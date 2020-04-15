export type OkHiAccessScope = 'verify' | 'address' | 'checkout' | 'profile';

export interface OkHiAuth {
  clientKey: string;
  branchId: string;
}

export const OkHiMode = {
  SANDBOX: 'sandbox',
  PROD: 'prod',
  DEV: 'dev',
};

export const OkHiPlatformType = {
  WEB: 'web',
  ANDROID: 'android',
  IOS: 'ios',
  HYBRID: 'hybrid',
  DESKTOP: 'desktop',
};

export const OkHiIntergrationType = {
  OKHI: 'okhi',
  EXTERNAL: 'external',
};

export interface OkHiBaseContext {
  mode?: string;
  platform?: { name: string };
  developer?: { name: string };
}

export interface OkHiAppContext extends OkHiBaseContext {
  app?: { name?: string; version?: string; build?: number };
}

export interface OkHiContext extends OkHiBaseContext {
  library?: { name: string; version: string };
  container?: { name?: string; version?: string; build?: number };
}

export interface OkHiError {
  code: string;
  message: string;
}

export interface OkHiLocation {
  id?: string;
  token?: string;
  placeId?: string;
  plusCode?: string;
  propertyName?: string;
  streetName?: string;
  title?: string;
  subtitle?: string;
  directions?: string;
  otherInformation?: string;
  url?: string;
  createdAt?: string;
  photo?: string;
  geoPoint?: {
    lat: number;
    lon: number;
  };
  streetView?: {
    panoId: string;
    url: string;
  };
}

export interface OkHiUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface OkHiCoreConfiguration {
  auth: string;
  context?: OkHiAppContext;
}

export const OkHiErrorCodes = {
  unauthorized: 'unauthorized',
  network_error: 'network_error',
  invalid_configuration: 'invalid_configuration',
  invalid_phone: 'invalid_phone',
  unknown_error: 'unknown_error',
};

export const OkHiErrorMessages = {
  unauthorized: 'Invalid authorization credentials provided',
  network_error: 'Unable to connect to OkHi servers',
  invalid_configuration: 'Invalid configuration provided',
  invalid_phone:
    'Invalid phone number provided. Please make sure its in MSISDN standard format',
  unknown_error: 'Something went wrong',
};

export class OkHiException extends Error {
  code: string;
  constructor(error: OkHiError) {
    super(error.message);
    this.name = 'OkHiException';
    this.message = error.message;
    this.code = error.code;
  }
}
