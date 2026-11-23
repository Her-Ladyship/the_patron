import { app_state } from './app_state.js';
import { visual_themes } from './config.js';
import { apply_spell } from './spell_cards.js';

export function save_original_consultation() {
    if (app_state.original_consultation !== null) {
        return;
    }

    const cards = document.querySelectorAll(".spell_card");

    app_state.original_consultation = Array.from(
        cards,
        card => card.spell_data
    );
}

export function open_manual_banner() {
    document.getElementById("settings_overlay").hidden = true;
    document.getElementById("manual_overlay").hidden = false;

    app_state.manual_selections = app_state.applied_manual_selections
        ? [...app_state.applied_manual_selections]
        : [null, null, null, null, null];

    update_manual_slots();
    select_manual_slot(0);
}

export function close_manual_banner() {
    document.getElementById("manual_overlay").hidden = true;

    app_state.manual_selections = [null, null, null, null, null];
}

export function select_manual_slot(index) {
    app_state.active_manual_slot = index;

    document.querySelectorAll(".manual_slot").forEach((slot, slot_index) => {
        const is_active = slot_index === index;

        slot.classList.toggle("is_active", is_active);
        slot.setAttribute("aria-pressed", String(is_active));
    });

    document.getElementById("manual_spell_search").value = "";
    populate_manual_spell_list();
}

export function update_manual_slots() {
    document.querySelectorAll(".manual_slot").forEach((slot, index) => {
        const spell = app_state.manual_selections[index];
        const name = slot.querySelector(".manual_slot_name");

        const slot_label = index < 3
            ? `C${index + 1}`
            : `R${index - 2}`;

        name.textContent = spell ? spell.name : slot_label;
        name.style.fontSize = spell ? "12px" : "16px";

        const default_colour = index < 3 ? "#B579FF" : "#D6AD60";

        slot.style.setProperty(
            "--slot_colour",
            spell
                ? visual_themes[spell.visual_theme] || default_colour
                : default_colour
        );
    });
    update_manual_actions();
}

export function populate_manual_spell_list() {
    const list = document.getElementById("manual_spell_list");
    const search = document.getElementById("manual_spell_search")
        .value.trim().toLowerCase();

    const is_cantrip = app_state.active_manual_slot < 3;

    const available_spells = app_state.spells
        .filter(spell => {
            const correct_type = is_cantrip
                ? spell.level === 0
                : spell.level === 1 && spell.ritual;

            const already_selected = app_state.manual_selections.some(
                selected => selected?.id === spell.id
            );

            return correct_type &&
                !already_selected &&
                spell.name.toLowerCase().includes(search);
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    list.replaceChildren();

    for (const spell of available_spells) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "manual_spell_option";
        button.textContent = spell.name;

        button.addEventListener("click", () => {
            if (app_state.manual_selections.some(selected => selected?.id === spell.id)) {
                return;
            }

            app_state.manual_selections[app_state.active_manual_slot] = spell;

            update_manual_slots();
            populate_manual_spell_list();

            const next_empty = app_state.manual_selections.findIndex(
                (selected, index) => selected === null && index > app_state.active_manual_slot
            );

            if (next_empty !== -1) {
                select_manual_slot(next_empty);
            }
        });

        button.style.setProperty(
            "--option_colour",
            visual_themes[spell.visual_theme] || "#B579FF"
        );

        list.appendChild(button);
    }
}

export function update_manual_actions() {
    const selected_count = app_state.manual_selections.filter(
        spell => spell !== null
    ).length;

    const can_apply =
        selected_count === 5 ||
        (selected_count === 0 && app_state.applied_manual_selections !== null);

    document.getElementById("manual_apply_button").disabled = !can_apply;

    document.getElementById("manual_clear_button").disabled =
        selected_count === 0;
}

export function update_override_button() {
    const button = document.getElementById("settings_override_button");
    const is_active = app_state.applied_manual_selections !== null;

    button.textContent = is_active
        ? "✦ EDIT OVERRIDE ✦"
        : "✦ OVERRIDE CONSULTATION ✦";

    button.classList.toggle("is_active", is_active);
}

export function display_manual_consultation() {
    const cards = document.querySelectorAll(".spell_card");

    cards.forEach((card, index) => {
        apply_spell(card, app_state.applied_manual_selections[index]);
        card.classList.remove("is_hidden");
    });
}

export function restore_original_consultation() {
    if (app_state.original_consultation === null) {
        return;
    }

    const cards = document.querySelectorAll(".spell_card");

    cards.forEach((card, index) => {
        apply_spell(card, app_state.original_consultation[index]);
        card.classList.remove("is_hidden");
    });

    app_state.original_consultation = null;
}
