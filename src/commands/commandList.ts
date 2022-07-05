import { MessageEmbed } from "discord.js";
import { CommandBuilder } from "../command";
import { getColor } from "../colors";

export const commandListCommand = new CommandBuilder()
    .executes(async (ctx) => {
        const embed = new MessageEmbed()
            .setTitle("Komendy")
            .setColor(getColor());

        for (const [names, cmd] of ctx.bot.commandHandler.commands) {
            embed.addField(names.map((el, i) => i == 0 ? `**${el}**` : el).join(", ") + " " + cmd.args.map(arg => `<${arg}>`).join(' '), `Jeżeli chcesz sie dowiedzieć co robi napisz \`${ctx.bot.prefix}corobi ${names[0]}\``);
        }

        await ctx.message.reply({ embeds: [embed] });
    });