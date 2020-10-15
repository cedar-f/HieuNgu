class controller {
    constructor() {
        let SC=process.SC;
        this.config = SC.config;
        this.app = SC.app;
        this.appExpress = SC.appExpress;
        this.controller_loader = "controller_loader.json";
    }
    loadController() {
        this.loadDefaultController();
        this.loadCustomController();
    }
    loadDefaultController() {
        let path = this.config.path.app_path;
        path = path + "mvc" + this.config.methods.path.sep + "system" + this.config.methods.path.sep + "controller";
        let controller = require(path);
        process.SC_CONTROLLER={
            default:controller
        };
    }
    loadCustomController() {
        let sep = this.config.methods.path.sep;
        let app_path = this.config.path.app_path;

        let pathFileConfig = app_path + "config" + sep + this.controller_loader;
        let controller_loader = require(pathFileConfig);

        for (let i = 0; i < controller_loader.length; i++) {
            let path = app_path + "mvc" + sep + "custom" + sep + controller_loader[i];
            let controllers = require(path);
            
            process.SC_CONTROLLER[controllers.name] = controllers;
        }
    }
}

module.exports = controller;
