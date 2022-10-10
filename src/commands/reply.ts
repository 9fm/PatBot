import { CommandBuilder, restOfTheLineParser } from "../command";
import { random } from "../util/random";

export function replyCommand(replyMessage: string) {
    return new CommandBuilder()
        .withDescription("Odpowiada na pytanko")
        .executes((ctx) => void ctx.message.reply(replyMessage));
}

export function randomReplyCommand(replyMessages: string[], allowArgs: boolean) {
    const builder: CommandBuilder<any> = new CommandBuilder();

    if (allowArgs) builder.withArg("cokolwiek", restOfTheLineParser);

    return builder
        .withDescription("Odpowiada na pytanko ale nie zawsze tak samo")
        .executes((ctx) => void ctx.message.reply(random.element(replyMessages)));
}
