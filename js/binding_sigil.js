import { app_state } from './app_state.js';

export function update_binding_sigil() {
    const sigil = document.getElementById("binding_sigil");

    if (app_state.applied_manual_selections !== null) {
        sigil.classList.remove("is_disappearing");
        sigil.removeAttribute("hidden");
    } else if (!sigil.hasAttribute("hidden")) {
        sigil.classList.add("is_disappearing");
    }
}
