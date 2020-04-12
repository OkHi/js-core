import {
  OkHiAppContext,
  OkHiMode,
  OkHiPlatformType,
  OkHiContext,
} from './types';

const DEV_AUTH_URL =
  'https://dev-api.okhi.io/v5/auth/mobile/generate-auth-token';

const PROD_AUTH_URL = 'https://api.okhi.io/v5/auth/mobile/generate-auth-token';

const SANDBOX_AUTH_URL =
  'https://sandbox-api.okhi.io/v5/auth/mobile/generate-auth-token';

let AUTHORIZATION_URL: string;

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

export const fetchAuthorizationToken = async () => {
  try {
    if (AUTHORIZATION_TOKEN) {
      return AUTHORIZATION_TOKEN;
    }
    if (!ACCESS_TOKEN) {
      throw new Error('invalid access token provided');
    }
    const response = await fetch(AUTHORIZATION_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: ACCESS_TOKEN,
      },
    });
    if (response.status !== 200) {
      throw new Error('invalid auth token');
    }
    const data: { authorization_token: string } = await response.json();
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
  }

  if (ctxt.mode === OkHiMode.SANDBOX) {
    AUTHORIZATION_URL = SANDBOX_AUTH_URL;
  }

  if (ctxt.mode === OkHiMode.PROD) {
    AUTHORIZATION_URL = PROD_AUTH_URL;
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
