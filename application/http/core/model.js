class model {
    constructor() {
        this.config = process.SC.config;
        this.db = process.SC.db;
        this.Q = process.SC.Q;
        this.model_loader = "model_loader";
    }
    loadModel() {
        this.loadDefaultModel();
        this.loadCustomModel();
    }
    loadDefaultModel() {
        let path = this.config.path.app_path;
        path = path + "mvc" + this.config.methods.path.sep + "system" + this.config.methods.path.sep + "model";
        let model = require(path);
        process.SC_MODEL = {
            default: model
        };
    }
    loadCustomModel() {
        let sep = this.config.methods.path.sep;
        let app_path = this.config.path.app_path;

        let pathFileConfig = app_path + "config" + sep + this.model_loader;
        let model_loader = require(pathFileConfig);

        for (let i = 0; i < model_loader.length; i++) {
            let path = app_path + "mvc" + sep + "custom" + sep + model_loader[i];
            let models = require(path);
            process.SC_MODEL[models.name] = models;
        }
    }
}

module.exports = model;
