import { Bot } from "./bot";

import { range } from "./util/misc";

import { badWordReplacer } from "./modules/badWordReplacer";
import { pinVoting } from "./modules/pinVoting";

import { replyCommand, randomReplyCommand } from "./commands/reply";
import { pingCommand } from "./commands/ping";
import { lejCommand } from "./commands/lej";
import { sayCommand } from "./commands/say";
import { progressBarCommand } from "./commands/progressBar";
import { executeCommand } from "./commands/execute";
import { commandListCommand } from "./commands/commandList";
import { setEnabledModuleCommand, getConfigOverridesCommand, listModulesCommand, setConfigOverridesCommand, getDefaultConfigCommand } from "./commands/module";
import { leakCodeCommand } from "./commands/leakCode";
import { botInfoCommand } from "./commands/info";

export const bot = new Bot(process.env.PREFIX as string, { badWordReplacer, pinVoting });

bot.commandHandler.commands = [
    [["info", "botinfo"], botInfoCommand],

    [["pomocy", "pomoc", "help"], replyCommand(`nie pomogę ci :c\n(ale możesz użyć \`${bot.prefix}komendy\` żeby zobaczyć listę komend)`)],

    [["żyjesz", "żyjesz?", "działasz", "działasz?"], replyCommand("tak")],
    [["pogłaskaj", "pat", "<:pat:708330059437441114>"], replyCommand("Pat został pogłaskany.")],
    [["ring", "ping"], pingCommand("Bing!")],
    [["kiedy", "<:kiedy:741288559604138005>"], randomReplyCommand([":jutro:", ":nigdy:"], true)],
    [["czy", "<:czy:767692365439565844>"], randomReplyCommand(["tak", "nie"], true)],
    [["ile"], randomReplyCommand([...range(0, 100).map(String), ...range(-10, 0).map(String), ...range(1, 20).map(s => s + " pierdylionów"), ...range(1, 20).map(s => s + " sekstylionów"), "dużo", "mało", "tak", "∞", "√2", "π"], true)],

    [["lej", "lejometr"], lejCommand],
    [["powiedz"], sayCommand],

    [["zrób"], progressBarCommand("Robię {text}...", "Zrobiono {text}!", "Błąd! Zrobienie {text} nie zakończyło się pomyślnie")],
    [["usuń"], progressBarCommand("Usuwam {text}...", "Usunięto {text}!", "Błąd! Usunięcie {text} nie zakończyło się pomyślnie")],

    [["komendy", "listakomend"], commandListCommand],
    [["corobi", "zleakujkod"], leakCodeCommand],

    [["moduły"], [
        [["lista"], listModulesCommand],
        [["włącz"], setEnabledModuleCommand(true)],
        [["wyłącz"], setEnabledModuleCommand(false)],
    ]],

    [["config", "konfig"], [
        [["ustaw"], setConfigOverridesCommand],
        [["pokaż"], getConfigOverridesCommand],
        [["default"], getDefaultConfigCommand],
    ]],
];

if (process.env.BOT_OWNER_ID) bot.commandHandler.addCommand(["wykonaj"], executeCommand(process.env.BOT_OWNER_ID as string));

bot.start(process.env.TOKEN!);
