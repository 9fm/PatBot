import { Command } from "../command";

export function executeCommand(ownerId: string): Command {
    return async (ctx) => {
        if (ctx.message.author.id != ownerId) return void ctx.message.reply("tylko właściciel bota może użyć takiej potężnej komendy");

        try {
            const result = eval(ctx.unsplittedArgs);
            ctx.message.reply((result ?? "Wykonane").toString());
        }
        catch (err) {
            await ctx.message.reply((err as any).toString());
        }
    }
}