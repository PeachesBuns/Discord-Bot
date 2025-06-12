const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// Collection to store commands
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: 64 }); // 64 is the ephemeral flag
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: 64 }); // 64 is the ephemeral flag
        }
    }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

// Voice state update handler
client.on('voiceStateUpdate', async (oldState, newState) => {
    //console.log('Voice state update detected');
    
    // Only proceed if we have a logging channel set up
    if (!client.logChannel) {
        console.log('No log channel set up');
        return;
    }
    
    try {
        const logChannel = await client.channels.fetch(client.logChannel);
        if (!logChannel) {
            //console.log('Could not fetch log channel');
            return;
        }
        //console.log('Log channel found:', logChannel.name);

    // Check if a user was disconnected
    if (oldState.channel && !newState.channel) {
        //console.log('Disconnect detected');
        try {
            // Get the audit logs for disconnect
            const auditLogs = await newState.guild.fetchAuditLogs({
                limit: 1,
                type: 27 // MEMBER_DISCONNECT
            });

            const disconnectLog = auditLogs.entries.first();
            //console.log(disconnectLog);
            //console.log(disconnectLog.createdTimestampa);
            //console.log('Audit log entry found:', disconnectLog ? 'yes' : 'no');
        
        // Check if this disconnect was performed by a moderator
        if (disconnectLog) {
            const moderator = disconnectLog.executor;
            const disconnectedUser = oldState.member;
            const voiceChannel = oldState.channel;

            await logChannel.send({
                content: `📢 **Voice Disconnect**\nModerator: ${moderator.tag}\nDisconnected User: ${disconnectedUser.user.tag}\nFrom Channel: ${voiceChannel.name}\nTime: ${new Date().toLocaleString()}`
            });
        }
    } catch (error) {
            console.error('Error fetching audit logs:', error);
            await logChannel.send({
                content: `❗ **Error Fetching Audit Logs**\nAn error occurred while trying to fetch the audit logs for a voice disconnect. Please check the bot permissions and try again.`
            });
        }
    }

    // Check if a user was moved between channels
    else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        // Get the audit logs for member move
        const auditLogs = await newState.guild.fetchAuditLogs({
            limit: 1,
            type: 26 // MEMBER_MOVE
        });

        const moveLog = auditLogs.entries.first();
        
        // Check if this move was performed by a moderator
        if (moveLog) {
            const moderator = moveLog.executor;
            const movedUser = oldState.member;
            const fromChannel = oldState.channel;
            const toChannel = newState.channel;

            await logChannel.send({
                content: `🔄 **Voice Channel Move**\nModerator: ${moderator.tag}\nMoved User: ${movedUser.user.tag}\nFrom Channel: ${fromChannel.name}\nTo Channel: ${toChannel.name}\nTime: ${new Date().toLocaleString()}`
            });
        }
    }}
    catch (error) {
        console.error('Error handling voice state update:', error);
        await logChannel.send({
            content: `❗ **Error Handling Voice State Update**\nAn error occurred while processing a voice state update. Please check the bot permissions and try again.`
        });
    }
});

// Basic error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
