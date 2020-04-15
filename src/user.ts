import axios from 'axios';
import OkHiCore from './core';
import {
  OkHiAccessScope,
  OkHiException,
  OkHiErrorCodes,
  OkHiErrorMessages,
} from './types';

const ANONYMOUS_SIGNIN_ENDPOINT = '/auth/anonymous-signin';

export default class User {
  private readonly core: OkHiCore;
  private readonly ANONYMOUS_SIGNIN_URL: string;
  constructor(core: OkHiCore) {
    this.core = core;
    this.ANONYMOUS_SIGNIN_URL = `${this.core.getBaseUrl()}${ANONYMOUS_SIGNIN_ENDPOINT}`;
  }

  anonymousSignInWithUserId = async (
    userId: string,
    scopes: Array<OkHiAccessScope>
  ) => {
    try {
      const { ANONYMOUS_SIGNIN_URL } = this;
      const { data } = await axios.post<{ authorization_token: string }>(
        ANONYMOUS_SIGNIN_URL,
        {
          scopes,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Token ${this.core.getAccessToken()}`,
          },
        }
      );
      return data.authorization_token;
    } catch (error) {
      throw new OkHiException({
        code: OkHiErrorCodes.unauthorized,
        message: OkHiErrorMessages.unauthorized,
      });
    }
  };

  anonymousSignWithPhoneNumber = async (
    phone: string,
    scopes: Array<OkHiAccessScope>
  ) => {
    try {
      const { ANONYMOUS_SIGNIN_URL } = this;
      const { data } = await axios.post<{ authorization_token: string }>(
        ANONYMOUS_SIGNIN_URL,
        {
          scopes,
          phone,
        },
        {
          headers: {
            Authorization: `Token ${this.core.getAccessToken()}`,
          },
        }
      );
      return data.authorization_token;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new OkHiException({
          code: OkHiErrorCodes.invalid_phone,
          message: OkHiErrorMessages.invalid_phone,
        });
      }
      throw new OkHiException({
        code: OkHiErrorCodes.unauthorized,
        message: OkHiErrorMessages.unauthorized,
      });
    }
  };
}
