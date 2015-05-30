cd /var/www/knalledge
rm /var/www/knalledge/src/frontend/app/js/config/config.env.js
git init
git remote add -f origin https://github.com/mprinc/KnAllEdge
git pull origin master

cp /var/www/knalledge/src/frontend/app/js/config/config.env.js /var/www/knalledge/config.env.js
joe /var/www/knalledge/config.env.js
rm /var/www/knalledge/config.env.js
cp /var/www/knalledge/config.env.js /var/www/knalledge/src/frontend/app/js/config/config.env.js
rm /var/www/knalledge/src/frontend/app/js/config/config.env.js
joe /var/www/knalledge/src/frontend/app/js/config/config.env.js
copy node_modules
