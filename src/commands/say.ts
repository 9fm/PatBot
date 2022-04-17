import { MessageEmbed } from "discord.js";
import { getColor } from "../colors";
import { Command } from "../command";

export const sayCommand: Command = async (context) => {
    const embed = new MessageEmbed()
        .setTitle(context.unsplittedArgs ? `${context.message.author.username} kazał mi to powiedzieć` : `${context.message.author.username} kazał mi nic nie mówić`)
        .setAuthor(context.message.author.username + "#" + context.message.author.discriminator, context.message.author.avatarURL() ?? undefined)
        .setColor(getColor())
        .setDescription(context.unsplittedArgs);

    await context.message.channel.send({ embeds: [embed] });
}
