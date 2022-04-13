import { Message, PermissionString } from "discord.js";

export interface BotModule {
    defaultEnabled: boolean
    description: string
    requiredPermissions: PermissionString[]

    onMessageSent?(message: Message): Promise<void>
    eventListeners?: Object
}