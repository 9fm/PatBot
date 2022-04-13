export const random = {
    range: (min: number, max: number) => min + Math.floor(Math.random() * (max + 1 - min)),
    chance: (chance: number) => Math.random() <= chance,
    element: (array: any[]) => array[random.range(0, array.length - 1)],
}