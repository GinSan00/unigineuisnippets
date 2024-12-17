import * as vscode from 'vscode';
import { languages } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let availableTags: string[];

export function activate(context: vscode.ExtensionContext) {
    // Загрузка списка тегов из ui.schema.json
    loadAvailableTags(context);

    // Регистрация XML-синтаксиса для файлов .ui
    const xmlProvider = vscode.workspace.registerTextDocumentContentProvider('ui', {
        provideTextDocumentContent: () => Promise.resolve('<!-- Place your UI code here -->')
    });
    
    context.subscriptions.push(xmlProvider);
    // Регистрация языковой схемы для файлов .ui
    languages.setLanguageConfiguration('ui', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*$$\-\=\+$$\{$$\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: {
            lineComment: '<!--',
            blockComment: ['<!--', '-->']
        },
        brackets: [['<', '>'], ['{', '}']],
        autoClosingPairs: [{
            open: '<',
            close: '/>',
            notIn: [vscode.SyntaxTokenType.String, vscode.SyntaxTokenType.Comment]
          }]
    });

    // Добавление JSON-схемы для .ui файлов
    vscode.workspace.onDidChangeConfiguration(() => {
        vscode.commands.executeCommand('vscode.reloadWindow');
    });

    // Настройка автодополнения и подсказок для тегов
    vscode.languages.registerCompletionItemProvider({ language: 'ui', scheme: 'ui' }, {
        provideCompletionItems(document, position, token, context) {
            // Получаем слово до курсора
            const linePrefix = document.lineAt(position).text.substr(0, position.character);

            // Находим последний открывающий символ "<"
            const lastOpenBracketIndex = linePrefix.lastIndexOf('<');
            if (lastOpenBracketIndex === -1 || linePrefix.charAt(lastOpenBracketIndex + 1) !== '/') {
                // Возвращаем все доступные теги, если находимся внутри тега
                return new vscode.CompletionList(availableTags.map(tag => {
                    return new vscode.CompletionItem(tag, vscode.CompletionItemKind.Property);
                }));
            }

            // Если находимся вне тега, возвращаем пустую подсказку
            return new vscode.CompletionList([]);
        }
    });

    // Шаблонный код для новых файлов .ui
    vscode.commands.registerCommand('test.createUIFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const templatePath = vscode.Uri.file(`${context.extensionPath}/templates/ui.template.xml`);
        const content = await vscode.workspace.fs.readFile(templatePath);
        editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), content.toString());
        });
    });

    context.subscriptions.push(vscode.commands.registerCommand('test.createUIFile', () => {}));
}

export function deactivate() {}

// Функция для загрузки списка тегов из ui.schema.json
function loadAvailableTags(context: vscode.ExtensionContext) {
    const schemaPath = path.join(context.extensionPath, 'shemas/ui.schema.json');
    try {
        const rawData = fs.readFileSync(schemaPath, 'utf8');
        const jsonData = JSON.parse(rawData);
        
        // Предполагаем, что теги находятся в свойстве "tags" в JSON
        availableTags = jsonData.tags;
    } catch (error) {
        console.error(`Error loading tags from ${schemaPath}: ${error}`);
    }
}