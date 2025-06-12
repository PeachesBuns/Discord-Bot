const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Set the channel for voice disconnect logs')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send voice disconnect logs to')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        
        // Store the channel ID in the client for later use
        interaction.client.logChannel = channel.id;
        
        await interaction.reply({
            content: `Voice disconnect logs will now be sent to ${channel}`,
            ephemeral: true
        });
    },
};
