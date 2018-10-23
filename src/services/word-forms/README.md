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
# it will report:
# `socket.error: [Errno 111] Connection refused`
# until the service is started completely
```