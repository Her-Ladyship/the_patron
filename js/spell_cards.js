import { visual_themes } from './config.js';
import { open_spell_banner } from './spell_overlay.js';

export function apply_spell(card, spell) {
    card.spell_data = spell;
    const artwork = card.querySelector(".card_front .spell_artwork");
    const name = card.querySelector(".spell_name");
    const diamonds = card.querySelector(".spell_diamonds");

    card.style.setProperty(
        "--spell_colour",
        visual_themes[spell.visual_theme] || "#B579FF"
    );

    artwork.src = `assets/cards/${spell.id}.png`;
    artwork.alt = spell.name;

    name.textContent = spell.name;

    diamonds.innerHTML = "";

    for (let index = 0; index < spell.level; index++) {
        const diamond = document.createElement("span");
        diamond.className = "spell_diamond";
        diamonds.appendChild(diamond);
    }
}

export function create_spell_card(spell, parent) {
    const template = document.getElementById("spell_card_template");

    const card = template.content
        .firstElementChild.cloneNode(true);

    apply_spell(card, spell);

    card.addEventListener("click", () => {
        if (card.classList.contains("is_hidden")) {
            return;
        }

        open_spell_banner(card.spell_data);
    });

    parent.appendChild(card);

    return card;
}
