// Shared mutable session state. Persistence remains compatible with the original app.
export const app_state = {
    spells: [],
    character_level: 2,
    enabled_sources: new Set(),
    excluded_spells: new Set(),
    active_manual_slot: 0,
    manual_selections: [null, null, null, null, null],
    applied_manual_selections: null,
    original_consultation: null,
    hold_timer: null,
    is_consulting: false,
    active_pointer: null,
    aspects: []
};
