import { SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from 'url'; 
import { finalPath } from "../paths.js";
const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')));

export default {
    data : new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Apaga as mensagens mais recentes.')
        .addIntegerOption(option => 
            option.setName('quantidade')
                .setDescription('Número de mensagens p/ apagar')
                .setRequired(true)
    ),

    async execute (interaction) {
        if (!isAdm.isAdm(interaction.member)) return await interaction.reply('Você não tem permissão para executar esse comando.');
        
        const quantidade = interaction.options.getInteger('quantidade');

        try {
            await interaction.channel.bulkDelete(quantidade);
            return await interaction.reply(`${quantidade} mensagens deletadas.`);
        } catch(error) {
            return await interaction.reply('Ocorreu algum erro. Tente Novamente.');
        }
        
    }
}