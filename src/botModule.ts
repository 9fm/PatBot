import { Awaitable, ClientEvents, Message, PermissionString } from "discord.js";

export interface BotModule {
    defaultEnabled: boolean
    description: string
    requiredPermissions: PermissionString[]

    onMessageSent?(message: Message): Promise<void>
    eventListeners?: {
        [K in keyof ClientEvents]?: (...args: ClientEvents[K]) => Awaitable<void>;
    }
}