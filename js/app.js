import { load_spell_data } from './data_loading.js';
import { app_state } from './app_state.js';
import { load_character_level } from './settings.js';
import { create_abyss_dust, create_abyss_motes } from './background_effects.js';
import { apply_aspect, create_skull } from './skull_animation.js';
import { create_spell_card } from './spell_cards.js';
import { bind_events } from './events.js';

export async function initialise() {
    load_character_level();
    create_abyss_motes();
    create_abyss_dust();

    await load_spell_data();

    const initial_aspects = [
        "anger",
        "hope",
        "sorrow"
    ];

    initial_aspects.forEach((aspect_id, index) => {
        create_skull(index);

        const aspect = app_state.aspects.find(
            aspect => aspect.id === aspect_id
        );

        apply_aspect(index, aspect);
    });

    const cantrip_row = document.getElementById("cantrip_row");
    const ritual_row = document.getElementById("ritual_row");

    const initial_cantrips = [
        "ray_of_frost",
        "minor_illusion",
        "mage_hand"
    ];

    const initial_rituals = [
        "find_familiar",
        "comprehend_languages"
    ];

    initial_cantrips.forEach(spell_id => {
        const spell = app_state.spells.find(
            spell => spell.id === spell_id
        );

        create_spell_card(spell, cantrip_row);
    });

    initial_rituals.forEach(spell_id => {
        const spell = app_state.spells.find(
            spell => spell.id === spell_id
        );

        create_spell_card(spell, ritual_row);
    });
}

bind_events();
initialise();

