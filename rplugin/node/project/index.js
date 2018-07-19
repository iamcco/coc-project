/*
 * created by 年糕小豆汤
*/

class App {
    constructor(plugin) {
        // save plugin object
        this.plugin = plugin;

        this.pathToSaveProject = '';
        this.project = null;

        // register
        plugin.registerFunction('ProjectAdd', [this, this.addProject]);

    }

    async addProject([project]) {
        const fs = require('fs');
        const { nvim } = this.plugin;

        if (!this.pathToSaveProject) {
            this.pathToSaveProject = await nvim.eval('project#util#get_path_to_save_project()');
        }

        if (fs.existsSync(this.pathToSaveProject)) {
            this.project = JSON.parse(fs.readFileSync(this.pathToSaveProject).toString());
        } else {
            this.project = {};
        }

        this.project[project] = Date.now();

        fs.writeFileSync(this.pathToSaveProject, JSON.stringify(this.project));
    }
}

module.exports = plugin => new App(plugin);
