const fs = require("fs");
const argv = require("yargs").argv;
const path = require("path");

var config = null;
if (argv.env == "dev") {
    let pathConfig = process.env["NODE_CONFIG_DIR"] + "developer.json";
    if (fs.existsSync(pathConfig)) {
        config = require(pathConfig);
    }
    else {
        console.error("aplication stoped: file config developer.json not found in '" + pathConfig + "'");
    }
}
else if (argv.env == "pro") {
    let pathConfig = process.env["NODE_CONFIG_DIR"] + "production.json";
    if (fs.existsSync(pathConfig)) {
        config = require(pathConfig);
    }
    else {
        console.error("aplication stoped: file config production.json not found in '" + pathConfig + "'");
    }
}
else {
    let pathConfig = process.env["NODE_CONFIG_DIR"] + "default.json";
    if (fs.existsSync(pathConfig)) {
        config = require(pathConfig);
    }
    else {
        console.error("aplication stoped: file config default.json not found in '" + pathConfig + "'");
    }
}

let dir = __dirname.substring(0, __dirname.length - 4);

let doc_aray = dir.split(path.sep);
doc_aray.splice(doc_aray.length-3,3);

config.path = new Object();
config.path.root_path=doc_aray.join(path.sep)+path.sep;
config.path.app_path = dir;
config.path.template_path = dir + "template";

config.methods = new Object();
config.methods.fs = fs;
config.methods.path = path;

module.exports = config;
