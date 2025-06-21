import { SlashCommandBuilder } from "discord.js";
import { pathToFileURL } from 'url';
import { finalPath } from "../paths.js";

const fs = await import('fs');
const dataPath = finalPath('../data.json')

export default {
    data : new SlashCommandBuilder()
        .setName('seek-remove')
        .setDescription('Remove uma restricao de uma pessoa')
        .addUserOption(options =>
            options.setName('user')
            .setDescription('pessoas a ser removida a restricao')
            .setRequired(true)
        )
        .addStringOption(options =>
            options.setName('text')
            .setDescription('restricao a ser removida')
            .setRequired(true)
        ),
    async execute(interaction) {
        const isAdm = await import(pathToFileURL(finalPath('utils/isAdm.js')).href);
        if (!isAdm.isAdm(interaction.member)) return await interaction.reply('Voce nao tem permissao para remover alguma restricao');

        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const user = interaction.options.getMember('user');
        const Rest = interaction.options.getString('text');


        try {
            //Remove all restrictions.
            if (Rest === '@all') {
                delete data[interaction.guild.id].seek;
                fs.writeFileSync(dataPath, JSON.stringify(data));
                return await interaction.reply(`Todas as restricoes foram removidas.`);
            }

            //Remove all restrictions for user.
            if (Rest === '.all') {
                delete data[interaction.guild.id].seek[user.id];
                fs.writeFileSync(dataPath, JSON.stringify(data));
                return await interaction.reply(`${user.displayName} agora esta sem nenhuma restricao.`);
            }

            //Remove a text from restriction
            let userR = data[interaction.guild.id].seek[user.id];
            userR = userR.filter(id => id != Rest);
            data[interaction.guild.id].seek[user.id] = userR;
            fs.writeFileSync(dataPath, JSON.stringify(data));

            return await interaction.reply(`${user.displayName} agora esta permitido dizer ${Rest}`);
        } catch(error) {
            console.log(error);
            return await interaction.reply('Ocorreu algum erro. Tente novamente.');
        }
    }
}