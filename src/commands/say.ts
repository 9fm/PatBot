import { EmbedBuilder } from "discord.js";
import { getColor } from "../colors";
import { CommandBuilder, restOfTheLineParser } from "../command";

export const sayCommand = new CommandBuilder()
    .withArg("coś", restOfTheLineParser)
    .executes(async (ctx, cos) => {
        const embed = new EmbedBuilder()
            .setTitle(cos ? `${ctx.message.author.username} kazał mi to powiedzieć` : `${ctx.message.author.username} kazał mi nic nie mówić`)
            .setAuthor({
                name: ctx.message.author.username + "#" + ctx.message.author.discriminator,
                iconURL: ctx.message.author.avatarURL() ?? undefined
            })
            .setColor(getColor())
            .setDescription(cos);

        await ctx.message.channel.send({ embeds: [embed] });
    });
