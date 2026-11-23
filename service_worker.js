
const cache_name = "the_patron_v3";

const core_files = [
    "./",
    "./index.html",
    "./spells.json",
    "./aspects.json",

    "./css/background.css",
    "./css/base.css",
    "./css/binding_sigil.css",
    "./css/consultation.css",
    "./css/header.css",
    "./css/manual_override.css",
    "./css/settings.css",
    "./css/skulls.css",
    "./css/spell_cards.css",
    "./css/spell_library.css",
    "./css/spell_overlay.css",

    "./js/app_state.js",
    "./js/app.js",
    "./js/background_effects.js",
    "./js/binding_sigil.js",
    "./js/config.js",
    "./js/consultation.js",
    "./js/consultation_storage.js",
    "./js/data_loading.js",
    "./js/dom.js",
    "./js/events.js",
    "./js/manual_override.js",
    "./js/random_selection.js",
    "./js/settings.js",
    "./js/skull_animation.js",
    "./js/spell_cards.js",
    "./js/spell_library.js",
    "./js/spell_overlay.js",

    "./assets/skulls/base_skull.png",
    "./assets/fonts/Cinzel-VariableFont_wght.ttf",

    "./assets/apple_touch_icon.png"
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(cache_name);

            // Cache the app's essential files.
            await cache.addAll(core_files);

            // Read the spell list.
            const response = await fetch("./spells.json");
            if (!response.ok) {
                throw new Error("Could not load spells.json");
            }

            const spells = await response.json();

            // Build an artwork path for every spell.
            const artwork_files = spells.map((spell) => {
                return `./assets/cards/${spell.id}.png`;
            });

            // Download all spell artwork for offline use.
            await cache.addAll(artwork_files);
        })()
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const cache_names = await caches.keys();

            await Promise.all(
                cache_names
                    .filter((name) => {
                        return name.startsWith("the_patron_")
                            && name !== cache_name;
                    })
                    .map((name) => caches.delete(name))
            );

            await self.clients.claim();
        })()
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached_response) => {
            return cached_response || fetch(event.request);
        })
    );
});
