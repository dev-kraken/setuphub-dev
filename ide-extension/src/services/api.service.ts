/**
 * API service for communicating with the backend
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import * as vscode from 'vscode';
import { ApiConfig, ApiErrorResponse, SyncSetupRequest, SyncSetupResponse } from '../types';
import { ConfigKeys, Defaults } from '../config/constants';
import { ApiError, NetworkError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Service for API communication with the SetupHub backend
 */
export class ApiService {
  private client: AxiosInstance;
  private config: ApiConfig;

  constructor() {
    this.config = this.loadConfig();
    this.client = this.createClient();
  }

  /**
   * Load API configuration from IDE settings
   */
  private loadConfig(): ApiConfig {
    const vscodeConfig = vscode.workspace.getConfiguration();
    const apiUrl = vscodeConfig.get<string>(ConfigKeys.API_URL) || Defaults.API_URL;

    return {
      baseUrl: apiUrl,
      timeout: Defaults.REQUEST_TIMEOUT,
      retries: Defaults.MAX_RETRIES,
    };
  }

  /**
   * Create Axios client with request/response interceptors
   */
  private createClient(): AxiosInstance {
    const client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    client.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    client.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => Promise.reject(this.handleError(error))
    );

    return client;
  }

  /**
   * Transform Axios errors into application-specific errors
   */
  private handleError(error: AxiosError): Error {
    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      logger.error('Network error occurred', error);
      return new NetworkError(
        'Unable to connect to the server. Please check your internet connection.'
      );
    }

    if (error.response) {
      const data = error.response.data as ApiErrorResponse;
      const message = data?.error || 'An error occurred while communicating with the server';
      logger.error(`API Error ${error.response.status}:`, message);
      return new ApiError(message, error.response.status, data?.details);
    }

    if (error.request) {
      logger.error('No response received from server', error);
      return new NetworkError('No response from server. Please try again later.');
    }

    logger.error('Unknown API error', error);
    return new ApiError(error.message || 'An unexpected error occurred');
  }

  /**
   * Create authorization header for authenticated requests
   */
  private createAuthHeader(token: string): { Authorization: string } {
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Sync user setup to the backend
   */
  async syncSetup(setup: SyncSetupRequest, token: string): Promise<SyncSetupResponse> {
    logger.info('Syncing setup to server...');
    const response = await this.client.post<SyncSetupResponse>('/setups', setup, {
      headers: this.createAuthHeader(token),
    });

    logger.info('Setup synced successfully');
    return response.data;
  }

  /**
   * Get existing setup for current IDE
   *
   * @param token - Authentication token
   * @param editorName - Name of the editor (vscode, cursor, etc.)
   * @returns Existing setup data or null if not found
   */
  async getExistingSetup(
    token: string,
    editorName: string
  ): Promise<{ name: string; description?: string } | null> {
    try {
      logger.info(`Fetching existing setup for IDE: ${editorName}`);
      const response = await this.client.get(`/setups/${editorName}`, {
        headers: this.createAuthHeader(token),
      });

      return response.data;
    } catch (error) {
      // 404 means no existing setup - this is expected for new users
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logger.info('No existing setup found');
        return null;
      }
      logger.error('Failed to fetch existing setup', error);
      return null;
    }
  }

  /**
   * Get base URL for constructing web URLs (without /api suffix)
   */
  getBaseUrl(): string {
    return this.config.baseUrl.replace('/api', '');
  }

  /**
   * Get dashboard URL where users can sign in and get their token
   */
  getAuthUrl(): string {
    return `${this.getBaseUrl()}/dashboard`;
  }

  /**
   * Get profile URL for a user
   */
  getProfileUrl(username: string): string {
    return `${this.getBaseUrl()}/${username}`;
  }

  /**
   * Get community setups browsing URL
   */
  getSetupsUrl(): string {
    return `${this.getBaseUrl()}/setups`;
  }

  /**
   * Reload configuration when settings change
   */
  reloadConfig(): void {
    this.config = this.loadConfig();
    this.client = this.createClient();
    logger.info('API configuration reloaded');
  }
}
