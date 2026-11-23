import { skull_group } from './dom.js';
import { consultation_duration } from './config.js';

export function trigger_eruption() {
    const eruption = document.getElementById("magic_eruption");

    eruption.classList.add("active");

    setTimeout(() => {
        eruption.classList.remove("active");
    }, 650);
}

export function animate_skulls(on_complete) {
    const skulls = Array.from(skull_group.children);
    const duration = consultation_duration;
    const spacing = skull_group.clientWidth / 3;
    const start_time = performance.now();

    function animate(current_time) {
        const progress = Math.min(
            (current_time - start_time) / duration, 1
        );

        let angle;

        if (progress < 0.8) {
            const t = progress / 0.8;
            const eased = t * t * (3 - 2 * t);

            angle = -eased * Math.PI * 4;
        } else {
            const t = (1 - progress) / 0.2;
            const eased = t * t * (3 - 2 * t);

            angle = -eased * Math.PI * 4;
        }

        const envelope = Math.sin(progress * Math.PI);

        skulls.forEach((skull, index) => {
            const phase = angle + index * Math.PI * 2 / 3;
            const depth = Math.sin(phase);

            const home_x = (index - 1) * spacing;
            const orbit_x = Math.cos(phase) * spacing;

            const x = (orbit_x - home_x) * envelope;
            const y = depth * 12 * envelope;
            const scale = 1 + depth * 0.15 * envelope;

            skull.style.transform =
                `translate(${x}px, ${y}px) scale(${scale})`;

            skull.style.zIndex =
                Math.round((depth + 1) * 100);
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            skulls.forEach(skull => {
                skull.style.transform = "";
                skull.style.zIndex = "";
            });

            trigger_eruption();

            setTimeout(on_complete, 100);
        }
    }

    requestAnimationFrame(animate);
}

export function create_skull(index) {
    const skull = document.createElement("div");

    skull.className = "skull";
    skull.id = `skull_${index}`;

    skull.innerHTML = `
        <img class="base_skull"
             src="assets/skulls/base_skull.png"
             alt="The Many">

        <svg class="sigil"
             viewBox="0 0 100 100"
             fill="none"
             stroke-linejoin="miter"
             stroke-linecap="square">

            <defs>
                <path id="sigil_shape_${index}"/>
            </defs>

            <g class="sigil_brand">
                <use href="#sigil_shape_${index}"
                     stroke="var(--brand_colour)"
                     stroke-width="10"
                     opacity="0.15"/>

                <use href="#sigil_shape_${index}"
                     stroke="var(--brand_colour)"
                     stroke-width="6"
                     opacity="0.8"/>
            </g>

            <g class="sigil_energy">
                <use href="#sigil_shape_${index}"
                     stroke="var(--aspect_colour)"
                     stroke-width="9"
                     opacity="0.2"/>

                <use href="#sigil_shape_${index}"
                     stroke="var(--energy_colour)"
                     stroke-width="5"/>

                <use href="#sigil_shape_${index}"
                     stroke="var(--core_colour)"
                     stroke-width="2"/>
            </g>

        </svg>

        <div class="eye_ember eye_left"></div>
        <div class="eye_ember eye_right"></div>
    `;

    skull_group.appendChild(skull);

    return skull;
}

export function apply_aspect(index, aspect) {
    const skull = document.getElementById(`skull_${index}`);

    skull.dataset.aspectId = aspect.id;

    const sigil_shape = document.getElementById(
        `sigil_shape_${index}`
    );

    skull.style.setProperty(
        "--aspect_colour", aspect.colour
    );

    skull.style.setProperty(
        "--brand_colour", aspect.brand_colour
    );

    skull.style.setProperty(
        "--energy_colour", aspect.energy_colour
    );

    skull.style.setProperty(
        "--core_colour", aspect.core_colour
    );

    sigil_shape.setAttribute("d", aspect.sigil_path);

    const label = document.getElementById(
        `aspect_label_${index}`
    );

    label.textContent = aspect.name;

    label.style.setProperty(
        "--aspect_colour", aspect.colour
    );
}
