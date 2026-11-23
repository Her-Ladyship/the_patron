import { app_state } from './app_state.js';
import { close_spell_banner } from './spell_overlay.js';
import { close_library_banner, hide_library_reset_confirmation, open_library_banner, populate_spell_exclusions, reset_spell_library, show_library_reset_confirmation } from './spell_library.js';
import { close_manual_banner, display_manual_consultation, open_manual_banner, populate_manual_spell_list, restore_original_consultation, save_original_consultation, select_manual_slot, update_manual_slots, update_override_button } from './manual_override.js';
import { update_binding_sigil } from './binding_sigil.js';
import { consultation_button, level_picker_scroll, skull_group } from './dom.js';
import { close_settings_banner, open_settings_banner, save_character_level, update_level_picker_appearance } from './settings.js';
import { begin_consultation, stop_anticipation } from './consultation.js';
import { save_consultation } from './consultation_storage.js';
import { hold_duration } from './config.js';

export function bind_events() {
    document.getElementById("spell_overlay").addEventListener(
        "click",
        event => {
            if (event.target.id === "spell_overlay") {
                close_spell_banner();
            }
        }
    );

    document.getElementById("spell_search").addEventListener(
        "input",
        populate_spell_exclusions
    );

    document.getElementById("library_reset_button").addEventListener(
        "click",
        show_library_reset_confirmation
    );

    document.getElementById("library_reset_yes").addEventListener(
        "click",
        () => {
            reset_spell_library();
            hide_library_reset_confirmation();
        }
    );

    document.getElementById("library_reset_no").addEventListener(
        "click",
        hide_library_reset_confirmation
    );

    document.getElementById("library_button").addEventListener(
        "click",
        open_library_banner
    );

    document.getElementById("library_overlay").addEventListener(
        "click",
        event => {
            if (event.target.id === "library_overlay") {
                close_library_banner();
            }
        }
    );

    document.getElementById("binding_sigil").addEventListener(
        "transitionend",
        event => {
            if (event.propertyName !== "opacity") {
                return;
            }

            const sigil = event.currentTarget;

            if (sigil.classList.contains("is_disappearing")) {
                sigil.setAttribute("hidden", "");
                sigil.classList.remove("is_disappearing");
            }
        }
    );

    document.querySelectorAll(".manual_slot").forEach((slot, index) => {
        slot.addEventListener("click", () => {
            select_manual_slot(index);
        });
    });

    document.getElementById("settings_override_button").addEventListener(
        "click",
        open_manual_banner
    );

    document.getElementById("manual_overlay").addEventListener(
        "click",
        event => {
            if (event.target.id === "manual_overlay") {
                close_manual_banner();
            }
        }
    );

    document.getElementById("manual_spell_search").addEventListener(
        "input",
        populate_manual_spell_list
    );

    document.getElementById("manual_apply_button").addEventListener("click", () => {
        const selected_count = app_state.manual_selections.filter(
            spell => spell !== null
        ).length;

        if (selected_count !== 0 && selected_count !== 5) {
            return;
        }

        if (selected_count === 0) {
            app_state.applied_manual_selections = null;
            restore_original_consultation();
        } else {
            save_original_consultation();
            app_state.applied_manual_selections = [...app_state.manual_selections];

            display_manual_consultation();
        }

        const current_cards = Array.from(
            document.querySelectorAll(".spell_card"),
            card => card.spell_data
        );

        const original_spells = app_state.original_consultation
            ?? current_cards;

        const current_aspects = Array.from(
            document.querySelectorAll(".skull"),
            skull => app_state.aspects.find(
                aspect => aspect.id === skull.dataset.aspectId
            )
        );

        save_consultation(
            current_aspects,
            original_spells,
            app_state.applied_manual_selections
        );

        update_override_button();
        update_binding_sigil();
        close_manual_banner();
    });

    document.getElementById("manual_clear_button").addEventListener("click", () => {
        app_state.manual_selections = [null, null, null, null, null];

        update_manual_slots();
        select_manual_slot(0);
    });

    level_picker_scroll.addEventListener(
        "scroll",
        update_level_picker_appearance
    );

    level_picker_scroll.addEventListener(
        "scrollend",
        save_character_level
    );

    document.getElementById("settings_button").addEventListener(
        "click",
        open_settings_banner
    );

    document.getElementById("settings_overlay").addEventListener(
        "click",
        event => {
            if (event.target.id === "settings_overlay") {
                close_settings_banner();
            }
        }
    );

    consultation_button.addEventListener("pointerdown", event => {
        if (app_state.is_consulting ||
            app_state.applied_manual_selections !== null ||
            app_state.active_pointer !== null ||
            event.button !== 0 ||
            document.querySelectorAll(".spell_card").length !== 5) {
            return;
        }

        app_state.active_pointer = event.pointerId;

        consultation_button.setPointerCapture(event.pointerId);

        consultation_button.classList.add("charging");
        skull_group.classList.add("anticipating");

        app_state.hold_timer = setTimeout(() => {
            app_state.hold_timer = null;
            begin_consultation();
        }, hold_duration);
    });

    consultation_button.addEventListener(
        "pointerup", stop_anticipation
    );

    consultation_button.addEventListener(
        "pointercancel", stop_anticipation
    );

    consultation_button.addEventListener(
        "lostpointercapture", stop_anticipation
    );
}
