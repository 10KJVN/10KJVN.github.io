/**
 * Media optimiser. Creates web-friendly siblings next to the originals in public/. Originals are never
 * modified or deleted. Only files that are actually referenced from src/ are processed.
 *
 *   node scripts/optimize-media.mjs            # process everything that is missing/outdated
 *   node scripts/optimize-media.mjs --dry      # list what would happen
 *   node scripts/optimize-media.mjs --force    # redo everything
 *   node scripts/optimize-media.mjs --only=images   (or --only=video)
 *
 * Needs `sharp` (already installed, Astro depends on it) and, for video, an ffmpeg binary:
 *   FFMPEG=C:\path\to\ffmpeg.exe node scripts/optimize-media.mjs      (or ffmpeg on PATH)
 *
 * What it writes (src/lib/media.ts finds these automatically, no MDX changes needed):
 *   images  foo.png|jpg  ->  foo.webp, foo-1280.webp, foo-640.webp   (only sizes smaller than the original)
 *   videos  foo.gif|mp4  ->  foo.web.mp4   (GIFs become muted looping H.264, big MP4s are re-encoded)
 *           foo.gif|mp4  ->  foo.poster.webp  (first-frame poster so nothing is downloaded until needed)
 * GIFs with real transparency are skipped (a video can't carry it) and listed at the end.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const FORCE = args.has("--force");

const WIDTHS = [640, 1280];
const MIN_IMAGE_BYTES = 20 * 1024; // below this a webp rarely pays off
const MIN_GIF_BYTES = 200 * 1024; // tiny GIFs stay GIFs
const MIN_MP4_BYTES = 6 * 1024 * 1024; // only re-encode big MP4s
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

// 1. Referenced media -------------------------------------------------------
const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const sources = walk(path.join(ROOT, "src")).filter((f) => /\.(mdx|astro|ts|md)$/.test(f));
const referenced = new Set();
for (const f of sources) {
    for (const m of readFileSync(f, "utf8").matchAll(/\/(?:images|videos)\/[^"'\s)`]+?\.(?:png|jpe?g|gif|mp4)(?=["'\s)`])/gi)) {
        referenced.add(m[0]);
    }
}
const toDisk = (url) => path.join(PUBLIC, ...url.split("/").filter(Boolean));
const files = [...referenced].map((u) => ({ url: u, file: toDisk(u) })).filter((x) => existsSync(x.file));
// Paths inside doc comments (e.g. "/images/x/a.png", "<file>") aren't real references.
const missing = [...referenced].filter((u) => !existsSync(toDisk(u)) && !/[<>]|\/images\/x\//.test(u));

const fresh = (out, input) => !FORCE && existsSync(out) && statSync(out).mtimeMs >= statSync(input).mtimeMs;
const report = [];
const skipped = [];

// 2. Images -----------------------------------------------------------------
async function doImage({ file }) {
    const ext = path.extname(file);
    const base = file.slice(0, -ext.length);
    if (statSync(file).size < MIN_IMAGE_BYTES) return;
    const meta = await sharp(file).metadata();
    const isPng = /png/i.test(ext);

    const targets = [{ out: `${base}.webp`, width: null }, ...WIDTHS.filter((w) => meta.width > w * 1.15).map((w) => ({ out: `${base}-${w}.webp`, width: w }))];
    let fullBytes = Infinity;
    for (const t of targets) {
        if (fresh(t.out, file)) { if (!t.width) fullBytes = statSync(t.out).size; continue; }
        if (DRY) { report.push(`[dry] ${path.relative(PUBLIC, t.out)}`); continue; }
        let img = sharp(file);
        if (t.width) img = img.resize({ width: t.width });
        // Per file: keep screenshots lossless when that costs little, otherwise use a high-quality lossy encode.
        const lossy = await img.clone().webp({ quality: isPng ? 90 : 85, effort: 5, smartSubsample: true }).toBuffer();
        let buf = lossy;
        if (isPng) {
            const lossless = await img.clone().webp({ lossless: true, effort: 5 }).toBuffer();
            if (lossless.length <= lossy.length * 1.25) buf = lossless;
        }
        // A smaller size that isn't clearly smaller than the full file is pointless: leave it out.
        if (t.width && buf.length > fullBytes * 0.8) { rmSync(t.out, { force: true }); continue; }
        if (!t.width) fullBytes = buf.length;
        await sharp(buf).toFile(t.out);
        report.push(`${path.relative(PUBLIC, t.out)}  ${kb(statSync(file).size)} -> ${kb(buf.length)}`);
    }
}

// 3. Video ------------------------------------------------------------------
function ffmpeg(a) {
    const r = spawnSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...a], { encoding: "utf8" });
    return r.status === 0;
}

async function hasTransparency(gif) {
    const { data, info } = await sharp(gif, { pages: 1 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 3; i < data.length; i += info.channels) if (data[i] < 250) return true;
    return false;
}

async function doVideo({ file }) {
    const ext = path.extname(file).toLowerCase();
    const base = file.slice(0, -ext.length);
    const size = statSync(file).size;
    const web = `${base}.web.mp4`;
    const poster = `${base}.poster.webp`;
    const isGif = ext === ".gif";

    if (isGif && size < MIN_GIF_BYTES) return;
    if (!isGif && size < MIN_MP4_BYTES) { await makePoster(file, poster); return; }

    if (isGif && (await hasTransparency(file))) { skipped.push(`${path.relative(PUBLIC, file)} has transparency, kept as GIF`); return; }

    if (!fresh(web, file)) {
        if (DRY) { report.push(`[dry] ${path.relative(PUBLIC, web)}`); }
        else {
            const common = ["-movflags", "+faststart", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "slow", "-profile:v", "high"];
            const ok = isGif
                // GIF -> silent loop. Even dimensions are required by yuv420p.
                ? ffmpeg(["-i", file, "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", ...common, "-crf", "23", "-an", web])
                // Big MP4 -> keep size and audio, lower the bitrate.
                : ffmpeg(["-i", file, ...common, "-crf", "26", "-c:a", "aac", "-b:a", "96k", web]);
            if (!ok) { skipped.push(`${path.relative(PUBLIC, file)}: ffmpeg failed`); return; }
            const out = statSync(web).size;
            if (!isGif && out > size * 0.85) { rmSync(web); skipped.push(`${path.relative(PUBLIC, file)}: re-encode saved <15%, kept original`); }
            else report.push(`${path.relative(PUBLIC, web)}  ${mb(size)} -> ${mb(out)}`);
        }
    }
    await makePoster(file, poster);
}

async function makePoster(input, out) {
    if (fresh(out, input)) return;
    if (DRY) { report.push(`[dry] ${path.relative(PUBLIC, out)}`); return; }
    const tmp = mkdtempSync(path.join(tmpdir(), "poster-"));
    const png = path.join(tmp, "f.png");
    // A little way in avoids black fade-in frames; very short clips fall back to frame 0.
    if (!ffmpeg(["-ss", "0.6", "-i", input, "-frames:v", "1", png]) || !existsSync(png)) ffmpeg(["-i", input, "-frames:v", "1", png]);
    if (existsSync(png)) {
        const meta = await sharp(png).metadata();
        await sharp(png).resize({ width: Math.min(meta.width, 1280) }).webp({ quality: 80, effort: 5 }).toFile(out);
        report.push(`${path.relative(PUBLIC, out)}  poster ${kb(statSync(out).size)}`);
    }
    rmSync(tmp, { recursive: true, force: true });
}

// 4. Run --------------------------------------------------------------------
const imgs = files.filter((f) => /\.(png|jpe?g)$/i.test(f.file));
const vids = files.filter((f) => /\.(gif|mp4)$/i.test(f.file) && !/\.web\.mp4$/i.test(f.file));
const ffOk = spawnSync(FFMPEG, ["-version"]).status === 0;
if (vids.length && !ffOk) console.warn(`! ffmpeg not found (${FFMPEG}). Skipping ${vids.length} video(s). Set FFMPEG=<path>.`);

const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1]; // images | video
if (only !== "video") for (const f of imgs) await doImage(f);
if (ffOk && only !== "images") for (const f of vids) await doVideo(f);

console.log(report.join("\n") || "Nothing to do, everything is up to date.");
if (skipped.length) console.log("\nSkipped:\n  " + skipped.join("\n  "));
if (missing.length) console.log("\nReferenced but missing on disk:\n  " + missing.join("\n  "));
