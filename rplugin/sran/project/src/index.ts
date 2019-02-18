import fs from 'fs'
import Plugin from 'sran.nvim'

export default function(plugin: Plugin) {
  let pathToSaveProject = null
  let projects = {}
  const { nvim } = plugin

  nvim.on('notification', async (method, args: any[]) => {
    if (method === 'project_nvim_add') {
      const project = args[0]

      if (!pathToSaveProject) {
        pathToSaveProject = await nvim.call('project#util#get_path_to_save_project')
      }

      if (fs.existsSync(pathToSaveProject)) {
        projects = JSON.parse(fs.readFileSync(pathToSaveProject).toString())
      } else {
        projects = {}
      }

      projects[project] = Date.now()

      fs.writeFileSync(pathToSaveProject, JSON.stringify(projects))
    }
  })
}
