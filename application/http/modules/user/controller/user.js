let controller = process.SC_CONTROLLER;
/**
 * class user
 */
class user extends controller.p_controller {
    constructor() {
        super();
        this.group_module = "user";
        this._bypass_authentication = ["login"];
        this._bypass_authorization = ["login", "info"];
    }
    info_get() {
        this.loadModel("user_model");
        this.user_model.getUserByUserId(this.userData.user_id).then(data => {
            this.loadLibrary("permission");
            this.permission.getRoleByUser(this.userData.user_id).then((roles) => {
                let result = {
                    name: data[0].user_name,
                    roles: roles,
                    avatar: "",
                    introduction: ""
                };
                this.response(true, "", result);
            }).catch(error => {
                this.logs.error(error);
                this.response(false, "", null, 500);
            });
        }).catch((error) => {
            this.logs.error(error);
            this.response(false, "", null, 500);
        });
    }
    login_post() {
        let userName = this.getPost("username");
        let password = this.getPost("password");
        this.loadModel("user_model");
        this.user_model.selectUserByUserName(userName)
            .then((data) => {
                if (data.length != 0) {
                    let passwordHash = this.user_model.genPassword(password, data[0].salt);
                    if (passwordHash == data[0].password) {
                        let token = this.jwt.genToken({ user_id: data[0].user_id });
                        this.response(true, "", token);
                    }
                    else {
                        this.response(false, "Sai tài khoản hoặc mật khẩu", null, 401);
                    }
                } else {
                    this.response(false, "Sai tài khoản hoặc mật khẩu", null, 401);
                }
            }).catch(function (error) {
                this.response(false, "", error);
            });
    }
}
module.exports = user;

