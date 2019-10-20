import { UPDATE_LOCALE } from '../names';
import * as R from 'ramda';
import { AnyAction } from 'redux';
import defaultTranslations from '../../I18n/defaultTranslations.json';

export type Translation = Record<allLocales, string>;
export type allLocales = 'en' | 'el';

export interface Translations {
  [key: string]: Translation;
}

export interface II18n {
  lang: allLocales;
  translations: Translations;
  availableLangs: Array<string>;
}

export const initI18n = {
  lang: 'en' as allLocales,
  translations: defaultTranslations,
  availableLangs: ['en', 'el']
};

const i18n = (state: II18n = initI18n, action: AnyAction): II18n => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_LOCALE:
      return R.assoc('lang', payload, state);
    default:
      return state;
  }
};

export default i18n;
