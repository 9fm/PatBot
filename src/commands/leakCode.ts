import { CommandBuilder, stringParser } from "../command";

export const leakCodeCommand = new CommandBuilder()
    .withArg("komenda", stringParser)
    .executes(({ bot, message }, command) => {
        const cmd = bot.commandHandler.getCommand(command);
        if (!cmd) return void message.reply("nie ma takiej komendy");
        message.reply("(kod poniżej jest wynikiem kompilacji z ts do js, więc różni się nieco od prawdziwego)\n```js\n" + (cmd.execute.toString()) + "```");
    });