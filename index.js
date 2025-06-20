import { Collection } from 'discord.js';
import { finalPath } from './paths.js';

//Bot and bot permissions
const { Client, GatewayIntentBits } = await import('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
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
import seekAdd from './commands/seekAdd.js';
import seekRemove from './commands/seekRemove.js';
import dmMessage from './commands/dmMessage.js';
import randomMsgChance from './commands/randomMsgChance.js';

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
client.commands.set(seekAdd.data.name, seekAdd);
client.commands.set(seekRemove.data.name, seekRemove);
client.commands.set(dmMessage.data.name, dmMessage);
client.commands.set(randomMsgChance.data.name, randomMsgChance);

// Basic
client.on('interactionCreate', async function (interaction) {
    if (!interaction.isChatInputCommand) return;
    try {
        const id = interaction.guild.id;
    } catch (error) { return; }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (data[interaction.guild.id] === undefined) {
        data[interaction.guild.id] = {};
        fs.writeFileSync(dataPath, JSON.stringify(data));
    };

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
    }
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    //Random MSG
    randomMsg(message);


    //seek
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const user = message.author.id;
    const text = message.content.toLowerCase();

    const Rest = data[message.guild.id].seek[user];
    if (!Rest) return;
    try {
        for (let i = 0; i < Rest.length; i++) {
            if (text.includes(Rest[i])) {
                await message.delete();
            }
        }
    } catch (error) {};
});

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}`);
});

await client.login(process.env.DISCORD_TOKEN);

async function randomMsg(message) {
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (!data[message.guild.id].randomMsg) {
        data[message.guild.id].randomMsg = 100;
        fs.writeFileSync(dataPath, JSON.stringify(data));
    }

    const chance = data[message.guild.id].randomMsg;
    const random = Math.floor(Math.random() * chance);
    if (random === 0) {
        let txt = fs.readFileSync(finalPath('/utils/msg.txt'), 'utf-8');
        txt = txt.split('\n');

        const line = Math.floor(Math.random() * txt.length)
        return await message.reply(`Voce sabia que: ${txt[line]}`);
    }
}