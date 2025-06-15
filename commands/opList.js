import { SlashCommandBuilder } from "discord.js";
import { finalPath } from "../paths.js";

const fs = await import('fs');
const dataPath = finalPath('../data.json');
const dotenv = await import('dotenv');

export default {
    data : new SlashCommandBuilder()
        .setName('op-list')
        .setDescription('Lista todos os operadores'),

    async execute (interaction) {
        dotenv.config( { path : finalPath('../.env') });
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        let msg = 'Os operadores sao:\n';
        const sudo_users = process.env.SUDO_USERS.split(',');
        const adms = data[interaction.guild.id].adm;

        for (let i=0; i<sudo_users.length; i++) {
            const name = await interaction.guild.members.fetch(sudo_users[i]);
            msg += name.displayName + '\n';
        }
        for (let i=0; i<adms.length; i++) {
            const name = await interaction.guild.members.fetch(adms[i]);
            msg += name.displayName + '\n';
        }

        return await interaction.reply(msg);
    }
}