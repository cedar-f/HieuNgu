/**
 * application start here
 * don't change anything here if you don't understand
 * author: huu mai
 * version: 1.0.0
 */
const path = require("path");
process.env["NODE_CONFIG_DIR"] =
    __dirname +
    path.sep +
    "application" +
    path.sep +
    "http" +
    path.sep +
    "config" +
    path.sep;
const argv = require("yargs").argv;

if (argv.env == null || (argv.env != "pro" && argv.env != "dev")) {
    console.error(
        "application stopped: missing parameter environment or wrong environment config"
    );
    process.exit();
}

var appPath = __dirname + path.sep + "application" + path.sep + "http" + path.sep;

var config = require(appPath + "core" + path.sep + "config");
var router = require(appPath + "core" + path.sep + "router");

var logInit = require(appPath + "core" + path.sep + "log");
var logs = logInit(__dirname + path.sep + config.system.logs + path.sep);

(new router(config, logs)).run();
