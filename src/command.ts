import { Awaitable, Message, PermissionResolvable, User } from "discord.js";
import { Bot } from "./bot";
import { bot } from "./main";
import { getUserFromMention } from "./util/discord";

export interface CommandContext {
    readonly bot: Bot;

    readonly message: Message;

    readonly unsplittedArgs: string;
}

export type ParsingError = { error: string }
export type ArgParser<T> = (arg: string) => (T | ParsingError) | Promise<T | ParsingError>

export const restOfTheLineParser: ArgParser<string> = Symbol("Rest of the line parser") as any;

export const stringParser: ArgParser<string> = (arg) => arg;
export const intParser: ArgParser<number> = (arg) => {
    const parsed = parseInt(arg);
    if (isNaN(parsed)) return { error: `${arg} nie jest liczbą` };
    return parsed;
};
export const userParser: ArgParser<User> = async (arg) => {
    return await getUserFromMention(bot.client, arg) ?? { error: `Użytkownik ${arg} nie istnieje` };
};
export const moduleParser: ArgParser<string> = async (arg) => {
    return bot.modules.has(arg) ? arg : { error: `Moduł ${arg} nie istnieje` };
};

export type ParserList<T extends any[]> = { [P in keyof T]: ArgParser<T[P]> };

export interface Command<T extends any[] = any> {
    readonly args: string[];
    readonly parsers: ParserList<T>;
    readonly description: string | null;
    readonly permissions: PermissionResolvable;
    readonly execute: (ctx: CommandContext, ...args: T) => Awaitable<void>;
}

export class CommandBuilder<T extends any[] = []> {
    private readonly args: string[] = [];
    private readonly parsers: ParserList<T>;

    private permissions: PermissionResolvable = [];
    private description: string | null = null;

    constructor(args: string[] = [], parsers: ParserList<T> = [] as any) {
        this.args = args;
        this.parsers = parsers;
    }

    withArg<A>(name: string, parser: ArgParser<A>): CommandBuilder<[...T, A]> {
        this.args.push(name);
        this.parsers.push(parser);
        return this as unknown as CommandBuilder<[...T, A]>;
    }

    withDescription(description: string): this {
        this.description = description;
        return this;
    }

    requires(permissions: PermissionResolvable): this {
        this.permissions = permissions;
        return this;
    }

    executes(func: (ctx: CommandContext, ...args: T) => Awaitable<void>): Command<T> {
        return {
            args: this.args,
            parsers: this.parsers,
            description: this.description,
            permissions: this.permissions,
            execute: func
        };
    }
}
