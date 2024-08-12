/**
 * This composable contains the server configuration for the backend API
 */

import { useRuntimeConfig } from "#app";

export const useBackendConfig = () => {
  const { baseUrl } = useRuntimeConfig().public;

  return {
    baseUrl
  };
}
