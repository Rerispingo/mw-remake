import { Collection } from 'discord.js';
import { finalPath } from './paths.js';

//Bot and bot permissions
const { Client, GatewayIntentBits } = await import('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

//.env
const dotenvPath = finalPath('../.env');
const dotenv = await import('dotenv');
dotenv.config({ path: dotenvPath });

const fs = await import('fs');
const dataPath = finalPath('../data.json');

//Import commands
import help from './commands/help.js';
import clear from './commands/clear.js';
import limit from './commands/limit.js';
import opAdd from './commands/opAdd.js';
import opRemove from './commands/opRemove.js';
import opList from './commands/opList.js';
import roll from './commands/roll.js';
import kick from './commands/kick.js';

//Bot Commands
client.commands = new Collection();
client.commands.set(clear.data.name, clear);
client.commands.set(help.data.name, help);
client.commands.set(limit.data.name, limit);
client.commands.set(opAdd.data.name, opAdd);
client.commands.set(opRemove.data.name, opRemove);
client.commands.set(opList.data.name, opList);
client.commands.set(roll.data.name, roll);
client.commands.set(kick.data.name, kick);

// Basic
client.on('interactionCreate', async function (interaction) {
    if (!interaction.isChatInputCommand) return;

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (data[interaction.guild.id] === undefined) {
        data[interaction.guild.id] = {};
        fs.writeFileSync(dataPath, JSON.stringify(data));
    };  

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch(error) {
        console.log(error);
    }
})

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}`);
});

await client.login(process.env.DISCORD_TOKEN);