import * as Discord from "discord.js";
import { Bot } from "./bot";

export class CommandContext {
    public readonly bot: Bot;

    public readonly message: Discord.Message;
    public readonly args: string[];
    public readonly unsplittedArgs: string;

    public constructor(bot: Bot, message: Discord.Message, unsplittedArgs: string) {
        this.bot = bot;
        this.message = message;
        this.unsplittedArgs = unsplittedArgs;
        this.args = unsplittedArgs.split(' ');
    }
}

export type Command = (context: CommandContext) => Awaitable<void>;
