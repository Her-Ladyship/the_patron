import { app_state } from './app_state.js';

export function load_character_level() {
    const saved_state = localStorage.getItem("the_patron_state");

    if (saved_state === null) {
        return;
    }

    try {
        const state = JSON.parse(saved_state);
        const level = Number(state.character_level);

        if (Number.isInteger(level) && level >= 1 && level <= 20) {
            app_state.character_level = level;
        }
    } catch (error) {
        console.warn("Could not load character level:", error);
    }
}

export function open_settings_banner() {
    if (app_state.is_consulting) return;

    document.getElementById("settings_overlay").hidden = false;
    populate_level_picker();
}

export function close_settings_banner() {
    document.getElementById("settings_overlay").hidden = true;
}

export function populate_level_picker() {
    const picker = document.getElementById("level_picker_scroll");

    picker.replaceChildren();

    const top_spacer = document.createElement("div");
    top_spacer.style.height = "50px";
    top_spacer.style.flexShrink = "0";
    picker.appendChild(top_spacer);

    for (let level = 1; level <= 20; level++) {
        const number = document.createElement("div");

        number.className = "level_picker_number";
        number.textContent = level;

        if (level === app_state.character_level) {
            number.classList.add("is_selected");
        }

        picker.appendChild(number);
    }

    const bottom_spacer = document.createElement("div");
    bottom_spacer.style.height = "50px";
    bottom_spacer.style.flexShrink = "0";
    picker.appendChild(bottom_spacer);

    picker.scrollTop = (app_state.character_level - 1) * 50;
    update_level_picker_appearance();
}

export function update_level_picker_appearance() {
    const picker = document.getElementById("level_picker_scroll");
    const numbers = picker.querySelectorAll(".level_picker_number");

    const centre = picker.scrollTop + picker.clientHeight / 2;

    numbers.forEach(number => {
        const number_centre = number.offsetTop + number.offsetHeight / 2;
        const distance = (number_centre - centre) / 50;

        const angle = Math.max(-75, Math.min(75, distance * -35));
        const depth = Math.abs(distance);

        number.style.transform =
            `rotateX(${angle}deg) scale(${Math.max(0.65, 1 - depth * 0.15)})`;

        number.style.opacity = Math.max(0.15, 1 - depth * 0.4);

        number.classList.toggle(
            "is_selected",
            Math.abs(distance) < 0.5
        );
    });
}

export function save_character_level() {
    const picker = document.getElementById("level_picker_scroll");

    const level = Math.max(
        1,
        Math.min(20, Math.round(picker.scrollTop / 50) + 1)
    );

    if (level === app_state.character_level) {
        return;
    }

    app_state.character_level = level;

    let state = {};

    try {
        const saved_state = JSON.parse(
            localStorage.getItem("the_patron_state") || "{}"
        );

        if (saved_state && typeof saved_state === "object"
            && !Array.isArray(saved_state)) {
            state = saved_state;
        }
    } catch (error) {
        console.warn("Could not read saved settings:", error);
    }

    state.character_level = app_state.character_level;

    localStorage.setItem(
        "the_patron_state",
        JSON.stringify(state)
    );
}
