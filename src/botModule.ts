import { Awaitable, ClientEvents, Message, PermissionResolvable } from "discord.js";
import { Bot } from "./bot";

export interface BotModule<C extends Record<string, any>> {
    defaultEnabled: boolean
    description: string
    requiredPermissions: PermissionResolvable
    defaultConfig?: C

    onMessageSent?(bot: Bot, message: Message): Promise<void>
    eventListeners?: {
        [K in keyof ClientEvents]?: (bot: Bot, ...args: ClientEvents[K]) => Awaitable<void>;
    }
}