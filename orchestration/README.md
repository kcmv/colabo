# Orchestration Services

## Rabbitmq

run the server:

```sh
/usr/local/sbin/rabbitmq-server
```

## Similar verses

servis:


```sh
ssh -i ~/.ssh/sasha-iaas-no.pem mprinc@158.37.63.53
# start similarity_functions.py
python3 -m pip install virtualenv
cd colabo
python3 -m virtualenv colabo-env
source ./colabo-env/bin/activate
# or:
# source /var/colabo/colabo-env/bin/activate

# or (OSX)
source /Users/sasha/Documents/data/development/colabo.space/colabo/orchestration/colabo-env/bin/activate
rm /home/mprinc/nohup.out

# before
# nohup python similarity_functions.py &
# ZEKO
# python similarity_functions_wrapper_colaboflow.py
nohup python similarity_functions_wrapper_colaboflow.py &
# Lazin PyRPC
# python similarity_functions_wrapper_pyrpc.py
nohup python similarity_functions_wrapper_pyrpc.py &
# NEW (integrated wrappers becaus of bugs)
python similarity_functions.py

cat /home/mprinc/nohup.out
ps -ax | grep 'similarity_functions'
# use `top` to check if it finished, if usage for the service gets close to 0% it is done?! :)
# kill
kill -TERM <PID>
```

client:

```sh
# start sv_client.py <map_id>
# old?
python sv_client.py 5b49e7f736390f03580ac9a7
# new
python sv_client.py 5b96619b86f3cc8057216a03 5b9fbde97f07953d41256b32 1
```