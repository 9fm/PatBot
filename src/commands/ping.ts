import { CommandBuilder } from "../command";

export function pingCommand(replyMessage: string) {
    return new CommandBuilder()
        .executes(async (ctx) => {
            const response = await ctx.message.reply(replyMessage);

            const ping = response.createdTimestamp - ctx.message.createdTimestamp;

            response.edit(`${replyMessage} (${ping}ms)`);
        });
}
