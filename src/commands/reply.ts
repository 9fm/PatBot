import { Command } from "../command";

export function replyCommand(replyMessage: string): Command {
    return (context) => void context.message.reply(replyMessage);
}
