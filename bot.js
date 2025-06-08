const fs = await import('fs');

//Important variables
const dataPath = '../data.json';
const dotenvPath = '../.env';
const error_msg = 'Alem de primata, é burro. Manda um !help e ve se aprende, inútil';
const commands = fs.readFileSync('./commands.txt', 'utf-8');

// =========================== .env Configuration ===================================

const dotenv = await import('dotenv')
dotenv.config({ path : dotenvPath})  // !!! Change path to the .env archive location !!!4


//================ Bot Configuration ============================

const { Client, GatewayIntentBits} = await import('discord.js');

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
        await message.reply(commands);
    }

    if (message.content.startsWith('!roll')) {
        await message.reply(await roll(message.content));
    }

    if (message.content.startsWith('!primes')) {
        await message.reply(await primes(message.content));
    }

    if (message.content.startsWith('!adm add')) {
        if (message.mentions.users.size > 0) {
            await message.reply(await addAdm(message.author, message.mentions.users.first()));
        }
    }

    if (message.content.startsWith('!adm remove')) {
        if (message.mentions.users.size > 0) {
            await message.reply(await removeAdm(message.author, message.mentions.users.first()));
        }
    }

    if (message.content.startsWith('!limit')) {
        if (isAdm(message.author)) {
            if (message.member.voice.channel) {
                let limit = message.content.split(' ')[1]; //!Limit <@channelID> *limit*
                limit = parseInt(limit);
                if (!isNaN(limit)) {
                    if (limit > 99 || limit < 0) return await message.reply('Entre 1 e 99 colega. (0) p/ sem limite.');
                    await message.member.voice.channel.setUserLimit(limit);
                    if (limit === 0) {
                        return await message.reply(`${message.member.voice.channel} foi definido para sem limite de usuarios.`);
                    }else {
                        return await message.reply(`${message.member.voice.channel} foi definido para no maximo ${limit} usuários.`);
                    }
                }else {
                    return await message.reply(error_msg);
                }
            }else {
                return await message.reply('Entre em uma call primeiro amigo(a).');
            }
        }
        return await message.reply('Comando somente para operadores.');
    }

    if (message.content.startsWith('!kick')) {
        const mentions = message.mentions.users;
        if (isAdm(message.author)) {
            if(mentions.size > 0) {
                const user = await message.guild.members.fetch(mentions.first().id);
                if (isAdm(user, true)) {return await message.reply('Nao tem como kickar esse cara. Ele e absoluto.')}
                if (user.voice.channel) {
                    await user.voice.disconnect()
                    return await message.reply('Usuário desconectado com sucesso.')
                }
            }
            return await message.reply(error_msg);
        }
        return await message.reply('Voce nao tem autoridade!');
    }

});

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}`);
});

await client.login(process.env.DISCORD_TOKEN);

// ================================== Funcionalidades ===================================

function isAdm(user, isSudo=false) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const sudo_users = process.env.SUDO_USERS;

    if (isSudo) {
        return (sudo_users.includes(user.id));
    }else {
        return (data.adm.includes(user.id) || sudo_users.includes(user.id));
    }
}

async function addAdm(req_user, user) {
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    let adm = data.adm;
    const sudo_users = process.env.SUDO_USERS;

    if (!adm.includes(req_user.id) && !sudo_users.includes(req_user.id)) return 'Amigo, voce nem permissão tem e acha que pode pedir para dar permissão a outro?.';
    if (sudo_users.includes(user.id)) return `${user}  já pertence a uma categoria superior.`;

    if (!adm.includes(user.id)) {
        adm.push(user.id);

        data.adm = adm;
        fs.writeFileSync(dataPath, JSON.stringify(data));
        return `Usuário adicionado a lista de operadores com sucesso`;
    } else {
        return 'Usuário ja adicionado anteriormente. Qualquer duvida, digite !help.'
    }
}

async function removeAdm(req_user, user) {
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    let adm = data.adm;
    const sudo_users = process.env.SUDO_USERS;

    if (!adm.includes(req_user.id) && !sudo_users.includes(req_user.id)) return 'Amigo, voce nem permissão tem e acha que pode pedir para dar permissão a outro?.';
    if (sudo_users.includes(user.id)) return `${user} não pode ser removido, pois pertence a uma categoria superior.`;

    if (adm.includes(user.id)) {
        adm = adm.filter(id => id !== user.id);

        data.adm = adm;
        fs.writeFileSync(dataPath, JSON.stringify(data));
        return `Usuário removido com sucesso`;
    } else {
        return 'Usuário nao esta na lista de operadores . Qualquer duvida, digite !help.'
    }
}

async function roll(msg) {
    try {
        let msg_split = msg.split(' ');
        let number1 = parseInt(msg_split[1]);
        let number2 = parseInt(msg_split[2]);

        if (!isNaN(number1) && !isNaN(number2)) {
            let randomNumber = Math.floor(Math.random() * (number2 - number1 + 1) + number1);
            return `E o número premiado é ${randomNumber}`;
        }else {
            return (error_msg);
        }
    }catch (error) {
        return (error_msg);
    }

}

async function primes(msg) {
    try {
        let msg_split = msg.split(' ')
        let number1 = parseInt(msg_split[1]);
        let number2 = parseInt(msg_split[2]);
        let primes = [];

        if (isNaN(number2)) {
            if (isNaN(number1)) {
                return error_msg;
            }
            number2 = number1;
            number1 = 1;
        }

        let divisors = 0;
        for (let i = number1; i <= number2; i++) {
            divisors = 0;
            for (let j = 1; j <= i; j++) {
                if (i % j === 0) {
                    divisors++;
                }
            }
            if (divisors === 2) {
                primes.push(i);
            }
        }

        let primos = primes.join(', ');
        if (primos.length > 1500) {
            return 'Intervalo muito grande. Poderia diminui-lo?'
        }
        return `Os números primos de ${number1} até ${number2} são: ${primos}`;
    }catch (error) {
        return (error_msg);
    }
}



