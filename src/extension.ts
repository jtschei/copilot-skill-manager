import * as vscode from 'vscode';
import { Logger } from './util/logging';

const LOGGER = Logger.getInstance();

export function activate(context: vscode.ExtensionContext) {
    LOGGER.info('Extension activated');

    const disposable = vscode.commands.registerCommand(
        'copilot-skill-manager.helloWorld',
        () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage(
                'Hello World from copilot-skill-manager!',
            );
        },
    );

    // add disposables to the context's subscriptions so they are cleaned up when the extension is deactivated
    context.subscriptions.push(disposable);
    context.subscriptions.push(LOGGER);
}

export function deactivate() {
    LOGGER.info('Extension deactivated');
}
