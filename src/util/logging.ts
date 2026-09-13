import * as constants from '../constants';
import * as vscode from 'vscode';
import { callSiteCapture } from '@thelinuxlich/csc';

/**
 * Logger class that wraps the vscode LogOutputChannel and provides additional functionality.
 * The logger is a singleton and can be accessed via the static getInstance() method.
 * The logger provides methods to log messages at different log levels (trace, debug, info, warn, error).
 * When log level is debug or trace, the logger will include caller information in the log messages.
 * The logger can be disposed of when no longer needed, which will also dispose of the underlying LogOutputChannel.
 * The logger can be shown in the VS Code output panel using the show() method.
 * The logger can be configured to preserve focus when shown in the output panel.
 * The logger can be used to log messages from different parts of the extension, providing a centralized logging mechanism.
 */
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

  static getInstance(): Logger {
    Logger.logger ??= new Logger(vscode.window.createOutputChannel(constants.extensionDisplayName, { log: true }));
    return Logger.logger;
  }

  /**
   * Get the caller information (file name and line number) of the function that called the logging method.
   * File name is normalized to use forward slashes.
   * File name only includes the path from the last ocurrence of /src/.
   * If file name cannot be determined, 'unknown' is used as a placeholder.
   * If line number cannot be determined, 0 is used as a placeholder.
   * @returns <file>:<linenumber>
   */
  getCallerInfo(): string {
    const callInfo = callSiteCapture(1);
    const stackFrames = callInfo?.stackFrames?.frame ?? [];
    if (stackFrames.length < 2) {
      return 'unknown:0';
    }

    const callFrame = stackFrames[1];
    const fileName = callFrame?.fileName;
    const lineNumber = callFrame?.lineNumber ?? 0;

    if (!fileName) {
      return `unknown:${lineNumber}`;
    }

    const normalizedFileName = fileName.replace(/\\/g, '/');
    const srcIndex = normalizedFileName.lastIndexOf('/src/');
    const relativeFileName = srcIndex >= 0 ? normalizedFileName.slice(srcIndex + 1) : normalizedFileName;

    return `${relativeFileName || 'unknown'}:${lineNumber}`;
  }

  getName(): string {
    return this.logChannel.name;
  }

  getLogLevel(): vscode.LogLevel {
    return this.logChannel.logLevel;
  }

  trace(message: string, ...args: unknown[]): void {
    this.logChannel.trace(`[${this.getCallerInfo()}]`, message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logChannel.debug(`[${this.getCallerInfo()}]`, message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    if (this.getLogLevel() <= vscode.LogLevel.Debug) {
      this.logChannel.info(`[${this.getCallerInfo()}]`, message, ...args);
    } else {
      this.logChannel.info(message, ...args, this.getCallerInfo());
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.getLogLevel() <= vscode.LogLevel.Debug) {
      this.logChannel.warn(`[${this.getCallerInfo()}]`, message, ...args);
    } else {
      this.logChannel.warn(message, ...args);
    }
  }

  error(error: string | Error, ...args: unknown[]): void {
    if (this.getLogLevel() <= vscode.LogLevel.Debug) {
      this.logChannel.error(`[${this.getCallerInfo()}]`, error, ...args);
    } else {
      this.logChannel.error(error, ...args);
    }
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
