# rpyc client
import sys
import rpyc

rpcConn = rpyc.connect("158.37.63.127", 12374)
rpcService = rpcConn.root

# do stuff over rpyc
if __name__ == "__main__":
    word = sys.argv[1]
    what = sys.argv[2]
    if what == 'word_forms':
        r = rpcService.get_word_forms(word)
    if what == 'synonyms':
        r = rpcService.get_synonyms(word)
    if what == 'hypernyms':
        r = rpcService.get_hypernyms(word)
    print (r)
