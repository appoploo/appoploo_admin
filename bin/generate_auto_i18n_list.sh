#!/bin/bash

# concat all in tmp file
echo "create tmp file"
cat $(find src/* -type f) > bin/tmp

KEY_PREFIX="int\..*"

echo "find all keys"
cat bin/tmp |  grep $KEY_PREFIX | sed  -e 's/\x22/\n/g' -e 's/ /\n/g' -e 's/.*+int/\nint/g' -e 's/.*-int/\nint/g' -e 's/\x27/\n/g' -e 's/\x60/\n/g'  | grep $KEY_PREFIX | sort -u  > bin/i18n_auto_list

echo "remove template literals lines"
sed -i '/\$/d' bin/i18n_auto_list

echo "clear tmp file"
rm bin/tmp