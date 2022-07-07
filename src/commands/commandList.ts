import { MessageEmbed } from "discord.js";
import { Command, CommandBuilder } from "../command";
import { getColor } from "../colors";

export const commandListCommand = new CommandBuilder()
    .executes(async (ctx) => {
        const embed = new MessageEmbed()
            .setTitle("Komendy")
            .setColor(getColor());

        for (const [names, cmd] of ctx.bot.commandHandler.commands) {
            const isGroup = cmd instanceof Array;

            const title = names.map((n, i) => i == 0 ? `**${n}**` : n).join(", ") + " " + (isGroup ? "" : (cmd as Command).args.map(arg => `<${arg}>`).join(' '));
            const description = isGroup ? "Grupa komend" : `Jeżeli chcesz sie dowiedzieć co robi napisz \`${ctx.bot.prefix}corobi ${names[0]}\``;

            embed.addField(title, description);
        }

        await ctx.message.reply({ embeds: [embed] });
    });