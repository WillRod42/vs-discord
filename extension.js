const vscode = require('vscode');
const fs = require("fs");
const Discord = require('discord.io');
const fetch = require("node-fetch");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, './.env') });

let selectedChannelMessages = [];

let bot = new Discord.Client({
  token: process.env.BOT_KEY,
  autorun: true
});

bot.on('ready', function(event) {

	vscode.commands.executeCommand("parrot.load", bot.servers, bot.channels)
	.then(edit => {
		if (!edit) throw Error;

		return vscode.workspace.applyEdit(edit);
})
	.then(undefined, err => {
	console.error('error handled');
})
	
});

bot.on('message', async function (user, userId, channelId, message, evt) {
	if (message.substring(0,1) === '!') {
    let args = message.substring(1).split(" ");
    let cmd = args[0];
    args = args.splice(1);
    switch(cmd) {
				case "catfact":
					await getCatFact()
						.then(function(response) {
						bot.sendMessage({to: channelId, message: ` ${response.fact}`})
					})
					break;
    }
  } else {
		let incomingMessage = message;
		while (incomingMessage.match(/<@[0-9]+>/g)) {
			let user = await replaceMentions(incomingMessage);
			incomingMessage = incomingMessage.replace(/<@[0-9]+>/, "@" + user.username);
		}

	
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
				vscode.ViewColumn.Two,
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
			vscode.commands.executeCommand("parrot.load", bot.servers, bot.channels)
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.load', function(guilds, channels) {
			panel.webview.postMessage({command: 'load', guildNames: guilds, channelNames: channels});
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.helloWorld', function(userName, message, evt, userId) {
			panel.webview.postMessage({command: 'newMessage', authorName: userName ,text: message, evtD: evt, authorId: userId});
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('parrot.selectChannel', function(channelMessages){
			panel.webview.postMessage({command: 'getChannelMessages', messageArray: channelMessages});
		})
	);
}

function deactivate() {}

function userIdToUsername(userId) {
	return fetch(`https://discord.com/api/v9/users/${userId}`, {
		method: "GET",
		headers: {"Authorization": `Bot ${process.env.BOT_KEY}`}
	})
	.then(response => response.json())
	.catch(error => console.error(error));
}

function replaceMentions(message) {
	return userIdToUsername(message.substring(message.indexOf("<") + 2, message.indexOf(">")));
}

async function getCatFact() {
	try {
		const response = await fetch(`https://catfact.ninja/fact`);
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return response.json();
	} catch(error) {
		return error.message;
	}
}


module.exports = {
	activate,
	deactivate
}