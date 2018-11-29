# Install

```sh
# install requirements
# note: we do not instll bson explicitly: https://github.com/py-bson/bson/issues/82
python3 -m pip install -r requirements.txt

 pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple colabo.knalledge

pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple colabo.knalledge==0.0.4
```

# Use

```py
from colabo.knalledge.knalledge_mongo import ColaboKnalledgeMongo
```

# Build

```sh
source /Users/sasha/Documents/data/development/colabo.space/python3_env/bin/activate
python3 setup.py sdist
twine upload --repository testpypi  --config-file ../../../../../colabo.space-infrastructure/publishing/python/.pypirc dist/*

```