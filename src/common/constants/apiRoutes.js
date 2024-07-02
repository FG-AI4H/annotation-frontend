const SCHEME = process.env.REACT_APP_SCHEME
  ? process.env.REACT_APP_SCHEME
  : 'http';
const HOST = process.env.REACT_APP_HOST
  ? process.env.REACT_APP_HOST
  : 'localhost';
const PORT = process.env.REACT_APP_PORT
  ? process.env.REACT_APP_PORT === '80'
    ? ''
    : process.env.REACT_APP_PORT
  : ':8080';

export const baseUrl = `${SCHEME}://${HOST}${PORT}`;

export const API_ROUTES = {
  ADMIN_URL: `${baseUrl}/api/v1/admin`,
  MESSAGE_URL: `${baseUrl}/api/v1/messages`,
  USER_URL: `${baseUrl}/api/v1/users`,
  CAMPAIGN_URL: `${baseUrl}/api/v1/campaigns`,
  TASK_URL: `${baseUrl}/api/v1/tasks`,
  ANNOATATION_TASK_URL: `${baseUrl}/api/v1/annotation_tasks`,
  ANNOTATION_URL: `${baseUrl}/api/v1/annotations`,
  ANNOTATION_TOOL_URL: `${baseUrl}/api/v1/annotation_tools`,
  DATASET_URL: `${baseUrl}/api/v1/datasets`,
  GET_PERMISSION_LIST: `${baseUrl}/api/v1/datasets/:datasetId/permissions`,
  DATASET_CATALOG_URL: `${baseUrl}/api/v1/datasets/catalog`,
  DATA_CATALOG_URL: `${baseUrl}/api/v1/data_catalogs`,
  DATA_ACCESS_REQUEST_URL: `${baseUrl}/api/v1/data_access_request`,
  CREATE_DATASET_ROLE: `${baseUrl}/api/v1/datasetRoles`,
  EDIT_DATASET_ROLE: `${baseUrl}/api/v1/datasetRoles/:dataset_role_id`,
};
