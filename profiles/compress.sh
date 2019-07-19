#!/bin/bash

zip -r Archive.zip $1.js node_modules -x "*.DS_Store"
aws lambda update-function-code --function-name $2 --zip-file fileb://Archive.zip #--publish


