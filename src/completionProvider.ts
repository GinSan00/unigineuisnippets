
import * as vscode from 'vscode';

import { languages, Position, TextDocument, workspace } from 'vscode';
import { provideAttributeCompletions } from './attributeCompletions';
import { provideCompletionItems } from './completionItems';

export function activateEx(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('ui', {provideCompletionItems: provideCompletionItems}, '<'),
    vscode.languages.registerCompletionItemProvider('ui', {provideCompletionItems: provideAttributeCompletions}, ' '),
    );
}