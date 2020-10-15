
let model = process.SC_MODEL;
/**
 * class user_model
 */
class user_model extends model.default {
    constructor() {
        super();
        this.tb_user = "tb_user";
    }
    genPassword(rawPassword, salt) {
        const crypto = require("crypto");
        let hash = crypto.createHash("sha256");

        hash.update(rawPassword);
        let hash1 = hash.digest("hex");
        hash1+=salt;

        hash = crypto.createHash("sha256");
        hash.update(hash1);
        return hash.digest("hex");
    }
    selectUserByUserName(userName) {
        let deferred = this.Q.defer();
        this.db.select("user_id,user_name,password,salt")
            .where("user_name", userName)
            .get(this.tb_user, (err, results) => {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(results);
                }
            });
        return deferred.promise;
    }
    getUserByUserId(userId){
        let deferred = this.Q.defer();
        this.db.select("user_id,user_name,name,email")
            .where("user_id", userId)
            .get(this.tb_user, (err, results) => {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(results);
                }
            });
        return deferred.promise;
    }
}
module.exports = user_model;

