import Config from "./Config";
import {callApiWithToken, postApiWithToken} from "../fetch";

class AdminClient {
    accessToken

    constructor(accessToken) {
        this.accessToken = accessToken;
        this.config = new Config();
    }

    async fetchAnnotationToolList() {
        console.log("Fetching annotation tools");

        return callApiWithToken(this.accessToken, this.config.ANNOTATION_TOOL_URL)
            .then(([response, json]) => {
                if (!response.ok) {
                    return {success: false, error: json};
                }
                return {success: true, data: json};
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async fetchAnnotationToolById(annotationToolId) {
        console.log("Fetching task for Id: " + annotationToolId);

        return callApiWithToken(this.accessToken, `${this.config.ANNOTATION_TOOL_URL}/${annotationToolId}`)
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

    async addAnnotationTool(annotationTool) {
        console.log("Creating task");

        return postApiWithToken(this.accessToken, this.config.ANNOTATION_TOOL_URL,annotationTool,"POST")
            .then(([response]) => {
                if (!response.ok) {
                    return { success: false, error: response };
                }
                return { success: true, data: response };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async updateAnnotationTool(annotationTool) {
        console.log("Updating task");

        return postApiWithToken(this.accessToken, `${this.config.ANNOTATION_TOOL_URL}/${annotationTool.id}`,annotationTool,"PUT")
            .then(([response]) => {
                if (!response.ok) {
                    return { success: false, error: response };
                }
                return { success: true, data: response };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async fetchDataCatalogList() {
        console.log("Fetching data catalogs");

        return callApiWithToken(this.accessToken, this.config.DATA_CATALOG_URL)
            .then(([response, json]) => {
                if (!response.ok) {
                    return {success: false, error: json};
                }
                return {success: true, data: json};
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async fetchDataCatalogById(catalogId) {
        console.log("Fetching catalog for Id: " + catalogId);

        return callApiWithToken(this.accessToken, `${this.config.DATA_CATALOG_URL}/${catalogId}`)
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

    async addDataCatalog(catalog) {
        console.log("Creating catalog");

        return postApiWithToken(this.accessToken, this.config.DATA_CATALOG_URL,catalog,"POST")
            .then(([response]) => {
                if (!response.ok) {
                    return { success: false, error: response };
                }
                return { success: true, data: response };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async updateDataCatalog(catalog) {
        console.log("Updating catalog");

        return postApiWithToken(this.accessToken, `${this.config.DATA_CATALOG_URL}/${catalog.id}`,catalog,"PUT")
            .then(([response]) => {
                if (!response.ok) {
                    return { success: false, error: response };
                }
                return { success: true, data: response };
            })
            .catch((e) => {
                this.handleError(e);
            });
    }

    async removeDataCatalog(id) {
        console.log("Deleting DataCatalog for Id: " + id);

        return callApiWithToken(this.accessToken, `${this.config.DATA_CATALOG_URL}/${id}`,"DELETE")
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


}
export default AdminClient;
