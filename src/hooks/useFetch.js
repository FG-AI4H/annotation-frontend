import { Auth } from "aws-amplify";

export default function useFetch() {
  const fetchAPI = async (url, method, data) => {
    const auth = await Auth.currentAuthenticatedUser({
      bypassCache: false,
    });
    const accessToken = auth.signInUserSession.accessToken.jwtToken;

    const options = {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    };

    const res = await fetch(url, options);

    return await res.json();
  };

  return { fetchAPI };
}
