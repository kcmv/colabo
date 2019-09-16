# Info

This domain supports talking to services/workers across AMQP messaging broker. 

It is in a way leftover of the workaround before full cFlow is implemented. But it also is a necessary mechanism for queuing requests, executing them and returning back results to correct consumer.

It has to be **redone**, rethought, and implemented deeper in cFlow, without depending on AMQP, being separate solution.

We can and should support various protocols of communication, but queueing should be a separate mechanism in such sense.