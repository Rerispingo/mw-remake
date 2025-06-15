import { SlashCommandBuilder } from "discord.js";

export default {
    data : new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Retorna um numero aleatorio entre dois numeros')
        .addIntegerOption(options =>
            options.setName('number1')
            .setDescription('Primeiro Numero')
            .setRequired(true)
        )
        .addIntegerOption(options =>
            options.setName('number2')
            .setDescription('Segundo Numero (opcional)')
        ),
    async execute (interaction) {
        let num1 = interaction.options.getInteger('number1');
        let num2 = interaction.options.getInteger('number2');
        
        if (num2 === null) {
            num2 = num1;
            num1 = 1;
        }

        for (let i=0; i<50; i++) console.log( Math.floor(Math.random() * (num2 - num1 + 1)) + num1)

        const numSort = Math.floor(Math.random() * (num2 - num1 + 1)) + num1;
        return await interaction.reply('E o numero sorteado da vez e ' + numSort);
    }
}