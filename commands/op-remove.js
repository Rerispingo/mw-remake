import { SlashCommandBuilder } from "discord.js";
import { finalPath } from "../paths.js";
import { pathToFileURL } from "url";

const fs = await import('fs');
const dataPath = finalPath('../data.json');

export default {
    data : new SlashCommandBuilder()
        .setName('op-remove')
        .setDescription('Remove um operador da lista')
        .addUserOption(options =>
            options.setName('user')
            .setDescription('Usuario a ser removido')
            .setRequired(true)
        ),
    
    async execute (interaction) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')).href);

        const user = interaction.options.getMember('user');
        let adm = data[interaction.guild.id].adm;

        //Verifys
        if (!isAdm.isAdm(interaction.member, true)) return await interaction.reply('Voce nao tem permissao para esse comando.');
        if (isAdm.isAdm(user, true)) return await interaction.reply('Esse usuario nao pode ser removido de operador.')
        if (!isAdm.isAdm(user)) return await interaction.reply(user.displayName + ' nao e operador.')

        adm = adm.filter(id => id !== user.id);
        data[interaction.guild.id].adm = adm;
        fs.writeFileSync(dataPath, JSON.stringify(data));
        return await interaction.reply(user.displayName + ' foi removido da lista de operadores.');
    }

}