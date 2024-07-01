import { Auth } from 'aws-amplify';
import axios from 'axios';
import { baseUrl } from '../common/constants/apiRoutes';

export default function useFetch() {
  const axiosBase = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  axiosBase.interceptors.request.use(
    async (req) => {
      const auth = await Auth.currentAuthenticatedUser({
        bypassCache: false,
      });

      const accessToken = auth.signInUserSession.accessToken.jwtToken;

      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return req;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const fetchAPI = async (url, method, data) => {
    const auth = await Auth.currentAuthenticatedUser({
      bypassCache: false,
    });
    const accessToken = auth.signInUserSession.accessToken.jwtToken;

    const options = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    };

    const res = await fetch(url, options);

    return await res.json();
  };

  return { fetchAPI, axiosBase };
}
