/**
 * This file contains utility functions for user authentication and making JWT-based API calls
 */

import { useUserDataStore } from '@/stores/common/UserDataStore';
import type { FetchResponse } from 'ofetch';

/**
 * Verfies access token
 * @param ngencerfBaseUrl
 * @returns {boolean} true if access token is valid, false otherwise
 */
export const verifyAccessToken = async (ngencerfBaseUrl: string): Promise<boolean> => {
  const userDataStore = useUserDataStore();
  const accessToken = userDataStore.getAccessToken();

  // If no access token is present to verify, return false
  if (!accessToken) {
    return false;
  }

  // Make a request to the server to verify the access token
  // Response will be empty if token is valid or a string[] if token is invalid
  try {
    const data = await $fetch<any>(`${ngencerfBaseUrl}/auth/jwt/verify/`, {
      method: 'POST',
      body: { 
        token: accessToken
      },
    });
    // console.log('Token verification response:', data);
    return true;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

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
      // console.log('Refreshed access token:', access);
      // console.log('Token refresh successful');
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
export const makeProtectedApiCall = async <T>(
  url: string,
  userOptions: any = {},
): Promise<any> => {
  const userDataStore = useUserDataStore();
  const parsedUrl = new URL(url);
  const ngencerfBaseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
  let responseData: FetchResponse<any> | null = null;

  // verify access token before making the API call
  const isValid = await verifyAccessToken(ngencerfBaseUrl);

  // if access token is invalid, attempt to refresh it
  if (!isValid) {
    const refreshAccessTokenSuccess = await refreshAccessToken(ngencerfBaseUrl);
    
    // if refresh fails, log the user out and redirect to login page
    if (!refreshAccessTokenSuccess) {
      userDataStore.logUserOut();
      await navigateTo('/login');
      return null;
    }
  }

  // make API call
  try {
    const response = await $fetch.raw(url, {
      ...userOptions,
      async onRequest({ request, options }: { request: any, options: any } ) {
        // stringify body if it is an object
        if (options.body && typeof options.body === 'object' && !Array.isArray(options.body) && !(options.body instanceof FormData)) {
          options.body = JSON.stringify(options.body);
        }
        console.log('Request:', request, options);
      },
      async onRequestError({ error }: { error: any }) {
        console.error('Request error:', error);
      },
      async onResponseError({ response }: { response: any }) {
        responseData = await response;
      }
    });

    responseData = await response;
    console.log('Response:', responseData);
    return responseData;
  } catch (error) {
    console.error('API call failed:', responseData, error);
    return null;
  }
};
