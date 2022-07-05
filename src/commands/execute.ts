import { CommandBuilder, restOfTheLineParser } from "../command";

export function executeCommand(ownerId: string) {
    return new CommandBuilder()
        .withArg("kod", restOfTheLineParser)
        .executes(async (ctx, code) => {
            if (ctx.message.author.id != ownerId) return void ctx.message.reply("Tylko właściciel bota może użyć takiej potężnej komendy");

            try {
                const result = eval(code);
                ctx.message.reply((result ?? "Wykonane").toString());
            }
            catch (err) {
                await ctx.message.reply((err as any).toString());
            }
        });
}