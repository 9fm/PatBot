import { PermissionString } from "discord.js";
import { Command } from "../command";

export function requiresPermissions(permissions: PermissionString[], command: Command): Command {
    return async (ctx) => {
        if (!ctx.message.guild!.members.cache.get(ctx.message.author.id)!.permissions.has(permissions)) {
            await ctx.message.reply("Nie możesz tego dokonać");
            return;
        }
        await command(ctx);
    };
}