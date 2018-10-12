# Setting up paremeters
#http://linux.die.net/man/1/date
timestamp=`(date +'%Y.%m.%d-%H.%M')`
#timestamp='2016.07.07-04.48'
# cd backend
deploy_folder_base="/var/www/knalledge/src/backend"

echo "[deploy] deploying started"

echo "Command: $0"
if [ ! -z ${1+x} ] && [ $1 == "prod" ];  then
    echo "Command parameter 1: $1"
    deploy_folder_sub="prod"
else
    deploy_folder_sub="beta"
fi

zipname="$deploy_folder_sub-backend-$timestamp.zip"
remote_zip_path="$deploy_folder_base/$deploy_folder_sub/$zipname"
user="mprinc"
new_packages=0

echo "[deploy:$deploy_folder_sub] zipname: $zipname"
echo "[deploy:$deploy_folder_sub] remote_zip_path: $remote_zip_path"
# http://askubuntu.com/questions/306851/how-to-import-a-variable-from-a-script
#  http://stackoverflow.com/questions/5228345/bash-script-how-to-reference-a-file-for-variables
export timestamp
export deploy_folder_base
export deploy_folder_sub
export zipname
export remote_zip_path
export user
export new_packages

# Loading script
my_dir="$(dirname "$0")"
"$my_dir/_build-backend.sh"
"$my_dir/_push-backend.sh"

echo "[deploy:$deploy_folder_sub] deploying finished"
