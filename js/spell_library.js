import { app_state } from './app_state.js';
import { visual_themes } from './config.js';

export function populate_spell_sources() {
    const list = document.getElementById("spell_sources_list");

    list.replaceChildren();

    const sources = [...new Set(app_state.spells.map(spell => spell.source))]
        .sort((a, b) => a.localeCompare(b));

    for (const source of sources) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = app_state.enabled_sources.has(source);

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                app_state.enabled_sources.add(source);
            } else {
                app_state.enabled_sources.delete(source);
            }

            let state = {};

            try {
                state = JSON.parse(
                    localStorage.getItem("the_patron_state") || "{}"
                ) || {};
            } catch (error) {
                console.warn("Could not read saved settings:", error);
            }

            state.enabled_sources = [...app_state.enabled_sources];

            localStorage.setItem(
                "the_patron_state",
                JSON.stringify(state)
            );

            populate_spell_exclusions();
            update_library_warning();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${source}`));

        list.appendChild(label);
    }
}

export function populate_spell_exclusions() {
    const list = document.getElementById("library_exclusions_list");
    const search = document.getElementById("spell_search")
        .value.trim().toLowerCase();

    list.replaceChildren();

    const available_spells = app_state.spells
        .filter(spell =>
            app_state.enabled_sources.has(spell.source) &&
            spell.name.toLowerCase().includes(search)
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    for (const spell of available_spells) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = app_state.excluded_spells.has(spell.id);

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                app_state.excluded_spells.add(spell.id);
            } else {
                app_state.excluded_spells.delete(spell.id);
            }

            let state = {};

            try {
                state = JSON.parse(
                    localStorage.getItem("the_patron_state") || "{}"
                ) || {};
            } catch (error) {
                console.warn("Could not read saved settings:", error);
            }

            state.excluded_spells = [...app_state.excluded_spells];

            localStorage.setItem(
                "the_patron_state",
                JSON.stringify(state)
            );

            update_library_warning();
        });

        const spell_name = document.createElement("span");

        spell_name.textContent = spell.name;
        spell_name.style.color =
            visual_themes[spell.visual_theme] || "#B579FF";

        label.appendChild(checkbox);
        label.appendChild(spell_name);

        list.appendChild(label);
    }
}

export function show_library_reset_confirmation() {
    document.getElementById("library_reset_confirmation").hidden = false;
}

export function hide_library_reset_confirmation() {
    document.getElementById("library_reset_confirmation").hidden = true;
}

export function reset_spell_library() {
    app_state.enabled_sources = new Set(
        app_state.spells.map(spell => spell.source)
    );

    app_state.excluded_spells.clear();

    let state = {};

    try {
        state = JSON.parse(
            localStorage.getItem("the_patron_state") || "{}"
        ) || {};
    } catch (error) {
        console.warn("Could not read saved settings:", error);
    }

    state.enabled_sources = [...app_state.enabled_sources];
    state.excluded_spells = [];

    localStorage.setItem(
        "the_patron_state",
        JSON.stringify(state)
    );
    document.getElementById("spell_search").value = "";

    populate_spell_sources();
    populate_spell_exclusions();
    update_library_warning();
}

export function open_library_banner() {
    if (app_state.is_consulting || app_state.applied_manual_selections !== null) {
        return;
    }

    document.getElementById("library_overlay").hidden = false;
    document.getElementById("spell_search").value = "";

    populate_spell_sources();
    populate_spell_exclusions();
    update_library_warning();
}

export function update_library_warning() {
    const counts = get_available_spell_counts();

    const warning = document.getElementById("library_warning");
    const warning_text = document.getElementById("library_warning_text");

    if (counts.cantrips >= 3 && counts.rituals >= 2) {
        warning.hidden = true;
        return true;
    }

    warning_text.textContent =
        `The Many require at least 3 cantrips and 2 rituals. ` +
        `Currently available: ${counts.cantrips} cantrips ` +
        `and ${counts.rituals} rituals.`;

    warning.hidden = false;
    return false;
}

export function close_library_banner() {
    if (!update_library_warning()) {
        return;
    }

    hide_library_reset_confirmation();
    document.getElementById("library_overlay").hidden = true;
}

export function get_available_spell_counts() {
    const available_spells = app_state.spells.filter(spell =>
        app_state.enabled_sources.has(spell.source) &&
        !app_state.excluded_spells.has(spell.id)
    );

    const cantrips = available_spells.filter(spell =>
        spell.level === 0
    ).length;

    const rituals = available_spells.filter(spell =>
        spell.level === 1 && spell.ritual
    ).length;

    return { cantrips, rituals };
}
