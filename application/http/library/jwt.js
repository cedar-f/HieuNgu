module.exports = class {
    constructor() {
        let SC = process.SC;
        this.db = SC.db;
        this.Q = SC.Q;
        this.config = SC.config;
        this.jwt = require("jsonwebtoken");
    }

    genToken(data) {
        let privateKey = this.config.system.keyJWT;
        var token = this.jwt.sign({ data: data, time: parseInt(Date.now() / 1000) }, privateKey);
        return token;
    }


    getData(token) {
        let privateKey = this.config.system.keyJWT;
        let timeOut=this.config.system.tokenTimeOut;
        try {
            let decoded = this.jwt.verify(token, privateKey);
            if((decoded.time+timeOut)<parseInt(Date.now() / 1000)){
                return false;
            }
            else{
                return decoded.data;
            }
        } catch (err) {
            return false;
        }
    }
};
