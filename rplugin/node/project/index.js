/*
 * created by 年糕小豆汤
*/

class App {
    constructor(plugin) {
        // save plugin object
        this.plugin = plugin;

        this.pathToSaveProjects = '';
        this.projects = null;

        // register
        plugin.registerFunction('ProjectAdd', [this, this.addProject]);

    }

    async addProject([project]) {
        const path = require('path');
        const fs = require('fs');
        const { nvim } = this.plugin;

        if (!this.pathToSaveProjects) {
            try {
                this.pathToSaveProjects = await nvim.eval('g:project_save_path');
            } catch(e) {
                this.pathToSaveProjects = path.join(require('os').homedir(), '.projects.json');
            }
        }

        if (!this.projects) {
            if (fs.existsSync(project)) {
                this.projects = JSON.parse(fs.readFileSync(this.pathToSaveProjects).toString());
            } else {
                this.projects = {};
            }
        }

        this.projects[project] = Date.now();

        fs.writeFileSync(this.pathToSaveProjects, JSON.stringify(this.projects));
    }
}

module.exports = plugin => new App(plugin);
