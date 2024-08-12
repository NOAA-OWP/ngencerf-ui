/**
 * This file contains a mock api/auth/jwt/verify endpoint
 */

import { defineEventHandler, readBody, H3Error } from 'h3';

/**
 * Verifies that the access token is still valid
 * @param event - event object containing request context
 * @returns {Promise<void | string[] | string>} that resolves to an error message or nothing
 */
export default defineEventHandler(async (event): Promise<void | string[] | string> => {
  // get request method
  const requestMethod = event.node.req.method;

  if (requestMethod == "POST") { 
    // Read the request body to get the access token.
    const { accessToken } = await readBody(event);

    // Send 200 response if access token is 'valid' (not null for testing purposes) 
    if (accessToken) {
      event.node.res.statusCode = 200;
    } else {
      const error = new H3Error('Invalid access token');
      event.node.res.statusCode = 401;
      // Return an error response for invalid access token.
      return [error.message];
    }
  } else {
    event.node.res.statusCode = 405;
    // Return an error response for invalid request method.
    return 'Method Not Allowed';
  }
});