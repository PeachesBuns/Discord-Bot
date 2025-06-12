const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checklogchannel')
        .setDescription('Check which channel is set for voice logs'),
    async execute(interaction) {
        const logChannelId = interaction.client.logChannel;
        if (!logChannelId) {
            await interaction.reply({
                content: 'No logging channel is currently set. Use `/setlogchannel` to set one.',
                ephemeral: true
            });
            return;
        }

        try {
            const logChannel = await interaction.client.channels.fetch(logChannelId);
            await interaction.reply({
                content: `Current logging channel is set to: ${logChannel.name} (#${logChannel.id})`,
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                content: 'Error: Could not find the configured logging channel. Please use `/setlogchannel` to set a new one.',
                ephemeral: true
            });
        }
    },
};
