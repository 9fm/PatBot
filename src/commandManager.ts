import { Message, MessageEmbed } from "discord.js";
import { Bot } from "./bot";
import { Command, CommandContext } from "./command";
import { error } from "./colors";
import { unpolish } from "./util/text";

export class CommandManager {
    public readonly bot: Bot;

    public readonly commands: [string[], Command][] = [];

    public constructor(bot: Bot) {
        this.bot = bot;
    }

    public async executeCommand(message: Message, commandBody: string) {
        const commandName = commandBody.split(" ")[0];

        if (!commandName) return;

        const command = this.getCommand(commandName);

        if (!command) {
            message.reply("Nie ma takiej komendy :c");
            return;
        }

        try {
            await command(new CommandContext(this.bot, message, commandBody.slice(commandName.length + 1)));
        } catch (exception) {
            const embed = new MessageEmbed()
                .setTitle("Błąd")
                .setDescription("Coś wybuchło :c")
                .setColor(error);

            message.channel.send({ embeds: [embed] });

            console.error(exception);
        }
    }

    public getCommand(name: string) {
        name = name.toLowerCase();

        for (const cmdEntry of this.commands) {
            if (cmdEntry[0].includes(name) || cmdEntry[0].map(unpolish).includes(name)) return cmdEntry[1];
        }

        return null;
    }

    public addCommand(names: string[], command: Command) {
        names.forEach(name => { if (this.getCommand(name) != null) throw new Error(`Command named ${name} is already added`) })
        this.commands.push([names.map(n => n.toLowerCase()), command]);
    }
}
