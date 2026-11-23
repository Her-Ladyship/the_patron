
export function select_random_items(items, count) {
    const available_items = [...items];
    const selected_items = [];

    for (let index = 0; index < count; index++) {
        const random_index = Math.floor(
            Math.random() * available_items.length
        );

        selected_items.push(
            available_items.splice(random_index, 1)[0]
        );
    }

    return selected_items;
}
