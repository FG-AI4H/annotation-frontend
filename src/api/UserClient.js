import Config from "./Config";
import {callApiWithToken, postApiWithToken} from "../utils/fetch";

class UserClient {
    accessToken
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.config = new Config();
    }

    async fetchAdminUserList() {
        console.log("Fetching users from admin endpoint");

        return callApiWithToken(this.accessToken, `${this.config.ADMIN_URL}/users`)
            .then(([response, json]) => {
                if (!response.ok) {
                    return { success: false, error: json };
                }
                return { success: true, data: json };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async fetchUserList() {
        console.log("Fetching users");

        return callApiWithToken(this.accessToken, `${this.config.USER_URL}`)
            .then(([response, json]) => {
                if (!response.ok) {
                    return { success: false, error: json };
                }
                return { success: true, data: json };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }


    async fetchUserById(userId) {
        console.log("Fetching user for Id: " + userId);

        return callApiWithToken(this.accessToken, `${this.config.USER_URL}/${userId}`)
            .then(([response, json]) => {
                if (!response.ok) {
                    return { success: false, error: json };
                }
                return { success: true, data: json };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async updateUser(user) {
        console.log("Updating user for Id: " + user.id);

        return postApiWithToken(this.accessToken, `${this.config.USER_URL}/${user.id}`,user,"PUT")
            .then(([response, json]) => {
                if (!response.ok) {
                    return { success: false, error: json };
                }
                return { success: true, data: json };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async addUser(user) {
        console.log("Creating user");

        return postApiWithToken(this.accessToken, this.config.USER_URL,user,"POST")
            .then(([response, json]) => {
                if (!response.ok) {
                    return { success: false, error: json };
                }
                return { success: true, data: json };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    handleError(error) {
        const err = new Map([
            [TypeError, "There was a problem fetching the response."],
            [SyntaxError, "There was a problem parsing the response."],
            [Error, error.message],
        ]).get(error.constructor);
        console.log(err);
        return err;
    }
}

export default UserClient;
