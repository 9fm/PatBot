import { Command } from "../command";
import vm from "vm";

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

export const safeExecuteCommand: Command = async (ctx) => {
    const context = {
        // napisz(text: string) {
        //     ctx.message.reply(text);
        // },
        // dodajKomende(names: string[], command: (args: string[]) => void) {
        //     ctx.bot.commandManager.registerCommand(names, (ctx) => {
        //         command(ctx.args);
        //     });
        // },
        tele: "lej"
    };

    let result = undefined;

    try {
        result = vm.runInNewContext(ctx.unsplittedArgs, context, { timeout: 100 });
    }
    catch (err) {
        await ctx.message.reply((err as any).toString());
        return;
    }

    const stringResult = (result ?? "Wykonane").toString();

    await ctx.message.reply(stringResult.length < 2000 ? stringResult : "Zbyt dlugie");
}