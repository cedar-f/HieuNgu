class database {
    constructor(config) {
        this.config = config;
    }

    async init(callBack = null) {
        let config = this.config;
        let settings = {
            host: config.mysql.host,
            database: config.mysql.database,
            user: config.mysql.user,
            password: config.mysql.password
        };
        if (config.mysql.connection_type == "pool") {
            console.log("database: init connection type `pool`");
            let QueryBuilder = require("node-querybuilder");
            let pool = new QueryBuilder(settings, "mysql", config.mysql.connection_type);
            let qb = await pool.get_connection();

            this.db = qb;
        }
        else if (config.mysql.connection_type == "single") {
            console.log("database: init connection type `single`");

            let QueryBuilder = require("node-querybuilder");
            this.db = new QueryBuilder(settings, "mysql");
        }
        if (callBack) {
            callBack();
        }
    }

    setConnectionType(type,callBack) {
        this.config.mysql.connection_type = type;
        this.init(callBack);
    }
}
module.exports = database;
