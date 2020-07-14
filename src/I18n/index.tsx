import React from 'react';
import { useSelector } from 'react-redux';
import { IReduxStore } from '../redux/reducers';
const translations = require('./defaultTranslations.json');

export type Translate = (key: string) => string;

const I18n = React.createContext<Translate>(
  (key) => translations[key]?.el || key
);

export const I18nProvider = (props: any) => {
  const locale = useSelector((state: IReduxStore) => state.i18n.lang);
  const t = (key: string) => translations[key]?.[locale] || key;
  return <I18n.Provider value={t}>{props.children}</I18n.Provider>;
};

export default I18n;
