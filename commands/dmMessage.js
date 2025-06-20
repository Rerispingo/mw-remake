import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { finalPath } from "../paths.js";
const fs = await import('fs');

export default {
    data : new SlashCommandBuilder()
        .setName('msg-private')
        .setDescription('Manda uma mensagem em determinado chat.')
        .addStringOption(options =>
            options.setName('message')
            .setDescription('Mensagem a ser enviada')
            .setRequired(true)
        ),
        
    async execute (interaction) {
        const text = interaction.options.getString('message');

        try {
            await interaction.reply({ content: 'Mensagem enviada com sucesso!', flags: MessageFlags.Ephemeral });
            await interaction.channel.send(text);
        } catch (error) {console.log(error)}
    }
}