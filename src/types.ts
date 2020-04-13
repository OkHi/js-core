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
  phone: string;
}

export interface OkHiCoreConfiguration {
  auth: string;
  context?: OkHiAppContext;
}

export class OkHiException extends Error {
  code: string;
  constructor(error: OkHiError) {
    super(error.message);
    this.name = 'OkHiException';
    this.message = error.message;
    this.code = error.code;
  }
}
