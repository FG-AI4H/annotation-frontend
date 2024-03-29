class Config {
    SCHEME = process.env.REACT_APP_SCHEME ? process.env.REACT_APP_SCHEME : "http";
    HOST = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : "localhost";
    PORT = process.env.REACT_APP_PORT ? (process.env.REACT_APP_PORT === "80" ? "" : process.env.REACT_APP_PORT) : ":8080";
    ADMIN_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/admin`;
    MESSAGE_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/messages`;
    USER_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/users`;
    CAMPAIGN_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/campaigns`;
    TASK_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/tasks`;
    ANNOATATION_TASK_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/annotation_tasks`;
    ANNOTATION_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/annotations`;
    ANNOTATION_TOOL_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/annotation_tools`;
    DATASET_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/datasets`;
    DATASET_CATALOG_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/datasets/catalog`;
    DATA_CATALOG_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/data_catalogs`;
    DATA_ACCESS_REQUEST_URL = `${this.SCHEME}://${this.HOST}${this.PORT}/api/v1/data_access_request`;
    ACCESS_TOKEN = "accessToken";
    EXPIRATION = "expiration";


    defaultHeaders() {
        return {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    getExpiration(token) {
        let encodedPayload = token ? token.split(".")[1] : null;
        if (encodedPayload) {
            encodedPayload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(window.atob(encodedPayload));
            return payload?.exp ? payload?.exp * 1000 : 0;
        }
        return 0;
    }
}

export default Config;
