/**
 * Authentication service for handling token verification
 */

import axios from 'axios';
import * as vscode from 'vscode';
import { UserProfile } from '../types';
import { ConfigKeys, Defaults } from '../config/constants';
import { AuthenticationError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Service for handling authentication operations
 */
export class AuthService {
  /**
   * Get API URL from configuration
   */
  private getApiUrl(): string {
    const config = vscode.workspace.getConfiguration();
    return config.get<string>(ConfigKeys.API_URL) || Defaults.API_URL;
  }

  /**
   * Verify Personal Access Token (PAT) and get user information
   *
   * @param token - The Personal Access Token to verify
   * @returns The user profile if token is valid
   * @throws {AuthenticationError} When token is invalid or verification fails
   */
  async verifyToken(token: string): Promise<UserProfile> {
    try {
      logger.info('Verifying PAT with backend...');

      const apiUrl = this.getApiUrl();
      const endpoint = `${apiUrl}/user/me`;

      const response = await axios.get<{ success: boolean; user: UserProfile }>(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: Defaults.REQUEST_TIMEOUT,
      });

      if (!response.data.success || !response.data.user) {
        throw new AuthenticationError('Invalid token or missing user data');
      }

      logger.info(`Token verified for user: ${response.data.user.username}`);
      return response.data.user;
    } catch (error) {
      logger.error('Token verification failed', error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new AuthenticationError(
          'Invalid or expired token. Please check your token and try again.'
        );
      }

      if (error instanceof AuthenticationError) {
        throw error;
      }

      throw new AuthenticationError(
        'Failed to verify token. Please check your connection and try again.'
      );
    }
  }
}
