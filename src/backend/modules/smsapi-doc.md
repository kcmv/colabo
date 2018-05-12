# User-actions

1. **Help**
2. **Register**
3. **Reply**

## Help

code: "**hlp**"

+ EN: You can interact in CoLaboArthon by sending some of the following codes

## Unrecognized code

+ EN: The code <CODE> is not recognized. Send code 'HELP' to get more info. Some of the existing codes are: 'REG' (for registering) and 'REP' (for replying)

  

> **UNKNOWN CODE**
> curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REGL Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

## Register

code: "**reg**"

### Responses

#### Success

+ EN: You are registered for the CoLaboArthon. Start the poetic dialogue, by replying on verses that inspire you.
+ **Questions**
  + should we put all the prompts here with their number?
  + should we give them example message
+ IT: ""

#### Missing data

##### Name

+ EN: Your name is missing. The registration SMS should be in the format ''REG. First_name Last_name. your_background'"'. E.g: 'REG Marco Poet'
+ IT:

##### Background

- EN: Your background is missing. The registration SMS should be in the format ''REG. First_name Last_name. your_background'"'. E.g: 'REG Marco Poet'
- IT:

> **CORRECT REG:**
> curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+385989813852","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

> **REG with EXTRA SPACES:**
> curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG   Sinisa       poet   ","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

>  **REGISTER**
> curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://api.colabo.space/smsapi'

## Reply

code: "**rep**"

### Responses

#### General

##### non-existing-id

If user tried to reply on an non-existing node.

Response-SMS:

- EN: ***Sorry, you've tried to reply on a text with non-existing ID (<ID_NO>)***
- IT:

#### On the starting prompt

##### Success

+ EN: Success! Your reply will be compared to replies by other poets/artists to continue your dialogue. Please wait for further messages.
+ IT:

> **NORMAL**
> curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REP 2 we have taken the immortality out of their proud hearts, because ...","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'
>
> **REPLY with the Enter**
> curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REP 2 we have taken\nthe immortality out\nof their proud hearts\nbecause ...","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'
>
> **REPLY - long SMS with 2 segments and Enters:**
> curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM2edeeca395fba4df49165e0919f280c2","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM2edeeca395fba4df49165e0919f280c2","FromState":"","SmsStatus":"received","FromCity":"","Body":"REP 1 le nostre tremendamente grandi\nmani\nnon furono grandi\nabbastanza\n\nda proteggerci\nda tremendamente grandi mezzo secolo lunghi coltelli\ncoltelli\n\nfacendo il loro lavoro\nnella preparazione \ndella zuppa dei Balcani\nperché ...","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"2","MessageSid":"SM2edeeca395fba4df49165e0919f280c2","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381642830738","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'
> */

# Push Messages

## Paired for dialogue

+ EN: The ***CoLaboArthon*** has found a poetic pair for you to continue dialogue buy continuation of this verse:
  <VERSE>.
  Instructions how to reply.
+ IT:

# Important

+ some phones don't have "ENTER / NEW LINE"
+ fields - delimiter?
  + ". "
+ to start all the "Push Messages" by: "***CoLaboArthon:*** "
+
