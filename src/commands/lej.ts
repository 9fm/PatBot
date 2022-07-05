import { MessageEmbed, User } from "discord.js";
import { getColor } from "../colors";
import { CommandBuilder, userParser } from "../command";
import { random } from "../util/random";

export const lejCommand = new CommandBuilder()
    .withArg("użytkownik", userParser)
    .executes(async (ctx, user) => {
        const r = getLejostwo(user);

        const description = `<@${user.id}> jest w ${r}% lejem`;

        const embed = new MessageEmbed()
            .setTitle("Lejometr")
            .setColor(getColor())
            .setDescription(description);

        await ctx.message.reply({ embeds: [embed] });
    });

function getLejostwo(user: User): number {
    if (user.username == "tele" || user.id == "829597851767406593") return 100;

    return random.range(0, 100);
}
