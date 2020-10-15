class model {
    constructor() {
        let SC = process.SC;
        this.SC=SC;
        this.config = SC.config;
        this.db = SC.db;
        this.Q = SC.Q;
    }
}
module.exports = model;
