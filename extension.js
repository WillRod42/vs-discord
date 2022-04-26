const vscode = require('vscode');
const Discord = require ('discord.io');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, './.env') });

let replyChannelId;

let bot = new Discord.Client({
  token: process.env.BOT_KEY,
  autorun: true
});

bot.on('ready', function() {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function (user, userId, channelId, message, evt) {
	console.log("message!")
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
			case "set":
				replyChannelId = channelId;
				bot.sendMessage({
					to: channelId,
					message: "Channel set"
				});
				break;
    }
  } else {
		let incomingMessage = message;
		if (incomingMessage.includes("@")) {
			incomingMessage.replace(/<@[0-9]+>/g, `@${userIdTousername}`)
		}
		vscode.commands.executeCommand("parrot.helloWorld", `(${user}): ${incomingMessage}`);
	}
});

function activate(context)	{
	let panel;
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.start', (message) => {
			panel = vscode.window.createWebviewPanel(
				'parrot',
				'Discord',
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			)
			panel.webview.html = getWebviewContent(message);
			panel.webview.onDidReceiveMessage(
				message => {
					switch	(message.command)	{
						case 'alert':
							bot.sendMessage({
								to: replyChannelId,
								message: message.text
							})
							vscode.window.showInformationMessage(message.text);
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		})
	);

	console.log('Congratulations, your extension "parrot" is now active!');
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.helloWorld', function(message) {
			vscode.window.showInformationMessage(message);
			panel.webview.postMessage({command: 'newMessage', text: message});
			console.log(message);
		})
	);
	// context.subscriptions.push(disposable);
}




function getWebviewContent(message)	{
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
	<script
		src="https://code.jquery.com/jquery-3.5.1.min.js"
		integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
		crossorigin="anonymous"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Test</title>
	</head>
	<body>
		<label>Set your name:</label>
		<input id="user-name">
		<button id="set-name">Set Name</button>
		<div id='display-new-message'></div>
		<h1 id="test">UserName<h1>
		<input id="chat">
		<button id="send-chat">Submit</button>
		
		<script type="text/javascript">
		const vscode = acquireVsCodeApi();
			$(document).ready(function()	{
				let chat = "";
				let userName = "";
				$('#set-name').on('click', function()	{
					userName = $('#user-name').val();
					$('#test').html('<h1>' + userName + '</h1>')
				})
				$('#send-chat').on('click', function(){
					chat = $('#chat').val();
					vscode.postMessage({
						command: 'alert',
						text: userName + ": " + chat
					})
				});
				window.addEventListener('message', event => {
					const message = event.data;
					switch	(message.command)	{
						case 'newMessage':
							$('#display-new-message').append("<h5>" + message.text + "</h5>")
							break;
					}
				});
			})
				</script>
	</body>
  </html>`
}
function deactivate() {}

function userIdTousername(userId) {
	return (Object.values(bot.users).find(user => user.id === userId)).username;
}

module.exports = {
	activate,
	deactivate
}