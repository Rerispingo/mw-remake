import { CategoryChannel, SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from 'url';
import { finalPath } from '../paths.js';

const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')));

export default {
    data : new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Remove um usuario da chamada atual')
        .addUserOption(options =>
            options.setName('user')
            .setDescription('Usuario a ser removido da chamada')
            .setRequired(true)
        ),
    
    async execute (interaction) {
        const user = interaction.options.getMember('user');
        if (isAdm.isAdm(user, true)) return await interaction.reply('Nao posso remover esse usuario da chamada.');
        if (!isAdm.isAdm(interaction.member)) return await interaction.reply('Voce nao tem permissao para executar esse comando.');

        try {
            user.voice.disconnect();
            return await interaction.reply(user.displayName + ' foi desconectado com sucesso.');
        } catch(error) {
            return await interaction.reply('Nao foi possivel remover o usuario da chamada. Tente novamente.');
        }
        
    }
}