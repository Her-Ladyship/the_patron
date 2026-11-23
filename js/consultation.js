import { app_state } from './app_state.js';
import { consultation_button, skull_group } from './dom.js';
import { select_random_items } from './random_selection.js';
import { apply_spell } from './spell_cards.js';
import { animate_skulls, apply_aspect } from './skull_animation.js';

export function stop_anticipation(event) {
    if (event.pointerId !== app_state.active_pointer) {
        return;
    }

    app_state.active_pointer = null;

    clearTimeout(app_state.hold_timer);
    app_state.hold_timer = null;

    consultation_button.classList.remove("charging");
    skull_group.classList.remove("anticipating");
}

export function begin_consultation() {
    app_state.is_consulting = true;

    consultation_button.classList.remove("charging");
    skull_group.classList.remove("anticipating");
    skull_group.classList.add("consulting");

    const selected_aspects = select_random_items(app_state.aspects, 3);

    const available_spells = app_state.spells.filter(spell =>
        app_state.enabled_sources.has(spell.source) &&
        !app_state.excluded_spells.has(spell.id)
    );

    const available_cantrips = available_spells.filter(spell =>
        spell.level === 0
    );

    const available_rituals = available_spells.filter(spell =>
        spell.level === 1 && spell.ritual
    );

    const selected_cantrips = select_random_items(
        available_cantrips, 3
    );

    const selected_rituals = select_random_items(
        available_rituals, 2
    );

    const selected_spells = [
        ...selected_cantrips,
        ...selected_rituals
    ];

    const cards = Array.from(
        document.querySelectorAll(".spell_card")
    );

    cards.forEach(card => {
        card.classList.add("is_hidden");
    });

    setTimeout(() => {
        cards.forEach((card, index) => {
            apply_spell(card, selected_spells[index]);
        });
    }, 650);

    cards.forEach((card, index) => {
        const reveal_delay = Math.min(index + 1, 4) * 1000;

        setTimeout(() => {
            card.classList.remove("is_hidden");
        }, reveal_delay);
    });

    animate_skulls(() => {
        selected_aspects.forEach((aspect, index) => {
            apply_aspect(index, aspect);
        });

        skull_group.classList.remove("consulting");

        setTimeout(() => {
            app_state.is_consulting = false;
        }, 600);
    });
}
