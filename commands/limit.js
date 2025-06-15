import { SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from "url";
import { finalPath } from "../paths.js";

const fs = await import('fs');
const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')).href);

export default {
    data : new SlashCommandBuilder()
        .setName('limit')
        .setDescription('Limita a quantidade de usuários')
        .addIntegerOption(option =>
            option.setName('quantidade')
            .setDescription('Quantidade a ser limitada.')
            .setRequired(true)
        ),
    
    async execute(interaction) {
        if(!isAdm.isAdm(interaction.member)) return;
        if(!interaction.member.voice.channel) return;

        const limit = interaction.options.getInteger('quantidade');
        if (limit < 0 || limit > 99) return await interaction.reply('Entre 1 e 99 colega. (0) p/ sem limite.');

        await interaction.member.voice.channel.setUserLimit(limit);
        if (limit === 0) {
            return await interaction.reply(`${interaction.member.voice.channel} foi definido para sem limite de usuarios.`);
        } else {
            return await interaction.reply(`${interaction.member.voice.channel} foi definido para no maximo ${limit} usuários.`);
        }
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