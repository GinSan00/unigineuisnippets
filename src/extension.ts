import * as vscode from 'vscode';
import { activateEx } from './completionProvider';

export function activate(context: vscode.ExtensionContext) {
  activateEx(context);
}

export function deactivate() {}