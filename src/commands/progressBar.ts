import { EmbedBuilder } from "discord.js";
import { error, getColor } from "../colors";
import { CommandBuilder, CommandContext, restOfTheLineParser } from "../command";
import { delay } from "../util/misc";
import { random } from "../util/random";

export function progressBarCommand(progressMessage: string, finishedMessage: string, failedMessage: string) {
    return new CommandBuilder()
        .withArg("coś", restOfTheLineParser)
        .executes(async (ctx, text) => {
            const embed = new EmbedBuilder()
                .setTitle(progressMessage.replaceAll("{text}", text))
                .setColor(getColor())
                .setDescription("");

            let percentage = 0

            const msg = await ctx.message.reply({ embeds: [embed] });

            while (percentage < 100) {
                percentage += Math.floor(random.range(0, 10));
                if (percentage > 100) percentage = 100;

                embed.setDescription(`${percentage}%`);
                await msg.edit({ embeds: [embed] });

                await delay(random.range(500, 600));
            }

            const failed = random.chance(0.1);

            const resultEmbed = new EmbedBuilder()
                .setTitle(!failed ? finishedMessage.replaceAll("{text}", text) : failedMessage.replaceAll("{text}", text))
                .setColor(!failed ? getColor() : error)
                .setDescription("");

            await ctx.message.reply({ embeds: [resultEmbed] });
        });
}