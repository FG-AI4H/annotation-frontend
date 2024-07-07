import { API_ROUTES } from '../common/constants/apiRoutes';

export async function getUserInfo(axiosBase) {
  try {
    const res = axiosBase.get(API_ROUTES.GET_USER_INFO);
    return res?.data;
  } catch (e) {
    return null;
  }
}
