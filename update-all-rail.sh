#!/bin/bash

cd albums; ./compress.sh api-albums Rail-PrivateAlbums-mobilehub-1247959479; cd ..;
cd friends; ./compress.sh api-friends Rail-Friends-mobilehub-1247959479; cd ..
cd search; ./compress.sh api-search Rail-Search-mobilehub-1247959479; cd ..;
cd notifications; ./compress.sh api-notifications Rail-Notifications-mobilehub-1247959479; cd ..;
cd profiles; ./compress.sh api-profile Rail-Profiles-mobilehub-1247959479; cd ..;
cd accounts; ./compress.sh api-account Rail-Accounts-mobilehub-1247959479; cd ..;
cd settings; ./compress.sh api-settings Rail-UserSettings-mobilehub-1247959479; cd ..;

