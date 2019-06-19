# Initial 

```sh
python3 -m pip install --upgrade -r requirements.txt
```

# Build Proto

```sh
cd python/colabo/flow/go

# activate environment
source /Users/sasha/Documents/data/development/colabo.space/python3_env/bin/activate

# [Inline comments for Bash?](https://stackoverflow.com/questions/2524367/inline-comments-for-bash)
# build
python -m grpc_tools.protoc  `# use grpc_tools.protoc plugin` \
-I../protos `# include folder with other necessary proto files (I guess)` \
--python_out=. `# python output folder (*_pb2.py file)` \
--grpc_python_out=. `# grpc python output folder (*_pb2_grpc.py file)` \
../protos/colabo/flow/go/go.proto `# path to the *.proto file with the description of gRPC service and messages`
```

# Build Package

## In Test Repo

```sh
# build source distribution
python3 setup.py sdist

# upload package (witch config file)
twine upload --repository testpypi  --config-file ../../../../../../../colabo.space-infrastructure/publishing/python/.pypirc dist/*
```

Check: https://test.pypi.org/project/colabo.flow.go/

Test install:

```sh
# create a test environment
python3 -m virtualenv p3test_env
# get to the test environment
source p3test_env/bin/activate

# the latest
pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple colabo.flow.go

# upgrade AFTER installing
pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple --upgrade colabo.flow.go

# a speciffic one
pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple colabo.flow.go==0.0.4
```

## In The Real Repo

```sh
# build source distribution
python3 setup.py sdist

# upload package (witch config file)
twine upload --repository pypi  --config-file ../../../../../../../colabo.space-infrastructure/publishing/python/.pypirc dist/*
```

Check: https://pypi.org/project/colabo.flow.go/

Test install:

```sh
# get to the test environment
source <test_env>/bin/activate

# the latest
pip install 


# check version
pip show colabo.flow.go

# upgrade AFTER installing
pip install --upgrade colabo.flow.go

# a speciffic one
pip install colabo.flow.go==0.0.4
```
