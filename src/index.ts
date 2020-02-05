import { homedir } from 'os'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { ExtensionContext, workspace, listManager, Uri } from 'coc.nvim'
import { TextDocument } from 'vscode-languageserver-protocol'

import Project from './source/project'
import { findProjectRootDirectory } from './utils'

export async function activate(context: ExtensionContext): Promise<void> {
  let { subscriptions } = context
  let config = workspace.getConfiguration('project')
  let enable = config.get<boolean>('enable', true)

  if (!enable) {
    return
  }

  const rootPatterns = config.get<string[]>('rootPatterns', ['.git'])
  const trace = config.get<'off' | 'message' | 'verbose'>('trace.server', 'off')
  const dbpath = config.get<string>('dbpath', '~/.coc-project')
    .replace(/^~/, homedir())
  let projects: Record<string, number> = {}
  let output = trace !== 'off' ? workspace.createOutputChannel('coc-project') : undefined
  let isInit = false

  subscriptions.push(
    listManager.registerList(new Project(projects, updateProjectList))
  )

  subscriptions.push(
    workspace.registerAutocmd({
      event: 'VimLeavePre',
      request: true,
      callback: updateProjectList
    })
  )

  subscriptions.push(
    workspace.registerAutocmd({
      event: 'BufEnter',
      request: false,
      callback: enterBuffer
    })
  )

  // resolve current document when coc ready
  workspace.ready.then(() => {
    enterBuffer()
  })

  async function enterBuffer() {
    const textDocument = await workspace.document
    if (textDocument) {
      openTextDocument(textDocument.textDocument)
    }
  }

  function updateProjectList(workdirs: string[]) {
    try {
      let data = {}
      if (existsSync(dbpath)) {
        data = JSON.parse(readFileSync(dbpath).toString())
      }
      const newData = {
        ...data,
        ...projects
      }
      if (workdirs) {
        workdirs.forEach(workdir => {
          delete projects[workdir]
          delete newData[workdir]
        })
      }
      writeFileSync(dbpath, JSON.stringify(newData))
    } catch (error) {
      trace !== 'off' && output.append(`\nsave dbpath: ${error.stack || error.message || error}`)
    }
  }

  async function openTextDocument (textDocument: TextDocument) {
    if (!isInit) {
      isInit = true
      if (existsSync(dbpath)) {
        try {
          const data = JSON.parse(readFileSync(dbpath).toString())
          Object.keys(data).forEach(workdir => {
            projects[workdir] = data[workdir]
          })
          trace !== 'off' && output.append(`\nloading .coc-project: ${dbpath}`)
        } catch (error) {
          trace !== 'off' && output.append(`\n${error.stack || error.message || error}`)
        }
      }
    }

    const projectRoot = await findProjectRootDirectory(Uri.parse(textDocument.uri).fsPath, rootPatterns)

    if (!projectRoot) {
      return
    }

    projects[projectRoot] = Date.now()
    if (!projects[projectRoot]) {
      trace !== 'off' && output.append(`enter projectRoot: ${projectRoot}`)
    }
    const { nvim } = workspace
    const currentWorkdir = await nvim.commandOutput('pwd')
    if (projectRoot !== currentWorkdir.trim()) {
      nvim.command(`silent! lcd ${projectRoot}`)
    }
  }
}
