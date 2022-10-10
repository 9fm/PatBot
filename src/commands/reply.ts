import { CommandBuilder, restOfTheLineParser } from "../command";
import { random } from "../util/random";

export function replyCommand(replyMessage: string) {
    return new CommandBuilder()
        .executes((ctx) => void ctx.message.reply(replyMessage));
}

export function randomReplyCommand(replyMessages: string[], allowArgs: boolean) {
    let builder: CommandBuilder<any> = new CommandBuilder();

    if (allowArgs) builder = builder.withArg("cokolwiek", restOfTheLineParser);

    return builder.executes((ctx) => void ctx.message.reply(random.element(replyMessages)));
}
