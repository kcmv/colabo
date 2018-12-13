# Initial 

```sh
python3 -m pip install --upgrade -r requirements.txt
```

# Build

## In Test Repo

```sh
# build source distribution
python3 setup.py sdist

# upload package (witch config file)
twine upload --repository testpypi  --config-file ../../../../../../../colabo.space-infrastructure/publishing/python/.pypirc dist/*
```

Check: https://test.pypi.org/project/colabo.flow.audit/

Test install:

```sh
# create a test environment
python3 -m virtualenv p3test_env
# get to the test environment
source p3test_env/bin/activate

# the latest
pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple colabo.flow.audit

# upgrade AFTER installing
pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple --upgrade colabo.flow.audit

# a speciffic one
pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple colabo.flow.audit==0.0.4
```

## In The Real Repo

```sh
# build source distribution
python3 setup.py sdist

# upload package (witch config file)
twine upload --repository pypi  --config-file ../../../../../../../colabo.space-infrastructure/publishing/python/.pypirc dist/*
```

Check: https://pypi.org/project/colabo.flow.audit/

Test install:

```sh
# get to the test environment
source <test_env>/bin/activate

# the latest
pip install colabo.flow.audit

# check version
pip show colabo.flow.audit

# upgrade AFTER installing
pip install --upgrade colabo.flow.audit

# a speciffic one
pip install colabo.flow.audit==0.0.4
```
