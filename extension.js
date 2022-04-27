const vscode = require('vscode');
const fs = require("fs");
const Discord = require ('discord.io');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, './.env') });


let selectedChannelMessages = [];

let bot = new Discord.Client({
  token: process.env.BOT_KEY,
  autorun: true
});


bot.on('ready', function(event) {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
	// console.log(event);
	vscode.commands.executeCommand("parrot.load", bot.servers, bot.channels);
	
});

bot.on('message', function (user, userId, channelId, message, evt) {
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
				bot.sendMessage({
					to: channelId,
					message: "Channel set"
				});
				break;
    }
  } else {
		let incomingMessage = message;
		if (incomingMessage.includes("@")) {
			incomingMessage.replace(/<@[0-9]+>/g, `@${userIdTousername(incomingMessage.substring(incomingMessage.indexOf("@") + 1, incomingMessage.indexOf(">")))}`);
		}

	
		vscode.commands.executeCommand("parrot.selectChannel", selectedChannelMessages);
		vscode.commands.executeCommand("parrot.helloWorld", user, incomingMessage, evt.d, userId);
	}
});


function activate(context)	{
	let panel;
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.start', () => {
			panel = vscode.window.createWebviewPanel(
				'parrot',
				'Discord',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, "web"))],
					retainContextWhenHidden: true
				}
			)

			const stylePath = vscode.Uri.file(path.join(context.extensionPath, "web", "styles.css"));
			const styleSrc = panel.webview.asWebviewUri(stylePath);

			const scriptPath = vscode.Uri.file(path.join(context.extensionPath, "web", "index.js"));
			const scriptSrc = panel.webview.asWebviewUri(scriptPath);

			const htmlPath = vscode.Uri.file(path.join(context.extensionPath, "web", "index.html"));
			const htmlSrc = htmlPath.with({scheme: "vscode-resource"});
			let htmlString = fs.readFileSync(htmlSrc.fsPath, "utf8");

			htmlString = htmlString.replace("styles.css", styleSrc.toString());
			htmlString = htmlString.replace("index.js", scriptSrc.toString());

			panel.webview.html = htmlString;
			
		
			panel.webview.onDidReceiveMessage(
				message => {
					switch	(message.command)	{
						case 'alert':
							bot.sendMessage({
								to: message.channel,
								message: message.text
							})
							break;
						case 'channel':
							bot.getMessages({
								channelID: message.selectedChannelId,
								limit: "50"}, function(error, messages) {
									selectedChannelMessages = messages;
									vscode.commands.executeCommand("parrot.selectChannel", selectedChannelMessages);
								})
							
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.load', function(guilds, channels) {
			panel.webview.postMessage({command: 'load', guildNames: guilds, channelNames: channels });
		})
	);
	console.log('Congratulations, your extension "parrot" is now active!');
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.helloWorld', function(userName, message, evt, userId) {
			// vscode.window.showInformationMessage(message);
			panel.webview.postMessage({command: 'newMessage', authorName: userName ,text: message, evtD: evt, authorId: userId});
			console.log(message);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.selectChannel', async function(channelMessages){
			await panel.webview.postMessage({command: 'getChannelMessages', messageArray: channelMessages});
		})
	);
}

function deactivate() {}

function userIdTousername(userId) {
	console.log("userId: " + userId);
	return (Object.values(bot.users).find(user => {
		console.log("user: " + user);
		return user.id === userId;
	})).username;
}

module.exports = {
	activate,
	deactivate
}