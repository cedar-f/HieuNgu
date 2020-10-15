import { asyncRoutes, constantRoutes } from "@/router";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, m, a) {
    if (roles.hasOwnProperty(m)) {
        if (roles[m].hasOwnProperty(a)) {
            return true;
        }
    }
    return false;
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = [];

    routes.forEach(route => {
        const tmp = Object.assign({}, route);
        tmp.children = new Array();
        if (route.hasOwnProperty("children")) {
            route.children.forEach(child => {
                if (
                    child.hasOwnProperty("module") &&
                    child.hasOwnProperty("action")
                ) {
                    if (hasPermission(roles, child.module, child.action)) {
                        tmp.children.push(Object.assign({}, child));
                    }
                } else if (
                    route.hasOwnProperty("module") &&
                    child.hasOwnProperty("action")
                ) {
                    if (hasPermission(roles, tmp.module, child.action)) {
                        tmp.children.push(Object.assign({}, child));
                    }
                }
            });
            if (tmp.children.length > 0) {
                res.push(tmp);
            }
        }
    });

    return res;
}

const state = {
    routes: [],
    addRoutes: []
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = constantRoutes.concat(routes);
    }
};

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            let accessedRoutes;

            accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
            console.log(accessedRoutes);
            commit("SET_ROUTES", accessedRoutes);
            resolve(accessedRoutes);
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
