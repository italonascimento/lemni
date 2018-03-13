"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const fs = require("fs");
const path_1 = require("path");
const { version } = require('../package.json');
commander
    .action((project) => {
    const projectDir = path_1.join(process.cwd(), project);
    fs.mkdirSync(projectDir);
    const pkgTemplate = fs.readFileSync(path_1.join(__dirname, '../templates/pkg.json'));
    fs.writeFileSync(path_1.join(projectDir, 'package.json'), buildTemplate(pkgTemplate.toString(), {
        project,
        version,
    }));
})
    .parse(process.argv);
function buildTemplate(template, params) {
    return template
        .replace('{{project}}', params.project)
        .replace('{{version}}', params.version);
}
//# sourceMappingURL=lemni-start.js.map