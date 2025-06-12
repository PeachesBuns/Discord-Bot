# Voice Moderation Logger Bot

A Discord bot that logs voice channel moderation actions, such as when moderators disconnect users from voice channels or move users between channels.

## Features

- Logs when moderators disconnect users from voice channels
- Logs when moderators move users between voice channels
- Customizable logging channel
- Simple setup with slash commands

## Commands

- `/setlogchannel` - Set the channel where moderation logs will be sent
- `/checklogchannel` - Check which channel is currently set for logging
- `/ping` - Check if the bot is responsive/online

## Requirements

- Node.js 16.9.0 or higher
- Discord.js v14
- A Discord Bot Token
- Necessary bot permissions:
  - View Audit Log
  - Send Messages
  - View Channels
  - Use Slash Commands

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory with the following content:
```properties
# Your bot token from Discord Developer Portal
TOKEN=your_bot_token_here
# Your application's client ID from Discord Developer Portal
CLIENT_ID=your_client_id_here
```

## Setup

1. Create a Discord application and bot at the [Discord Developer Portal](https://discord.com/developers/applications), example below:
 ![Screenshot From 2025-06-12 19-15-46](https://github.com/user-attachments/assets/2b0aa30a-3694-47c0-b3fa-f6ef420c6698)

2. Enable the following Privileged Gateway Intents in your bot settings:
   - Server Members Intent
   - Message Content Intent
   - Voice States Intent
3. Invite the bot to your server with the necessary permissions, example installation configuration below:
 ![installationConfig](https://github.com/user-attachments/assets/dcc6a353-f443-41bb-926b-e002c65e9645)
4. Deploy the slash commands:
```bash
node src/deploy-commands.js
```
5. Start the bot:
```bash
node src/index.js
```

## Usage

1. Use `/setlogchannel` to specify which channel should receive the moderation logs
2. The bot will automatically log the following events:
   - When a moderator disconnects a user from a voice channel
   - When a moderator moves a user from one voice channel to another

Each log entry includes:
- The moderator who performed the action
- The affected user
- The relevant voice channels
- Timestamp of the action

## Security Notes

- Keep your bot token private and never share it
- Reset your token if it ever gets exposed
- The `.env` file is included in `.gitignore` to prevent accidental token exposure

## Contributing

Feel free to submit issues and enhancement requests.

## License

ISC

## Support

For support, please open an issue in the repository.
