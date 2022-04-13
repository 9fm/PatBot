import { Command } from "../command";

export const leakCodeCommand: Command = ({ bot, message, args }) => {
    const cmd = bot.commandManager.getCommand(args[0]);
    if (!cmd) return message.reply("nie ma takiej komendy");
    message.reply("(kod poniżej jest wynikiem kompilacji z ts do js, więc różni się nieco od prawdziwego)\n```js\n" + cmd.toString() + "```");
}