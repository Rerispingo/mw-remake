import { CategoryChannel, SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from 'url';
import { finalPath } from '../paths.js';
import { isContext } from "vm";

const fs = await import('fs');
const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')));

export default {
    data : new SlashCommandBuilder()
        .setName('random-chance')
        .setDescription('Altera a chance de mandar uma mensagem aleatoria')
        .addIntegerOption(options =>
            options.setName('chance')
            .setDescription('Chance em escala de (1 a X).')
            .setRequired(true)
        ),

    async execute(interaction) {
        if (!isAdm.isAdm(interaction.member)) return await interaction.reply('Voce nao tem permissao para executar esse comando.');
        const dataPath = finalPath('../data.json');
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        const chance = interaction.options.getInteger('chance');
        data[interaction.guild.id].randomMsg = chance;
        fs.writeFileSync(dataPath, JSON.stringify(data));

        return await interaction.reply(`A chance de mensagem foi alterada para ${100/chance}%`);
    }
}