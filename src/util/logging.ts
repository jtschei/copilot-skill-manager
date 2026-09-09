import * as constants from '../constants';
import * as vscode from 'vscode';

export class Logger implements vscode.Disposable {

    private static logger?: Logger;
    private disposables: vscode.Disposable[] = [];

    private constructor(private logChannel: vscode.LogOutputChannel) { 
        this.disposables.push(this.logChannel.onDidChangeLogLevel((level) => {
            this.logChannel.appendLine(`Log level changed to ${vscode.LogLevel[level]}`);
        }));
        this.disposables.push(this.logChannel);
    }

    public static getInstance(): Logger{
        if (!Logger.logger) {
            Logger.logger = new Logger(vscode.window.createOutputChannel(constants.extensionName, {
                log: true,
            }));
        }
        return Logger.logger;
    }

    getName(): string {
        return this.logChannel.name;
    }
    
    getLogLevel(): vscode.LogLevel {
        return this.logChannel.logLevel;
    }

    trace(message: string, ...args: any[]): void {
        this.logChannel.trace(message, ...args);
    }
    debug(message: string, ...args: any[]): void {
        this.logChannel.debug(message, ...args);
    }
    info(message: string, ...args: any[]): void {
        this.logChannel.info(message, ...args);
    }
    warn(message: string, ...args: any[]): void {
        this.logChannel.warn(message, ...args);
    }
    error(error: string | Error, ...args: any[]): void {
        this.logChannel.error(error, ...args);
    }

    dispose(): void {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
        Logger.logger = undefined;
    }

}
