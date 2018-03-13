import * as commander from 'commander'
import * as fs from 'fs'
import { join } from 'path'

const { version } = require('../package.json')

commander
  .action((project: string) => {
    const projectDir = join(process.cwd(), project)
    
    fs.mkdirSync(projectDir)
    fs.mkdirSync(join(projectDir, 'src'))
    fs.mkdirSync(join(projectDir, 'src/components'))
    fs.mkdirSync(join(projectDir, 'dist'))

    const pkgTemplate = fs.readFileSync(
      join(__dirname, '../templates/pkg.json'),
    )
    
    fs.writeFileSync(
      join(projectDir, 'package.json'),
      buildTemplate(pkgTemplate.toString(), {
        project,
        version,
      })
    )
  })
  .parse(process.argv)

function buildTemplate(template: string, params: any): string {
  return template
    .replace('{{project}}', params.project)
    .replace('{{version}}', params.version)
}