# Intro

This is a backend part of the `@colabo-media/b-upload` puzzle

It is responsible for uploading media files to the server

# Preparation

NGINX
```yml
# https://www.cyberciti.biz/faq/linux-unix-bsd-nginx-413-request-entity-too-large/
client_max_body_size 2M;
```

```sh
mkdir -p src/backend/apps/colabo-space/dist/dist/uploads/
echo "Hello upload boy!" > ./info.txt
# TODO: add additional parameters
curl -i -X POST -H "Content-Type: multipart/form-data" -F "avatar=@./info.txt" http://localhost:8001/upload/
cat src/backend/apps/colabo-space/dist/uploads/avatar-*.txt
```
