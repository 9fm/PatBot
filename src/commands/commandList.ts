import { MessageEmbed } from "discord.js";
import { Command } from "../command";
import { Colors, prefix } from "../config";

export const commandListCommand: Command = async (ctx) => {
    const embed = new MessageEmbed()
        .setTitle("Komendy")
        .setColor(Colors.getColor());

    for (const cmd of ctx.bot.commandManager.commands) {
        embed.addField(cmd[0].map((el, i) => i == 0 ? `**${el}**` : el).join(", "), `Jeżeli chcesz sie dowiedzieć co robi napisz \`${prefix}corobi ${cmd[0][0]}\``);
    }

    await ctx.message.reply({ embeds: [embed] });
}