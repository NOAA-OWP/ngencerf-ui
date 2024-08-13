/**
 * This file contains a mock api/auth/jwt/create endpoint
 */

import { defineEventHandler, readBody, H3Error } from 'h3';
import jwt from 'jsonwebtoken';

/**
 * Interface for a successful authentication response
 */
export interface AuthSuccessResponse {
  access: string;
  refresh: string;
}

/**
 * Interface for an unsuccessful authentication response
 */
export interface AuthErrorResponse {
  non_field_errors: string[];
}

/**
 * Union type for success or error authentication response
 */
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

/**
 * Handles authentication request and generates JWT access and refresh tokens if credentials are valid
 * @param event - event object containing request context
 * @returns {Promise<AuthResponse>} that resolves to an authentication response, either success or error
 */
export default defineEventHandler(async (event): Promise<AuthResponse> => {
  // get request method
  const requestMethod = event.node.req.method;

  if (requestMethod == "POST") {
    // Read the request body to get the username and password.
    const { username, password } = await readBody(event);

    // Check if the provided credentials are correct
    if (username === 'username' && password === 'password') {
      event.node.res.statusCode = 200;
      // Generate JWT tokens for valid credentials
      const accessToken = jwt.sign({ username }, 'accessSecret', { expiresIn: '15m' });
      const refreshToken = jwt.sign({ username }, 'refreshSecret', { expiresIn: '1h' });

      // Return the access and refresh tokens
      return {
        access: accessToken,
        refresh: refreshToken
      };
    } else {
      const error = new H3Error('Invalid username or password');
      event.node.res.statusCode = 401;
      // Return an error response for invalid credentials
      return {
        non_field_errors: [error.message]
      };
    }
  } else {
    const error = new H3Error('Method not allowed');
    event.node.res.statusCode = 405;
    // Return an error response for invalid method.
    return {
      non_field_errors: [error.message]
    };
  }
});
