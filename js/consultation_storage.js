
const storage_key = "the_patron_consultation";

export function save_consultation(aspects, original_spells, override_spells = null) {
    const consultation = {
        aspects: aspects.map(aspect => aspect.id),
        original_spells: original_spells.map(spell => spell.id),
        override_spells: override_spells
            ? override_spells.map(spell => spell.id)
            : null
    };

    localStorage.setItem(storage_key, JSON.stringify(consultation));
}

export function load_consultation(spells, aspects) {
    const saved_data = localStorage.getItem(storage_key);

    if (!saved_data) {
        return null;
    }

    try {
        const saved = JSON.parse(saved_data);

        const find_spells = ids => ids.map(
            id => spells.find(spell => spell.id === id)
        );

        const restored_aspects = saved.aspects.map(
            id => aspects.find(aspect => aspect.id === id)
        );

        const original_spells = find_spells(saved.original_spells);

        const override_spells = saved.override_spells
            ? find_spells(saved.override_spells)
            : null;

        if (
            restored_aspects.length !== 3 ||
            original_spells.length !== 5 ||
            restored_aspects.some(aspect => !aspect) ||
            original_spells.some(spell => !spell) ||
            (override_spells && (
                override_spells.length !== 5 ||
                override_spells.some(spell => !spell)
            ))
        ) {
            return null;
        }

        return {
            aspects: restored_aspects,
            original_spells,
            override_spells
        };
    } catch (error) {
        console.warn("Could not restore consultation:", error);
        return null;
    }
}
