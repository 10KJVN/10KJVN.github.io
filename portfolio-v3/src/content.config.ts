import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        tags: z.array(z.string()).default([]),
        highlight: z.boolean().default(false),
        order: z.number().optional(),

        // Project Information stats — always exactly 6, shown at the top of the page.
        // Optional for now until existing .mdx files are updated with real values.
        year: z.number().optional(),
        duration: z.string().optional(),
        engine: z.string().optional(),
        language: z.string().optional(),
        teamSize: z.string().optional(),
        role: z.string().optional(),

        // Project Links block — GitHub, itch.io, Trello, GDD, LinkedIn post, gameplay video, etc.
        links: z
            .array(
                z.object({
                    label: z.string(),
                    url: z.string().url(),
                })
            )
            .default([]),
    }),
});

const features = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/features" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        tags: z.array(z.string()).default([]),

        // Standalone feature -> gets its own /features/[slug] page.
        // Feature tied to a project -> resolves to /projects/{projectSlug}#{anchorId} instead.
        projectSlug: z.string().optional(),
        anchorId: z.string().optional(),
    }),
});

export const collections = { projects, features };