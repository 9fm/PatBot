import { CommandBuilder } from "../command";
import { random } from "../util/random";

export function replyCommand(replyMessage: string) {
    return new CommandBuilder()
        .executes((ctx) => void ctx.message.reply(replyMessage));
}

export function randomReplyCommand(...replyMessages: string[]) {
    return new CommandBuilder()
        .executes((ctx) => void ctx.message.reply(random.element(replyMessages)));
}
