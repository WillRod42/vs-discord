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




// function getWebviewContent(message)	
function deactivate() {}

function userIdTousername(userId) {
	return (Object.values(bot.users).find(user => user.id === userId)).username;
}

module.exports = {
	activate,
	deactivate
}