const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const express = require('express');

// Express server for Railway health checks
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    bot: 'running',
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Express server ready on port ${PORT}`);
});

// Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  console.log(`🌐 In ${client.guilds.cache.size} servers`);
  
  // Set initial status
  updateStatus();
  // Update status every 15 minutes
  setInterval(updateStatus, 900000);
});

function updateStatus() {
  const statuses = [
    { name: '24/7 on Railway', type: ActivityType.Playing },
    { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
    { name: '/help', type: ActivityType.Listening }
  ];
  
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  client.user.setActivity(status);
  console.log(`🔄 Status updated: ${status.name}`);
}

// Simple commands
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content.toLowerCase() === '!ping') {
    message.reply(`🏓 Pong! ${Date.now() - message.createdTimestamp}ms`);
  }
  
  if (message.content.toLowerCase() === '!uptime') {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    message.reply(`⏰ Online for ${hours}h ${minutes}m ${seconds}s`);
  }
});

// Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login with token from Railway environment variable
client.login(process.env.DISCORD_TOKEN);
