module.exports = class {
    constructor(config, logs) {
        this.config = config;
        this.logs = logs;
        this.express = require("express");
        this.bodyParser = require("body-parser");
        this.app = this.express();
    }

    helper() {
        let helper = require(this.config.path.app_path + "core" + this.config.methods.path.sep + "helper");
        let h = new helper();
        h.loadHelper();
    }
    run() {
        this.app.use("/public", this.express.static(this.config.path.root_path + "public"));
        this.app.use(this.bodyParser.json());
        this.app.use(this.bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        }));

        let host = this.config.server.host;
        let port = this.config.server.port;
        let database = require(this.config.path.app_path + "core" + this.config.methods.path.sep + "database");
        let dbinit = new database(this.config);
        dbinit.init(() => {
            this.db = dbinit.db;
            this.Q = require("q");
            this.settingGlobalConfig();
            this.permisison = this.loadPermisison();
            process.SC.modules = this.permisison.modules;

            let controller_loader = require("./controller");
            (new controller_loader()).loadController();

            this.app.set("view engine", this.config.system.view_engine);
            this.helper();
            this.app.all("*", (req, res, next) => {
                process.SC.app = {
                    req: req,
                    res: res,
                    next: next
                };
                this.catchRequest(req, res);
            });
            this.app.listen(port, host, function () {
                console.log("Server is running in: %s:%s", host, port);
            });
        });
    }

    catchRequest(req, res) {
        try {
            let r = this.getRequest(req.path);
            if (r.group_module == "") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("404:group module not found!");
            }
            else if (r.module == "") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("404:module not found!");
            }
            else if (r.action == "") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("404:action not found!");
            }
            else {
                let path = this.config.path.app_path;
                let sep = this.config.methods.path.sep;
                path = path + "modules" + sep + r.group_module + sep + "controller" + sep + r.module;
                process.SC.INPUT = r;
                if (this.config.methods.fs.existsSync(path + ".js")) {
                    // load view folder

                    let c = require(path);
                    let i = new c();
                    if (typeof i.callBackAsyn == "function") {
                        i.callBackAsyn(() => {
                            if (typeof i[r.action] == "function") {
                                let string_run = "i[r.action](";
                                for (let i = 0; i < r.param.length; i++) {
                                    string_run += "'" + r.param[i] + "',";
                                }
                                if (r.param.length != 0) {
                                    string_run = string_run.substring(0, string_run.length - 1);
                                }
                                string_run += ")";
                                eval(string_run);
                                // i[r.action](r.param);
                            }
                            else {
                                if (process.SC.cancelR) {
                                    return;
                                } else {
                                    res.writeHead(404, { "Content-Type": "text/html" });
                                    res.end("404:action not defined in controller!");
                                }
                            }
                        });
                    } else {
                        if (typeof i[r.action] == "function") {
                            let string_run = "i[r.action](";
                            for (let i = 0; i < r.param.length; i++) {
                                string_run += "'" + r.param[i] + "',";
                            }
                            if (r.param.length != 0) {
                                string_run = string_run.substring(0, string_run.length - 1);
                            }
                            string_run += ")";
                            eval(string_run);
                            // i[r.action](r.param);
                        }
                        else {
                            if (process.SC.cancelR) {
                                return;
                            } else {
                                res.writeHead(404, { "Content-Type": "text/html" });
                                res.end("404:action not defined in controller!");
                            }
                        }
                    }

                } else {
                    if (process.SC.cancelR) {
                        return;
                    }
                    else {

                        res.writeHead(404, { "Content-Type": "text/html" });
                        res.end("404:file controller not found!");
                    }
                }
            }
        } catch (error) {

            let today = new Date();
            let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            // console.log(date+" "+time+" ["+error.name+"] "+error.message );
            let e = {
                time: date + " " + time,
                name: error.name,
                message: error.message,
                stack: error.stack
            };
            this.logs.error(e);
        }
    }

    settingGlobalConfig() {
        // left.config, { req: req, res: res, db: db, Q: Q, LOGS: left.logs }, left.app
        process.SC = {
            config: this.config,
            appExpress: this.app,
            db: this.db,
            Q: this.Q,
            logs: this.logs
        };
    }
    loadPermisison() {
        let pathPermisison = this.config.path.app_path + "core" + this.config.methods.path.sep + "permission";
        if (!this.config.methods.fs.existsSync(pathPermisison + ".js")) {
            console.error("application stoped: missing permission.js in: " + pathPermisison);
            process.exit();
        }
        let permisison = require(pathPermisison);
        return (new permisison()).loadPermission();
    }

    getRequest(url) {
        if (url[url.length - 1] == "/") {
            url = url.substring(0, url.length - 1);
        }
        let group_module = "";
        let module = "";
        let action = "";
        let param = new Array();

        if (url == "") {
            group_module = this.getGroupModule(this.config.system.default_module);
            module = this.getModule(this.config.system.default_module),
                action = "index";
        }
        else {
            url = url.substring(1, url.length);
            let split = url.split("/");

            if (split.length == 1) {
                group_module = this.getGroupModule(split[0]);
                module = this.getModule(split[0]);
                action = "index";
            }
            else if (split.length == 2) {
                let m = this.getModule(split[0]);
                if (m != "") {
                    let a = this.getAction(m, split[1]);
                    group_module = this.getGroupModule(m);
                    module = m;
                    if (a != "") {
                        action = a;
                    }
                    else {
                        action = "index";
                        param.push(split[1]);
                    }
                }
                else {
                    m = this.getModule(split[1]);
                    if (m != "") {
                        let g_m = this.getGroupModule(m);
                        if (g_m == split[0]) {
                            group_module = g_m;
                        }
                        else {
                            g_m = this.getModule(split[0]);
                            if (g_m != "") {
                                group_module = this, this.getGroupModule(g_m);
                            }
                        }
                        module = m;
                        action = "index";
                    }
                }
            }
            else if (split.length == 3) {
                let m = this.getModule(split[1]);
                if (m != "") {
                    module = m;
                    let g_m = this.getGroupModule(m);
                    if (g_m == split[0]) {
                        group_module = g_m;
                    }
                    else {
                        g_m = this.getModule(split[0]);
                        if (g_m != "") {
                            group_module = this, this.getGroupModule(g_m);
                        }
                    }
                    let a = this.getAction(m, split[2]);
                    if (a != "") {
                        //group_module/module/action/
                        action = a;
                    }
                    else {
                        //group_module/module/param_1/
                        action = "index";
                        param.push(split[2]);
                    }
                }
                else {
                    m = this.getModule(split[0]);
                    if (m != "") {
                        module = m;
                        group_module = this.getGroupModule(m);
                        let a = this.getAction(m, split[1]);
                        if (a != "") {
                            action = a;
                            param.push(split[2]);
                        }
                        else {
                            action = "index";
                            param.push(split[1]);
                            param.push(split[2]);
                        }
                    }
                }
            }
            else {
                let m = this.getModule(split[1]);
                if (m != "") {
                    module = m;
                    let g_m = this.getGroupModule(m);
                    if (g_m == split[0]) {
                        group_module = g_m;
                    }
                    else {
                        g_m = this.getModule(split[0]);
                        if (g_m != "") {
                            group_module = this, this.getGroupModule(g_m);
                        }
                    }

                    let a = this.getAction(m, split[2]);
                    if (a != "") {
                        action = a;
                        for (let i = 3; i < split.length; i++) {
                            param.push(split[i]);
                        }
                    }
                    else {
                        action = "index";
                        for (let i = 2; i < split.length; i++) {
                            param.push(split[i]);
                        }
                    }
                }
                else {
                    let m = this.getModule(split[0]);
                    if (m != "") {
                        module = m;
                        group_module = this.getGroupModule(m);
                        let a = this.getAction(m, split[1]);
                        if (a != "") {
                            action = a;
                            for (let i = 2; i < split.length; i++) {
                                param.push(split[i]);
                            }
                        }
                    }
                }
            }
        }

        return {
            group_module: group_module,
            module: module,
            action: action,
            param: param
        };
    }
    // getModuleMapping(module, action = "") {

    // }
    getModule(m) {
        if (m.toString() in this.permisison.modules) {
            return m;
        }
        else if (m.toString() in this.permisison.override_url) {
            return this.permisison.override_url[m].module;
        }
        else {
            return "";
        }
    }
    getAction(m, a) {
        if (this.permisison.override_url[m]) {
            if (a.toString() in this.permisison.override_url[m].actions) {
                // viet-lai/hanh-dong

                return this.permisison.override_url[m].actions[a];
            }
            else if (Object.values(this.permisison.override_url[m].actions).indexOf(a) > -1) {
                // viet-lai/action
                return a;
            }
        }
        else {
            m = this.getModule(m);
            if (m != "") {
                if (a.toString() in this.permisison.modules[m].actions) {
                    //module/action
                    return a;
                }
                else {
                    //module/hanh-dong
                    for (let key in this.permisison.override_url) {
                        if (this.permisison.override_url[key].module == m && (a.toString() in this.permisison.override_url[key].actions)) {
                            return this.permisison.override_url[key].actions[a];
                        }
                    }
                }
            }
        }
        return "";
    }
    getGroupModule(m) {
        m = this.getModule(m);
        if (m != "") {
            let group_module = this.permisison.modules[m].group_module.toLowerCase();
            group_module = group_module.replace(/\s+/g, "_");
            return group_module;
        }
        return "";
    }
};
