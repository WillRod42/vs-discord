const vscode = require('vscode');
const { Client, Intents } = require('discord.js');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, './.env') });



/**
 * @param {vscode.ExtensionContext} context
 */

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

async function activate(context) {
	const token = process.env.BOT_KEY;
	
	client.once('ready', c => {
		console.log(`Ready! Logged in as ${c.user.tag}`);
	});
	
	client.on('interactionCreate', async interaction => {
		if (!interaction.isCommand()) return;
	
		const { commandName } = interaction;
	
		if (commandName === 'ping') {
			await interaction.reply('Pong!');
		} else if (commandName === 'server') {
			await interaction.reply('Server info.');
		} else if (commandName === 'user') {
			await interaction.reply('User info.');
		}
	});
	
	
	client.login(token);

	console.log('Congratulations, your extension "parrot" is now active!');

	let disposable = vscode.commands.registerCommand('parrot.helloWorld', function(message) {
		vscode.window.showInformationMessage(message);
		console.log("test");
	});

	context.subscriptions.push(disposable);

	//outputTest = vscode.window.createOutputChannel("parrotOutput");

	// context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(displayMessage));
	// context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(displayMessage));

	//setInterval(displayMessage, 1000);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}