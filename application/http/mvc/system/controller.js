class controller {
    constructor() {
        let SC = process.SC;
        this.SC = SC;
        this.config = SC.config;
        this.app = SC.app;
        this.appExpress = SC.appExpress;
        this.Q = SC.Q;
        this.logs = SC.logs;
        this.var = new Object();
        this.input = new Object();
        this.input.r = process.SC.INPUT;
    }
    render(view, data = {}, template = "default") {
        let sep = this.config.methods.path.sep;
        let pathView = this.config.path.app_path + "modules" + sep + this.group_module + sep + "view" + sep;
        this.appExpress.set("views", pathView);
        this.app.res.render(view, data, (err, html) => {
            this.render_layout(html, template);
        });
    }
    render_layout(html, layout) {
        let layoutPath = this.config.path.template_path;
        this.appExpress.set("views", layoutPath);
        let left = this;
        this.app.res.render(layout, { VAR: left.var, body: html });
    }
    loadModel(models) {
        let left = this;
        let sep = left.config.methods.path.sep;
        let model_loader = require(this.config.path.app_path + "core" + sep + "model");
        (new model_loader()).loadModel();
        if (typeof models == "string") {
            let path = this.config.path.app_path + "modules" + sep + this.group_module + sep + "model" + sep + models;
            let model = require(path);
            this[models] = new model();
        }
        else if (typeof models == "object") {
            for (let i = 0; i < models.length; i++) {
                let path = this.config.path.app_path + "modules" + sep + this.group_module + sep + "model" + sep + models[i];
                let model = require(path);
                this[models[i]] = new model();
            }
        }
    }
    loadLibrary(libs) {
        let left = this;
        let sep = left.config.methods.path.sep;
        if (typeof libs == "string") {
            let path = this.config.path.app_path + "library" + sep + libs;
            let lib = require(path);
            this[libs] = new lib();
        }
        else if (typeof libs == "object") {
            for (let i = 0; i < libs.length; i++) {
                let path = this.config.path.app_path + "library" + sep + libs[i];
                let lib = require(path);
                this[libs[i]] = new lib();
            }
        }
    }

    getPost(key=null){
        if(key==null){
            return this.app.req.body;
        }
        if(key in this.app.req.body){
            return this.app.req.body[key];
        }
        else{
            return null;
        }
    }
}
module.exports = controller;
