import { MessageEmbed } from "discord.js";
import { CommandBuilder, moduleParser, restOfTheLineParser } from "../command";
import { getColor } from "../colors";
import { Bot, GuildData, GuildModuleSettings } from "../bot";

function getModuleSettings(bot: Bot, guildData: GuildData, moduleId: string): [GuildModuleSettings, number] {
    let index = guildData.modules.findIndex((moduleConf) => moduleConf.moduleId == moduleId);
    if (index == -1) {
        index = guildData.modules.push({ moduleId, enabled: bot.modules.get(moduleId)!.defaultEnabled, configOverrides: {} }) - 1;
    }
    return [guildData.modules[index]!, index];
}

export function setEnabledModuleCommand(enabled: boolean) {
    return new CommandBuilder()
        .withArg("moduleId", moduleParser)
        .requires("MANAGE_GUILD")
        .executes(async ({ bot, message }, moduleId) => {
            const guildData = await bot.getGuildData(message.guild!);

            getModuleSettings(bot, guildData, moduleId)[0].enabled = enabled;

            await guildData.save();
            await message.reply(enabled ? `Moduł \`${moduleId}\` został włączony na tym serwerze` : `Moduł \`${moduleId}\` został wyłączony na tym serwerze`);
        });
}

export const listModulesCommand = new CommandBuilder()
    .executes(async ({ bot, message }) => {
        const embed = new MessageEmbed()
            .setTitle("Moduły pata")
            .setColor(getColor());

        for (const [moduleId, module] of bot.modules) {
            const status = await bot.isModuleEnabled(message.guild!, moduleId) ? (bot.hasModulePermissions(message.guild!, moduleId) ? "wlonczony" : "brakuje permisji") : "wylonczony";
            embed.addField(moduleId + ": " + status, module.description);
        }

        await message.reply({ embeds: [embed] });
    });

export const setConfigOverridesCommand = new CommandBuilder()
    .withArg("moduleId", moduleParser)
    .withArg("config", restOfTheLineParser)
    .requires("MANAGE_GUILD")
    .executes(async ({ bot, message }, moduleId, configStr) => {
        const configOverrides = JSON.parse(configStr);

        const guildData = await bot.getGuildData(message.guild!);
        const [moduleSettings, index] = getModuleSettings(bot, guildData, moduleId);

        moduleSettings.configOverrides = configOverrides;
        guildData.markModified(`modules[${index}].configOverrides`);

        guildData.save();

        message.reply("Ustawione :thumbsup:")
    });

export const getConfigOverridesCommand = new CommandBuilder()
    .withArg("moduleId", moduleParser)
    .requires("MANAGE_GUILD")
    .executes(async ({ bot, message }, moduleId) => {
        const guildData = await bot.getGuildData(message.guild!);
        const [moduleSettings] = getModuleSettings(bot, guildData, moduleId);

        await message.reply("```json\n" + JSON.stringify(moduleSettings.configOverrides) + "```");
    });