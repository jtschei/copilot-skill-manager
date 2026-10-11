import * as vscode from 'vscode';

export class Skill extends vscode.TreeItem {
  private skillId: string;
  private skillName: string;
  constructor(skillId: string, skillName: string) {
    super(skillName, vscode.TreeItemCollapsibleState.Collapsed);

    this.skillId = skillId;
    this.skillName = skillName;

    this.tooltip = `Tool tip`;
    this.description = `Description`;
    this.iconPath = `$files`;
  }

  public get SkillId(): string {
    return this.skillId;
  }

  public get SkillName(): string {
    return this.skillName;
  }
}
