import { Command } from "../command";
import { random } from "../util/random";

export function randomReplyCommand(...replyMessages: string[]): Command {
    return (context) => context.message.reply(random.element(replyMessages));
}
