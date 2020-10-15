import request from "@/utils/request";
import { auth } from "../helpers/auth.js";

export function login(data) {
    return request({
        url: "/user/login",
        method: "post",
        data
    });
}

export function getInfo(token) {
    return request({
        url: "/user/info",
        method: "get",
        headers: auth(),
        params: { token }
    });
}

export function logout() {
    return request({
        url: "/vue-element-admin/user/logout",
        method: "post"
    });
}
