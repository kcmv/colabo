echo "[push:$deploy_folder_sub] pushing to server started."
echo "[push:$deploy_folder_sub] zip name: $zipname"
echo "[push:$deploy_folder_sub] remote_zip_path: $remote_zip_path"

cd ..

# http://www.gabrielserafini.com/blog/2008/08/19/mac-os-x-voices-for-using-with-the-say-command/
say -v Whisper "provide password!"&

local_zip_path=$zipname
# http://unix.stackexchange.com/questions/105667/upload-file-to-ftp-server-using-commands-in-shell-script
# http://stackoverflow.com/questions/11744547/sftp-to-send-file-with-bash-script
# http://stackoverflow.com/questions/4937792/using-variables-inside-a-bash-heredoc
# sftp
# sftp -v -oIdentityFile=path "$user@knalledge.org" <<EOF
sftp -v "$user@knalledge.org" <<EOF
put $local_zip_path $remote_zip_path
EOF

say -v Whisper "project uploaded! provide password!"&
if [ $new_packages -eq 0 ];  then
    ssh -v "$user@knalledge.org" <<EOF
    cd $deploy_folder_base/$deploy_folder_sub
    unzip $remote_zip_path

    rm -r config/ continuousServer.sh info.txt KnAllEdgeBackend.js models/ modules/ package.json scripts/ tools/

    mv backend_archive/* .
    rm -r backend_archive/

    chmod -R o+rx .
    chmod -R g+wrx .

    cp -r ../../node_modules_backup/tC/* modules/topiChat
    cp -r ../../node_modules_backup/tCK/* modules/topiChat-knalledge
    cp -r ../../node_modules_backup/tools/* tools

    echo "[push:$deploy_folder_sub:remote] pushing to server finished. Pushed file: $zipname"
EOF
else
    echo "[push:$deploy_folder_sub] !!! The scenario for installing new packages is not implemented yet !!!"
fi

echo "[push:$deploy_folder_sub] pushing to server finished. Pushed file: $zipname"

if [ $deploy_folder_sub == "prod" ];  then
cat <<EOF
For TESTING: need to execute this commands on your own:

# Login
ssh mprinc@knalledge.org

# now switch to the root user
su

# for testing
cd /var/www/knalledge/src/backend/prod
status knalledge-b
stop knalledge-b
nodejs KnAllEdgeBackend.js 8888 8060

# for testing
start knalledge-b
status knalledge-b

restart knalledge-b
exit
exit

# you are done!
===========

You need to execute this commands on your own:
======
ssh mprinc@knalledge.org
su
restart knalledge-b
exit
exit
======
EOF
else
cat <<EOF
For TESTING: need to execute this commands on your own:

# Login
ssh mprinc@knalledge.org

# now switch to the root user
su

# for testing
cd /var/www/knalledge/src/backend/beta
status knalledge-b-beta
stop knalledge-b-beta
nodejs KnAllEdgeBackend.js 8889 8061

# for testing
start knalledge-b-beta
status knalledge-b-beta

restart knalledge-b-beta
exit
exit

# you are done!
===========

You need to execute this commands on your own:
======
ssh mprinc@knalledge.org
su
restart knalledge-b-beta
exit
exit
======
EOF
fi

say -v Whisper "I did my part! Now it is your turn oh master!"&
