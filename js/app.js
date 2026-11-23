import { load_spell_data } from './data_loading.js';
import { app_state } from './app_state.js';
import { load_character_level } from './settings.js';
import { create_abyss_dust, create_abyss_motes } from './background_effects.js';
import { apply_aspect, create_skull } from './skull_animation.js';
import { create_spell_card } from './spell_cards.js';
import { bind_events } from './events.js';
import { load_consultation } from './consultation_storage.js';
import { update_override_button } from './manual_override.js';
import { update_binding_sigil } from './binding_sigil.js';

export async function initialise() {
    load_character_level();
    create_abyss_motes();
    create_abyss_dust();

    await load_spell_data();

    const saved_consultation = load_consultation(
        app_state.spells,
        app_state.aspects
    );

    const initial_aspects = saved_consultation
        ? saved_consultation.aspects.map(aspect => aspect.id)
        : ["anger", "hope", "sorrow"];

    initial_aspects.forEach((aspect_id, index) => {
        create_skull(index);

        const aspect = app_state.aspects.find(
            aspect => aspect.id === aspect_id
        );

        apply_aspect(index, aspect);
    });

    const cantrip_row = document.getElementById("cantrip_row");
    const ritual_row = document.getElementById("ritual_row");


    const initial_spells = saved_consultation
        ? (saved_consultation.override_spells
            ?? saved_consultation.original_spells)
        : [
            "ray_of_frost",
            "minor_illusion",
            "mage_hand",
            "find_familiar",
            "comprehend_languages"
        ].map(id => app_state.spells.find(spell => spell.id === id));



    initial_spells.slice(0, 3).forEach(spell => {
        create_spell_card(spell, cantrip_row);
    });

    initial_spells.slice(3).forEach(spell => {
        create_spell_card(spell, ritual_row);
    });


    if (saved_consultation?.override_spells) {
        app_state.original_consultation =
            saved_consultation.original_spells;

        app_state.applied_manual_selections =
            saved_consultation.override_spells;

        update_override_button();
        update_binding_sigil();
    }

}

bind_events();
initialise();

