import { Guild, Message, TextChannel } from "discord.js";
import { Bot } from "../bot";
import { BotModule } from "../botModule";
import { includesWord, replaceWord, unpolish } from "../util/text";

import badWords from "./badWords.json";

async function getBadWordMap(bot: Bot, guild: Guild): Promise<Record<string, string>> {
    const badWordMap = {};

    const config = await bot.getConfig(guild, badWordReplacer);

    if (config.useGlobalBadWordMap) Object.assign(badWordMap, badWords);
    Object.assign(badWordMap, config.customBadWordMap);

    return badWordMap as Record<string, string>;
}

function includesBadWords(content: string, badWordMap: Record<string, string>) {
    return Object.keys(badWordMap).some(badWord => includesWord(content, badWord) || includesWord(content, unpolish(badWord)))
}

export const badWordReplacer: BotModule<{ useGlobalBadWordMap: boolean, customBadWordMap: Record<string, string> }> = {
    defaultEnabled: true,
    description: "Zamienia brzydkie słowa na ładne w wiadomościach (np. chuj -> siusiak)",
    requiredPermissions: ["ManageWebhooks", "ManageMessages"],
    defaultConfig: {
        useGlobalBadWordMap: true,
        customBadWordMap: {}
    },

    async onMessageSent(bot: Bot, message: Message<boolean>) {
        const content = message.content.toLowerCase();

        const badWordMap = await getBadWordMap(bot, message.guild!)

        if (includesBadWords(content, badWordMap)) {
            let contentWithoutBadWords = content;
            Object.entries(badWordMap)
                .forEach(([badWord, goodWord]) => {
                    contentWithoutBadWords = replaceWord(contentWithoutBadWords, badWord, goodWord as string);
                    contentWithoutBadWords = replaceWord(contentWithoutBadWords, unpolish(badWord), unpolish(goodWord as string));
                });

            // TODO: Fix other pings
            contentWithoutBadWords = contentWithoutBadWords
                .replaceAll("@everyone", "@każdyjeden")
                .replaceAll("@here", "@tutaj");

            const channel = message.channel as TextChannel;

            const hook = (await channel.fetchWebhooks()).find((webhook) => webhook.name == "Pathook") ?? await channel.createWebhook({ name: "Pathook", reason: "Webhook stworzony przez pat bota do usuwania brzydkich słów z wiadomości" });
            await hook.send({ username: message.author.username, avatarURL: message.author.avatarURL() ?? undefined, content: contentWithoutBadWords })
            await message.delete();
        }
    },

    eventListeners: {
        async messageUpdate(bot, oldMessage, newMessage) {
            if (includesBadWords(newMessage.content!, await getBadWordMap(bot, oldMessage.guild!))) {
                newMessage.delete();
                if ("send" in newMessage.channel) newMessage.channel.send(`<@${newMessage.author!.id}> pat wszystko widzi`); // Kinda hacky but at least it compiles
            }
        }
    }
}
