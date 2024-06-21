import Config from "./Config";
import {callApiWithToken, postApiWithToken} from "../utils/fetch";

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

    async fetchOwnerDataAccessRequestList() {
        console.log("Fetching data access requests");

        return callApiWithToken(this.accessToken, `${this.config.DATA_ACCESS_REQUEST_URL}/owner`)
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

    async fetchRequesterDataAccessRequestList() {
        console.log("Fetching data access requests");

        return callApiWithToken(this.accessToken, `${this.config.DATA_ACCESS_REQUEST_URL}/requester`)
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

    async fetchTableFromCatalog(catalog_uuid, table_name) {
        console.log("Fetching Table "+table_name+" for Id: " + catalog_uuid);

        return callApiWithToken(this.accessToken, `${this.config.DATA_CATALOG_URL}/${catalog_uuid}/${table_name}`)
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

    requestAccessToCatalogDataset(dataset) {
        console.log("Linking Dataset for Id: " + dataset.name);

        return postApiWithToken(this.accessToken, `${this.config.DATASET_CATALOG_URL}/request`,dataset,"POST")
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

    async removeDataAccessRequest(id) {
        console.log("Deleting Data Access Request for Id: " + id);

        return callApiWithToken(this.accessToken, `${this.config.DATA_ACCESS_REQUEST_URL}/${id}`,"DELETE")
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


    updateDataAccessRequest(request) {
        console.log("Updating Data Access Request for Id: " + request.id);

        return postApiWithToken(this.accessToken, `${this.config.DATA_ACCESS_REQUEST_URL}/${request.id}`,request,"PUT")
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

    updateDataAccessRequestStatus(id, newStatus) {
        console.log("Updating Data Access Request for Id: " + id);

        return callApiWithToken(this.accessToken, `${this.config.DATA_ACCESS_REQUEST_URL}/${id}/update_status/${newStatus}`)
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

export default DatasetClient;
