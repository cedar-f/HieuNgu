module.exports = class {
    constructor() {
        this.config = process.SC.config;
    }
    loadPermission() {
        let pathPermisison = this.config.path.app_path + "config" + this.config.methods.path.sep + "permission.json";
        if (!this.config.methods.fs.existsSync(pathPermisison)) {
            console.error("application stoped: missing permission.json in: " + pathPermisison);
            process.exit();
        }
        let permisison = require(pathPermisison);
        return this.loadPermissionFromModules(permisison);
    }
    loadPermissionFromModules(permisison) {
        let sep = this.config.methods.path.sep;
        let pathModules = this.config.path.app_path + "modules" + sep;

        let activeModules = this.config.activeModules;
        for (let i = 0; i < activeModules.length; i++) {
            let pathPer = pathModules + activeModules[i] + sep + "config" + sep + "permission.json";
            if (!this.config.methods.fs.existsSync(pathPer)) {
                console.error("application stoped: missing permission.json in: " + pathPer);
                process.exit();
            }
            let per = require(pathPer);
            permisison.modules = Object.assign(permisison.modules, per.modules);
            permisison.override_url = Object.assign(permisison.override_url, per.override_url);
        }
        return permisison;
    }
};
