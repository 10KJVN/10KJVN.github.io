/**
 * Defines the structure and validation rules for portfolio content.
 *
 * Projects and features are loaded from MDX files and validated
 * against these schemas when Astro builds the site.c
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Shared by both collections, everything needed to render a card.
const cardFields = {
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    tags: z.array(z.string()).default([]), // tags on project card

    highlight: z.boolean().default(false), // homepage highlight
    order: z.number().optional(), // manual sort order
    draft: z.boolean().default(false), // true = hidden from lists and not built as a page
};

// Project Information stats + quick links
const infoFields = {
    year: z.number().optional(),
    duration: z.string().optional(),
    engine: z.string().optional(),
    language: z.string().optional(),
    teamSize: z.string().optional(),
    role: z.string().optional(),

    // Project Info panel (ProjectInfo.astro) tuning, all optional:
    //   infoTitle: heading above the panel (default "Project info"; "" hides it)
    //   infoHide:  fields to leave out for this project, e.g. ["engine", "language"]
    infoTitle: z.string().optional(),
    infoHide: z.array(z.enum(["year", "duration", "engine", "language", "teamSize", "role"])).default([]),

    links: z
        .array(z.object({ label: z.string(), url: z.string().url() }))
        .default([]),
};

// Hero + overview composition for project and feature pages.
// All optional, so existing pages keep working without changes.
const heroFields = {
    // Which intro layout the page uses.
    // Always set per page in the front matter, never inferred from slug or parent.
    heroLayout: z.enum(["stacked", "stacked-left"]).default("stacked"),

    // Finished-gameplay video for the hero (mp4 path or YouTube URL).
    // Empty = the hero uses `thumbnail`.
    heroVideo: z.string().optional(),

    // "bounded" = height-capped (default). "full" = full content width, no height cap.
    // The media is never cropped, so "full" makes the hero taller.
    heroSize: z.enum(["bounded", "full"]).default("bounded"),

    // "About this Project" block. Empty = the block is not rendered.
    about: z.string().optional(),

    // "What I Learned / TL;DR" bullets. Empty = the block is not rendered.
    learned: z.array(z.string()).default([]),
};

const projects = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: z.object({
        ...cardFields,
        ...infoFields,
        ...heroFields,
    }),
});

// A feature can resolve in 3 ways, see 'src\lib\resolveFeatureHref.ts'
const features = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/features" }),
    schema: z.object({
        ...cardFields,
        ...infoFields,
        ...heroFields,

        externalUrl: z.string().url().optional(),
        projectSlug: z.string().optional(),
        anchorId: z.string().optional(),
    }),
});

export const collections = { projects, features };