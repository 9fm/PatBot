import { Command } from "../command";
import { CommandHandler, CommandsMap } from "../commandHandler";

export function groupCommand(...subcommands: CommandsMap): Command {
    const commandHandler = new CommandHandler(...subcommands);
    return async (ctx) => {
        const result = commandHandler.handleCommand(ctx.bot, ctx.message, ctx.unsplittedArgs);
        if (!result) ctx.message.reply("Nie ma takiej komendy :c");
    }
}