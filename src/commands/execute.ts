import { CommandBuilder, restOfTheLineParser } from "../command";
import { Script } from "vm";

export function executeCommand(ownerId: string) {
    return new CommandBuilder()
        .withArg("kod", restOfTheLineParser)
        .withDescription(`Wykonuje kod ale o ile nie jesteś <@${ownerId}> to nie możesz tego użyć`)
        .executes(async (ctx, code) => {
            if (ctx.message.author.id != ownerId) return void ctx.message.reply("Tylko właściciel bota może użyć takiej potężnej komendy");

            try {
                const result = new Script(code).runInNewContext({
                    ctx,
                    CommandBuilder
                });
                ctx.message.reply((result ?? "Wykonane").toString());
            }
            catch (err) {
                await ctx.message.reply((err as any).toString());
            }
        });
}