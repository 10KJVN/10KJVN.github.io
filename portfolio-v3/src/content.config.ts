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
};

// Project Information stats + quick links
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

// A feature can resolve in 3 ways, see 'src\lib\resolveFeatureHref.ts'
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