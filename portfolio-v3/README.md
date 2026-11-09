# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## ⚙️ Site settings

`src/config.ts` is the one place for switches you may want to flip:

- `pageTransitions.enabled`: `false` turns page transitions off completely (normal page loads, no transition code). `durationMs` sets the cross-fade length.
- `cv.href` / `cv.label`: the CV download on the Contact page (the PDF lives in `public/documents/cv/`; the link is hidden if the file is missing).
- `toc.minHeadings`: how many sections a page needs before it gets a table of contents.

Per project/feature front matter (all optional): `infoTitle` changes the heading of the Project Info panel, `infoHide: ["engine", ...]` leaves fields out of it.

## 🖼️ Media pipeline

Pages reference the original files (`/images/...`, `/videos/...`). `scripts/optimize-media.mjs` writes web-friendly siblings next to them and the components pick those up automatically, so MDX never changes:

- `foo.png|jpg` → `foo.webp`, `foo-1280.webp`, `foo-640.webp` (only sizes that are actually smaller)
- `foo.gif|mp4` → `foo.web.mp4` (GIFs become silent looping clips; big MP4s are re-encoded) and `foo.poster.webp`

```sh
FFMPEG=/path/to/ffmpeg node scripts/optimize-media.mjs        # new or changed files only
node scripts/optimize-media.mjs --dry                          # preview
node scripts/optimize-media.mjs --only=images                  # skip video
```

Run it after adding images or videos. Originals are never modified. GIFs with real transparency are skipped and stay GIFs. Videos load only when they come near the viewport; images use `<picture>` with WebP and a size hint (`sizes` prop on `Media`).

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
