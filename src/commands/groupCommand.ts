import { Command } from "../command";
import { CommandHandler, CommandsMap } from "../commandHandler";

export function groupCommand(...subcommands: CommandsMap): Command {
    const commandHandler = new CommandHandler(...subcommands);
    return async (ctx) => {
        const result = await commandHandler.handleCommand(ctx.bot, ctx.message, ctx.unsplittedArgs);
        if (!result) {
            if (ctx.args.length == 0) {
                await ctx.message.reply("Lista subkomend:\n" + commandHandler.commands.map(([name]) => name).join("\n"));
            }
            else {
                await ctx.message.reply("Nie ma takiej subkomendy");
            }
        }
    }
}