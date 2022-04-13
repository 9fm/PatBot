import { MessageEmbed } from "discord.js";
import { Command } from "../command";
import { Colors } from "../config";

function setEnabledModuleCommand(enabled: boolean): Command {
    return async ({ bot, message, args }) => {
        if (!bot.modules.has(args[0])) {
            await message.reply(`Moduł ${args[0]} nie istnieje`);
            return;
        }

        const guild = await bot.getGuildData(message.guild!);

        let index = guild.modules.findIndex((moduleConf) => moduleConf.moduleId == args[0]);
        if (index == -1) {
            guild.modules.push({ moduleId: args[0], enabled });
        }
        else {
            guild.modules[index].enabled = enabled;
        }

        await guild.save();
        await message.reply(enabled ? `Moduł \`${args[0]}\` został włączony na tym serwerze` : `Moduł \`${args[0]}\` został wyłączony na tym serwerze`);
    }
}

export const enableModuleCommand = setEnabledModuleCommand(true);
export const disableModuleCommand = setEnabledModuleCommand(false);

export const listModulesCommand: Command = async ({ bot, message, args }) => {
    const embed = new MessageEmbed()
        .setTitle("Moduły pata")
        .setColor(Colors.getColor());

    for (const [moduleId, module] of bot.modules) {
        const status = await bot.isModuleEnabled(message.guild!, moduleId) ? (bot.hasModulePermissions(message.guild!, moduleId) ? "wlonczony" : "brakuje permisji") : "wylonczony";
        embed.addField(moduleId + ": " + status, module.description);
    }

    await message.reply({ embeds: [embed] });
}