let controller = process.SC_CONTROLLER;

class p_controller extends controller.default {
    constructor() {
        super();
        this._bypass_authentication = new Array();
        this._bypass_authorization = new Array();
        this.tokenHeaderKey = "auth-token";
        this._alow_method = [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ];
        this.loadLibrary("jwt");
    }

    callBackAsyn(callBack = null) {
        if (this._cros_check()) {
            if (this._verify_authentication()) {
                this._verify_authorization().then(data => {
                    if (data && this._detect_method()) {
                        if (callBack) {
                            callBack();
                        }
                    }
                });
            }
        }
    }

    _cros_check() {
        let method = this.app.req.method.toLowerCase();
        this.app.res.header("Content-Type", "application/x-www-form-urlencoded,multipart/form-data,text/plain");
        this.app.res.header("Access-Control-Allow-Origin", "*");
        this.app.res.header("Access-Control-Allow-Headers", "*");
        this.app.res.header("Access-Control-Allow-Methods", this._alow_method.join(", "));
        // this.app.res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        if (method == "options") {
            this.app.res.end();
            this.app.next();
            return false;
        }
        else {
            return true;
        }
    }

    _verify_authentication() {
        if (this._bypass_authentication.includes(this.input.r.action)) {
            return true;
        }
        let token = this.app.req.headers[this.tokenHeaderKey];
        if (!token) {
            this.response(false, "authenticaion false", null, 401);
            this.app.next();
            return false;
        }
        else {
            let data = this.jwt.getData(token);
            if (!data) {
                this.response(false, "authenticaion false", null, 401);
                this.app.next();
                return false;
            }
            else {
                this.userData = data;
                return true;
            }
        }
    }

    async _verify_authorization() {
        if (this._bypass_authorization.includes(this.input.r.action)) {
            return true;
        }
        if (!await this._check_permission(this.input.r.module, this.input.r.action)) {
            this.response(false, "you don't have permisison to asset this function", null, 401);
            this.app.next();
            return false;
        }
        else {
            return true;
        }
    }
    async _check_permission(m, a) {
        let modules = process.SC.modules;
        this.loadLibrary("permission");

        let data = await this.permission.getRoleByUserNotMap(this.userData.user_id);
        for (let i = 0; i < data.length; i++) {
            if (Object.prototype.hasOwnProperty.call(data[i], m)) {
                if (data[i][m] & modules[m].actions[a].value) {
                    return true;
                }
            }
        }
        return false;
    }

    _detect_method() {
        let method = this.app.req.method;
        if (this._alow_method.includes(method)) {
            this._map_action();
            return true;
        }
        else {
            this.response(false, "", null, 404);
            this.app.next();
            return false;
        }
    }

    _map_action() {
        this.input.r.action += "_" + this.app.req.method.toLowerCase();
    }

    _log_api() {

    }

    response(status = true, message = "", data = null, code = 200) {
        // if (process.SC.cancelR) {
        //     process.SC.cancelR = false;
        //     return;
        // }
        this.app.res.writeHead(code, { "Content-Type": "application/json" });
        this.app.res.end(JSON.stringify({
            status: status,
            message: message,
            data: data
        }));
    }
}
module.exports = p_controller;
