import * as vscode from 'vscode';
import * as constants from './constants';
import { Logger } from './util/logging';
import { Controller } from './controller';
import { Telemetry } from './util/telemetry';

const LOGGER = Logger.getInstance();
const TELEMETRY = Telemetry.getInstance();

export function activate(context: vscode.ExtensionContext) {
  LOGGER.debug('Extension activation started');

  // add logger and telemetry to context subscriptions for disposal on deactivation
  context.subscriptions.push(LOGGER);
  context.subscriptions.push(TELEMETRY);

  // initialize controller to effectively start the extension
  try {
    const controller = Controller.getInstance(context);
    context.subscriptions.push(controller);
    // success
    LOGGER.info('Extension activated');
    TELEMETRY.sendTelemetryEvent(constants.evtExtensionActivated, { status: 'success' });
  } catch (error: unknown) {
    // failure
    LOGGER.error(`Failed to initialize Controller: ${error instanceof Error ? error.message : String(error)}`);
    TELEMETRY.sendTelemetryEvent(constants.evtExtensionActivated, { status: 'failure' });
  }
}

export function deactivate() {
  LOGGER.info('Extension deactivated');
}
