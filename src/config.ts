import { ColorResolvable } from "discord.js";

export const prefix = "pat ";

export namespace Colors {
    let currentColor = false;

    export const main1: ColorResolvable = '#5b6ee1';
    export const main2: ColorResolvable = '#639bff';
    export const error: ColorResolvable = '#fc4a32';

    export function getColor() {
        currentColor = !currentColor;

        return currentColor ? main1 : main2;
    }
}
