import { MessageEmbed } from "discord.js";
import { Command } from "../command";
import { getColor } from "../colors";

export const commandListCommand: Command = async (ctx) => {
    const embed = new MessageEmbed()
        .setTitle("Komendy")
        .setColor(getColor());

    for (const cmd of ctx.bot.commandHandler.commands) {
        embed.addField(cmd[0].map((el, i) => i == 0 ? `**${el}**` : el).join(", "), `Jeżeli chcesz sie dowiedzieć co robi napisz \`${ctx.bot.prefix}corobi ${cmd[0][0]}\``);
    }

    await ctx.message.reply({ embeds: [embed] });
}