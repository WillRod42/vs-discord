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
  $('#set-name').on('click', function()	{
    userName = $('#user-name').val();
    $('#test').html(`<h1>${userName}</h1>`)
  })
  // Outgoing
  $('#send-chat').on('click', function(){
    chat = $('#chat').val();
    vscode.postMessage({
      command: 'alert',
      text: `${userName}: ${chat}`
    })
  });
  // Incoming
  window.addEventListener('message', event => {
    const message = event.data;
    switch	(message.command)	{
      case 'newMessage':
        if(message.evtD.author.avatar){
        $('#display-new-message').append(`<img class='user-icon'src='https://cdn.discordapp.com/avatars/${message.authorId}/${message.evtD.author.avatar}'><div class="message-container"><p class="author-name">${message.authorName}</p><p class='user-message'>${message.text}</p></div><br>`)
        } else {
        $('#display-new-message').append(`<p class="author-name">${message.authorName}</p><p class='user-message'>${message.text}</p><br>`)
        }
        break;
    }
  });
});

function timeStamp(botTimestamp) {
  const utcDate = botTimestamp;
  const date = new Date(utcDate);
  const todaysDate = new Date();
  console.log(date.toLocaleString());
  console.log(todaysDate);
}

timeStamp(utcDate);