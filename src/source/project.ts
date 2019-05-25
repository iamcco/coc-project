import {
  IList,
  ListAction,
  ListContext,
  ListItem,
  workspace,
} from 'coc.nvim'

export default class Project implements IList {
  public readonly name = 'project'
  public readonly description = 'project list'
  public readonly defaultAction = 'open'
  public actions: ListAction[] = []

  constructor(private projects: Record<string, number>) {
    this.actions.push({
      name: 'open',
      execute: async item => {
        if (Array.isArray(item)) {
          return
        }
        workspace.nvim.command(`e ${item.filterText}`)
      }
    })
  }

  public async loadItems(_context: ListContext): Promise<ListItem[]> {
    return Object.keys(this.projects).map<ListItem>(workdir => {
      return {
        label: `${workdir} [${new Date(this.projects[workdir]).toString()}]`,
        filterText: workdir
      }
    })
  }
}
