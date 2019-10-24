import {homedir} from 'os'
import {
  IList,
  ListAction,
  ListContext,
  ListItem,
  workspace,
} from 'coc.nvim'
import colors from 'colors/safe'

export default class Project implements IList {
  public readonly name = 'project'
  public readonly description = 'project list'
  public readonly defaultAction = 'open'
  public actions: ListAction[] = []

  constructor(
    private projects: Record<string, number>,
    updateProjectList: (workdir: string[]) => void
  ) {
    this.actions.push({
      name: 'open',
      execute: async item => {
        if (Array.isArray(item)) {
          return
        }
        workspace.nvim.command(`e ${item.filterText}`)
      }
    })
    this.actions.push({
      name: 'delete',
      execute: async item => {
        const workdirs = [].concat(item).map(n => n.filterText)
        updateProjectList(workdirs)
      }
    })
  }

  public async loadItems(_context: ListContext): Promise<ListItem[]> {
    return Object.keys(this.projects).map<ListItem>(workdir => {
      return {
        label: `${workdir.replace(homedir(), '~')} ${colors.gray(new Date(this.projects[workdir]).toString())}`,
        filterText: workdir
      }
    })
  }
}
