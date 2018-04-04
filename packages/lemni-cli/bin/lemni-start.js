"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const commander = require("commander");
const fs = require("fs");
const path_1 = require("path");
const ncp_1 = require("ncp");
const { version } = require('../package.json');
const copyFolder = util_1.promisify(ncp_1.ncp);
commander
    .action((project) => __awaiter(this, void 0, void 0, function* () {
    const targetDir = path_1.join(process.cwd(), project);
    const templateFolder = path_1.join(__dirname, '../templates/typescript');
    yield copyFolder(templateFolder, targetDir);
    writePackageJson(path_1.join(templateFolder, 'pkg.json'), path_1.join(targetDir, 'package.json'), { version, project });
    const installation = child_process_1.exec(`cd ${project} && npm i`);
    installation.stdout.pipe(process.stdout);
    installation.stderr.pipe(process.stderr);
    child_process_1.execSync('cd ..');
}))
    .parse(process.argv);
const writePackageJson = (filePath, targetPath, params) => {
    const pkgTemplate = fs.readFileSync(filePath);
    fs.writeFileSync(targetPath, buildTemplate(pkgTemplate.toString(), params));
};
const buildTemplate = (template, params) => template
    .replace('{{project}}', params.project)
    .replace('{{version}}', params.version);
//# sourceMappingURL=lemni-start.js.map