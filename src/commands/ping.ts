import { Command } from "../command";

export function pingCommand(replyMessage: string): Command {
    return async (context) => {
        const mess = await context.message.reply(replyMessage);

        const ping = mess.createdTimestamp - context.message.createdTimestamp;

        mess.edit(`${replyMessage} (${ping}ms)`);
    }
}
