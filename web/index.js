// $(document).ready(function() {
//   $("body").append("<p>It works!</p>");
// });


const vscode = acquireVsCodeApi();
let currentGuild;
let currentChannel;
$(document).ready(function() {
  let chat = "";
  let userName = "";
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
    console.log("click working")
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
    const messageTimeStamp = timeStamp(message.evtD.timestamp);
    switch	(message.command)	{
      case 'newMessage':
        if (message.evtD.author.avatar && message.text.includes('https://tenor.com/view/')){
          $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.authorId}/${message.evtD.author.avatar}'><p class="author-name">${message.authorName} <span class="user-timestamp">${messageTimeStamp}<span></p><img class="gif"src="${message.text}.gif"></div>`)
          lastAuthor = message.authorName;
        }
        else if(message.evtD.author.avatar && lastAuthor !== message.authorName){
          lastAuthor = message.authorName;
        $('#display-new-message').append(`<div class="message-container"><img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.authorId}/${message.evtD.author.avatar}'><p class="author-name">${message.authorName} <span class="user-timestamp">${messageTimeStamp}<span></p><p class='user-message'>${message.text}</p></div>`)
        } else if(lastAuthor === message.authorName) {
          $('#display-new-message').append(`<div class="message-container"><p class='user-message-later'>${message.text}</p></div>`)
        }
        else {
        $('#display-new-message').append(`<p class="author-name">${message.authorName} ${messageTimeStamp}</p><p class='user-message'>${message.text}</p><br>`)
        }
        break;
        
    }
  });
});

window.addEventListener('message', event => {
  const data = event.data;
  switch (data.command){
    case 'load':
      Object.keys(data.guildNames).forEach(function(guild){
        let noIcon = "";
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
          $(`.channel-parent-${guild}`).append(`<p class="channel-names" id='${channels.id}'># ${channels.name}</p>`)
          }
        });
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
        $(this).addClass("channel-active");
        $(this).siblings().removeClass("channel-active");
        currentChannel = this.id;
      });

      console.log(data.guildNames);
      
  } 
});

function timeStamp(botTimestamp) {
  const utcDate = botTimestamp;
  const date = new Date(utcDate);
  return date.toLocaleString().slice(-10);
}
