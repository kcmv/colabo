# Python

```sh
sudo apt-get install python-pip
python -m pip install --upgrade pip
sudo -H python -m pip install virtualenv
cd /var/colabo
# create
virtualenv colabo-env

sudo chown -R sasha colabo-env/

source /var/colabo/colabo-env/bin/activate
python -m pip install grpcio
python -m pip install grpcio-tools
python -m pip install flask
python -m pip install pika
deactivate
```
