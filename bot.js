import fetch from 'node-fetch';
const fs = await import('fs');

//Important variables
const dataPath = '../data.json';
const dotenvPath = '../.env';
const error_msg = 'Alem de primata, é burro. Manda um !help e ve se aprende, inútil';
const commands = fs.readFileSync('./commands.txt', 'utf-8');

// =========================== .env Configuration ===================================

const dotenv = await import('dotenv')
dotenv.config({ path: dotenvPath })  // !!! Change path to the .env archive location !!!4


//================ Bot Configuration ============================

const { Client, GatewayIntentBits } = await import('discord.js');

//Bot permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ========================= Main Bot Commands ===============================

// ========= important variables ===========

const vnGenres = ['homem', 'mulher', 'outro'];

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // ============================ General Commands ======================

    if (message.content.toLowerCase().includes('civic')) return await message.reply(`<@${process.env.MAX_ID}> estão te procurando`);

    if (message.content.startsWith('!help')) {
        return await message.reply(commands);
    }

    if (message.content.startsWith('!roll')) {
        return await message.reply(await roll(message.content));
    }

    if (message.content.startsWith('!primes')) {
        return await message.reply(await primes(message.content));
    }

    if (message.content.startsWith('!adm list')) {
        let ids = await listAdm();
        ids = ids.split(',');
        let res = 'Lista de operadores: \n\n';
        for (let i = 0; i < ids.length; i++) {
            const user = await message.guild.members.fetch(ids[i]);
            res += `${user.displayName}, `;
        }
        return await message.reply(res);
    }

    // ============================== Adm Commands =================================

    if (message.content.startsWith('!clear')) {
        if (!isAdm(message.author)) return;

        const number = parseInt(message.content.split(' ')[1]);
        if (isNaN(number)) return;

        try {
            await message.channel.bulkDelete(number, true);
        } catch (error) {
            return await message.reply('Algo deu errado.');
        }
    }

    if (message.content.startsWith('!adm add')) {
        if (message.mentions.users.size > 0) {
            return await message.reply(await addAdm(message.author, message.mentions.users.first()));
        }
    }

    if (message.content.startsWith('!adm remove')) {
        if (message.mentions.users.size > 0) {
            return await message.reply(await removeAdm(message.author, message.mentions.users.first()));
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
                    } else {
                        return await message.reply(`${message.member.voice.channel} foi definido para no maximo ${limit} usuários.`);
                    }
                } else {
                    return await message.reply(error_msg);
                }
            } else {
                return await message.reply('Entre em uma call primeiro amigo(a).');
            }
        }
        return await message.reply('Comando somente para operadores.');
    }

    if (message.content.startsWith('!kick')) {
        const mentions = message.mentions.users;
        if (isAdm(message.author)) {
            if (mentions.size > 0) {
                const user = await message.guild.members.fetch(mentions.first().id);
                if (isAdm(user, true)) { return await message.reply('Nao tem como kickar esse cara. Ele e absoluto.') }
                if (user.voice.channel) {
                    await user.voice.disconnect()
                    return await message.reply('Usuário desconectado com sucesso.')
                }
            }
            return await message.reply(error_msg);
        }
        return await message.reply('Voce nao tem autoridade!');
    }

    if (message.content.startsWith('!rmsg')) {
        if (!isAdm(message.author)) return

        let chance = message.content.split(' ')[1];
        chance = parseInt(chance);
        if (isNaN(chance)) return;

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        if (data.msgRandomChance === undefined) { data.msgRandomChance = 100 };
        let res = `A chance de mensagem aleatória passou de 1 em ${data.msgRandomChance} para 1 em ${chance}.`;
        data.msgRandomChance = chance;
        fs.writeFileSync(dataPath, JSON.stringify(data), 'utf-8');
        return await message.reply(res);
    }

    // ============================ "Vai dar namoro" ============================

    if (message.content.startsWith('!vn')) {
        if (!isAdm(message.author)) { return await message.reply('Você não tem permissão') };

        let msg = message.content.split(' ');
        msg = msg.filter(id => id !== ''); //Remove emptys values if user double tap space

        //data.vnUsers -> list of participants. { 'id' : 'genre' }
        //data.vnPrefs -> list of preferences. { 'id' : 'preferences' }
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        //Switch between sub-commands
        switch (msg[1].toLowerCase()) {
            case 'help': {
                return await message.reply(commands);
                break;
            }
            case 'add': {
                if (message.mentions.users.size <= 0) return;
                if (data.vnUsers === undefined) { data.vnUsers = {} };
                if (data.vnPrefs === undefined) { data.vnPrefs = {} };

                //Verify if participants already exists in list
                const usersAdd = Object.keys(data.vnUsers);
                for (let i = 0; i <= usersAdd.length; i++) {
                    if (usersAdd[i] == message.mentions.users.first().id) {
                        return await message.reply('Usuário ja adicionado anteriormente.');
                    }
                }

                //Save genre and preference
                const genre = msg[3];
                let prefs = msg.slice(4);
                prefs = prefs.filter(id => vnGenres.includes(id));

                if (!vnGenres.includes(genre) || genre === undefined) { return await message.reply('Você digitou o gênero certo? Digite !help.') };
                if (prefs.length <= 0 || genre === undefined) { return await message.reply('Você não digitou nenhum gênero de preferência válido. Digite !help.') };


                // Registry people in list
                for (let i = 0; i <= prefs.size; i++) { prefs[i].toLowerCase() };
                data.vnUsers[`${message.mentions.users.first().id}`] = genre.toLowerCase();
                data.vnPrefs[`${message.mentions.users.first().id}`] = [...new Set(prefs)];
                fs.writeFileSync(dataPath, JSON.stringify(data));

                return await message.reply(`${message.mentions.users.first().displayName} adicionado com sucesso.`);
                break;
            }
            case 'remove': {
                if (message.mentions.users.size <= 0) return;

                //Verify if people exists in list and remove.
                const usersRemove = Object.keys(data.vnUsers);
                for (let i = 0; i <= usersRemove.length; i++) {
                    if (usersRemove[i] == message.mentions.users.first().id) {
                        delete data.vnUsers[`${message.mentions.users.first().id}`];
                        fs.writeFileSync(dataPath, JSON.stringify(data));
                        return await message.reply(`${await message.mentions.users.first().displayName} removido com sucesso.`);
                    }
                }
                break;
            }
            case 'removeall': {

                data.vnUsers = {};
                fs.writeFileSync(dataPath, JSON.stringify(data));

                return await message.reply('A lista foi apagada');
                break;
            }
            case 'list': {
                const usersList = Object.keys(data.vnUsers);
                const usersGenre = Object.values(data.vnUsers);
                const usersPrefs = Object.values(data.vnPrefs);

                if (usersList.length == 0) { return await message.reply('Não há ninguem') };

                let res = 'Os participantes são:\n\n';
                for (let i = 0; i < usersList.length; i++) {
                    res += `${(await message.guild.members.fetch(usersList[i])).displayName} : ${usersGenre[i]}. Preferência por ${usersPrefs[i].join(', ')}\n`;
                }

                return await message.reply(res);
                break;
            }
            case 'par': {
                const usersList = Object.keys(data.vnUsers);
                const usersPrefs = Object.values(data.vnPrefs);
                const usersGenres = Object.values(data.vnUsers);
                
                break;
            }
        }


    }


    // ============================ others ==================================================

    //Random chance to say a curios if a message is not a command.
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (data.msgRandomChance === undefined) { data.msgRandomChance = 100 };
    const msgRandomChance = data.msgRandomChance;
    if (Math.floor(Math.random() * msgRandomChance + 1) === msgRandomChance) {
        return await message.reply(await randomMSG());
    }

});

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}`);
});

await client.login(process.env.DISCORD_TOKEN);

// ================================== Modulars Functions ===================================

async function randomMSG() {
    const text = fs.readFileSync('./public/msg.txt', 'utf-8').split('\n');
    return text[Math.floor(Math.random() * text.length)];
}

function isAdm(user, isSudo = false) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const sudo_users = process.env.SUDO_USERS;

    if (isSudo) {
        return (sudo_users.includes(user.id));
    } else {
        return (data.adm.includes(user.id) || sudo_users.includes(user.id));
    }
}

async function addAdm(req_user, user) {
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (data.adm === undefined) { data.adm = [] }
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

async function listAdm() {
    let sudo_users = process.env.SUDO_USERS;
    let adm_users = JSON.parse(fs.readFileSync(dataPath, 'utf-8')).adm;
    return sudo_users + ',' + adm_users;
}

async function roll(msg) {
    try {
        let msg_split = msg.split(' ');
        let number1 = parseInt(msg_split[1]);
        let number2 = parseInt(msg_split[2]);

        if (!isNaN(number1) && !isNaN(number2)) {
            let randomNumber = Math.floor(Math.random() * (number2 - number1 + 1) + number1);
            return `E o número premiado é ${randomNumber}`;
        } else {
            return (error_msg);
        }
    } catch (error) {
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
    } catch (error) {
        return (error_msg);
    }
}