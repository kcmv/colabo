# Intro

This is a backend part of the `@colabo-media/b-upload` puzzle

It is responsible for uploading media files to the server

# Preparation

```sh
mkdir -p src/backend/apps/colabo-space/dist/dist/uploads/
echo "Hello upload boy!" > ./info.txt
curl -i -X POST -H "Content-Type: multipart/form-data" -F "avatar=@./info.txt" http://localhost:8001/upload/
cat src/backend/apps/colabo-space/dist/uploads/avatar-*.txt
```
