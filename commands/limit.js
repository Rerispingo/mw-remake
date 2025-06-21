import { SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from "url";
import { finalPath } from "../paths.js";

const fs = await import('fs');
const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')).href);

export default {
    data: new SlashCommandBuilder()
        .setName('limit')
        .setDescription('Restringe a chamada ao numero de usuario')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade a ser limitada.')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!isAdm.isAdm(interaction.member)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }
        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'Você precisa estar em um canal de voz para usar este comando.', ephemeral: true });
        }

        let limit = interaction.options.getInteger('quantidade');

        if (limit === null) {
            limit = interaction.member.voice.channel.members.size;
        } else if (limit < 0 || limit > 99) {
            return interaction.reply({ content: 'O limite deve ser entre 0 e 99. (0 para sem limite)', ephemeral: true });
        }
            
        await interaction.member.voice.channel.setUserLimit(limit);

        const replyMessage = limit === 0
            ? `O canal de voz ${interaction.member.voice.channel} foi definido para não ter limite de usuários.`
            : `O canal de voz ${interaction.member.voice.channel} foi definido para um máximo de ${limit} usuários.`;

        return interaction.reply(replyMessage);
    }
}

/*

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

    
*/