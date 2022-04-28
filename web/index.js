const vscode = acquireVsCodeApi();

let currentGuild;
let currentChannel;

$(document).ready(function() {
  let chat = "";
  let userName = "Anonymous";
  let lastAuthor;
  $('#user-name').keyup(function(event) {
    if(event.keyCode === 13)  {
      $('#set-name').click();
    }
  });
  $('#set-name').on('click', function()	{
    userName = $('#user-name').val();
    $('#user-name-display').text(`${userName}`)
    $('#user-name-display').removeClass("hidden");
    $('#user-name').addClass('hidden');
  });

  $('#user-name-display').on('click', function() {
    $('#user-name').removeClass("hidden");
    $('#user-name-display').addClass("hidden");
  });

  // Outgoing

  $('#chat').keyup(function(event) {
    if(event.keyCode === 13)  {
      $('#send-chat').click();
    }
  })
  $('#send-chat').on('click', function(){
    chat = $('#chat').val();
    vscode.postMessage({
      command: 'alert',
      text: `${userName}: ${chat}`,
      guild: `${currentGuild}`,
      channel: `${currentChannel}`
    })
    $('#chat').val("");



  });

  // Incoming
  
  window.addEventListener('message', event => {
    const message = event.data;
    switch	(message.command)	{
      case 'newMessage':
        const messageTimeStamp = timeStamp(message.evtD.timestamp);
        if(message.evtD.type === 7){
          return;
        }
        if(!message.evtD.content && message.evtD.attachments.length < 1){
          return;
        }
        if (message.evtD.author.avatar && message.text.includes('https://tenor.com/view/')){
          $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.authorId}/${message.evtD.author.avatar}'><p class="author-name">${message.authorName} <span class="user-timestamp">${messageTimeStamp}</span></p><img class="gif"src="${message.text}.gif"></div>`);
          lastAuthor = message.authorName;
        } else if (!message.evtD.content && message.evtD.attachments.length >= 1 && message.evtD.author.avatar) {
          message.evtD.attachments.forEach(function(attachment){
            if (attachment['content_type'].includes("video")){
              $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.evtD.author.id}/${message.evtD.author.avatar}'><p class="author-name">${message.evtD.author.username} <span class="user-timestamp">${messageTimeStamp}</span></p><video class="gif" src="${attachment['proxy_url']}"></video></div>`);
            } else {
            $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.evtD.author.id}/${message.evtD.author.avatar}'><p class="author-name">${message.evtD.author.username} <span class="user-timestamp">${messageTimeStamp}</span></p><img class="gif"src="${attachment['proxy_url']}"></div>`);
            }
          });
          lastAuthor = message.authorName;
        } else if(message.evtD.author.avatar && lastAuthor !== message.authorName){
          lastAuthor = message.authorName;
        $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.authorId}/${message.evtD.author.avatar}'><p class="author-name">${message.authorName} <span class="user-timestamp">${messageTimeStamp}</span></p><p class='user-message'>${message.text}</p></div>`);
        } else if(lastAuthor === message.authorName) {
          $('#display-new-message').append(`<div class="message-container"><p class='user-message-later'>${message.text}</p></div>`);
          lastAuthor = message.authorName;
        } else if (!message.evtD.content && message.evtD.attachments.length >= 1) {
          message.evtD.attachments.forEach(function(attachment){
            if (attachment['content_type'].includes("video")){
              $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.evtD.author.id}/${message.evtD.author.avatar}'><p class="author-name">${message.evtD.author.username} <span class="user-timestamp">${messageTimeStamp}</span></p><video class="gif" src="${attachment['proxy_url']}"></video></div>`);
            } else {
            $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.evtD.author.id}/${message.evtD.author.avatar}'><p class="author-name">${message.evtD.author.username} <span class="user-timestamp">${messageTimeStamp}</span></p><img class="gif"src="${attachment['proxy_url']}"></div>`);
            }
          });
          lastAuthor = message.authorName;
        } else {
          lastAuthor = message.authorName;
        $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.iconscout.com/icon/free/png-256/discord-3691244-3073764.png'><p class="author-name">${message.authorName} <span class="user-timestamp">${messageTimeStamp}</span></p><p class='user-message'>${message.text}</p></div>`);
        }
        break;
      
      case 'getChannelMessages':
        let allChannelMessages ="";
        let lastChannelAuthor;
        message.messageArray.reverse().forEach(function(userMessage) {
            if(userMessage.type === 7) {
              return;
            }
            if(!userMessage.content && userMessage.attachments.length < 1){
              return;
            }
          if(userMessage['channel_id'] === currentChannel){
            let userMessageContent = userMessage.content;
            
            if(userMessage.content.match(/<@[0-9]+>/g)) {
              userMessage.mentions.forEach(function(mention){
                userMessageContent = userMessageContent.replaceAll(`<@${mention.id}>`, `<span class='user-mentions'>@${mention.username}</span>`);
              });
            }
            let userMessageTimeStamp = timeStamp(userMessage.timestamp);
            if(userMessage.author.avatar && userMessage.content.includes('https://tenor.com/view/')){
              allChannelMessages += `<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${userMessage.author.id}/${userMessage.author.avatar}'><p class="author-name">${userMessage.author.username} <span class="user-timestamp">${userMessageTimeStamp}</span></p><img class="gif"src="${userMessageContent}.gif"></div>`;
              lastChannelAuthor = userMessage.author.username;
            } else if (!userMessage.content && userMessage.attachments.length >= 1 && userMessage.author.avatar) {
              userMessage.attachments.forEach(function(attachment){
                if (attachment['content_type'].includes("video")){
                  allChannelMessages += `<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${userMessage.author.id}/${userMessage.author.avatar}'><p class="author-name">${userMessage.author.username} <span class="user-timestamp">${userMessageTimeStamp}</span></p><video class="gif" src="${attachment['proxy_url']}"></video></div>`;
                } else {
                allChannelMessages += `<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${userMessage.author.id}/${userMessage.author.avatar}'><p class="author-name">${userMessage.author.username} <span class="user-timestamp">${userMessageTimeStamp}</span></p><img class="gif"src="${attachment['proxy_url']}"></div>`;
                }
              });
              lastChannelAuthor = userMessage.author.username;
            } else if (userMessage.author.avatar && lastChannelAuthor !== userMessage.author.username){
              allChannelMessages += `<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${userMessage.author.id}/${userMessage.author.avatar}'><p class="author-name">${userMessage.author.username} <span class="user-timestamp">${userMessageTimeStamp}</span></p><p class='user-message'>${userMessageContent}</p></div>`;
              lastChannelAuthor = userMessage.author.username;
            } else if (lastChannelAuthor === userMessage.author.username) {
              allChannelMessages += `<div class="message-container"><p class='user-message-later'>${userMessageContent}</p></div>`;
              lastChannelAuthor = userMessage.author.username;
            } else if (!userMessage.content && userMessage.attachments.length >= 1) {
              userMessage.attachments.forEach(function(attachment){
                if (attachment['content_type'].includes("video")){
                  allChannelMessages += `<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${userMessage.author.id}/${userMessage.author.avatar}'><p class="author-name">${userMessage.author.username} <span class="user-timestamp">${userMessageTimeStamp}</span></p><video class="gif" src="${attachment['proxy_url']}"></video></div>`;
                } else {
                allChannelMessages += `<div class="message-container"><img class='user-icon'src='https://cdn.iconscout.com/icon/free/png-256/discord-3691244-3073764.png'><p class="author-name">${userMessage.author.username} <span class="user-timestamp">${userMessageTimeStamp}</span></p><img class="gif"src="${attachment['proxy_url']}"></div>`;
                }
              });
              lastChannelAuthor = userMessage.author.username;
            }else {
              lastChannelAuthor = userMessage.author.username;
              allChannelMessages += `<div class="message-container"><img class='user-icon'src='https://cdn.iconscout.com/icon/free/png-256/discord-3691244-3073764.png'><p class="author-name">${userMessage.author.username} <span class="user-timestamp">${userMessageTimeStamp}</span></p><p class='user-message'>${userMessageContent}</p></div>`;
            }
          } 
        });
        $('#display-new-message').empty();
        $('#display-new-message').append(allChannelMessages);
        break;
    }
  });
});

