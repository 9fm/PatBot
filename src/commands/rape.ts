import { EmbedBuilder, User } from "discord.js";
import { getColor } from "../colors";
import { CommandBuilder, userParser } from "../command";
import { random } from "../util/random";

export const rapeCommand = new CommandBuilder()
    .withArg("użytkownik", userParser)
    .withDescription("Gwałci użytkownika")
    .executes(async (ctx, user) => {
        const description = `Zgwałcono <@${user.id}>!`;

        const embed = new EmbedBuilder()
            .setTitle("Gwałtomaszyna")
            .setColor(getColor())
            .setDescription(description);

        await ctx.message.reply({ embeds: [embed] });
    });

