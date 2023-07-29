const vscode = require('vscode');
const axios = require('axios').default;

/**
 * @param {vscode.ExtensionContext} context
 */

vscode.workspace.onDidChangeTextDocument(event => {
    if (event.contentChanges.some(change => change.text === '    ')) {
		codeSuggest();
	}
});

function codeSuggest(){
	var lang=''	
	var editor = vscode.window.activeTextEditor;
	var filename = editor.document.fileName;
	var file_extension = filename.split('.').pop()
	if (!editor) {
		return;
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
		const selection = editor.selection;
		var text = editor.document.getText(selection);
		if (text!='') {
			var url='https://anzpathfinders.pythonanywhere.com?lang=' + lang + '&hint= ' + text
			axios.get(url).then(resp => {
				editor.edit(editBuilder => {
					editBuilder.delete(selection)
				});
				codeComplete(editor, resp.data)
			});
		}
		else{
			vscode.window.showWarningMessage('Please select the input to generate the code completion')
		}
	}
}

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

	const hoverProvider = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'python' }, {
        provideHover() {
			const linkText = 'Generate Code using Enterprise AI Code Companion';
			const linkUrl = 'command:extension.codeSuggest';
			const markdownString = new vscode.MarkdownString(`[${linkText}](${linkUrl})`);
			markdownString.isTrusted = true;
			return new vscode.Hover(markdownString);
        }
    });

	context.subscriptions.push(hoverProvider);
	context.subscriptions.push(vscode.commands.registerCommand('extension.codeSuggest', codeSuggest));
    context.subscriptions.push(hoverProvider);
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
