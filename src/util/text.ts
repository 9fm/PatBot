export const unpolish = (text: string) => text
    .replace("ą", "a")
    .replace("ć", "c")
    .replace("ę", "e")
    .replace("ł", "l")
    .replace("ń", "n")
    .replace("ó", "o")
    .replace("ś", "s")
    .replace("ż", "z")
    .replace("ź", "z");

export const includesWord = (text: string, word: string) =>
    (" " + text + " ").includes(" " + word + " ");

export const replaceWord = (text: string, from: string, to: string) =>
    (" " + text + " ").replaceAll(" " + from + " ", " " + to + " ");