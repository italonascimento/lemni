import { execSync, exec } from 'child_process'
import { promisify } from 'util'
import * as commander from 'commander'
import * as fs from 'fs';
import { join } from 'path'
import { ncp } from 'ncp'


const { version } = require('../package.json')

interface PackageTemplateParams {
  project: string
  version: string
}

const copyFolder = promisify(ncp)

commander
  .action(async (project: string) => {
    const targetDir = join(process.cwd(), project)
    const templateFolder = join(__dirname, '../templates/typescript')
    
    await copyFolder(templateFolder, targetDir)
    writePackageJson(
      join(templateFolder, 'pkg.json'),
      join(targetDir, 'package.json'),
      {version, project}
    )
    
    const installation = exec(`cd ${project} && npm i`)
    installation.stdout.pipe(process.stdout)
    installation.stderr.pipe(process.stderr)
    execSync('cd ..')
  })
  .parse(process.argv)

const writePackageJson: (
  filePath: string,
  targetPath: string,
  params: PackageTemplateParams
) => void =
  (filePath, targetPath, params) => {
    const pkgTemplate = fs.readFileSync(filePath)

    fs.writeFileSync(
      targetPath,
      buildTemplate(pkgTemplate.toString(), params)
    )
  }

const buildTemplate: (template: string, params: any) => string =
  (template, params) =>
    template
      .replace('{{project}}', params.project)
      .replace('{{version}}', params.version)
