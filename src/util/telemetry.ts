import * as vscode from 'vscode';
import { TelemetryReporter } from '@vscode/extension-telemetry';
import { Logger } from './logging';

/**
 * This TELEMETRY_KEY constant is injected at build time by the build process.
 * It is used to initialize the TelemetryReporter for sending telemetry events.
 * It is sourced from the src/resources/util/telemetry.[dev|prod].json files.
 * The esbuild script will read the appropriate telemetry file based on the build environment and inject the TELEMETRY_KEY constant into the code.
 */
declare const TELEMETRY_KEY: string;

const LOGGER = Logger.getInstance();

/**
 * Telemetry class is a singleton that manages telemetry reporting for the extension.
 * It initializes a TelemetryReporter with the provided telemetry key and listens for changes in telemetry level.
 * The class provides a method to send telemetry events with optional properties and measurements.
 * It also implements the vscode.Disposable interface to clean up resources when the extension is deactivated.
 * The telemetry reporter is only initialized once and can be accessed via the static getInstance() method.
 * If the telemetry reporter is not initialized, telemetry events will not be sent, and a debug message will be logged.
 * The class ensures that all disposables are properly disposed of when the extension is deactivated.
 */
export class Telemetry implements vscode.Disposable {
  private reporter?: TelemetryReporter;

  private disposables: vscode.Disposable[] = [];

  private static telemetry: Telemetry;

  private constructor() {
    this.reporter = new TelemetryReporter(TELEMETRY_KEY);

    this.disposables.push(
      this.reporter.onDidChangeTelemetryLevel((level) => {
        LOGGER.debug(`Telemetry level changed to ${level}`);
      }),
    );
  }

  static getInstance(): Telemetry {
    return (Telemetry.telemetry ??= new Telemetry());
  }

  sendTelemetryEvent(
    eventName: string,
    properties?: Record<string, string>,
    measurements?: Record<string, number>,
  ): void {
    if (this.reporter) {
      LOGGER.debug(`Sending telemetry event: ${eventName}`);
      this.reporter.sendTelemetryEvent(eventName, properties, measurements);
    } else {
      // issue as debug as this is not user facing
      LOGGER.debug('Telemetry reporter is not initialized. Telemetry event not sent.');
    }
  }

  dispose() {
    LOGGER.debug('Disposing Telemetry');
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.reporter = undefined;
  }
}
