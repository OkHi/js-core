import User from './user';
import {
  OkHiCoreConfiguration,
  OkHiContext,
  OkHiPlatformType,
  OkHiMode,
  OkHiIntergrationType,
  OkHiException,
} from './types';

const API_VERSION = 'v5';
const DEV_BASE_URL = `https://dev-api.okhi.io/${API_VERSION}`;
const SANDBOX_BASE_URL = `https://sandbox-api.okhi.io/${API_VERSION}`;
const PROD_BASE_URL = `https://api.okhi.io/${API_VERSION}`;

export default class OkHiCore {
  private readonly BASE_URL: string;
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
  public user: User;

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

    // define base rest url
    if (this.context.mode === OkHiMode.DEV) {
      this.BASE_URL = DEV_BASE_URL;
    } else if (this.context.mode === OkHiMode.PROD) {
      this.BASE_URL = PROD_BASE_URL;
    } else {
      this.BASE_URL = SANDBOX_BASE_URL;
    }

    this.user = new User(this);
  }

  getContext = () => {
    return this.context;
  };

  getAccessToken = () => {
    return this.ACCESS_TOKEN;
  };

  getBaseUrl = () => {
    return this.BASE_URL;
  };
}
