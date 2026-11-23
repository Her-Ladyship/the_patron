// Keep the original number and order of random draws for both layers.
function create_particle_layer({ count, colours, min_size, size_range, min_brightness, brightness_range, min_twinkle, twinkle_range, min_drift, drift_range, delay_range, movement_range }) {
    const container = document.querySelector('.abyss_particles');
    for (let index = 0; index < count; index++) {
        const mote = document.createElement('span');
        mote.className = 'abyss_mote';
        const size = min_size + Math.random() * size_range;
        mote.style.left = `${Math.random() * 100}%`;
        mote.style.top = `${Math.random() * 100}%`;
        mote.style.setProperty('--mote_size', `${size}px`);
        mote.style.setProperty('--mote_colour', colours[Math.floor(Math.random() * colours.length)]);
        mote.style.setProperty('--mote_brightness', min_brightness + Math.random() * brightness_range);
        mote.style.setProperty('--twinkle_duration', `${min_twinkle + Math.random() * twinkle_range}s`);
        mote.style.setProperty('--drift_duration', `${min_drift + Math.random() * drift_range}s`);
        mote.style.setProperty('--mote_delay', `${-Math.random() * delay_range}s`);
        mote.style.setProperty('--drift_x', `${Math.random() * movement_range - movement_range / 2}px`);
        mote.style.setProperty('--drift_y', `${Math.random() * movement_range - movement_range / 2}px`);
        container.appendChild(mote);
    }
}

export function create_abyss_motes() {
    create_particle_layer({ count: 100, colours: ['#B579FF', '#D6A5FF', '#C46B9B', '#E8DFFF'], min_size: 1, size_range: 2, min_brightness: 0.15, brightness_range: 0.45, min_twinkle: 3, twinkle_range: 7, min_drift: 15, drift_range: 25, delay_range: 40, movement_range: 30 });
}

export function create_abyss_dust() {
    create_particle_layer({ count: 180, colours: ['#6383C4', '#8FA9D9', '#A6B5D4', '#C9D9EF'], min_size: 0.5, size_range: 1, min_brightness: 0.1, brightness_range: 0.3, min_twinkle: 0.8, twinkle_range: 1.7, min_drift: 5, drift_range: 7, delay_range: 12, movement_range: 20 });
}
