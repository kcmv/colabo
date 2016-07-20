#! /bin/bash -u
#
echo "[build] building started."
echo "[build] Zip name: $zipname"
echo "[build] Building project ..."
npm run build.prod

# Copying missing fonts
cp ./node_modules/ng2-material/font/MaterialIcons-Regular* dist/prod/css/
mkdir -p dist/prod/fonts/
cp -r ./app/fonts/font-awesome dist/prod/fonts/font-awesome/

echo "[build] Zipping build into $zipname"
zipcommand="zip -r -X $zipname dist/prod"
# http://stackoverflow.com/questions/4668640/how-to-execute-command-stored-in-a-variable
eval "$zipcommand"
echo "[build] building finished. zipped into: $zipname."
say -v Whisper "project is built and zipped!"
