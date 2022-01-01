const Discord = require('discord.js');

class DiscordBot {
  constructor({discordToken, commandPrefix = '!'}) {
    this.discordToken = discordToken;
    this.discordClient = null;
    this.commandPrefix = commandPrefix;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      const client = new Discord.Client();
      this.discordClient = client;

      client.on('ready', () => {
        console.log(`Client ready, user.tag is: ${client.user.tag}`);
      });
      
      client.login(this.discordToken).then(function() {
        console.log(`Logged in as ${client.user.tag}`);
        resolve(client);
      }).catch(reject);

      client.on('error', function(error) {
        console.error('ERRROR from Discord Client: ' + error);
        // can't reject here since its most likely that we already resolved
        throw error;
      });
    });
  }
}


module.exports = DiscordBot;