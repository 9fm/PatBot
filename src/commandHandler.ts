import { Message } from "discord.js";
import { Bot } from "./bot";
import { Command, ParserList, ParsingError, restOfTheLineParser } from "./command";
import { unpolish } from "./util/text";

export type CommandsMap = [string[], Command][];

export class CommandHandler {
    public commands: CommandsMap;

    public constructor(...commands: CommandsMap) {
        this.commands = commands;
    }

    public async handleCommand(bot: Bot, message: Message, commandBody: string): Promise<string | null> {
        const commandName = commandBody.split(" ")[0];
        if (!commandName) return "aha nawet nie wpisałeś komendy";

        const command = this.getCommand(commandName);

        if (!command) {
            return "Taka komenda nie istnieje";
        }

        if (!message.member!.permissions.has(command.permissions)) {
            return "Nie możesz tego dokonać";
        }

        const unsplittedArgs = commandBody.slice(commandName.length + 1);

        const parsedArgs = await this.parseArgs(unsplittedArgs, command.parsers);

        if ("error" in parsedArgs) {
            return parsedArgs.error;
        }

        command.execute({ bot, message, unsplittedArgs }, ...parsedArgs);

        return null;
    }

    private async parseArgs<T extends any[]>(unsplittedArgs: string, parsers: ParserList<T>): Promise<T | ParsingError> {
        if (parsers.length == 0) {
            return unsplittedArgs == "" ? [] as unknown as T : { error: "Ta komenda nie przyjmuje argumentów" };
        }

        const result: any[] = [];

        let currentArg = "";
        let currentArgIndex = 0;

        unsplittedArgs += " ";

        for (let i = 0; i < unsplittedArgs.length; i++) {
            const p = unsplittedArgs[i - 1];
            const c = unsplittedArgs[i];

            if (c == " " && (p != " " && p != undefined)) {
                const parser = parsers[currentArgIndex];
                if (!parser) return { error: "Zbyt dużo argumentów" };

                if (parser == restOfTheLineParser) {
                    result.push(currentArg + unsplittedArgs.substring(i, unsplittedArgs.length - 1));
                    currentArgIndex++;
                    break;
                }

                const parsed = await parser(currentArg);
                if (parsed.error) return parsed;
                result.push(parsed);

                currentArgIndex++;
                currentArg = "";
            }
            else {
                currentArg += c;
            }
        };

        if (parsers[currentArgIndex]) {
            return { error: "Zbyt mało argumentów" };
        }

        return result as T;
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
