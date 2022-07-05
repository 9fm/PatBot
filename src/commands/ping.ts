import { CommandBuilder } from "../command";

export function pingCommand(replyMessage: string) {
    return new CommandBuilder()
        .executes(async (ctx) => {
            const mess = await ctx.message.reply(replyMessage);

            const ping = mess.createdTimestamp - ctx.message.createdTimestamp;

            mess.edit(`${replyMessage} (${ping}ms)`);
        });
}
