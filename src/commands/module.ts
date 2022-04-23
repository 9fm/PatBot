import { Guild, MessageEmbed } from "discord.js";
import { Command } from "../command";
import { getColor } from "../colors";
import { Bot, GuildData, GuildModuleSettings } from "../bot";

function moduleCommand(command: Command, moduleArgIndex: number = 0): Command {
    return async (ctx) => {
        if (!ctx.bot.modules.has(ctx.args[moduleArgIndex])) {
            await ctx.message.reply(`Moduł ${ctx.args[moduleArgIndex]} nie istnieje`);
            return;
        }

        await command(ctx);
    }
}

function getModuleSettings(bot: Bot, guildData: GuildData, moduleId: string): [GuildModuleSettings, number] {
    let index = guildData.modules.findIndex((moduleConf) => moduleConf.moduleId == moduleId);
    if (index == -1) {
        index = guildData.modules.push({ moduleId, enabled: bot.modules.get(moduleId)!.defaultEnabled, configOverrides: {} });
    }
    return [guildData.modules[index]!, index];
}

function setEnabledModuleCommand(enabled: boolean): Command {
    return moduleCommand(async ({ bot, message, args }) => {
        const guildData = await bot.getGuildData(message.guild!);

        getModuleSettings(bot, guildData, args[0])[0].enabled = enabled;

        await guildData.save();
        await message.reply(enabled ? `Moduł \`${args[0]}\` został włączony na tym serwerze` : `Moduł \`${args[0]}\` został wyłączony na tym serwerze`);
    });
}

export const enableModuleCommand = setEnabledModuleCommand(true);
export const disableModuleCommand = setEnabledModuleCommand(false);

export const listModulesCommand: Command = async ({ bot, message, args }) => {
    const embed = new MessageEmbed()
        .setTitle("Moduły pata")
        .setColor(getColor());

    for (const [moduleId, module] of bot.modules) {
        const status = await bot.isModuleEnabled(message.guild!, moduleId) ? (bot.hasModulePermissions(message.guild!, moduleId) ? "wlonczony" : "brakuje permisji") : "wylonczony";
        embed.addField(moduleId + ": " + status, module.description);
    }

    await message.reply({ embeds: [embed] });
}

export const setConfigOverridesCommand: Command = moduleCommand(async ({ bot, message, unsplittedArgs }) => {
    const spaceIndex = unsplittedArgs.indexOf(" ");
    const moduleId = unsplittedArgs.substring(0, spaceIndex);
    const configOverrides = JSON.parse(unsplittedArgs.substring(spaceIndex + 1));

    const guildData = await bot.getGuildData(message.guild!);
    const [moduleSettings, index] = getModuleSettings(bot, guildData, moduleId);

    moduleSettings.configOverrides = configOverrides;
    guildData.markModified(`modules[${index}].configOverrides`);

    guildData.save();

    message.reply("Ustawione :thumbsup:")
})

export const getConfigOverridesCommand: Command = moduleCommand(async ({ bot, message, args }) => {
    const moduleId = args[0];

    const guildData = await bot.getGuildData(message.guild!);
    const [moduleSettings] = getModuleSettings(bot, guildData, moduleId);

    await message.reply("```json\n" + JSON.stringify(moduleSettings.configOverrides) + "```");
});