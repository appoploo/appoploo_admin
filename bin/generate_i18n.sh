#!/bin/bash

echo "generate auto list"
npm run generateI18nList

echo "generate Json files"
npx tsc bin/generatei18nJson && node bin/generatei18nJson.js

echo "sync i18nJson"
rsync -avz bin/translationsKeys.json  src/I18n/defaultTranslations.json

echo "clear tmp file"
rm bin/generatei18nJson.js

echo "complete!!!"
