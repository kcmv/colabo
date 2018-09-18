#!/usr/bin/python
# -*- coding: utf-8 -*-
#............  load modules   ............#
import re, csv, sys, os, glob, string
#reload(sys)  
#sys.setdefaultencoding('utf8')
from copy import deepcopy
from collections import Counter
import operator
#import pandas as pd
import numpy as np
#import fasttext #nope, not enought labels for good training...
#from sklearn.manifold import TSNE
import nltk
from nltk.tag import pos_tag
from nltk import *
from nltk.corpus import stopwords
stopwords = stopwords.words("english")
stop_words_set = set(stopwords)
stop_words_set.add('|')
from nltk.stem.snowball import SnowballStemmer
stemmer = SnowballStemmer("english")
from nltk.stem.lancaster import LancasterStemmer
from nltk.tree import Tree
from sklearn.metrics import average_precision_score, jaccard_similarity_score
import gensim
from gensim import utils, corpora, models, similarities 
from gensim.models import Word2Vec#, Doc2Vec
#from gensim.models.doc2vec import TaggedDocument
#from gensim.models.doc2vec import LabeledSentence
from gensim.similarities.docsim import Similarity
#import gensim.models.doc2vec
print 'imported'
from gensim.models import Word2Vec
#model = gensim.models.KeyedVectors.load('C:\Users\lazar\Desktop\en_1000_no_stem\en.model')
#model = Word2Vec.load('D:\glove_WIKI') # glove model
#model = Word2Vec.load('GoogleNews-vectors-negative300.bin') # word2vec model
model = gensim.models.KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)
nl = """

"""
verses = """Non so Europa cosa sia diventata.
Persa cavalcando un toro divino;
nuotando in mare, in stelle è mutata.


Il suo ruolo sembra ora un fantasmino:
dal ventre sudorientale è spuntata.


Negli occhi dei migranti, persino:
fiamme rigenerative in mortali
onde. Ci guardano come immortali.

 
Nata nei commerci, unificare
l’intero abbraccio mediterraneo
con un linguaggio, razionalizzare.


Energia, gaiser intimo, istantaneo:
“rintraccia te stesso!” Senza osservare
Vaga nell’animo sottocutaneo


Di chi non vuol renderla materiale.
Sii un’emozione, ormone pineale.


Sii Mi specchio.
Trovo un me nuovo, improvviso,
tra i vetri di un vecchio
tram e di auto che corrono. Un viso
estraneo il mio, pieno
di tensione, quella vera.
 

Mi rispecchio.
E scambio
parole, come euro in dinara,
non ne capisco ancora il valore:
sono un filtro, che frena ogni forte
passione.
Solo una fredda essenza
                               passa.
 

Ma insisto
in tutte queste migliaia
                               menjačnica.
 

Terra di cammini,
passaggi. Piena
di monete differenti.


Belgrado, Occidente dei Balcani;
ogni insegna sboccia gridando
“siamo vivi”.


Io
ho
quattro
piedi
tremendamente
grandi


Ho quattro piedi tremendamente grandi!


So
che non puoi vedere
il secondo paio

Lo sto nascondendo 
alle mie spalle


Non guardarmi dietro le spalle!
Mi sento male quando le guardi


Guarda!
Lui sta ridendo
sta vedendo
dietro le mie spalle

Tu no?!
Tu guardi
oltre?


Ho dovuto nasconderli
altrimenti non avresti visto
il mare dei miei occhi
oceano 

Non avresti potuto ascoltare
la poesia delle mie labbra
fiume 
avresti solo visto
quattro enormi
piedi


il mio solo amore
solo ascoltandomi
felicemente
correndo verso lei
i miei piedi stanno suonando come
boom bum bum bum 
i miei piedi stanno correndo come
Boom bum bum bum
fanno anche lei
CORRERE! -
boom bum bum
CORRI VIA
da me
BUM!


Questo cuore tremendamente grande
non fu grande abbastanza 
quell’Agosto

quando la mia coraggiosa nazione Balcanica
di liberi
Uomini di frontiera
Крајишници
divennero una nazione
di rifugiati

Bum Bam Tu Bo
Baaaalcaaaaani!

Balcani!


Il mio cuore è tremendamente grande
perché 
è necessario un cuore tremendamente grande
per essere
abile 
ad amare il futuro
spuntando dal passato
che ha bisogno
di piedi tremendamente grandi
per correre via da


Un rifugiato
con un tremendamente
grande 
Cuore
Boom Bum Tu Ba ...


Un cuore normale

non avrebbe
potuto
avere
abbastanza
sangue

per attraversare
tutti i Paesi
superare
tutte le distanze
siamo sopravvissuti anche
per amare
tutte le persone 
che incontrai
ma che non ho mai avuto intenzione
di incontrare 
e non dimenticare
tutte le mie persone
che furono
sostituite 

da loro


I nostri occhi

sono terribilmente enormi
Le nostre lacrime

sono tremendamente grandi
perché 

le nostre tremendamente grandi
mani
non furono grandi
abbastanza

da proteggerci
da tremendamente grandi mezzo secolo lunghi coltelli
coltelli


Ognuno
vorrebbe
dimenticare
uomini con cuori tremendamente grandi
"""

