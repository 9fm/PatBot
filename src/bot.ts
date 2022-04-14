import * as Discord from "discord.js";
import { BotModule } from "./botModule";
import { Command } from "./command";
import { CommandManager } from "./commandManager";
import { prefix } from "./config"
import { connect, model, Schema } from "mongoose";

export interface GuildModuleSettings {
    readonly moduleId: string;
    enabled: boolean;
}

export interface GuildData {
    readonly guildId: string;
    modules: GuildModuleSettings[];
}

const guildSchema = new Schema<GuildData>({
    guildId: { type: String, required: true, unique: true },
    modules: {
        type: [{
            moduleId: String,
            enabled: Boolean
        }],
        required: true
    }
});

export const GuildData = model<GuildData>('GuildData', guildSchema);

//TODO: Make all of this static?
export class Bot {
    public readonly client: Discord.Client;

    public readonly commandManager = new CommandManager(this);

    public readonly modules: ReadonlyMap<string, BotModule>;

    public constructor(modules: Object) {
        this.client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
        this.modules = new Map(Object.entries(modules));

        this.registerModuleCallbacks();
        this.registerCallbacks();
    }

    private registerModuleCallbacks() {
        for (const [moduleId, module] of this.modules) {
            if (module.eventListeners) {
                for (const [event, listener] of Object.entries(module.eventListeners)) {
                    this.client.on(event, async (...args: any[]) => {
                        const guild = args[0].guild;
                        if (!guild) throw new Error();
                        if (await this.isModuleEnabled(guild, moduleId) && this.hasModulePermissions(guild, moduleId))
                            await listener(...args);
                    });
                }
            }
        }
    }

    private registerCallbacks() {
        this.client.on("messageCreate", async (message) => {
            if (message.author.bot) return;
            if (message.channel.type != "GUILD_TEXT") return;

            const content = message.content.toLowerCase();

            const mentionPrefix = `<@!${this.client.user!.id}> `;

            if (content == prefix.trimEnd() || content == mentionPrefix.trimEnd()) {
                message.reply("czego");
            }
            else if (content.startsWith(prefix)) {
                this.commandManager.executeCommand(message, message.content.slice(prefix.length));
            }
            else if (content.startsWith(mentionPrefix)) {
                this.commandManager.executeCommand(message, message.content.slice(mentionPrefix.length));
            }
            else {
                this.onAllEnabledModules(message.guild!, (m) => m.onMessageSent?.(message).catch((exception) => console.error(exception)));
            }
        });
    }

    private async onAllEnabledModules(guild: Discord.Guild, action: (module: BotModule) => void) {
        for (const [moduleId, module] of this.modules) {
            if (await this.isModuleEnabled(guild, moduleId) && this.hasModulePermissions(guild, moduleId)) {
                action(module);
            }
        }
    }

    public async isModuleEnabled(guild: Discord.Guild, moduleId: string) {
        const moduleConf = (await this.getGuildData(guild!)).modules.find((module) => module.moduleId == moduleId);
        if (moduleConf === undefined) return this.modules.get(moduleId)!.defaultEnabled;
        return moduleConf.enabled;
    }

    public hasModulePermissions(guild: Discord.Guild, moduleId: string) {
        return guild.members.cache.get(this.client.user!.id)!.permissions.has(this.modules.get(moduleId)!.requiredPermissions);
    }

    public addCommand(names: string[], command: Command) {
        return this.commandManager.addCommand(names, command);
    }

    public async getGuildData(guild: Discord.Guild) {
        let guildData = await GuildData.findOne({ guildId: guild.id });
        if (!guildData) {
            guildData = await GuildData.create({ guildId: guild.id, disabledModules: [] });
        }

        return guildData;
    }

    public async start(token: string) {
        console.log("Starting bot...");

        console.log("Connecting to database...");
        connect(process.env.DB_CONN_STRING!);

        console.log("Logging in...");
        await this.client.login(token);

        console.log("Bot started!");
    }
}
