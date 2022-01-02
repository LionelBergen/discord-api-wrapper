const Discord = require('discord.js');

const DefaultCommandPrefix = '!';

class DiscordBot {
  constructor({discordToken, commandPrefix = DefaultCommandPrefix}) {
    this.discordToken = discordToken;
    this.discordClient = null;
    this.commandPrefix = commandPrefix;
    this.commands = [];
  }

  initialize() {
    return new Promise((resolve, reject) => {
      const client = new Discord.Client();
      this.discordClient = client;
      const self = this;

      client.on('ready', () => {
        console.log(`Client ready, user.tag is: ${client.user.tag}`);
      });
      
      client.login(this.discordToken).then(function() {
        console.log(`Logged in as ${client.user.tag}`);

        client.on('message', function(interaction) {
          if (self.commands.length > 0) {
            const messageContent = interaction.content.trim();
            if (messageContent.startsWith(self.commandPrefix)) {
              let command = messageContent.substring(self.commandPrefix.length);
              command = command.replace(/(\r\n|\n|\r)/gm, ' ');

              if (command.includes(' ')) {
                command = command.substring(0, command.indexOf(' '));
              }

              const commandFound = self.commands.find(e => e.command == command);

              if (commandFound) {
                commandFound.commandFunction({discordMessageObject: interaction});
              }
            }
          }
        });

        resolve(client);
      }).catch(reject);

      client.on('error', function(error) {
        console.error('ERRROR from Discord Client: ' + error);
        // can't reject here since its most likely that we already resolved
        throw error;
      });
    });
  }

  sendMessage(channelId, message) {
    this.discordClient.channels.get(channelId).send(message);
  }

  addOnCommandFunction({commandName, commandFunction}) {
    this.commands.push({command: commandName, commandFunction: commandFunction});
  }
}


module.exports = DiscordBot;