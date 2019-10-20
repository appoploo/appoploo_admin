import { SET_ERRORS } from '../names';
import { AnyAction } from 'redux';

export type IErrors = Record<string, string>;

export const initErrors = {};

const errors = (state: IErrors = initErrors, action: AnyAction) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ERRORS:
      return payload;

    default:
      return state;
  }
};

export default errors;
