
let model = process.SC_MODEL;
/**
 * class test_model
 */
class test_model extends model.default {
    constructor() {
        super();
    }
    test_function() {
        return "this is text from test model";
    }
    fromdb() {
        let deferred = this.Q.defer();
        this.db.select("*").get("test", (err, results) => {
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
module.exports = test_model;

