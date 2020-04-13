import axios from 'axios';
import {
  OkHiCoreConfiguration,
  OkHiContext,
  OkHiPlatformType,
  OkHiMode,
  OkHiIntergrationType,
  OkHiException,
  OkHiErrorCodes,
  OkHiErrorMessages,
} from './types';

export default class OkHiCore {
  private readonly DEV_AUTH_URL =
    'https://dev-api.okhi.io/v5/auth/mobile/generate-auth-token';
  private readonly SANDBOX_AUTH_URL =
    'https://sandbox-api.okhi.io/v5/auth/mobile/generate-auth-token';
  private readonly PROD_AUTH_URL =
    'https://api.okhi.io/v5/auth/mobile/generate-auth-token';
  private readonly DEV_USER_VERIFY_TOKEN_URL_PREFIX =
    'https://dev-api.okhi.io/v5/auth/verification-token';
  private readonly SANDBOX_USER_VERIFY_TOKEN_URL_PREFIX =
    'https://sandbox-api.okhi.io/v5/auth/verification-token';
  private readonly PROD_USER_VERIFY_TOKEN_URL_PREFIX =
    'https://api.okhi.io/v5/auth/verification-token';

  private readonly AUTHORIZATION_URL: string;
  private readonly USER_VERIFY_TOKEN_URL_PREFIX: string;
  private readonly context: OkHiContext = {
    developer: {
      name: OkHiIntergrationType.OKHI,
    },
    platform: {
      name: OkHiPlatformType.HYBRID,
    },
    mode: OkHiMode.SANDBOX,
  };

  private ACCESS_TOKEN: string;
  private AUTHORIZATION_TOKEN: string | undefined;

  constructor(configuration: OkHiCoreConfiguration) {
    const { auth, context } = configuration;

    if (typeof auth !== 'string') {
      throw new OkHiException({
        code: 'invalid_configuration',
        message: 'Invalid constructor configuration provided',
      });
    }

    if (typeof context === 'object') {
      const container = context.app;
      delete context.app;
      this.context = { ...this.context, ...context, container };
    }

    this.ACCESS_TOKEN = auth;

    // define endpoints
    if (this.context.mode === OkHiMode.DEV) {
      this.AUTHORIZATION_URL = this.DEV_AUTH_URL;
      this.USER_VERIFY_TOKEN_URL_PREFIX = this.DEV_USER_VERIFY_TOKEN_URL_PREFIX;
    } else if (this.context.mode === OkHiMode.PROD) {
      this.AUTHORIZATION_URL = this.PROD_AUTH_URL;
      this.USER_VERIFY_TOKEN_URL_PREFIX = this.PROD_USER_VERIFY_TOKEN_URL_PREFIX;
    } else {
      this.AUTHORIZATION_URL = this.SANDBOX_AUTH_URL;
      this.USER_VERIFY_TOKEN_URL_PREFIX = this.SANDBOX_USER_VERIFY_TOKEN_URL_PREFIX;
    }

    this.fetchAuthorizationToken()
      .then(token => {
        this.AUTHORIZATION_TOKEN = token;
      })
      .catch(() => {});
  }

  fetchAuthorizationToken = async () => {
    const { AUTHORIZATION_TOKEN, AUTHORIZATION_URL, ACCESS_TOKEN } = this;
    if (AUTHORIZATION_TOKEN) {
      return AUTHORIZATION_TOKEN;
    }
    try {
      const { data } = await axios.get<{ authorization_token: string }>(
        AUTHORIZATION_URL,
        {
          headers: {
            Authorization: `Token ${ACCESS_TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      if (!data.authorization_token) {
        throw new OkHiException({
          code: OkHiErrorCodes.unauthorized,
          message: OkHiErrorMessages.unauthorized,
        });
      }
      return data.authorization_token;
    } catch (error) {
      if (!error.response || error.response.status !== 200) {
        throw new OkHiException({
          code: OkHiErrorCodes.network_error,
          message: OkHiErrorMessages.network_error,
        });
      } else {
        throw error;
      }
    }
  };

  fetchUserVerificationToken = async (userId: string) => {
    try {
      const { USER_VERIFY_TOKEN_URL_PREFIX, ACCESS_TOKEN } = this;

      if (typeof userId !== 'string') {
        throw new OkHiException({
          code: OkHiErrorCodes.invalid_configuration,
          message: OkHiErrorMessages.invalid_configuration,
        });
      }

      const link = `${USER_VERIFY_TOKEN_URL_PREFIX}?user-id=${userId}`;
      const { data } = await axios.get<{ authorization_token: string }>(link, {
        headers: {
          Authorization: `Token ${ACCESS_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!data.authorization_token) {
        throw new OkHiException({
          code: OkHiErrorCodes.unauthorized,
          message: OkHiErrorMessages.unauthorized,
        });
      }

      return data.authorization_token;
    } catch (error) {
      if (!error.response || error.response.status !== 200) {
        throw new OkHiException({
          code: OkHiErrorCodes.network_error,
          message: OkHiErrorMessages.network_error,
        });
      } else {
        throw error;
      }
    }
  };

  fetchOkHiContext = () => {
    return this.context;
  };
}
