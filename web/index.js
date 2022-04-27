// $(document).ready(function() {
//   $("body").append("<p>It works!</p>");
// });
const utcDate = '2022-04-26T20:45:30.517000+00:00'
// const date = new Date(utcDate);
// console.log(date.toLocaleString());

const vscode = acquireVsCodeApi();
$(document).ready(function() {
  let chat = "";
  let userName = "";
  let lastAuthor;
  $('#user-name').keyup(function(event) {
    if(event.keyCode === 13)  {
      $('#set-name').click();
    }
  })
  $('#set-name').on('click', function()	{
    userName = $('#user-name').val();
    $('#test').html(`<h1>${userName}</h1>`)
  })
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
      text: `${userName}: ${chat}`
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
//  https://tenor.com/view/aww-cute-gif-11008488
function timeStamp(botTimestamp) {
  const utcDate = botTimestamp;
  const date = new Date(utcDate);
  return date.toLocaleString().slice(-10);
}
