import { SlashCommandBuilder } from "discord.js";
import { finalPath } from "../paths.js";
const fs = await import('fs');

export default {
    data : new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lista os comandos'),
        
    async execute (interaction) {
        const text = fs.readFileSync(finalPath('/utils/commands.txt'), 'utf-8');
        interaction.reply(text);
    }
}