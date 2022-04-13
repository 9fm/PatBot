import { Client, User } from "discord.js";

export const getUserFromMention = async (client: Client, mention: string): Promise<User | undefined> => {
    if (!mention) return undefined;

    mention = mention.trim();

    if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);

        if (mention.startsWith("!")) {
            mention = mention.slice(1);
        }

        return await client.users.fetch(mention);
    }

    try {
        return await client.users.fetch(mention);
    } catch {
        return undefined;
    }
}