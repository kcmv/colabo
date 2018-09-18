#!/usr/bin/python
# -*- coding: utf-8 -*-
#............  load modules   ............#


#http://sci-hub.tw/10.1109/ICALT.2015.108
#http://sci-hub.tw/10.1109/ICACCI.2017.8126064

#from colabo_db import *

import re, csv, sys, os, glob, string
import pymongo, codecs
from pymongo import MongoClient
#reload(sys)  
#sys.setdefaultencoding('utf8')
from copy import deepcopy
from collections import Counter, OrderedDict
import operator
#import pandas as pd
import numpy as np
#import fasttext #nope, not enought labels for good training...
#from sklearn.manifold import TSNE
import nltk
from nltk.tag import pos_tag
from nltk import *
#from nltk.corpus import stopwords
#stopwords = stopwords.words("english")
stop_words_set = set(u"""baš
bez
biće
bio
biti
blizu
broj
dana
danas
doći
dobar
dobiti
dok
dole
došao
drugi
duž
dva
često
čiji
gde
gore
hvala
ići
iako
ide
ima
imam
imao
ispod
između
iznad
izvan
izvoli
jedan
jedini
jednom
jeste
još
juee
kad
kako
kao
koga
koja
koje
koji
kroz
mali
manji
misli
mnogo
moći
mogu
mora
morao
naæi
naš
negde
nego
nekad
neki
nemam
nešto
nije
nijedan
nikada
nismo
ništa
njega
njegov
nje
njih
njih
oko
okolo
ona
onaj
oni
ono
osim
ostali
otišao
ovako
ovamo
ovde
ove
ovo
pitati
početak
pojedini
posle
povodom
praviti
pre
preko
prema
prvi
staviti
radije
sada
smeti
šta
stvar
stvarno
sutra
svaki
sve
svim
svugde
točno
tada
taj
takoðe
tamo
tim
ueinio
ueiniti
umalo
unutra
upotrebiti
uzeti
vaš
veæina
veoma
video
više
zahvaliti
zašto
zbog
želeo
želi
znati
""".split())
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

from gensim.models import Word2Vec
from gensim.models import FastText
#model = gensim.models.KeyedVectors.load('C:\Users\lazar\Desktop\en_1000_no_stem\en.model')
#model = Word2Vec.load('D:\glove_WIKI') # glove model
#model = Word2Vec.load('C:\Users\lazar\Desktop\GoogleNews-vectors-negative300.bin') # word2vec model
from stemmerByNikola import *

print 'imported part 1 ...'

class Sentences(object):
    def __init__(self, filename):
        self.filename = filename
 
    def __iter__(self):
        for line in open(self.filename):
            yield line.split('\t')[1].split()

test = False
# test = True
if test:
    print 'testing, loading test model ...'
    #sentences = Sentences('srp-rs_web_2016_1M-sentences.txt')
    sentences = Sentences('srp-rs_web_2016_30K-sentences.txt')
    model = gensim.models.Word2Vec(sentences)
    #model.wv.save_word2vec_format('srp.sent.model.txt', binary=False)
else:
    print 'not testing, loading real model ...'
    model = gensim.models.KeyedVectors.load_word2vec_format('wiki.sr.vec') # glove model

print 'imported part 2 ...'

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

s1 = 'Sada je sve što jabuka treba da uradi je da dobiješ svipe na iPhoneu i da će biti pukotina iphone-a'.split()
s2 = 'Apple će dodati još više podrške za mobilne uređaje koji su samo objavili iphone 4s'.split()
distance_prenorming = model.wmdistance(s1, s2)
model.init_sims()  # calc unit-normed vectors alongside original raw vectors
distance_postnorming = model.wmdistance(s1, s2)
model.init_sims(replace=True)  # replace raw vectors in-place with unit-normed ones
distance_norms_only = model.wmdistance(s1, s2)

print 'imported all.'

print((distance_prenorming, distance_postnorming, distance_norms_only))
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

#lemmas = [a.strip().split('\t') for a in open('lemmatization-en.txt').readlines()]
#lemmas = [(b, a) for a, b in lemmas]
#lemmas = dict(lemmas)



client = MongoClient('mongodb://158.39.75.120:27017')
db = client['KnAllEdge']
#print pymongo.database.Database.collection_names(db)
from bson import ObjectId

#db.create_collection('Reduced_Cluster')
#summarycollection = db['Reduced_Cluster']
#summarycollection.remove()

