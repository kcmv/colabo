## Python

```sh
cd python

# activate environment
source /Users/sasha/Documents/data/development/colabo.space/python3_env/bin/activate

# [Inline comments for Bash?](https://stackoverflow.com/questions/2524367/inline-comments-for-bash)
# build
python -m grpc_tools.protoc  `# use grpc_tools.protoc plugin` \
-I../protos `# include folder with other necessary proto files (I guess)` \
--python_out=. `# python output folder (*_pb2.py file)` \
--grpc_python_out=. `# grpc python output folder (*_pb2_grpc.py file)` \
../protos/colaboflow/audit.proto `# path to the *.proto file with the description of gRPC service and messages`

python colaboflow_audit_client.py
```
---

Run the server:

```sh
node ./node/colaboflow_audit_server/.js
```

Run the client:

```sh
node ./dynamic_codegen/route_guide/route_guide_client.js --db_path=./dynamic_codegen/route_guide/route_guide_db.json