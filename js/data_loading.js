import { app_state } from './app_state.js';

// Preserve data schemas, source defaults, and saved exclusion validation.
export async function load_spell_data() {
    const response = await fetch("spells.json");
    app_state.spells = await response.json();

    const all_sources = [...new Set(app_state.spells.map(spell => spell.source))];

    app_state.enabled_sources = new Set(all_sources);

    try {
        const saved_state = JSON.parse(
            localStorage.getItem("the_patron_state") || "{}"
        );

        if (Array.isArray(saved_state.enabled_sources)) {
            app_state.enabled_sources = new Set(
                saved_state.enabled_sources.filter(source =>
                    all_sources.includes(source)
                )
            );
        }
    } catch (error) {
        console.warn("Could not load enabled sources:", error);
    }

    try {
        const saved_state = JSON.parse(
            localStorage.getItem("the_patron_state") || "{}"
        );

        if (Array.isArray(saved_state.excluded_spells)) {
            const valid_spell_ids = new Set(
                app_state.spells.map(spell => spell.id)
            );

            app_state.excluded_spells = new Set(
                saved_state.excluded_spells.filter(id =>
                    valid_spell_ids.has(id)
                )
            );
        }
    } catch (error) {
        console.warn("Could not load excluded spells:", error);
    }

    const aspect_response = await fetch("aspects.json");
    app_state.aspects = await aspect_response.json();

}