#from mongo console:
#db.knodes.createIndex({name:"text",goal:"text",desc:"text"}, {weights:{name:10, goal:5,desc:1}})

def get_users(q='', mid=''):
    users = {}
    collection = db['knodes']
    id_ = None
    if len(q)==24 and ' ' not in q and set(q) - set('1234567890abcdef') == set([]):
        id_ = q.strip()
    if id_:docs = collection.find({'_id': ObjectId(id_), 'type':"rima.user", "mapId" : ObjectId(mid)})
    else:docs = collection.find({'type':"rima.user", "mapId" : ObjectId(mid)})
    for doc in docs:
        if doc['name']:
            users[doc['_id']] = (doc['_id'], doc['name'], doc['dataContent']['email'])
    return users

def get_all_users(mid):
    return get_users('', mid);

def get_sdgs(q = '', mid=''):
    sdgs = {}
    collection = db['knodes']
    if q:docs = collection.find({'$text': {'$search': q}, 'type':"const.sdgs.sdg", "mapId" : ObjectId(mid)}, {'score': {'$meta': "textScore"}}).sort({'score':{'$meta':"textScore"}})
    else:docs = collection.find({'type':"const.sdgs.sdg"})
    for doc in docs:
        if doc['name']:
            sdgs[doc['_id']] = (doc['_id'], doc['name'], doc['dataContent']['goal'], doc['desc'])
    return sdgs

def get_all_sdgs(mid):
    return get_sdgs('', mid)

def get_sdgs_for_query(q, mid):
    return get_sdgs(q, mid)

def get_ideas(q = '', mid='', what="rima.user.dream", runda=-1):
    # knodes from the DB where the {mapId == MAP_ID} && {iAmId == AID} && {type == 'topiChat.talk.chatMsg'}
    ideas = {}
    id_ = None
    if len(q)==24 and ' ' not in q and set(q) - set('1234567890abcdef') == set([]):
        id_ = q.strip()
    collection = db['knodes']
    if not q:docs = collection.find({'type':what, "mapId" : ObjectId(mid)})
    elif id_:
        if runda < 0:
            docs = collection.find({'type':what, "mapId" : ObjectId(mid)})#'iAmId': ObjectId(q), 
        else:
            docs = collection.find({'type':what, "mapId" : ObjectId(mid), "dataContent.dialoGameReponse.playRound" : runda}) # 'iAmId': ObjectId(q), , '_id': {'$ne': q}
    else:docs = collection.find({'$text': {'$search': q}, 'type':what, "mapId" : ObjectId(mid)}, {'score': {'$meta': "textScore"}}).sort({'score':{'$meta':"textScore"}})
    for doc in docs:
        if doc['name']:
            ideas[doc['_id']] = (doc['iAmId'], doc['_id'], doc['name'])#iAmId is user id
    return ideas

def get_all_ideas(mid):
    return get_ideas('', mid)

def get_ideas_for_query(q, mid):
    return get_ideas(q, mid)

def get_ideas_by_user(q, mid, what, runda):
    return get_ideas(q, mid, what, runda)


def get_sdgs_for_user(q, mid):
    id_ = None
    if len(q)==24 and ' ' not in q and set(q) - set('1234567890abcdef') == set([]):
        id_ = q.strip()
    if id_:
        sdgs = []
        collection = db['kedges']
        docs = collection.find({'iAmId': ObjectId(q), 'type':"rima.selected_UN_SDG", "mapId" : ObjectId(mid)})
        for doc in docs:
            sdgs.append(doc['targetId'])
        sdgs = [ObjectId(sdg) for sdg in sdgs]
        if sdgs:
            collection = db['knodes']
            docs = collection.find({'_id': {'$in': sdgs}, 'type':"const.sdgs.sdg", "mapId" : ObjectId(mid)})
            sdgs = {}
            for doc in docs:
                if doc['name']:
                    sdgs[doc['_id']] = (doc['_id'], doc['name'], doc['dataContent']['goal'], doc['desc'])
            return sdgs
        return {}


def get_sdg(q, txt=True, mid=''):
    collection = db['knodes']
    docs = collection.find({'_id': ObjectId(q), 'type':"const.sdgs.sdg"})
    for doc in docs:
        if txt:
            return doc['name']
        else:
            return doc['dataContent']['humanID']


