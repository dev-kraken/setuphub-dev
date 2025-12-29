import { AuthService } from '../../services/auth.service';
import { Defaults } from '../../config/constants';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

jest.mock('axios');
jest.mock('vscode', () => ({
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(() => Defaults.API_URL),
    })),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('should return user profile when token is valid', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: {
            id: '123',
            username: 'testuser',
            name: 'Test User',
            email: 'test@example.com',
            avatarUrl: 'https://example.com/avatar.png',
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.verifyToken('valid-pat-token');

      expect(result).toEqual(mockResponse.data.user);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${Defaults.API_URL}/user/me`, {
        headers: {
          Authorization: 'Bearer valid-pat-token',
        },
        timeout: 30000,
      });
    });

    it('should throw AuthenticationError when token verification returns invalid', async () => {
      const mockResponse = {
        data: {
          success: false,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await expect(authService.verifyToken('invalid-token')).rejects.toThrow(
        'Invalid token or missing user data'
      );
    });

    it('should throw AuthenticationError when user data is missing', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: null,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await expect(authService.verifyToken('invalid-token')).rejects.toThrow(
        'Invalid token or missing user data'
      );
    });

    it('should throw AuthenticationError on 401 response', async () => {
      const axiosError = new AxiosError('Unauthorized', '401');
      axiosError.response = {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: {} } as unknown as InternalAxiosRequestConfig,
      };

      mockedAxios.get.mockRejectedValueOnce(axiosError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(authService.verifyToken('expired-token')).rejects.toThrow(
        'Invalid or expired token'
      );
    });

    it('should throw AuthenticationError on network failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(authService.verifyToken('any-token')).rejects.toThrow('Failed to verify token');
    });
  });
});
