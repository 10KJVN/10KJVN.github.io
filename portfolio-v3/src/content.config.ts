/**
 * Defines the structure and validation rules for portfolio content.
 *
 * Projects and features are loaded from MDX files and validated
 * against these schemas when Astro builds the site.c
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Shared by both collections — everything needed to render a card.
const cardFields = {
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    tags: z.array(z.string()).default([]), // tags on project card

    highlight: z.boolean().default(false), // homepage highlight
    order: z.number().optional(), // manual sort order
};

// Project Information stats + quick links — shared because a standalone
const infoFields = {
    year: z.number().optional(),
    duration: z.string().optional(),
    engine: z.string().optional(),
    language: z.string().optional(),
    teamSize: z.string().optional(),
    role: z.string().optional(),
    links: z
        .array(z.object({ label: z.string(), url: z.string().url() }))
        .default([]),
};

const projects = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: z.object({
        ...cardFields,
        ...infoFields,
    }),
});

// A feature resolves its card link one of three ways, checked in this order:
// 1. externalUrl set               -> links straight out (e.g. a YouTube video, GitHub Repo)
// 2. projectSlug + anchorId set    -> links into a specific section of that project's page.
// 3. neither set                   -> gets its own standalone /features/[slug] page.
const features = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/features" }),
    schema: z.object({
        ...cardFields,
        ...infoFields,

        externalUrl: z.string().url().optional(),
        projectSlug: z.string().optional(),
        anchorId: z.string().optional(),
    }),
});

export const collections = { projects, features };