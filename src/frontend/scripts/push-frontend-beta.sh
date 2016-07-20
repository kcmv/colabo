#! /bin/bash -u

# Setting up paremeters
#http://linux.die.net/man/1/date
deploy_folder_base="/var/www/knalledge_frontend"
deploy_folder_sub="beta"

echo "Command: $0"
if [ ! -z ${1+x} ];  then
    echo "Command parameter 1: $1"
fi

# http://stackoverflow.com/questions/3601515/how-to-check-if-a-variable-is-set-in-bash
if [ ! -z ${1+x} ];  then
    zipname=$1
fi
echo "Zip file: $zipname"

remote_zip_path="$deploy_folder_base/$deploy_folder_sub/$zipname"
user="mprinc"

# http://askubuntu.com/questions/306851/how-to-import-a-variable-from-a-script
#  http://stackoverflow.com/questions/5228345/bash-script-how-to-reference-a-file-for-variables
export timestamp
export deploy_folder_base
export deploy_folder_sub
export zipname
export remote_zip_path
export user

# Loading script
my_dir="$(dirname "$0")"
"$my_dir/_push-frontend.sh"
