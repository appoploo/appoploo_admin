import React from 'react';

export type Translate = (key: string) => string;

const I18n = React.createContext<Translate>(key => key);

export default I18n;
