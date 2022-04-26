const vscode = require('vscode');
const fs = require("fs");
const Discord = require('discord.io');
const fetch = require("node-fetch");
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

bot.on('message', async function (user, userId, channelId, message, evt) {
	if (message.substring(0,1) === '!') {
    let args = message.substring(1).split(" ");
    let cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
      case "test":
				console.log(evt.d)
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
		if (message.match(/<@[0-9]+>/g)) {
			let user = await replaceMentions(message);
			incomingMessage = "@" + user.username;
		}

		vscode.commands.executeCommand("parrot.helloWorld", user, incomingMessage, evt.d, userId);
	}
});

//https://cdn.discordapp.com/avatars/{UserId}/{avatarId}
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
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, "web"))]
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
			
			// panel.webview.html = getWebviewContent(message);
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
		vscode.commands.registerCommand('parrot.helloWorld', function(userName, message, evt, userId) {
			vscode.window.showInformationMessage(message);
			panel.webview.postMessage({command: 'newMessage', authorName: userName ,text: message, evtD: evt, authorId: userId});
			console.log(message);
		})
	);
}

function deactivate() {}

function userIdTousername(userId) {
	return fetch(`https://discord.com/api/v9/users/${userId}`, {
		method: "GET",
		headers: {"Authorization": `Bot ${process.env.BOT_KEY}`}
	})
	.then(response => response.json())
	.catch(error => console.log(error));
}

function replaceMentions(message) {
	return userIdTousername(message.substring(message.indexOf("@") + 1, message.indexOf(">")));
}

module.exports = {
	activate,
	deactivate
}