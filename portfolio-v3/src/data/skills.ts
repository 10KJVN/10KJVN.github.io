/**
 * Skills shown on the About page.
 *
 * To update: edit a name or duration, or add an entry. Durations are plain text
 * ("4 year", "6 months", "1 month", "0.5 year"): a number plus "year(s)" or "month(s)".
 * Each category shows at most three entries (extras are ignored).
 */
export const skills: Record<string, { name: string; duration: string }[]> = {
    Engine: [
        { name: "Unity", duration: "4 year" },
        { name: "Unreal", duration: "2 year" },
        { name: "Godot", duration: "1 month" },
    ],
    Language: [
        { name: "C#", duration: "4 year" },
        { name: "C++", duration: "0.5 year" },
        { name: "HLSL/GLSL", duration: "0.5 year" },
    ],
    Tools: [
        { name: "Git", duration: "5 year" },
        { name: "Rider", duration: "4 year" },
        { name: "Visual Studio Code", duration: "4 year" },
    ],
    Productivity: [
        { name: "Trello", duration: "4 year" },
        { name: "ChatGPT", duration: "3 year" },
        { name: "Obsidian", duration: "1 month" },
    ],
    Creative: [
        { name: "Blender", duration: "0.5 year" },
        { name: "Photoshop", duration: "0.5 year" },
    ],
};
