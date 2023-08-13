import { EmbedBuilder } from "discord.js";
import { getColor } from "../colors";
import { Command, CommandBuilder } from "../command";
import { random } from "../util/random";

export const botInfoCommand: Command = new CommandBuilder()
    .withDescription("Pokazuje informacje o bocie")
    .executes(async ({ message, bot: { client, client: { user }, prefix } }) => {
        const guilds = (await client.guilds.fetch()).map(guild => guild.id);

        const embed = new EmbedBuilder()
            .setColor(getColor())
            .setAuthor({ name: user!.username, iconURL: user!.avatarURL()! })
            .setDescription(`Cześć! Jestem Pat i jestem małym śmiesznym ludkiem co robi śmieszne rzeczy. Możesz zobaczyć moją liste komend pisząc \`${prefix}komendy\``)
            .addFields(
                {
                    name: "Serwery:",
                    value: guilds.length.toString(),
                    inline: true,
                },
                {
                    name: "Repo:",
                    value: "https://github.com/Ketok4321/PatBot",
                    inline: true,
                },
                {
                    name: "Mój pan i władca:",
                    value: `<@${process.env.BOT_OWNER_ID!}>`,
                    inline: true,
                },
                {
                    name: "Losowy fun fact:",
                    value: random.element(["DJ Płodny jest najpotezniejsza istota na świecie", "Nie posiadam rodziny", "DJ Płodny urodził się w roku 1842", "W filipinach można kupić spaghetti w mcdonaldzie", "90% programistów poddaje się tuż przed tym jak mieli w końcu w pełni zautomatyzować rzecz której zrobienie recznie zajmuje 5 sekund", "JavaScript jest najlepszym językiem programowania", "Zdecydowana większość populacji żab nie zna języka włoskiego", ":3", "W 2019 roku 100% ludzi którzy zginęli w wypadkach samochodowych umarło", "Wolna wola to jedynie iluzja", "Życie to niekończące się cierpienie", "Reakcje jądrowe to przemiany jąder atomowych wywołane ich oddziaływaniem wzajemnym bądź też ich oddziaływaniem z cząstkami elementarnymi"]),
                    inline: true,
                },
            );

        message.reply({ embeds: [embed] });
    });