def get_sdgs_for_all_users(mid):
    user_sdgs = []
    collection = db['kedges']
    docs = collection.find({'type':"rima.selected_UN_SDG", "mapId" : ObjectId(mid)})
    for doc in docs:
        user_sdgs.append((doc['sourceId'],doc['targetId']))
    user_sdgs = [(ObjectId(user), ObjectId(sdg)) for user, sdg in user_sdgs]
    return user_sdgs


c2l = {u"А":u"A",
u"Б":u"B",
u"В":u"V",
u"Г":u"G",
u"Д":u"D",
u"Ђ":u"Đ",
u"Е":u"E",
u"Ж":u"Ž",
u"З":u"Z",
u"И":u"I",
u"Ј":u"J",
u"К":u"K",
u"Л":u"L",
u"Љ":u"Lj",
u"М":u"M",
u"Н":u"N",
u"Њ":u"Nj",
u"О":u"O",
u"П":u"P",
u"Р":u"R",
u"С":u"S",
u"Т":u"T",
u"Ћ":u"Ć",
u"У":u"U",
u"Ф":u"F",
u"Х":u"H",
u"Ц":u"C",
u"Ч":u"Č",
u"Џ":u"Dž",
u"Ш":u"Š",
u"а":u"a",
u"б":u"b",
u"в":u"v",
u"г":u"g",
u"д":u"d",
u"ђ":u"đ",
u"е":u"e",
u"ж":u"ž",
u"з":u"z",
u"и":u"i",
u"ј":u"j",
u"к":u"k",
u"л":u"l",
u"љ":u"lj",
u"м":u"m",
u"н":u"n",
u"њ":u"nj",
u"о":u"o",
u"п":u"p",
u"р":u"r",
u"с":u"s",
u"т":u"t",
u"ћ":u"ć",
u"у":u"u",
u"ф":u"f",
u"х":u"h",
u"ц":u"c",
u"ч":u"č",
u"џ":u"dž",
u"ш":u"š"
}

