/**
 * This Composable contains utility functions for user authentication and making JWT-based API calls
 */

import { useUserDataStore } from '@/stores/common/UserDataStore';
import type { FetchResponse } from 'ofetch';
import { useLogout } from "~/composables/UseEventBus";

/**
 * Refreshes access token
 * @param ngencerfBaseUrl
 * @returns {boolean} true if access token is refreshed successfully, false otherwise
 */
export const refreshAccessToken = async (ngencerfBaseUrl: string): Promise<boolean> => {
  const userDataStore = useUserDataStore();
  const refreshToken = userDataStore.getRefreshToken();

  // If no refresh token is present, return false
  if (!refreshToken) {
    return false;
  }

  try {
    // Make a request to server to refresh the access token
    const data = await $fetch<any>(`${ngencerfBaseUrl}/auth/jwt/refresh/`, {
      method: 'POST',
      body: { refresh: refreshToken },
    });
    const { access } = data;

    // If new access token is returned, update user data store with new access token
    if (access) {
      userDataStore.setAccessToken(access);
      return true;
    } else {
      console.error('Token refresh failed');
      return false
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

/**
 * This function makes a protected-API call to the server
 * @param url 
 * @param userOptions 
 * @returns response from the API call
 */

let rqstUrl: string;
let rqstUserOptions: any;

export const makeProtectedApiCall = async <T>(
  url: string,
  userOptions: any = {},
): Promise<any> => {
  // Save the call data in case we need to refresh.
   rqstUrl = url;
   rqstUserOptions = userOptions; 

  let responseData: any; 

  try {
    const response = await fetch(url, {
      ...userOptions,
      async onRequest({ request, options }: { request: any, options: any }) {
        // stringify body if it is an object
        if (options.body && typeof options.body === 'object' && !Array.isArray(options.body) && !(options.body instanceof FormData)) {
          options.body = JSON.stringify(options.body);
        }
      }
    });
    if (response.ok) {
      responseData = {_data: await response.json(), status: response.status, ok: response.ok };
       console.log(responseData);
       return responseData;
    } 
    if( response.status === 401) {
      const userDataStore = useUserDataStore();
      const { ngencerfBaseUrl } = useBackendConfig();
      const refreshAccessTokenSuccess = await refreshAccessToken(ngencerfBaseUrl);
      if (!refreshAccessTokenSuccess) {
        sendUserToLogin();
        return;
      }
      rqstUserOptions.headers.Authorization = `Bearer ${userDataStore.getAccessToken()}`;
      return makeProtectedApiCall( rqstUrl, rqstUserOptions);
    } else {
      responseData = {_data: await response.json(), status: response.status, ok: response.ok };
       console.log(responseData);
       return responseData;
    }
  } catch {
    sendUserToLogin();
  }

};

const sendUserToLogin = () => {
  const userDataStore = useUserDataStore();
  userDataStore.logUserOut();
  useLogout("logoutEvent", "token");
  return null;
}


