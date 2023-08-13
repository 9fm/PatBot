import * as Discord from "discord.js";
import { BotModule } from "./botModule";
import { CommandHandler } from "./commandHandler";
import { connect, model, Schema } from "mongoose";
import { error } from "./colors";
import { ChannelType } from "discord.js";

export interface GuildModuleSettings {
    readonly moduleId: string;
    enabled: boolean;
    configOverrides: Object;
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
            enabled: Boolean,
            configOverrides: Schema.Types.Mixed,
        }],
        required: true
    }
});

export const GuildData = model<GuildData>('GuildData', guildSchema);

//TODO: Make all of this static?
export class Bot {
    public readonly client: Discord.Client;

    public readonly prefix: string;

    public readonly commandHandler = new CommandHandler();

    public readonly modules: ReadonlyMap<string, BotModule<any>>;

    public constructor(prefix: string, modules: { [key: string]: BotModule<any> }) {
        this.client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "MessageContent"] });
        this.prefix = prefix;
        this.modules = new Map(Object.entries(modules));

        this.registerModuleCallbacks();
        this.registerCallbacks();
    }

    private registerModuleCallbacks() {
        for (const [moduleId, module] of this.modules) {
            if (module.eventListeners) {
                for (const [event, listener] of Object.entries(module.eventListeners)) {
                    this.client.on(event, async (...args: any[]) => {
                        const guild: Discord.Guild = args[0].guild ?? args[0].message?.guild;
                        if (!guild) throw new Error();
                        if (await this.isModuleEnabled(guild, moduleId) && this.hasModulePermissions(guild, moduleId)) {
                            console.log(`Sending ${event} from ${guild.name} to ${moduleId}`);
                            await (listener as any)(this, ...args);
                        }
                    });
                }
            }
        }
    }

    private registerCallbacks() {
        this.client.on("ready", async () => {
            await this.client.user!.setActivity({ name: `${this.prefix}info`, type: Discord.ActivityType.Listening });
        });

        this.client.on("messageCreate", async (message) => {
            try {
                if (message.author.bot) return;
                if (message.channel.type != ChannelType.GuildText) return;

                const content = message.content.toLowerCase();

                const prefixes = [this.prefix, `<@${this.client.user!.id}> `, `<@!${this.client.user!.id}> `];

                if (prefixes.some((prefix) => content == prefix.trimEnd())) {
                    message.reply("czego");
                    return;
                }

                const prefix = prefixes.find((prefix) => content.startsWith(prefix))
                if (prefix) {
                    const result = await this.commandHandler.handleCommand(this, message, message.content.slice(prefix.length));
                    if (result != null) message.reply(result);
                    return;
                }

                this.onAllEnabledModules(message.guild!, (m) => m.onMessageSent?.(this, message).catch((exception) => console.error(exception)));
            } catch (exception) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle("Błąd")
                    .setDescription("Coś wybuchło :c")
                    .setColor(error);

                message.channel.send({ embeds: [embed] });

                console.error(exception);
            }
        });
    }

    private async onAllEnabledModules(guild: Discord.Guild, action: (module: BotModule<any>) => void) {
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

    public async getGuildData(guild: Discord.Guild) {
        let guildData = await GuildData.findOne({ guildId: guild.id });
        if (!guildData) {
            guildData = await GuildData.create({ guildId: guild.id, disabledModules: [] });
        }

        return guildData;
    }

    public async getConfigOverrides(guild: Discord.Guild, moduleId: string) {
        const guildData = await this.getGuildData(guild);
        const moduleSettings = guildData.modules.find((moduleSettings) => moduleSettings.moduleId == moduleId);
        if (moduleSettings) return moduleSettings.configOverrides;
        return {};
    }

    public async getConfig<C extends Record<string, any>>(guild: Discord.Guild, module: string | BotModule<C>) {
        const moduleId = typeof module == "string" ? module : [...this.modules].find(([key, val]) => val == module)![0];
        const moduleObj = typeof module == "string" ? this.modules.get(moduleId) : module;

        const config = {};
        Object.assign(config, moduleObj!.defaultConfig);
        Object.assign(config, await this.getConfigOverrides(guild, moduleId));
        return config as C;
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
