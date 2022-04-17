import * as dotenv from "dotenv";

import { Bot } from "./bot";

import { hehe } from "./modules/hehe";
import { badWordReplacer } from "./modules/badWordReplacer";

import { replyCommand } from "./commands/reply";
import { pingCommand } from "./commands/ping";
import { lejCommand } from "./commands/lej";
import { sayCommand } from "./commands/say";
import { progressBarCommand } from "./commands/progressBar";
import { executeCommand } from "./commands/execute";
import { commandListCommand } from "./commands/commandList";
import { randomReplyCommand } from "./commands/randomReply";
import { requiresPermissions } from "./commands/requiresPermission";
import { disableModuleCommand, enableModuleCommand, listModulesCommand } from "./commands/module";
import { leakCodeCommand } from "./commands/leakCode";

dotenv.config();

const bot = new Bot(process.env.PREFIX as string, { badWordReplacer, hehe });

bot.addCommand(["pomocy", "pomoc", "help"], replyCommand(`nie pomogę ci :c\n(ale możesz użyć \`${bot.prefix}komendy\` żeby zobaczyć listę komend)`));

bot.addCommand(["żyjesz", "żyjesz?", "działasz", "działasz?"], replyCommand("tak"));
bot.addCommand(["pogłaskaj", "pat", "<:pat:708330059437441114>"], replyCommand("Pat został pogłaskany."));
bot.addCommand(["ring", "ping"], pingCommand("Bing!"));
bot.addCommand(["kiedy", "<:kiedy:741288559604138005>"], randomReplyCommand(":jutro:", ":nigdy:"));
bot.addCommand(["czy", "<:czy:767692365439565844>"], randomReplyCommand("tak", "nie"));

bot.addCommand(["lej", "lejometr", "<:lejoglowie:950000150447804436>"], lejCommand);
bot.addCommand(["powiedz"], sayCommand);

bot.addCommand(["zrób"], progressBarCommand((ctx) => `Robię ${ctx.unsplittedArgs}...`, (ctx) => `Zrobione!`));
bot.addCommand(["usuń"], progressBarCommand((ctx) => `Usuwam ${ctx.unsplittedArgs}...`, (ctx) => `Usunięte!`))

bot.addCommand(["komendy", "listakomend"], commandListCommand);
bot.addCommand(["corobi", "zleakujkod"], leakCodeCommand);
if (process.env.BOT_OWNER_ID) bot.addCommand(["wykonaj"], executeCommand(process.env.BOT_OWNER_ID as string));
bot.addCommand(["gdziejesteś"], (ctx) => void ctx.message.reply(ctx.bot.client.guilds.cache.map(guild => guild.name).toString()));

bot.addCommand(["moduły"], listModulesCommand);
bot.addCommand(["włącz"], requiresPermissions(["MANAGE_GUILD"], enableModuleCommand));
bot.addCommand(["wyłącz"], requiresPermissions(["MANAGE_GUILD"], disableModuleCommand));

bot.start(process.env.TOKEN!);