import { Message } from "discord.js";
import { Bot } from "./bot";
import { Command, CommandContext } from "./command";
import { unpolish } from "./util/text";

export type CommandsMap = [string[], Command][];

export class CommandHandler {
    public readonly commands: CommandsMap;

    public constructor(...commands: CommandsMap) {
        this.commands = commands;
    }

    public async handleCommand(bot: Bot, message: Message, commandBody: string): Promise<boolean> {
        const commandName = commandBody.split(" ")[0];
        if (!commandName) return false;

        const command = this.getCommand(commandName);

        if (!command) {
            return false;
        }

        await command(new CommandContext(bot, message, commandBody.slice(commandName.length + 1)));
        return true;
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
