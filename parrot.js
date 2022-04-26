import Discord from 'discord.io';
import {} from 'dotenv/config'

let selectedChan;
let parrotChan;
let commandChan;

let bot = new Discord.Client({
  token: process.env.BOT_KEY,
  autorun: true
});

bot.on('ready', function() {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function (user, userId, channelId, message, evt) {
  // if(message.author.bot) {
  //   return;
  // }

  // console.log(evt.d.author.bot);
  if (message.substring(0,1) === '!') {
    let args = message.substring(1).split(" ");
    let cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
      case "test":
      bot.sendMessage({
        to: channelId,
        message: `This test is working. channelId is ${channelId} avatar is ${evt.d.author.avatar} user is: ${user}user ID is ${userId}`
      });
      break;
      case "setChan":
        selectedChan = channelId;
        bot.sendMessage({
          to: channelId,
          message: `This channel is selected for messaging`
        });
      break;
      case "setCom":
        commandChan = channelId;
        bot.sendMessage({
          to: commandChan,
          message: "this channel is selected for commands"
        });
    }
  }

  if(channelId === selectedChan && userId !== bot.id) {
    bot.sendMessage({
      to: parrotChan,
      message: `${user}: ${message}`
    });
  } else if (channelId === selectedChan && message.substring(0,1) !== '!') {
    bot.sendMessage({
      to: parrotChan,
      message: `${message}`
    });
  }

  if(channelId === commandChan && userId !== bot.id) {
    bot.sendMessage({
      to: selectedChan,
      message: `${user}: ${message}`
    });
  }
  



});




function vsMessage(channel, vsMessage) {
  bot.sendMessage({
    to: channel,
    message: `${vsMessage}`
  });
}

console.log(process.env.TEST_KEY);