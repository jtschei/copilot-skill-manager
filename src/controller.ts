import * as vscode from 'vscode';
import { Logger } from './util/logging';
import { Telemetry } from './util/telemetry';
import { SkillExplorerTree } from './skillExplorer/skillExplorerTree';

const LOGGER = Logger.getInstance();
const TELEMETRY = Telemetry.getInstance();

export class Controller implements vscode.Disposable {
  static instance: Controller;

  private context: vscode.ExtensionContext;
  private disposables: vscode.Disposable[] = [];

  private skillExploreTree?: SkillExplorerTree;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.initialize();
  }

  public static getInstance(context?: vscode.ExtensionContext): Controller {
    if (!Controller.instance) {
      if (!context) {
        throw new Error('Controller not initialized and context is not provided. Provide a context to initialize.');
      }
      Controller.instance = new Controller(context);
    }
    return Controller.instance;
  }

  private initialize() {
    LOGGER.debug('Initializing Controller');
    LOGGER.debug('Logging URI: ' + this.context.logUri.toString());
    // command
    this.disposables.push(
      vscode.commands.registerCommand('copilot-skill-manager.helloWorld', () => {
        TELEMETRY.sendTelemetryEvent('helloWorldCommandExecuted');
        vscode.window.showInformationMessage('Hello World from copilot-skill-manager!');
      }),
    );

    // skill explorer
    LOGGER.debug('Initializing Skill Explorer');
    this.skillExploreTree = new SkillExplorerTree('');
    this.disposables.push(this.skillExploreTree);
    LOGGER.debug('Skill Explorer initialized');
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}
