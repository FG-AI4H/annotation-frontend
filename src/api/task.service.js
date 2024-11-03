import { API_ROUTES } from '../common/constants/apiRoutes';

export async function getTaskByCampaign(id, axios) {
  try {
    const res = await axios.get(
      API_ROUTES.TASK_BY_CAMPAIGN_URL.replace(':campaign_id', id)
    );
    return res?.data;
  } catch (e) {
    return null;
  }
}
