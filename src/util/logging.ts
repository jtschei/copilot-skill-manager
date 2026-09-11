import * as constants from '../constants';
import * as vscode from 'vscode';

export class Logger implements vscode.Disposable {
  private static logger?: Logger;

  private disposables: vscode.Disposable[] = [];

  private constructor(private logChannel: vscode.LogOutputChannel) {
    this.disposables.push(
      this.logChannel.onDidChangeLogLevel((level) => {
        this.logChannel.appendLine(`Log level changed to ${vscode.LogLevel[level]}`);
      }),
    );
    this.disposables.push(this.logChannel);
  }

  public static getInstance(): Logger {
    Logger.logger ??= new Logger(vscode.window.createOutputChannel(constants.extensionName, { log: true }));
    return Logger.logger;
  }

  getName(): string {
    return this.logChannel.name;
  }

  getLogLevel(): vscode.LogLevel {
    return this.logChannel.logLevel;
  }

  trace(message: string, ...args: unknown[]): void {
    this.logChannel.trace(message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logChannel.debug(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logChannel.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logChannel.warn(message, ...args);
  }

  error(error: string | Error, ...args: unknown[]): void {
    this.logChannel.error(error, ...args);
  }

  show(preserveFocus?: boolean): void {
    this.logChannel.show(preserveFocus);
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    Logger.logger = undefined;
  }
}