def d(mid, uid=None, rid=None):
    #dialect = "\t"
    #fn = 'FIPMen.csv'
    #with open(fn, 'r') as fs:
    #    dialect = csv.Sniffer().sniff(fs.readline().replace("\xef\xbb\xbf",'').strip())
    #reader = csv.reader(open(fn, 'rb'),delimiter=dialect.delimiter)
    #headers = reader.next()
    authors = {}
    rauthor = {}
    
    reader = get_all_ideas(mid)
    for row in reader.values():#ideas[doc['_id']] = (doc['iAmId'], doc['_id'], doc['name'])
        #line = row[1].replace("\n", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ").strip()
        a, i, line = row
        line = line.replace("\n", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ").strip()
        nline = []
        for c in line:
            if c in c2l.keys():
                nline.append(c2l[c])
            else:
                nline.append(c)
        line = ''.join(nline)
        authors[str(a)] = line
        rauthor[line] = str(a)
        
    verses = [(verse, [stem_word(w) for w in preprocess(verse) if w not in stop_words_set]) for verse in rauthor.keys()]#verses.split(nl)
    versesd = dict(verses)
    norms = dict([(''.join(j),k) for k,j in verses])
    candidates = []
    for orig, norm in verses:
        for e, s in similar_wmd_query(versesd.values(), norm):
            candidates.append((rauthor[orig], str(s), rauthor[norms[''.join(e)]], norms[''.join(e)], orig))
    sorted_candidates = sorted(candidates, key=operator.itemgetter(1))
    paired = OrderedDict()
    rtrn = '{"user":"","children":['
    seen = set()
    for a1, s, a2, v, o in sorted_candidates:
        if a1 == a2:continue
        if (a1,o) in seen or (a2,v) in seen:continue
        if a1 in paired.keys() and a2 in paired[a1]:continue
        if a2 in paired.keys() and a1 in paired[a2]:continue
        if float(s) > 1:continue
        if not paired.has_key(a1):
            paired[a1] = [a1, o, 0]
        seen.add((a1,o))
        #if not paired.has_key(a2):
        #    paired[a2] = [a2,v, 0]
        seen.add((a2,v))
        #paired[a2].extend([a1,o, s])
        paired[a1].extend([a2,v, s])

    #rtrn += '\n"ideas":[\n\t'
    comma_ = ''
    for vals in paired.values():
        newList = []
        for i in range(0,len(vals),3):
            newList.append([vals[i], vals[i+1], vals[i+2]])
        comma = ''
        rtrn += comma_+'{"user": "","children": ['
        for val in newList:
            user = get_users(str(val[0]), mid).values()
            if user:
                email = user[0][2]
                rtrn += comma+'{"user":"' + email + '","idea":"' +  val[1] + '"}'# +  str(val[2])
            comma = ','
        rtrn += ']}'
        comma_ = ','
        #rtrn += '\n' + s + '\n'
    rtrn += ']}'

    with codecs.open('cwc.json','w',encoding='utf8') as f:
        f.write(rtrn)

    authors = {}
    rauthor = {}
    
    user_sdgs = get_sdgs_for_all_users(mid)
    total = len(user_sdgs)
    users = [user for user, sdg in user_sdgs]
    sdgs = [sdg for user, sdg in user_sdgs]
    sdgs_counts = Counter(sdgs)
    candidates = {}
    cluster_sdgs = {}
    cluster_sdgs_i = {}
    for user, sdg in user_sdgs[:]:
        if not cluster_sdgs.has_key(str(user)):
            cluster_sdgs[str(user)] = []
            cluster_sdgs_i[str(user)] = []
        if get_sdg(str(sdg), mid):
            cluster_sdgs[str(user)].append(get_sdg(str(sdg), mid))
        if get_sdg(str(sdg), False, mid):
            cluster_sdgs_i[str(user)].append(get_sdg(str(sdg), False, mid))
        for user2, sdg2 in user_sdgs[:]:
            if str(user) >= str(user2):continue
            if not candidates.has_key(str(user)+':'+str(user2)):
                candidates[str(user)+':'+str(user2)] = 0.
            if sdg == sdg2:
                candidates[str(user)+':'+str(user2)] += 1./sdgs_counts[sdg]

    sorted_candidates = sorted(candidates.items(), key=operator.itemgetter(1), reverse=True)
    paired = OrderedDict()
    seen = set()
    for users, score in sorted_candidates:
        a1, a2 = users.split(':')
        if a1 in seen and a2 in seen:continue
        if paired.has_key(a1):
            paired[a1].append(a2)
        elif paired.has_key(a2):
            paired[a2].append(a1)
        elif a1 in seen:
            for k,vals in paired.iteritems():
                if a1 in vals:
                    paired[k].append(a2)
        elif a2 in seen:
            for k,vals in paired.iteritems():
                if a2 in vals:
                    paired[k].append(a1)
        else:
            paired[a1] = [a1, a2]
        seen.add(a1)
        seen.add(a2)

    rtrn = '{"user":"","children":['
    comma_ = ''
    for vals in paired.values():
        comma = ''
        rtrn += comma_+'{"user": "########asdf##############","idea":"########asdf##############", "children": ['
        best = ''
        csdgs = []
        csdgsi = []
        for val in vals:
            #rtrn += comma+'"' + get_users(str(val)).values()[0][1] + '"'
            user = get_users(str(val), mid).values()
            if user:
                email = user[0][2]
                usdgs = cluster_sdgs[str(user[0][0])]
                usdgsi = cluster_sdgs_i[str(user[0][0])]
                csdgs.extend(usdgs)
                csdgsi.extend(usdgsi)
                #usdgs = [u.encode('utf-8', errors='replace') for u in usdgs]
                usdgs = u'\\n'.join(usdgs)
                usdgsi = u'; '.join([str(u) for u in usdgsi])+u'\\n'
                nline = []
                for c in usdgs:
                    if c in c2l.keys():
                        nline.append(c2l[c])
                    else:
                        nline.append(c)
                usdgs = u''.join(nline)
                try:
                    rtrn += comma+'{"user":"' + str(email) + '","idea":"' + usdgsi + usdgs+ '"}'# +  str(val[2])
                except:
                    rtrn += comma+'{"user":"' + str(val) + '","idea":"' + usdgsi + usdgs+ '"}'# +  str(val[2])
                comma = ','
        csdgs = Counter(csdgs).most_common(3)
        csdgsi = Counter(csdgsi).most_common(3)
        top = csdgs[0][1]
        nline = []
        csdgs_ = []
        for i in range(min(len(csdgs),3)):
            if csdgs[i][1] == top:
                csdgs_.append(csdgs[i][0])
            else:
                break
        csdgs_ = u'\\n'.join(csdgs_)
        for c in csdgs_:
            if c in c2l.keys():
                nline.append(c2l[c])
            else:
                nline.append(c)
        usdgs = u''.join(nline)
        csdgs_ = []
        for i in range(min(len(csdgsi),3)):
            if csdgsi[i][1] == top:
                csdgs_.append(csdgsi[i][0])
            else:
                break
        sorted(csdgs_)
        csdgs_ = u'; '.join([str(u) for u in csdgs_])+u'\\n'
        rtrn = rtrn.replace("########asdf##############",csdgs_ + u''.join(nline))
        rtrn += ']}'
        comma_ = ','
        #rtrn += '\n' + s + '\n'
    rtrn += ']}'

    with codecs.open('sdg.json','w',encoding='utf8') as f:
        f.write(rtrn)
        
    #return rtrn


def ds(mid, uid, rid):
    # knodes from the DB where the {mapId == MAP_ID} && {iAmId == AID} && {type == 'topiChat.talk.chatMsg'}

    theauthors = {}
    therauthor = {}
    authors = {}
    rauthor = {}
    ids = {}
    
    reader = get_ideas_by_user(uid, mid, "topiChat.talk.chatMsg", int(rid))
    for row in reader.values():#ideas[doc['_id']] = (doc['iAmId'], doc['_id'], doc['name'])
        #line = row[1].replace("\n", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ").strip()
        a, i, line = row
        ids[line] = i
        line = line.replace("\n", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ").strip()
        nline = []
        for c in line:
            if c in c2l.keys():
                nline.append(c2l[c])
            else:
                nline.append(c)
        line = ''.join(nline)
        if uid == str(a):
            theauthors[str(a)] = line
            therauthor[line] = str(a)
        else:
            authors[str(a)] = line
            rauthor[line] = str(a)
    #return ' '.join(authors.keys())+' '.join(theauthors.keys())

    verses = [(verse, [stem_word(w) for w in preprocess(verse) if w not in stop_words_set]) for verse in rauthor.keys()]#verses.split(nl)
    versesd = dict(verses)
    norms = dict([(''.join(j),k) for k,j in verses])

    theverses = [(verse, [stem_word(w) for w in preprocess(verse) if w not in stop_words_set]) for verse in therauthor.keys()]#verses.split(nl)
    theversesd = dict(theverses)
    thenorms = dict([(''.join(j),k) for k,j in theverses])

    candidates = []
    for orig, norm in theverses:
        for e, s in similar_wmd_query(versesd.values(), norm):
            candidates.append((therauthor[orig], str(s), rauthor[norms[''.join(e)]], norms[''.join(e)], orig))
    sorted_candidates = sorted(candidates, key=operator.itemgetter(1))
    paired = OrderedDict()
    seen = set()
    for a1, s, a2, v, o in sorted_candidates:
        if uid != a1:continue
        if a1 == a2:continue
        if (v) in seen:continue#(a1,o) in seen or 
        #if a1 in paired.keys() and a2 in paired[a1]:continue
        #if a2 in paired.keys() and a1 in paired[a2]:continue
        #if float(s) > 1:continue
        if not paired.has_key(a1):
            paired[a1] = []#a1, o, 0]
        #seen.add((a1,o))
        #if not paired.has_key(a2):
        #    paired[a2] = [a2,v, 0]
        seen.add(v)
        #paired[a2].extend([a1,o, s])
        paired[a1].extend([ids[v],v, s])

    collection = db['knodes']
    comma_ = ''
    lst = []
    for vals in paired.values():
        newList = []
        for i in range(0,len(vals),3):
            newList.append([vals[i], vals[i+1], vals[i+2]])
        """
            format of the data: list of 5 elements in the format {cwc_card._id, similarity_quotient}
        """
        
        for val in newList[:5]:
            cwc_card_id = ObjectId(str(val[0]))
            cwc_name = str(val[1])
            similarity_quotient = val[2]
            lst.append({"id":cwc_card_id,"cwc_content":cwc_name,"similarity_quotient":similarity_quotient})
    _id = collection.insert({"mapId" : ObjectId(mid), 'type':'service.result.dialogame.cwc_similarities','gameRound':rid, 'iAmId':ObjectId(uid), "suggestions":lst})
    return str({"_id":_id,"object":{"mapId" : ObjectId(mid), 'type':'service.result.dialogame.cwc_similarities','gameRound':rid, 'iAmId':ObjectId(uid), "suggestions":lst}})

import sys

class simsAPI():
    def get_sims(self):
        return d(mid)
