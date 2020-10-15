import store from "@/store";

export default {
    inserted(el, binding, vnode) {
        const { value } = binding;
        const roles = store.getters && store.getters.roles;

        if (value && value instanceof Array && value.length == 2) {

            let hasPermission = false;
            if (value[0] instanceof Array) {
                value[0].forEach(ms => {
                    if (roles.hasOwnProperty(ms)) {
                        if (value[1] instanceof Array) {
                            value[1].forEach(as => {
                                if (roles[ms].hasOwnProperty(as)) {
                                    hasPermission = true;
                                }
                            });
                        } else {
                            if (roles[ms].hasOwnProperty(value[1])) {
                                hasPermission = true;
                            }
                        }
                    }
                });
            } else if (value[1] instanceof Array) {
                value[1].forEach(ms => {
                    if (roles.hasOwnProperty(value[0])) {
                        if (roles[value[0]].hasOwnProperty(ms)) {
                            hasPermission = true;
                        }
                    }
                });
            } else {
                if (roles.hasOwnProperty(value[0])) {
                    if (roles[value[0]].hasOwnProperty(value[1])) {
                        hasPermission = true;
                    }
                }
            }

            if (!hasPermission) {
                // el.remove();
                // vnode.context.$destroy();
                el.parentNode && el.parentNode.removeChild(el);
            }
        } else {
            throw new Error(
                "need roles! Like v-permission=\"['module','action']\""
            );
        }
    }
};
