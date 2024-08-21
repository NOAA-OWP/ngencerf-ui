/**
 * This file contains utility functions for user authentication and making JWT-based API calls
 */

import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useFetch } from '#app';

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
  const { data, error } = await useFetch<undefined | string[]>(`${ngencerfBaseUrl}/auth/jwt/verify/`, {
    method: 'POST',
    body: { 
      token: accessToken
    },
  });

  // Access token verification failed
  if (error.value) {
    console.error('Token verification failed:', error.value);
    return false;
  } 
  else {
    // Access token is valid
      return true;
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

  // Make a request to server to refresh the access token
  const { data, error } = await useFetch<{ access: string }>(`${ngencerfBaseUrl}/auth/jwt/refresh/`, {
    method: 'POST',
    body: { refresh: refreshToken },
  });

  // If new access token is returned, update user data store with new access token
  if (data?.value?.access) {
    userDataStore.setAccessToken(data.value.access);
    return true;
  }
  // No access token returned. Refresh failed
  else if (error?.value) {
    console.error('Token refresh failed:', error.value);
    return false;
  }
  else {
    console.error('Token refresh failed: no data returned');
    return false;
  }
};

/**
 * This function makes a protected-API call to the server
 * @param ngencerfBaseUrl
 * @param url 
 * @param options 
 * @returns response from the API call
 */
export const makeProtectedApiCall = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T | null> => {
  const userDataStore = useUserDataStore();
  const parsedUrl = new URL(url);
  const ngencerfBaseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

  
  try {
    // Verify access token before making the API call
    const isValid = await verifyAccessToken(ngencerfBaseUrl);

    // If access token is invalid, attempt to refresh it
    if (!isValid) {
      const refreshAccessTokenSuccess = await refreshAccessToken(ngencerfBaseUrl);
      // if access token is invalid and refresh failed, log user out and redirect to login page
      if (!refreshAccessTokenSuccess) {
        userDataStore.logUserOut();
        await navigateTo('/login');
        return null;
      }
    }

    // set access token in headers for API call
    const headers: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${userDataStore.getAccessToken()}`,
    };

    // format body based on type
    const body: BodyInit | undefined = options.body 
    ? (typeof options.body === 'object' && !Array.isArray(options.body) && !(options.body instanceof FormData) 
      ? JSON.stringify(options.body) 
      : options.body)
    : undefined;

    // make API call
    const response = await fetch(url, {
      ...options,
      headers,
      body
    });
    
    if (!response.ok) {
      console.error('API call failed:', response.statusText);
      return null;
    }

    return await response.json() as T;
  }
  catch (error) {
    console.error('Error making API call:', error);
    return null;
  }
};
