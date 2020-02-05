import path, {resolve} from 'path'
import findup from 'findup'

// cover cb type async function to promise
export function pcb(
  cb: (...args: any[]) => void,
): (...args: any[]) => Promise<any> {
  return function(...args: any[]): Promise<any> {
    return new Promise((resolve) => {
      cb(...args, function(...args: any[]) {
        resolve(args)
      })
    })
  }
}

// find work dirname by root patterns
export async function findProjectRootDirectory(
  filePath: string,
  rootPatterns: string | string[]
): Promise<string | undefined> {
  const dirname = path.dirname(filePath)
  let patterns = [].concat(rootPatterns)
  let dirCandidate = ''
  for (const pattern of patterns) {
    const [err, dir] =  await pcb(findup)(dirname, pattern)
    if (!err && dir && dir !== '/' && dir.length > dirCandidate.length) {
      dirCandidate = dir
    }
  }
  if (dirCandidate.length) {
    return resolve(dirCandidate)
  }
  return
}
