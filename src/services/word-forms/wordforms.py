# rpyc client
import sys
import rpyc

conn = rpyc.connect("158.37.63.127", 12374)
c = conn.root

# do stuff over rpyc
if __name__ == "__main__":
    word = sys.argv[1]
    what = sys.argv[2]
    if what == 'word_forms':
        r = c.get_word_forms(word)
    if what == 'synonyms':
        r = c.get_synonyms(word)
    if what == 'hypernyms':
        r = c.get_hypernyms(word)
    print (r)
