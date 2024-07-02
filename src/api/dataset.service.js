import { API_ROUTES } from '../common/constants/apiRoutes';

export async function addPermission(payload, axios) {
  try {
    const res = await axios.post(API_ROUTES.CREATE_DATASET_ROLE, payload);
    return res?.data;
  } catch (e) {
    return null;
  }
}

export async function updatePermission(payload, axios) {
  try {
    const res = await axios.put(
      API_ROUTES.EDIT_DATASET_ROLE.replace(':dataset_role_id', payload.id),
      payload
    );
    return res?.data;
  } catch (e) {
    return null;
  }
}

export async function deletePermission(payload, axios) {
  try {
    const res = await axios.delete(
      API_ROUTES.EDIT_DATASET_ROLE.replace(':dataset_role_id', payload.id)
    );
    return res?.data;
  } catch (e) {
    return null;
  }
}

export async function getPermissionList(payload, axios) {
  try {
    const res = await axios.get(
      API_ROUTES.GET_PERMISSION_LIST.replace(':datasetId', payload?.id)
    );
    return res?.data;
  } catch (e) {
    return null;
  }
}
