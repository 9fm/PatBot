import { MessageEmbed } from "discord.js";
import { getColor } from "../colors";
import { Command } from "../command";

export const sayCommand: Command = async (ctx) => {
    const embed = new MessageEmbed()
        .setTitle(ctx.unsplittedArgs ? `${ctx.message.author.username} kazał mi to powiedzieć` : `${ctx.message.author.username} kazał mi nic nie mówić`)
        .setAuthor({
            name: ctx.message.author.username + "#" + ctx.message.author.discriminator,
            iconURL: ctx.message.author.avatarURL() ?? undefined
        })
        .setColor(getColor())
        .setDescription(ctx.unsplittedArgs);

    await ctx.message.channel.send({ embeds: [embed] });
}