s1 = 'now all apple has to do is get swype on the iphone and it will be crack iphone that is'.split()
s2 = 'apple will be adding more carrier support to the iphone 4s just announced'.split()
distance_prenorming = model.wmdistance(s1, s2)
model.init_sims()  # calc unit-normed vectors alongside original raw vectors
distance_postnorming = model.wmdistance(s1, s2)
model.init_sims(replace=True)  # replace raw vectors in-place with unit-normed ones
distance_norms_only = model.wmdistance(s1, s2)

#print((distance_prenorming, distance_postnorming, distance_norms_only))
## shows: (1.8161385991456382, 1.8161385991456382, 0.8207403953201577)
#exit()
#assert gensim.models.doc2vec.FAST_VERSION > -1, "This will be painfully slow otherwise"
#model = gensim.models.KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)
#from gensim.models import word2vec
#model = word2vec.Word2Vec.load('C:\Users\lazar\Desktop\_codes\word_vectors_enwik9_text.model')
#model.init_sims(replace=True)  # Normalizes the vectors in the word2vec class.



#............  methods   ............#

#def predict(text):return fasttext(text)#how many labels in total?

def flatten(lst):
    newlst = []
    for item in lst:
        if isinstance(item, basestring):
            item = [item]
        else:
            raise TypeError#: unhashable type: 'list'
        for i in item:
            newlst.append(i)
    print newlst
    return list(set(newlst))

def ngrams(seq, n):
    return [' '.join([s.decode('utf-8', 'ignore') for s in seq[i:i+n]]) for i in range(1+len(seq)-n)]

def is_ascii(s):
    return all(ord(c) < 128 for c in s)

def preprocess(text):
    tokens = utils.simple_preprocess(text.lower())
    new_tokens = []
    for token in tokens:
        if is_ascii(token):
            new_tokens.append(token)
    return new_tokens
    #return [lemmas[k] if lemmas.has_key(k) else k for k in new_tokens]
    
def trim_stop(w):
    l = w.split()
    while len(l)>0 and l[0] in stop_words_set:
        if len(l) == 1:
            l = []
        else:
            l = l[1:]
    while  len(l)>0 and l[-1] in stop_words_set:
        if len(l) == 1:
            l = []
        else:
            l = l[:-1]
    return ' '.join(l)
    
def concepts(preprocessed_tokens, n=2, l=1000):
    tmp = Counter([phrase for phrase in ngrams(preprocessed_tokens, n) if not (set(phrase.split()) & stop_words_set) and not (set(phrase) & set('1234567890'))]).most_common(20)
    return [(trim_stop(k), v) for k, v in tmp if v > (int)((6. / n)*(l / 100.))]

def tokenize_and_stem(text):
    tokens = [word for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
    filtered_tokens = []
    for token in tokens:
        if re.search('[a-zA-Z]', token):
            filtered_tokens.append(token)
    stems = [stemmer.stem(t) for t in filtered_tokens]
    return stems

def tokenize_only(text):
    tokens = [word.lower() for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
    filtered_tokens = []
    for token in tokens:
        if re.search('[a-zA-Z]', token):
            filtered_tokens.append(token)
    return filtered_tokens

def strip_proppers(text):
    tokens = [word for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent) if word.islower()]
    return "".join([" "+i if not i.startswith("'") and i not in string.punctuation else i for i in tokens]).strip()

def strip_proppers_POS(text):
    tagged = pos_tag(text.split())
    non_propernouns = [word for word,pos in tagged if pos != 'NNP' and pos != 'NNPS']
    return non_propernouns

def wmd(a, b):
    return model.wmdistance(a, b)

def similar_wmd_query(items, query):#remove stopwords before passing codes here!
    wmds = [(item, wmd(item, query)) for item in items]
    sorted_sims = sorted(wmds, key=operator.itemgetter(1))
    return [(e, s) for e, s in sorted_sims if s <> 'inf' and s < 2.0]#[0][0] list in the code and cut above some threshold

lemmas = [a.strip().split('\t') for a in open('lemmatization-en.txt').readlines()]
lemmas = [(b, a) for a, b in lemmas]
lemmas = dict(lemmas)

def d():
    dialect = "\t"
    fn = 'FIPMen.csv'
    with open(fn, 'r') as fs:
        dialect = csv.Sniffer().sniff(fs.readline().replace("\xef\xbb\xbf",'').strip())
    reader = csv.reader(open(fn, 'rb'),delimiter=dialect.delimiter)
    headers = reader.next()
    authors = {}
    rauthor = {}
    for row in reader:
        line = row[1].replace("\n", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ").strip()
        authors[row[2]] = line
        rauthor[line] = row[2]
        
    verses = [(verse, [lemmas[w] if lemmas.has_key(w) else w for w in preprocess(verse) if w not in stop_words_set]) for verse in rauthor.keys()]#verses.split(nl)
    versesd = dict(verses)
    norms = dict([(''.join(j),k) for k,j in verses])
    candidates = []
    for orig, norm in verses:
        for e, s in similar_wmd_query(versesd.values(), norm):
            candidates.append((rauthor[orig], str(s), rauthor[norms[''.join(e)]], norms[''.join(e)], orig))
    sorted_candidates = sorted(candidates, key=operator.itemgetter(1))
    paired = set()
    for a1, s, a2, v, o in sorted_candidates:
        if a1 == a2:continue
        if a1 in paired:continue
        if a2 in paired:continue
        paired.add(a1)
        paired.add(a2)
        print a1, o.replace("\\n", " / ")
        print a2, v.replace("\\n", " / ")
        print s
        print
