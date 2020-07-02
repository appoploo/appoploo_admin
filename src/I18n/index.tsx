import React from 'react';
const translations = require('./defaultTranslations.json');

export type Translate = (key: string) => string;

const I18n = React.createContext<Translate>(
  (key) => translations[key]?.el || key
);

export default I18n;
