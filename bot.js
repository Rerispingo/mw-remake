const fs = await import('fs');

//Important variables
const admPath = '../adm.json';
const dotenvPath = '../.env';
const error_msg = 'Po, isso dai ta certo? Manda denovo. !help para qualquer duvida';
const commands = {
    '!help' : 'Exibe todos os comandos.',
    '!roll (Num1) (Num2)' : 'Retorna um número aleatório entre os dois números informados.',
    '!primes (Num1)' : 'Retorna todos os números primos de 1 até o número informado.',
    '!primes (Num1) (Num2)' : 'Retorna todos os números primos entres os dois números informados.'
}
const adm_commands = {
    '!adm add (mention)' : 'Adiciona um usuário a lista de operadores.',
    '!adm remove (mention)' : 'Remove um usuário da lista de operadores'
}


// =========================== .env Configuration ===================================
const dotenv = await import('dotenv')
dotenv.config({ path : dotenvPath})  // !!! Change path to the .env archive location !!!

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
        await message.reply(await help());
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
});

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}`);
});

await client.login(process.env.DISCORD_TOKEN);

// ================================== Funcionalidades ===================================

async function help () {

    // Object to text.
    let reply = '**Comandos gerais:** \n\n';
    for (let i=0; i < Object.keys(commands).length; i++) {
        reply += `+ **${Object.keys(commands)[i]}** : ${Object.values(commands)[i]}\n`;
    }
    reply += '\n**Comandos de operadores:**\n\n';
    for (let i=0; i < Object.keys(adm_commands).length; i++) {
        reply += `+ **${Object.keys(adm_commands)[i]}** : ${Object.values(adm_commands)[i]}\n`;
    }
    return reply;
}

async function addAdm(req_user, user) {
    let adm = JSON.parse(fs.readFileSync(admPath, 'utf-8'));
    const sudo_users = process.env.SUDO_USERS;

    if (!adm.includes(req_user.id) && !sudo_users.includes(req_user.id)) return 'Amigao, voce nem permissao tem e acha que pode pedir para dar permissao a outro?.';
    if (sudo_users.includes(user.id)) return `${user}  já pertence a uma categoria superior.`;

    if (!adm.includes(user.id)) {
        adm.push(user.id);
        fs.writeFileSync(admPath, JSON.stringify(adm));
        return `Usuário adicionado a lista de operadores com sucesso`;
    } else {
        return 'Usuário ja adicionado anteriormente. Qualquer duvida, digite !help.'
    }
}

async function removeAdm(req_user, user) {
    let adm = JSON.parse(fs.readFileSync(admPath, 'utf-8'));
    const sudo_users = process.env.SUDO_USERS;

    if (!adm.includes(req_user.id) && !sudo_users.includes(req_user.id)) return 'Amigao, voce nem permissao tem e acha que pode pedir para dar permissao a outro?.';
    if (sudo_users.includes(user.id)) return `${user} não pode ser removido, pois pertence a uma categoria superior.`;

    if (adm.includes(user.id)) {
        adm.filter(id => id !== user.id);
        fs.writeFileSync(admPath, JSON.stringify(adm));
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



