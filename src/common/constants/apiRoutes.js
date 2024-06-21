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

export const API_ROUTES = {
  ADMIN_URL: `${SCHEME}://${HOST}${PORT}/api/v1/admin123`,
  MESSAGE_URL: `${SCHEME}://${HOST}${PORT}/api/v1/messages`,
  USER_URL: `${SCHEME}://${HOST}${PORT}/api/v1/users`,
  CAMPAIGN_URL: `${SCHEME}://${HOST}${PORT}/api/v1/campaigns`,
  TASK_URL: `${SCHEME}://${HOST}${PORT}/api/v1/tasks`,
  ANNOATATION_TASK_URL: `${SCHEME}://${HOST}${PORT}/api/v1/annotation_tasks`,
  ANNOTATION_URL: `${SCHEME}://${HOST}${PORT}/api/v1/annotations`,
  ANNOTATION_TOOL_URL: `${SCHEME}://${HOST}${PORT}/api/v1/annotation_tools`,
  DATASET_URL: `${SCHEME}://${HOST}${PORT}/api/v1/datasets`,
  DATASET_CATALOG_URL: `${SCHEME}://${HOST}${PORT}/api/v1/datasets/catalog`,
  DATA_CATALOG_URL: `${SCHEME}://${HOST}${PORT}/api/v1/data_catalogs`,
  DATA_ACCESS_REQUEST_URL: `${SCHEME}://${HOST}${PORT}/api/v1/data_access_request`,
};
