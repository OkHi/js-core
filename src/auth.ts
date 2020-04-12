import axios from 'axios';
import {
  OkHiAppContext,
  OkHiMode,
  OkHiPlatformType,
  OkHiContext,
} from './types';

const DEV_AUTH_URL =
  'https://dev-api.okhi.io/v5/auth/mobile/generate-auth-token';

const SANDBOX_AUTH_URL =
  'https://sandbox-api.okhi.io/v5/auth/mobile/generate-auth-token';

const PROD_AUTH_URL = 'https://api.okhi.io/v5/auth/mobile/generate-auth-token';

const DEV_USER_VERIFY_TOKEN_URL_PREFIX =
  'https://dev-api.okhi.io/v5/auth/verification-token';

const SANDBOX_USER_VERIFY_TOKEN_URL_PREFIX =
  'https://sandbox-api.okhi.io/v5/auth/verification-token';

const PROD_USER_VERIFY_TOKEN_URL_PREFIX =
  'https://api.okhi.io/v5/auth/verification-token';

let AUTHORIZATION_URL: string;

let USER_VERIFY_TOKEN_URL_PREFIX: string;

let ctxt: OkHiContext = {
  developer: {
    name: 'external',
  },
  platform: {
    name: OkHiPlatformType.HYBRID,
  },
  mode: OkHiMode.SANDBOX,
};

let ACCESS_TOKEN: string;

let AUTHORIZATION_TOKEN: string;

export const fetchUserVerificationToken = async (userId: string) => {
  try {
    if (typeof userId !== 'string') {
      throw new Error('invalid user id');
    }
    if (
      typeof ACCESS_TOKEN !== 'string' ||
      typeof USER_VERIFY_TOKEN_URL_PREFIX !== 'string'
    ) {
      throw new Error('invalid init config provided');
    }
    const { data } = await axios.get<{ authorization_token: string }>(
      `${USER_VERIFY_TOKEN_URL_PREFIX}?user-id=${userId}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: ACCESS_TOKEN,
        },
      }
    );
    if (!data.authorization_token) {
      throw new Error('verification_token not provided');
    }
    return data.authorization_token;
  } catch (error) {
    throw error;
  }
};

export const fetchAuthorizationToken = async () => {
  try {
    if (AUTHORIZATION_TOKEN) {
      return AUTHORIZATION_TOKEN;
    }
    if (
      typeof ACCESS_TOKEN !== 'string' ||
      typeof AUTHORIZATION_URL !== 'string'
    ) {
      throw new Error('invalid init config provided');
    }
    const { data } = await axios.get<{ authorization_token: string }>(
      AUTHORIZATION_URL,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: ACCESS_TOKEN,
        },
      }
    );
    if (!data.authorization_token) {
      throw new Error('authorization_token not provided');
    }
    return data.authorization_token;
  } catch (error) {
    throw error;
  }
};

export const init = (auth: string, context: OkHiAppContext) => {
  // validate auth credentials
  if (typeof auth !== 'string') {
    throw new Error('invalid auth credentials provided');
  }

  ACCESS_TOKEN = `Token ${auth}`;

  // overridde default context object
  if (typeof context === 'object') {
    const container = context.app;
    delete context.app;
    ctxt = { ...ctxt, ...context, container };
  }

  // define endpoints
  if (ctxt.mode === OkHiMode.DEV) {
    AUTHORIZATION_URL = DEV_AUTH_URL;
    USER_VERIFY_TOKEN_URL_PREFIX = DEV_USER_VERIFY_TOKEN_URL_PREFIX;
  }

  if (ctxt.mode === OkHiMode.SANDBOX) {
    AUTHORIZATION_URL = SANDBOX_AUTH_URL;
    USER_VERIFY_TOKEN_URL_PREFIX = SANDBOX_USER_VERIFY_TOKEN_URL_PREFIX;
  }

  if (ctxt.mode === OkHiMode.PROD) {
    AUTHORIZATION_URL = PROD_AUTH_URL;
    USER_VERIFY_TOKEN_URL_PREFIX = PROD_USER_VERIFY_TOKEN_URL_PREFIX;
  }

  fetchAuthorizationToken()
    .then(token => {
      AUTHORIZATION_TOKEN = token;
    })
    .catch(() => {});
};

export const fetchContext = () => {
  return ctxt;
};
