module.exports = class {
    constructor() {
        this.tb_role = "tb_role";
        this.tb_acc_role = "tb_acc_role";

        let SC = process.SC;
        this.db = SC.db;
        this.Q = SC.Q;
    }

    async getRoleByUser(userID) {
        let results = await this.db.select("r.role_value")
            .join(this.tb_role + " r", "r.role_id=a_r.role_id")
            .where("a_r.user_id", userID)
            .get(this.tb_acc_role + " a_r");
        for (let i = 0; i < results.length; i++) {
            results[i] = JSON.parse(results[i]["role_value"]);
        }

        let modules = process.SC.modules;
        // global.pr(modules);
        let data = new Object();
        for (let i = 0; i < results.length; i++) {
            for (let m in modules) {
                if (Object.prototype.hasOwnProperty.call(results[i], m)) {
                    if (!Object.prototype.hasOwnProperty.call(data, m)) {
                        data[m] = new Object();
                    }
                    for (let a in modules[m].actions) {
                        if (!Object.prototype.hasOwnProperty.call(data[m], a)) {
                            if (modules[m].actions[a].value & results[i][m]) {
                                data[m][a] = modules[m].actions[a];
                            }
                        }
                    }
                }
            }
        }
        return data;
    }
    async getRoleByUserNotMap(userID) {
        let results = await this.db.select("r.role_value")
            .join(this.tb_role + " r", "r.role_id=a_r.role_id")
            .where("a_r.user_id", userID)
            .get(this.tb_acc_role + " a_r");

        for (let i = 0; i < results.length; i++) {
            results[i] = JSON.parse(results[i]["role_value"]);
        }

        return results;
    }
};
