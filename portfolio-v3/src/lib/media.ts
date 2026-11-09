/**
 * Build-time media lookup. Finds the optimised siblings made by scripts/optimize-media.mjs and reads
 * pixel sizes, so components can emit <picture>, posters and width/height without MDX changes.
 *
 * Nothing here runs in the browser. If a sibling doesn't exist, the original file is used as is.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const toDisk = (url: string): string => path.join(PUBLIC, ...url.split("/").filter(Boolean));
const exists = (url: string): boolean => existsSync(toDisk(url));

interface Size { width: number; height: number }
const sizeCache = new Map<string, Size | undefined>();

async function sizeOf(url: string): Promise<Size | undefined> {
    if (sizeCache.has(url)) return sizeCache.get(url);
    let size: Size | undefined;
    try {
        const meta = await sharp(toDisk(url), { pages: 1 }).metadata();
        if (meta.width && meta.height) size = { width: meta.width, height: meta.height };
    } catch { /* unreadable file: render without dimensions */ }
    sizeCache.set(url, size);
    return size;
}

const isLocal = (src: string): boolean => src.startsWith("/") && !src.startsWith("//");
const strip = (src: string): string => src.replace(/\.[^./]+$/, "");

export interface ResolvedImage {
    src: string;
    width?: number;
    height?: number;
    /** WebP srcset (e.g. "/a-640.webp 640w, /a.webp 1920w"). Absent if no WebP exists. */
    webpSrcset?: string;
}

/** PNG/JPG -> original + WebP variants. Everything else (SVG, GIF, remote) passes through. */
export async function resolveImage(src: string): Promise<ResolvedImage> {
    if (!isLocal(src) || !/\.(png|jpe?g)$/i.test(src) || !exists(src)) return { src };
    const size = await sizeOf(src);
    const base = strip(src);
    const candidates: [string, number | undefined][] = [
        [`${base}-640.webp`, 640],
        [`${base}-1280.webp`, 1280],
        [`${base}.webp`, size?.width],
    ];
    const parts = candidates
        .filter(([url, w]) => w && exists(url))
        .map(([url, w]) => `${url} ${w}w`);
    return { src, ...size, webpSrcset: parts.length ? parts.join(", ") : undefined };
}

export interface ResolvedVideo {
    /** The file to play: the optimised `.web.mp4` when it exists, otherwise the original. */
    src: string;
    poster?: string;
    width?: number;
    height?: number;
    /** True when a GIF was swapped for a video: render it as a silent looping clip. */
    fromGif: boolean;
}

/** GIF or MP4 -> optimised MP4 + poster. A GIF with no MP4 sibling returns null (keep it as an <img>). */
export async function resolveVideo(src: string): Promise<ResolvedVideo | null> {
    if (!isLocal(src)) return /\.mp4$/i.test(src) ? { src, fromGif: false } : null;
    const isGif = /\.gif$/i.test(src);
    const web = `${strip(src)}.web.mp4`;
    if (isGif && !exists(web)) return null;

    const posterUrl = `${strip(src)}.poster.webp`;
    const poster = exists(posterUrl) ? posterUrl : undefined;
    const size = poster ? await sizeOf(poster) : isGif ? await sizeOf(src) : undefined;
    return { src: exists(web) ? web : src, poster, ...size, fromGif: isGif };
}
