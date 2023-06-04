import Config from "./Config";
import {callApiWithToken, postApiWithToken} from "../fetch";

class DatasetClient {
    accessToken
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.config = new Config();
    }

    async fetchDatasetList() {
        console.log("Fetching Datasets");

        return callApiWithToken(this.accessToken, this.config.DATASET_URL)
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

    async fetchCatalogDatasetList() {
        console.log("Fetching Datasets from catalogs");

        return callApiWithToken(this.accessToken, this.config.DATASET_CATALOG_URL)
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


    async fetchDatasetById(DatasetId) {
        console.log("Fetching Dataset for Id: " + DatasetId);

        return callApiWithToken(this.accessToken, `${this.config.DATASET_URL}/${DatasetId}`)
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

    async fetchDatasetPermissionsById(DatasetId) {
        console.log("Fetching Dataset persmissions for Id: " + DatasetId);

        return callApiWithToken(this.accessToken, `${this.config.DATASET_URL}/${DatasetId}/permissions`)
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

    async updateDataset(dataset) {
        console.log("Updating Dataset for Id: " + dataset.id);

        return postApiWithToken(this.accessToken, `${this.config.DATASET_URL}/${dataset.id}`,dataset,"PUT")
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

    async addDataset(dataset) {
        console.log("Creating Dataset");

        return postApiWithToken(this.accessToken, this.config.DATASET_URL,dataset,"POST")
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

    async removeDataset(id) {
        console.log("Deleting Dataset for Id: " + id);

        return callApiWithToken(this.accessToken, `${this.config.DATASET_URL}/${id}`,"DELETE")
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

    async linkDataset(dataset) {
        console.log("Linking Dataset for Id: " + dataset.name);

        return postApiWithToken(this.accessToken, `${this.config.DATASET_CATALOG_URL}`,dataset,"PUT")
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

export default DatasetClient;
