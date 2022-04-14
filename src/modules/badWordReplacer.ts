import { Message, TextChannel } from "discord.js";
import { BotModule } from "../botModule";
import { includesWord, replaceWord, unpolish } from "../util/text";

import badWords from "./badWords.json";

function includesBadWords(content: string) {
    return Object.keys(badWords).some(badWord => includesWord(content, badWord) || includesWord(content, unpolish(badWord)))
}

export const badWordReplacer: BotModule = {
    defaultEnabled: true,
    description: "Zamienia brzydkie słowa na ładne w wiadomościach (np. chuj -> siusiak)",
    requiredPermissions: ["MANAGE_WEBHOOKS", "MANAGE_MESSAGES"],

    async onMessageSent(message: Message<boolean>) {
        const content = message.content.toLowerCase();

        if (includesBadWords(content)) {
            let contentWithoutBadWords = content;
            Object.entries(badWords)
                .forEach(([badWord, goodWord]) => {
                    contentWithoutBadWords = replaceWord(contentWithoutBadWords, badWord, goodWord);
                    contentWithoutBadWords = replaceWord(contentWithoutBadWords, unpolish(badWord), unpolish(goodWord));
                });

            const channel = message.channel as TextChannel;

            const hook = (await channel.fetchWebhooks()).find((webhook) => webhook.name == "Pathook") ?? await channel.createWebhook("Pathook", { reason: "Webhook stworzony przez pat bota do usuwania brzydkich słów z wiadomości" });
            await hook.send({ username: message.author.username, avatarURL: message.author.avatarURL() ?? undefined, content: contentWithoutBadWords })
            await message.delete();
        }
    },

    eventListeners: {
        messageUpdate(oldMessage, newMessage) {
            if (includesBadWords(newMessage.content!)) {
                newMessage.delete();
                newMessage.channel.send(`<@${newMessage.author!.id}> pat wszystko widzi`);
            }
        }
    }
}