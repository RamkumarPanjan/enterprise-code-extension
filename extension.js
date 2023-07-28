const vscode = require('vscode');
const axios = require('axios').default;

/**
 * @param {vscode.ExtensionContext} context
 */

vscode.workspace.onDidChangeTextDocument(event => {
    // Check if the change was a tab press event
    if (event.contentChanges.some(change => change.text === '    ')) {
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
			lang='unsupported'
			vscode.window.showErrorMessage('Enterprise AI Code Companion is not supported for ' + file_extension);
		}
		
		if(lang!='unsupported'){
			vscode.window.showInformationMessage('Enterprise AI Code Companion is generating the optimized code for you');
			var text = editor.document.getText();
			var url='https://ashishsinghaus-super-trout-rxv66xj97q73pg4p-5000.preview.app.github.dev?lang=' + lang + '&hint= ' + text
			axios.get(url).then(resp => {
				codeComplete(editor, resp.data)
			});
		}
	}
});

function codeComplete(editor, text) {
    let index = 0;
	let words = text.split(' ');
    const intervalId = setInterval(() => {
        editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, words[index] + ' ');
        });
        index++;
        if (index >= words.length) {
            clearInterval(intervalId);
        }
    }, 50);
}

function activate(context) {
	console.log('Extension "enterprise-code-extension" is running!');
	let disposable = vscode.commands.registerCommand('enterprise-code-extension.enterprise-code-companion', function () {
		vscode.window.showInformationMessage('Enterprise AI Code Companion is running...');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
