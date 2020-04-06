import { AnyAction } from 'redux';
import { LOGIN, UPDATE_TOKEN } from '../names';
import JwtDecode from 'jwt-decode';

export interface IAccount {
  token?: string;
  refreshToken?: string;
  sub?: string;
  tokenExp?: number;
  rTokenExp?: number;
  iss?: string;
  tenant?: string;
}

export const initAccount = {};

function decodeToken(token: string, refreshToken: string) {
  const { iat: tokenIat, exp: tokenExp, sub, iss, tenant } = JwtDecode(token);
  const { iat: rTokenIat, exp: rTokenExp } = JwtDecode(refreshToken);
  return {
    token,
    refreshToken,
    sub,
    iss,
    tenant,
    tokenIat: tokenIat * 1000,
    tokenExp: tokenExp * 1000,
    rTokenIat: rTokenIat * 1000,
    rTokenExp: rTokenExp * 1000
  };
}

function decodeT(token: string) {
  const { iat: tokenIat, exp: tokenExp, sub, iss, tenant } = JwtDecode(token);
  return {
    token,
    sub,
    iss,
    tenant,
    tokenIat: tokenIat * 1000,
    tokenExp: tokenExp * 1000
  };
}

function auth(state: IAccount = initAccount, action: AnyAction) {
  switch (action.type) {
    case LOGIN:
      return {
        ...action.payload,
        ...decodeToken(action.payload.token, action.payload.refreshToken)
      };

    case UPDATE_TOKEN:
      return {
        ...state,
        ...decodeT(action.payload)
      };
    default:
      return state;
  }
}

export default auth;
