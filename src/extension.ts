import * as vscode from 'vscode';
import { activateEx } from './completionProvider';

const uiTemplate = `
<?xml version="1.0" encoding="UTF-8"?>
<ui>
    
</ui>
`;

export function activate(context: vscode.ExtensionContext) {
  activateEx(context);
  
  context.subscriptions.push(vscode.workspace.onDidCreateFiles(event => {
    event.files.forEach(uri => {
        if (uri.path.endsWith('.ui')) {
            // Если создан файл с расширением .ui, заполняем его содержимым шаблона
            vscode.workspace.openTextDocument(uri).then(doc => {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document.uri.toString() === uri.toString()) {
                    editor.edit(builder => {
                        builder.replace(new vscode.Range(new vscode.Position(0, 0), doc.lineAt(doc.lineCount - 1).range.end), uiTemplate);
                    });
                }
            });
        }
    });
}));
}

export function deactivate() {}