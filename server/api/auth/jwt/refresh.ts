/**
 * This file contains a mock api/auth/jwt/refresh endpoint
 */

import { defineEventHandler, readBody, H3Error } from 'h3';
import jwt from 'jsonwebtoken';

/**
 * Attempts to refresh the access token using the refresh token
 * @param event - event object containing request context
 * @returns {Promise<string | string[]>} that resolves to a new access token or an error message
 */
export default defineEventHandler(async (event): Promise<string | string[]> => {
  // get request method
  const requestMethod = event.node.req.method;

  if (requestMethod === "POST") {
    // Read the request body to get the refresh token
    const { refreshToken } = await readBody(event);

    // Check if the refresh token is valid
    // TODO: grab actual refresh token from user store to verify and see if it's expired
    if (refreshToken === 'validRefreshToken') {
      event.node.res.statusCode = 200;
      // Generate a new access token
      const newAccessToken = jwt.sign({ username: 'username' }, 'accessSecret', { expiresIn: '15m' });
      // Return the new access token
      return newAccessToken;
    } else {
      const error = new H3Error('Invalid refresh token');
      event.node.res.statusCode = 401;
      // Return an error response for invalid refresh token.
      return [error.message];
    }
  } else {
    event.node.res.statusCode = 405;
    // Return an error response for invalid request method
    return 'Method Not Allowed';
  }
});