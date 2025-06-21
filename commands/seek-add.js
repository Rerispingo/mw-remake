import { SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from 'url';
import { finalPath } from "../paths.js";

const fs = await import('fs');

export default {
    data : new SlashCommandBuilder()
        .setName('seek-add')
        .setDescription('Adiciona uma restricao a uma pessoa')
        .addUserOption(options =>
            options.setName('user')
            .setDescription('pessoas a ser adicionada a restricao')
            .setRequired(true)
        )
        .addStringOption(options =>
            options.setName('text')
            .setDescription('texto a ser restringido')
            .setRequired(true)
        ),

    async execute (interaction) {
        const dataPath = '../data.json'
        const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')).href);
        let data = JSON.parse(fs.readFileSync(finalPath(dataPath)));

        const user = interaction.options.getMember('user');
        let text = interaction.options.getString('text').toLowerCase();

        if (!isAdm.isAdm(interaction.member)) return await interaction.reply('Voce nao tem permissao para adicionar uma restricao.');
        if (!data[interaction.guild.id].seek) {
            data[interaction.guild.id].seek = {};
            fs.writeFileSync(dataPath, JSON.stringify(data));
        }

        const u = Object.keys(data[interaction.guild.id].seek);
        if (!u.includes(user.id)) data[interaction.guild.id].seek[user.id] = [];
        data[interaction.guild.id].seek[user.id].push(text);
        fs.writeFileSync(dataPath, JSON.stringify(data));

        return await interaction.reply(`${user.displayName} agora esta proibido de dizer ${text}.`)

    }
}