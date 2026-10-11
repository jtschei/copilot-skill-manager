import * as vscode from 'vscode';
// import * as fs from 'fs';
// import * as path from 'path';
import { Skill } from './skill';

export class SkillExplorerTree implements vscode.TreeDataProvider<Skill>, vscode.Disposable {
  private disposables: vscode.Disposable[] = [];

  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Skill): Skill {
    return element;
  }

  getChildren(element?: Skill): Thenable<Skill[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No skill in empty workspace');
      return Promise.resolve([]);
    }

    if (element) return Promise.resolve([]);
    else return Promise.resolve([]);

    // if (element) {
    //   return Promise.resolve(
    //     this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')),
    //   );
    // } else {
    //   const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    //   if (this.pathExists(packageJsonPath)) {
    //     return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
    //   } else {
    //     vscode.window.showInformationMessage('Workspace has no package.json');
    //     return Promise.resolve([]);
    //   }
    // }
  }

  // private getSkillsInWorkspace(): Skill[] {
  //   // const skillSubDirectory = '.copilot/skills';
  //   // const skillPath = path.join(this.workspaceRoot, skillSubDirectory);
  //   // read all files in the skill path
  //   // const files = fs.readdir(skillPath,{},{(e,f) => {files.}}
  // return [];
  // }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}
