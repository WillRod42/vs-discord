const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

//let outputTest;

async function activate(context) {

	console.log('Congratulations, your extension "parrot" is now active!');

	let disposable = vscode.commands.registerCommand('parrot.helloWorld', function(message) {
		vscode.window.showInformationMessage(message);
		console.log("test");
	});

	context.subscriptions.push(disposable);

	//outputTest = vscode.window.createOutputChannel("parrotOutput");

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(displayMessage));
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(displayMessage));

	//setInterval(displayMessage, 1000);
}

function deactivate() {}

function displayMessage() {
	let message = "test";
	vscode.commands.executeCommand("parrot.helloWorld", message);
}

module.exports = {
	activate,
	deactivate
}