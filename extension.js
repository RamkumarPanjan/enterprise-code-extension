// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
//import fetch from 'node-fetch';
const vscode = require('vscode');
const axios = require('axios').default;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

vscode.workspace.onDidChangeTextDocument(event => {
    // Check if the change was a tab press event
    if (event.contentChanges.some(change => change.text === '    ')) {
        // Implement your logic here
        vscode.window.showInformationMessage('Enterprise AI Code Companion is in action... ');
		var lang=''	
		var editor = vscode.window.activeTextEditor;
		var filename = editor.document.fileName;
		var file_extension = filename.split('.').pop()
		if (!editor) {
			return; // No open code editor
		}
		if (file_extension == 'py') {
			lang='python'
		}
		else if(file_extension == 'sql') {
			lang='sql'
		}
		else {
			lang='enterprise'
		}

		var text = editor.document.getText();
		var url='https://ashishsinghaus-organic-disco-v57rr5x4rqgh6qgr-5000.preview.app.github.dev?lang=' + lang + '&hint= ' + text
		axios.get(url).then(resp => {
		editor.edit(editBuilder => {
			editBuilder.insert(editor.selection.active, '\n' + resp.data);
		});
		});

	}
});

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "enterprise-code-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('enterprise-code-extension.ecc', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Enterprise AI Code Companion is on the job');
		
		vscode.window.showInformationMessage('Enterprise AI Code Companion is on the job');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
