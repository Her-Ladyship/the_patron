import { app_state } from './app_state.js';
import { visual_themes } from './config.js';

export function get_scaled_value(scaling, level) {
    const thresholds = Object.keys(scaling)
        .map(Number)
        .sort((a, b) => b - a);

    for (const threshold of thresholds) {
        if (level >= threshold) {
            return scaling[threshold];
        }
    }

    return "";
}

export function format_description(spell) {
    let description = spell.description;

    for (const key of Object.keys(spell.scaling)) {
        const value = get_scaled_value(
            spell.scaling[key],
            app_state.character_level
        );

        description = description.replaceAll(`{${key}}`, value);
    }

    return description;
}

export function populate_spell_banner(spell) {
    const content = document.getElementById(
        "spell_banner_content"
    );

    content.replaceChildren();

    const name = document.createElement("h2");
    name.textContent = spell.name;
    name.style.color =
        visual_themes[spell.visual_theme] || "#B579FF";

    const category = document.createElement("p");
    category.textContent = spell.level === 0
        ? `${spell.school} Cantrip`
        : `Level ${spell.level} ${spell.school}${spell.ritual ? " (Ritual)" : ""}`;

    const casting_time = `${spell.casting_time.amount} ${spell.casting_time.unit}`;

    const range = spell.range.amount === null
        ? spell.range.unit
        : `${spell.range.amount} ${spell.range.unit}`;

    const components = [];

    if (spell.components.verbal) components.push("V");
    if (spell.components.somatic) components.push("S");
    if (spell.components.material) components.push("M");

    let component_text = components.join(", ");

    if (spell.components.materials) {
        component_text += ` (${spell.components.materials})`;
    }

    const duration = spell.duration.amount === null
        ? spell.duration.unit
        : `${spell.duration.amount} ${spell.duration.unit}`;

    const details = document.createElement("div");
    details.className = "spell_banner_stats";

    const stats = [
        ["Casting Time", casting_time],
        ["Range", range],
        ["Components", component_text],
        ["Duration", duration],
        ["Concentration", spell.concentration ? "yes" : "no"]
    ];

    stats.forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "spell_banner_stat";

        const heading = document.createElement("strong");
        heading.textContent = `${label}: `;

        const information = document.createElement("span");
        information.textContent = value;

        row.append(heading, information);
        details.appendChild(row);
    });

    const description = document.createElement("p");
    description.className = "spell_banner_description";
    description.textContent = format_description(spell);
    description.style.whiteSpace = "pre-line";

    content.append(name, category, details, description);

    content.scrollTop = 0;
}

export function open_spell_banner(spell) {
    const overlay = document.getElementById("spell_overlay");
    const banner = document.getElementById("spell_banner");

    banner.style.setProperty(
        "--spell_colour",
        visual_themes[spell.visual_theme] || "#B579FF"
    );

    populate_spell_banner(spell);
    overlay.hidden = false;
}

export function close_spell_banner() {
    document.getElementById("spell_overlay").hidden = true;
}
