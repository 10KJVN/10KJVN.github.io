/**
 * Site-wide settings you are likely to want to tweak. Change a value here and rebuild: nothing else to edit.
 */
export const siteConfig = {
    /**
     * Page transitions (Astro view transitions).
     *   enabled: false  -> the site behaves exactly as before: normal page loads, the transition router isn't loaded.
     *   enabled: true   -> a short cross-fade between pages, and navigation without a full reload.
     * Transitions are skipped automatically for visitors who prefer reduced motion.
     */
    pageTransitions: {
        enabled: true,
        /** Length of the cross-fade in milliseconds. 120 to 250 feels subtle. */
        durationMs: 180,
    },

    /**
     * CV / resume. The PDF lives in public/documents/cv/. To publish a new version, overwrite that file
     * (keep the name), or change `href` if you rename it. The link is hidden if the file doesn't exist.
     */
    cv: {
        href: "/documents/cv/Jahvairo-Monkau-CV.pdf",
        label: "Download CV",
    },

    /** Table of contents on project/feature pages. */
    toc: {
        /** Pages with fewer headings than this don't get a TOC (it would add nothing). */
        minHeadings: 4,
        title: "On this page",
    },
};