window.addEventListener('message', async event => {
  const data = await event.data;
  switch (data.command){
    case 'load':
      Object.keys(data.guildNames).forEach(function(guild){
        let noIcon = "";
        if(!data.guildNames[guild].unavailable){
          data.guildNames[guild].name.split(" ").forEach(function(word){
            noIcon += word[0];
          });
          if (data.guildNames[guild].icon){
          $('.guild-container').append(`<img class='guild-icons' id='${guild}' src='https://cdn.discordapp.com/icons/${data.guildNames[guild].id}/${data.guildNames[guild].icon}.webp'>`);
          $('.channel-container').append(`<div class='channel-parent-${guild} hidden'></div>`);
          } else {
            $('.guild-container').append(`<div class='guild-icons' id='${guild}'>${noIcon}</div>`);
            $('.channel-container').append(`<div class='channel-parent-${guild} hidden'></div>`);
          }
          Object.keys(data.guildNames[guild].channels).forEach(function(channel){
            let channels = data.guildNames[guild].channels[channel];
            if (guild === channels['guild_id'] && channels.type === 0){
            $(`.channel-parent-${guild}`).append(`<p class="channel-names" id='${channels.id}'> <span class="hash-sign">#</span> ${channels.name}</p>`)
            }
          });
        }
      });
    
      //guild channel select
    
      $('.guild-icons').on('click', function() {
        $(this).addClass("guild-active");
        $(this).siblings().removeClass("guild-active");
        $(`.channel-parent-${this.id}`).removeClass('hidden');
        $(`.channel-parent-${this.id}`).siblings().addClass('hidden');
        currentGuild = this.id;
      });

      $('.channel-names').on('click', function() {
        currentChannel = this.id;
        vscode.postMessage({
          command: "channel",
          selectedChannelId: `${currentChannel}`
        });
        $(this).addClass("channel-active");
        $(this).siblings().removeClass("channel-active");
        $('#chat-box-header').html(`${data.guildNames[currentGuild].name} <span class="hash-sign">#</span> ${data.channelNames[this.id].name}`);
        $('#chat').attr('placeholder',`Send Message To: # ${data.channelNames[this.id].name}`)
      });
      
  } 
});

function timeStamp(botTimestamp) {
  const utcDate = botTimestamp;
  const date = new Date(utcDate);
  return date.toLocaleString().slice(-11);
}
