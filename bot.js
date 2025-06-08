//.env Configuration (Discord bot token)
const dotenv = await import('dotenv')
dotenv.config({ path : '../.env'})  // !!! Change path to the .env archive location !!!

/* .env:

DISCORD_TOKEN=''
CLIENT_ID=''

 */

//================ Bot Configuration ============================

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = await import('discord.js');

//Bot permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ========================= Main Bot Commands ===============================

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!help')) {
        await message.reply(await help());
    }

    if (message.content.startsWith('!roll')) {
        await message.reply(await roll(message.content));
    }
});

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}`);
});

await client.login(process.env.DISCORD_TOKEN);

//Commands List
const commands = {
    '!help' : 'Exibe todos os comandos.',
    '!roll (Num1) (Num2)' : 'Retorna um número aleatório entre os dois informados.'
}

async function help () {

    // Object to text.
    let reply = '';
    for (let i=0; i < Object.keys(commands).length; i++) {
        reply += `+ **${Object.keys(commands)[i]}** : ${Object.values(commands)[i]}\n`;
    }
    return reply;
}

async function roll(msg) {
    let msg_split = msg.split(' ');
    let number1 = parseInt(msg_split[1]);
    let number2 = parseInt(msg_split[2]);

    if (!isNaN(number1) && !isNaN(number2)) {
        let randomNumber = Math.floor(Math.random() * (number2 - number1 + 1) + number1);
        return `E o número premiado é ${randomNumber}`;
    }else {
        return ('Po, isso dai ta certo? Manda denovo. !help para qualquer duvida');
    }
}



