import { SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from 'url';
import { finalPath } from "../paths.js";
const fs = await import('fs');
const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')));

const dataPath = finalPath('../data.json');
let data = JSON.parse(fs.readFileSync(dataPath));

export default {
    data : new SlashCommandBuilder()
        .setName('op-add')
        .setDescription('Adiciona alguem a lista de operadores')
        .addUserOption(options =>
            options.setName('user')
            .setDescription('Usuario a ser adicionado.')
            .setRequired(true)
        ),

    async execute (interaction) {
        if (!isAdm.isAdm(interaction.member, true)) return await interaction.reply('Voce nao tem permissao para isso.');
        if (isAdm.isAdm(interaction.options.getMember('user'), true)) return await interaction.reply(interaction.options.getUser('user').displayName + ' ja pertence a uma categoria superior.');
        if (data[interaction.guild.id].adm.includes(interaction.options.getUser('user').id)) return await interaction.reply(`${interaction.options.getUser('user').displayName} ja esta na lista de operadores.`);

        data[interaction.guild.id].adm.push(interaction.options.getUser('user').id);
        fs.writeFileSync(dataPath, JSON.stringify(data));
        return await interaction.reply(`${interaction.options.getUser('user').displayName} foi adicionado a lista de operadores.`);
    }
}
