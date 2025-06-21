import {REST, Routes} from 'discord.js';
import { finalPath } from './paths.js';
import { pathToFileURL } from 'url';

const path = await import('path');
const fs = await import('fs');

//.env
const dotenvPath = '../.env';
const dotenv = await import('dotenv');
dotenv.config({ path: dotenvPath });

/*
import helpCommand from './commands/help.js';
import clearCommand from './commands/clear.js';
import limitCommand from './commands/limit.js';
import opAddCommand from './commands/opAdd.js';
import opRemoveCommand from './commands/opRemove.js';
import opListCommand from './commands/opList.js';
import rollCommand from './commands/roll.js';
import kickCommand from './commands/kick.js';
import seekAddCommand from './commands/seekAdd.js';
import seekRemoveCommand from './commands/seekRemove.js';
*/

const commandsPath = finalPath('/commands');
const filesPath = fs.readdirSync(commandsPath);
let commands = [];

for (const file of filesPath) {
    const jsPath = path.join(commandsPath, file);
    const js = await import(pathToFileURL(jsPath).href);
    commands.push(js.default.data.toJSON());
}

/*
const commands = [
    clearCommand.data.toJSON(),
    helpCommand.data.toJSON(),
    limitCommand.data.toJSON(),
    opAddCommand.data.toJSON(),
    opRemoveCommand.data.toJSON(),
    opListCommand.data.toJSON(),
    rollCommand.data.toJSON(),
    kickCommand.data.toJSON(),
    seekAddCommand.data.toJSON(),
    seekRemoveCommand.data.toJSON(),
];
*/

const rest = new REST({ version: '10'}).setToken(process.env.DISCORD_TOKEN);

try {
    await rest.put(
        Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, '1379265488881713153'),
        { body : commands }
    );
} catch (error) {
    console.log("ERRO!");
    console.log(error);
}