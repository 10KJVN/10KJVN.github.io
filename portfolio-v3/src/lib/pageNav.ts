import { getEntry } from "astro:content";
import { resolveFeatureHref } from "./resolveFeatureHref";

/** A destination: a project slug or a feature slug. */
export type NavTarget = { project: string } | { feature: string };

/**
 * Left slot = previous. Right slot = next, or related when there is no next.
 * Setting both `next` and `related` on one page is a type error on purpose.
 * Relationships are one-directional here: if A.next is B, add B.previous = A yourself.
 */
type NavEntry = { previous?: NavTarget } & (
    | { next?: NavTarget; related?: never }
    | { next?: never; related?: NavTarget }
    );

// Keys are project slugs (the file name without .mdx).
export const projectNav: Record<string, NavEntry> = {
    // Gameplay programming thread
    "operation-starfall": { next: { project: "candy-dandy" } },
    "candy-dandy": { previous: { project: "operation-starfall" }, next: { project: "parachute" } },
    "parachute": { previous: { project: "candy-dandy" } },

    // Creative direction. Related, not a strict sequence.
    // To make it a sequence: first-spark gets `next: { project: "the-kermis" }`
    // and the-kermis gets `previous: { project: "first-spark" }`.
    "first-spark": { related: { project: "the-kermis" } },
    "the-kermis": { related: { project: "first-spark" } },

    // Professional / technical work (project side)
    "the-ensemble": { related: { feature: "shopify-api" } },

    // Graphics thread: final decision yet to be made.
    "urp": { next: { project: "dirt-jam" } },
    "dirt-jam": { previous: { project: "urp" } },
    // Related:
    //   "urp": { related: { project: "dirt-jam" } },
    //   "dirt-jam": { related: { project: "urp" } },
};

// Keys are feature slugs (the file name without .mdx).
export const featureNav: Record<string, NavEntry> = {
    // Professional / technical work (feature side)
    "shopify-api": { related: { project: "the-ensemble" } },
};

export interface NavLink {
    label: "Previous" | "Next" | "Related";
    title: string;
    href: string;
}

async function resolve(target: NavTarget, label: NavLink["label"]): Promise<NavLink | undefined> {
    if ("project" in target) {
        const entry = await getEntry("projects", target.project);
        if (!entry) {
            console.warn(`[pageNav] project "${target.project}" does not exist, link skipped.`);
            return undefined;
        }
        return { label, title: entry.data.title, href: `/projects/${entry.id}` };
    }

    const entry = await getEntry("features", target.feature);
    if (!entry) {
        console.warn(`[pageNav] feature "${target.feature}" does not exist, link skipped.`);
        return undefined;
    }
    return { label, title: entry.data.title, href: resolveFeatureHref(entry) };
}

export async function getPageNav(
    kind: "project" | "feature",
    slug: string,
): Promise<{ left?: NavLink; right?: NavLink }> {
    const entry: NavEntry | undefined = (kind === "project" ? projectNav : featureNav)[slug];
    if (!entry) return {};

    const [left, right] = await Promise.all([
        entry.previous ? resolve(entry.previous, "Previous") : undefined,
        entry.next
            ? resolve(entry.next, "Next")
            : entry.related
                ? resolve(entry.related, "Related")
                : undefined,
    ]);

    return { left, right };
}