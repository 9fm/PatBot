import { Awaitable, ClientEvents, Message, PermissionString } from "discord.js";
import { Bot } from "./bot";

export interface BotModule {
    defaultEnabled: boolean
    description: string
    requiredPermissions: PermissionString[]
    defaultConfig?: Object

    onMessageSent?(bot: Bot, message: Message): Promise<void>
    eventListeners?: {
        [K in keyof ClientEvents]?: (bot: Bot, ...args: ClientEvents[K]) => Awaitable<void>;
    }
}