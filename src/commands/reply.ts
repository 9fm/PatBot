import { Command } from "../command";

export function replyCommand(replyMessage: string): Command {
    return (context) => context.message.reply(replyMessage);
}
