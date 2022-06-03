import { Command } from "../command";
import { random } from "../util/random";

export function replyCommand(replyMessage: string): Command {
    return (ctx) => void ctx.message.reply(replyMessage);
}

export function randomReplyCommand(...replyMessages: string[]): Command {
    return (ctx) => void ctx.message.reply(random.element(replyMessages));
}
