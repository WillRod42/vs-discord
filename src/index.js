import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
//import $ from 'jquery';

// $(document).ready(function()	{
//   let chat = "";
//   let userName = "";
//   $('#set-name').on('click', function()	{
//     userName = $('#user-name').val();
//     $('#test').html('<h1>' + userName + '</h1>')
//   })
//   $('#send-chat').on('click', function(){
//     chat = $('#chat').val();
//     vscode.postMessage({
//       command: 'alert',
//       text: userName + ": " + chat
//     })
//   });
//   window.addEventListener('message', event => {
//     const message = event.data;
//     switch	(message.command)	{
//       case 'newMessage':
//         $('#display-new-message').append("<h5>" + message.text + "</h5>")
//         break;
//     }
//   });
// })