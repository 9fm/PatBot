import { MessageEmbed, User } from "discord.js";
import { getColor } from "../colors";
import { Command } from "../command";
import { getUserFromMention } from "../util/discord";
import { random } from "../util/random";

export const lejCommand: Command = async (ctx) => {
    const user = await getUserFromMention(ctx.bot.client, ctx.args[0]);

    if (!user) {
        ctx.message.reply("Musi być użytkownik :c");
        return;
    }

    const r = getLejostwo(user);

    const description = `${ctx.args[0]} jest w ${r}% lejem`;

    const embed = new MessageEmbed()
        .setTitle("Lejometr")
        .setColor(getColor())
        .setDescription(description);

    await ctx.message.reply({ embeds: [embed] });
}

function getLejostwo(user: User): number {
    if (user.username == "tele" || user.id == "829597851767406593") return 100;

    return random.range(0, 100);
}
