#! /bin/bash -u
#
echo "[build:$deploy_folder_sub] building started."
echo "[build:$deploy_folder_sub] Zip name: $zipname"
echo "[build:$deploy_folder_sub] Building project ..."

# create a backend copy
echo "[build:$deploy_folder_sub] Creating backend copy ..."
cd ..
rm -r backend_archive
cp -r backend backend_archive

echo "[build:$deploy_folder_sub] Cleaning backend copy ..."

# clean from unnecessary stuff
rm -r backend_archive/node_modules
rm -r backend_archive/modules/topiChat/node_modules
rm -r backend_archive/modules/topiChat-knalledge/node_modules
rm -r backend_archive/tools/node_modules

echo "[build:$deploy_folder_sub] Zipping build into $zipname"
# zip -r -X prod-backend-2016.07.07-1.zip backend_archive
zipcommand="zip -r -X $zipname backend_archive"
# http://stackoverflow.com/questions/4668640/how-to-execute-command-stored-in-a-variable
eval "$zipcommand"

rm -r backend_archive

echo "[build:$deploy_folder_sub] building finished. zipped into: $zipname."
say -v Whisper "Project is built and zipped!"
