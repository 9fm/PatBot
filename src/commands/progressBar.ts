import { MessageEmbed } from "discord.js";
import { getColor } from "../colors";
import { Command, CommandContext } from "../command";
import { delay } from "../util/misc";
import { random } from "../util/random";

export function progressBarCommand(progressMessage: (ctx: CommandContext) => string, finishedMessage: (ctx: CommandContext) => string): Command {
    return async (context) => {
        const embed = new MessageEmbed()
            .setTitle(progressMessage(context))
            .setColor(getColor())
            .setDescription("");

        let percentage = 0

        const msg = await context.message.reply({ embeds: [embed] });

        while (percentage < 100) {
            percentage += Math.floor(random.range(0, 10));
            if (percentage > 100) percentage = 100;

            embed.setDescription(`${percentage}%`);
            await msg.edit({ embeds: [embed] });

            await delay(random.range(500, 600));
        }

        await context.message.reply(finishedMessage(context));
    }
}