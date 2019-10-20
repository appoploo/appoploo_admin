import * as fs from 'fs';
import { join } from 'path';

const autoFile = fs.readFileSync(join(__dirname, 'i18n_auto_list'), 'utf8');

const defaultTranslations = require('./defaultTranslations.json');

const translations: Array<string> = [...autoFile.split('\n')];

const i18n = JSON.parse(`{
      ${translations
        .reduce((acc, key: string) => {
          return acc + ` \n"${key}": { "el": "${key}", "en": "${key}" },`;
        }, ``)
        .slice(0, -1)}}`);

fs.writeFile(
  join(__dirname, 'translationsKeys.json'),
  JSON.stringify({ ...i18n, ...defaultTranslations }),
  () => {}
);
