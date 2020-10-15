
import { getToken } from "@/utils/auth";
export function auth() {
    return {
        "Content-Type": "application/json",
        "auth-token": getToken()
    };
}
