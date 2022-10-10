import { TextChannel } from "discord.js";
import { BotModule } from "../botModule";

export const pinVoting: BotModule<{ votesRequired: number }> = {
    defaultEnabled: false,
    description: "Automatycznie przypina wiadomości z wystarczająca liczbą reakcji :pushpin:",
    requiredPermissions: ["ManageMessages"],
    defaultConfig: {
        votesRequired: 3
    },

    eventListeners: {
        async messageReactionAdd(bot, reaction, user) {
            if (reaction.emoji.name == "📌") {
                const config = await bot.getConfig(reaction.message.guild!, pinVoting);

                const message = reaction.message;
                const channel = message.channel as TextChannel;
                if (message.pinned) return;

                const reactions = (await reaction.users.fetch())
                    .filter(user => !user.bot)
                    .filter(user => channel.guild.members.cache.get(user.id)!.permissionsIn(channel).has("SendMessages"));

                if (reactions.size >= config.votesRequired) {
                    await message.pin();
                }
            }
        }
    }
}