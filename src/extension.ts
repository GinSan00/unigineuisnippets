// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const completionItems = [
    new vscode.CompletionItem('console.log'),
    new vscode.CompletionItem('alert'),
    new vscode.CompletionItem('document.getElementById'),
    // ... другие варианты
];

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "unigineuisnippets" is now active!');



	const provider = vscode.languages.registerCompletionItemProvider(
        ['xml'], // Языки, для которых будет работать автодополнение
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
                // Получаем слово под курсором
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                
                // Возвращаем список предложений для автодополнения
                return [
                    new vscode.CompletionItem('console.log'),
                    new vscode.CompletionItem('alert')
                ];
            }
        },
        '.' // Триггер для активации автодополнения
    );
    
    context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
