import { Command } from "../command";

export const executeCommand: Command = async (ctx) => {
    if (ctx.message.author.id != "487681102580809728") return ctx.message.reply("tylko ketok moze uzyc takiej poteznej komendy");

    try {
        const result = eval(ctx.unsplittedArgs);
        ctx.message.reply((result ?? "Wykonane").toString());
    }
    catch (err) {
        await ctx.message.reply((err as any).toString());
    }
}