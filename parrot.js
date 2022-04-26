import {} from 'dotenv/config'

// let selectedGuild;
// let selectedChan = "966012063568789557";
// let parrotChan = "968243023970467901";
// let commandChan = "968243052139405404";


  // if (message.substring(0,1) === '!') {
  //   let args = message.substring(1).split(" ");
  //   let cmd = args[0];

  //   args = args.splice(1);
  //   switch(cmd) {
  //     case "test":
  //     bot.sendMessage({
  //       to: channelId,
  //       message: `This test is working. channelId is ${channelId} avatar is ${evt.d.author.avatar} user is: ${user}user ID is ${userId}`
  //     });
  //     break;
  //     case "setChan":
  //       selectedChan = channelId;
  //       bot.sendMessage({
  //         to: channelId,
  //         message: `This channel is selected for messaging`
  //       });
  //     break;
  //     case "setCom":
  //       commandChan = channelId;
  //       bot.sendMessage({
  //         to: commandChan,
  //         message: "this channel is selected for commands"
  //       });
  //   }
  // }

  // if(channelId === selectedChan && userId !== bot.id) {
  //   bot.sendMessage({
  //     to: parrotChan,
  //     message: `${user}: ${message}`
  //   });
  // } else if (channelId === selectedChan && message.substring(0,1) !== '!') {
  //   bot.sendMessage({
  //     to: parrotChan,
  //     message: `${message}`
  //   });
  // }

  // if(channelId === commandChan && userId !== bot.id) {
  //   bot.sendMessage({
  //     to: selectedChan,
  //     message: `${user}: ${message}`
  //   });
  // }
