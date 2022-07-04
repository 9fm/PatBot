import * as dotenv from "dotenv";

import { Bot } from "./bot";

import { badWordReplacer } from "./modules/badWordReplacer";
import { pinVoting } from "./modules/pinVoting";

import { replyCommand, randomReplyCommand } from "./commands/reply";
import { pingCommand } from "./commands/ping";
import { lejCommand } from "./commands/lej";
import { sayCommand } from "./commands/say";
import { progressBarCommand } from "./commands/progressBar";
import { executeCommand } from "./commands/execute";
import { commandListCommand } from "./commands/commandList";
import { requiresPermissions } from "./commands/requiresPermission";
import { disableModuleCommand, enableModuleCommand, getConfigOverridesCommand, listModulesCommand, setConfigOverridesCommand } from "./commands/module";
import { leakCodeCommand } from "./commands/leakCode";
import { groupCommand } from "./commands/groupCommand";

dotenv.config();

const bot = new Bot(process.env.PREFIX as string, { badWordReplacer, pinVoting });

bot.commandHandler.commands = [
    [["pomocy", "pomoc", "help"], replyCommand(`nie pomogę ci :c\n(ale możesz użyć \`${bot.prefix}komendy\` żeby zobaczyć listę komend)`)],

    [["żyjesz", "żyjesz?", "działasz", "działasz?"], replyCommand("tak")],
    [["pogłaskaj", "pat", "<:pat:708330059437441114>"], replyCommand("Pat został pogłaskany.")],
    [["ring", "ping"], pingCommand("Bing!")],
    [["kiedy", "<:kiedy:741288559604138005>"], randomReplyCommand(":jutro:", ":nigdy:")],
    [["czy", "<:czy:767692365439565844>"], randomReplyCommand("tak", "nie")],

    [["lej", "lejometr", "<:lejoglowie:950000150447804436>"], lejCommand],
    [["powiedz"], sayCommand],

    [["zrób"], progressBarCommand((ctx) => `Robię ${ctx.unsplittedArgs}...`, (ctx) => `Zrobiono ${ctx.unsplittedArgs}!`, (ctx) => `Błąd! Zrobienie ${ctx.unsplittedArgs} nie zakończyło się pomyślnie`)],
    [["usuń"], progressBarCommand((ctx) => `Usuwam ${ctx.unsplittedArgs}...`, (ctx) => `Usunięto ${ctx.unsplittedArgs}!`, (ctx) => `Błąd! Usunięcie ${ctx.unsplittedArgs} nie zakończyło się pomyślnie`)],

    [["komendy", "listakomend"], commandListCommand],
    [["corobi", "zleakujkod"], leakCodeCommand],

    [["moduły"], requiresPermissions(["MANAGE_GUILD"], groupCommand(
        [["lista"], listModulesCommand],
        [["włącz"], enableModuleCommand],
        [["wyłącz"], disableModuleCommand],
        [["config", "konfig"], groupCommand(
            [["ustaw"], setConfigOverridesCommand],
            [["pokaż"], getConfigOverridesCommand],
        )]
    ))],
];

if (process.env.BOT_OWNER_ID) bot.commandHandler.addCommand(["wykonaj"], executeCommand(process.env.BOT_OWNER_ID as string));

bot.start(process.env.TOKEN!);