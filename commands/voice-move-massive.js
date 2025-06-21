import { SlashCommandBuilder, ChannelType, MessageFlags } from "discord.js";
import { pathToFileURL } from "url";
import { finalPath } from "../paths.js";

const fs = await import('fs');
const isAdm = await import(pathToFileURL(finalPath('/utils/isAdm.js')).href);

export default {
    data: new SlashCommandBuilder()
        .setName('voice-move-massive')
        .setDescription('Move todos os usuarios de uma chamada')
        .addChannelOption(options =>
            options.setName('channel')
            .setDescription('Chamada que receberá os usuários')
            .setRequired(true)
        )
        .addChannelOption(options =>
            options.setName('channel2')
            .setDescription('Chamada que estao os usuários')
        ),
        async execute(interaction) {
            if (!isAdm.isAdm(interaction.member)) return await interaction.reply('Você não tem permissão para executar esse comando.');
            try {
                let oldChannel = interaction.options.getChannel('channel2');
                if (oldChannel === null) oldChannel = interaction.member.voice.channel;

                const channel = interaction.options.getChannel('channel');
                if (!(channel.type === ChannelType.GuildVoice)) return await interaction.reply({ content : 'O canal solicitado é invalido. Tente outro.' , flags: MessageFlags.Ephemeral });

                for(const [memberId, member] of oldChannel.members) {
                    try {
                        await member.voice.setChannel(channel);
                    } catch(error) {return await interaction.reply(`Não foi possível transferir ${member.displayName}`);}
                }
                return await interaction.reply(`Todos os usuários de ${oldChannel} foram transferidos para ${channel}`);
            } catch(error) {};
        }
    }