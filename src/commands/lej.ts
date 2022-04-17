import { MessageEmbed, User } from "discord.js";
import { getColor } from "../colors";
import { Command } from "../command";
import { getUserFromMention } from "../util/discord";
import { random } from "../util/random";

export const lejCommand: Command = async (context) => {
    const user = await getUserFromMention(context.bot.client, context.args[0]);

    if (!user) {
        context.message.reply("Musi być użytkownik :c");
        return;
    }

    const r = getLejostwo(user);

    const description = `${context.args[0]} jest w ${r}% lejem`;

    const embed = new MessageEmbed()
        .setTitle("Lejometr")
        .setColor(getColor())
        .setDescription(description);

    await context.message.reply({ embeds: [embed] });
}

function getLejostwo(user: User): number {
    if (user.username == "tele" || user.id == "829597851767406593") return 100;

    return random.range(0, 100);
}
