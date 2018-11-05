# Info

https://github.com/gutfeeling/word_forms

# Python3

```sh
python3 --version
sudo apt install python3-pip
pip3 --version
pip3 install --upgrade pip3
pip3 install virtualenv
cd /var/colabo
virtualenv colabo-env-py3
source /var/colabo/colabo-env-py3/bin/activate
pip3 install nltk
# https://github.com/gutfeeling/word_forms
cd /var/repos/word_forms/
python3 setup.py install
touch /var/colabo/log_words.txt
python3 word_stuff.py
deactivate
```

# Running the Word-Forms

```sh
# login from local terminal
ssh -i ~/.ssh/sasha-iaas-no.pem mprinc@158.39.75.130
ssh -i ~/.ssh/sinisha-iaas-no.pem sir@158.39.75.130
# get in the folder
cd /var/colabo/
# activate python environment with necessary packages, etc
source /var/colabo/colabo-env/bin/activate

# data created by
# https://github.com/gutfeeling/word_forms
/var/colabo/word_forms

# service backend
nohup python word_stuff.py &
ps -ax | grep word_stuff.py
kill -TERM pid

# python sv_client.py <word> <type>
# <type>: synonyms, word_forms, hypernyms
# service client
python wordforms.py dog synonyms
python3 wordforms.py dog synonyms
python3 wordforms.py anticipation synonyms
# it will report:
# `socket.error: [Errno 111] Connection refused`
# until the service is started completely
```