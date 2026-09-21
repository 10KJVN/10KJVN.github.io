import type { CollectionEntry } from "astro:content";

/**
 * Resolves where a feature's card should link to, in priority order:
 * 1. externalUrl set            -> links straight out (e.g. a YouTube video, GitHub repo)
 * 2. projectSlug + anchorId set -> links into a specific section of that project's page
 * 3. neither set                -> gets its own standalone /features/[slug] page
 */

export function resolveFeatureHref(feature: CollectionEntry<"features">): string {
    if (feature.data.externalUrl) {
        return feature.data.externalUrl;
    }

    if (feature.data.projectSlug && feature.data.anchorId) {
        return `/projects/${feature.data.projectSlug}#${feature.data.anchorId}`;
    }

    return `/features/${feature.id}`;
}