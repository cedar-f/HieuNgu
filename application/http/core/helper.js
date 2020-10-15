class helper {
    constructor() {
        let SC = process.SC;
        this.config = SC.config;
    }
    loadHelper() {
        let path = this.config.path.app_path;
        let sep = this.config.methods.path.sep;
        this.config.methods.fs.readdir(path + "helper", function (err, files) {
            //handling error
            if (err) {
                return console.log("Unable to scan directory: " + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                require(path + "helper" + sep + file);
            });
        });
    }
}

module.exports = helper;
