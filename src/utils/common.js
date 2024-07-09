export const generateUpdatePermissionPayload = (data) => {
  return {
    id: data?.role_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dataset: data?.dataset,
    user: data?.id,
    username: data?.username,
    user_role: data?.request_user_role,
  };
};

export const getArray = (arr) => (Array.isArray(arr) ? arr : []);
