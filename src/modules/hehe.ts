import { Message } from "discord.js";
import { BotModule } from "../botModule";

export const hehe: BotModule = {
    defaultEnabled: true,
    description: "Odpisuje hehe na śmieszne słowa (sex)",
    requiredPermissions: ["SEND_MESSAGES"],

    async onMessageSent(message: Message<boolean>) {
        const content = message.content.toLowerCase();

        if (content.includes("sex")) message.reply("hehe");
        if (content.includes("xes")) message.reply("eheh");
        if (content.includes("sęx")) message.reply("hęhę");
        if (content.includes("xęs")) message.reply("ęhęh");
        if (content.includes("seks")) message.reply("cheche");

        if (content.includes("hehe")) message.reply("hehe");
        if (content.includes("eheh")) message.reply("eheh");
        if (content.includes("hęhę")) message.reply("hęhę");
        if (content.includes("ęhęh")) message.reply("ęhęh");
        if (content.includes("cheche")) message.reply("cheche");
    }
}