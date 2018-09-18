# -*- coding: utf-8 -*-
from nltk.tokenize import word_tokenize
rules = {
'ovnicxki':'',
'ovnicxka':'',
'ovnika':'',
'ovniku':'',
'ovnicxe':'',
'kujemo':'',
'ovacyu':'',
'ivacyu':'',
'isacyu':'',
'dosmo':'',
'ujemo':'',
'ijemo':'',
'ovski':'',
'ajucxi':'',
'icizma':'',
'ovima':'',
'ovnik':'',
'ognu':'',
'inju':'',
'enju':'',
'cxicyu':'',
'sxtva':'',
'ivao':'',
'ivala':'',
'ivalo':'',
'skog':'',
'ucxit':'',
'ujesx':'',
'ucyesx':'',
'ocyesx':'',
'osmo':'',
'ovao':'',
'ovala':'',
'ovali':'',
'ismo':'',
'ujem':'',
'esmo':'',
'asmo':'', #pravi gresku kod pevasmo
'zxemo':'',
'cyemo':'',
'cyemo':'',
'bemo':'',
'ovan':'',
'ivan':'',
'isan':'',
'uvsxi':'',
'ivsxi':'',
'evsxi':'',
'avsxi':'',
'sxucyi':'',
'uste':'',
'icxe':'i',#bilo ik
'acxe':'ak',
'uzxe':'ug',
'azxe':'ag',# mozda treba az, pokazati, pokazxe
'aci':'ak',
'oste':'',
'aca':'',
'enu':'',
'enom':'',
'enima':'',
'eta':'',
'etu':'',
'etom':'',
'adi':'',
'alja':'',
'nju':'nj',
'lju':'',
'lja':'',
'lji':'',
'lje':'',
'ljom':'',
'ljama':'',
'zi':'g',
'etima':'',
'ac':'',
'becyi':'beg',
'nem':'',
'nesx':'',
'ne':'',
'nemo':'',
'nimo':'',
'nite':'',
'nete':'',
'nu':'',
'ce':'',
'ci':'',
'cu':'',
'ca':'',
'cem':'',
'cima':'',
'sxcyu':'s',
'ara':'r',
'iste':'',
'este':'',
'aste':'',
'ujte':'',
'jete':'',
'jemo':'',
'jem':'',
'jesx':'',
'ijte':'',
'inje':'',
'anje':'',
'acxki':'',
'anje':'',
'inja':'',
'cima':'',
'alja':'',
'etu':'',
'nog':'',
'omu':'',
'emu':'',
'uju':'',
'iju':'',
'sko':'',
'eju':'',
'ahu':'',
'ucyu':'',
'icyu':'',
'ecyu':'',
'acyu':'',
'ocu':'',
'izi':'ig',
'ici':'ik',
'tko':'d',
'tka':'d',
'ast':'',
'tit':'',
'nusx':'',
'cyesx':'',
'cxno':'',
'cxni':'',
'cxna':'',
'uto':'',
'oro':'',
'eno':'',
'ano':'',
'umo':'',
'smo':'',
'imo':'',
'emo':'',
'ulo':'',
'sxlo':'',
'slo':'',
'ila':'',
'ilo':'',
'ski':'',
'ska':'',
'elo':'',
'njo':'',
'ovi':'',
'evi':'',
'uti':'',
'iti':'',
'eti':'',
'ati':'',
'vsxi':'',
'vsxi':'',
'ili':'',
'eli':'',
'ali':'',
'uji':'',
'nji':'',
'ucyi':'',
'sxcyi':'',
'ecyi':'',
'ucxi':'',
'oci':'',
'ove':'',
'eve':'',
'ute':'',
'ste':'',
'nte':'',
'kte':'',
'jte':'',
'ite':'',
'ete':'',
'cyi':'',
'usxe':'',
'esxe':'',
'asxe':'',
'une':'',
'ene':'',
'ule':'',
'ile':'',
'ele':'',
'ale':'',
'uke':'',
'tke':'',
'ske':'',
'uje':'',
'tje':'',
'ucye':'',
'sxcye':'',
'icye':'',
'ecye':'',
'ucxe':'',
'oce':'',
'ova':'',
'eva':'',
'ava':'av',
'uta':'',
'ata':'',
'ena':'',
'ima':'',
'ama':'',
'ela':'',
'ala':'',
'aka':'',
'aja':'',
'jmo':'',
'oga':'',
'ega':'',
u'aća':'',
'oca':'',
'aba':'',
'cxki':'',
'ju':'',
'hu':'',
'cyu':'',
'cu':'',
'ut':'',
'it':'',
'et':'',
'at':'',
'usx':'',
'isx':'',
'esx':'',
'esx':'',
'uo':'',
'no':'',
'mo':'',
'mo':'',
'lo':'',
'ko':'',
'io':'',
'eo':'',
'ao':'',
'un':'',
'an':'',
'om':'',
'ni':'',
'im':'',
'em':'',
'uk':'',
'uj':'',
'oj':'',
'li':'',
'ci':'',
'uh':'',
'oh':'',
'ih':'',
'eh':'',
'ah':'',
'og':'',
'eg':'',
'te':'',
'sxe':'',
'le':'',
'ke':'',
'ko':'',
'ka':'',
'ti':'',
'he':'',
'cye':'',
'cxe':'',
'ad':'',
'ecy':'',
'ac':'',
'na':'',
'ma':'',
'ul':'',
'ku':'',
'la':'',
'nj':'nj',
'lj':'lj',
'ha':'',
'a':'',
'e':'',
'u':'',
'sx':'',
'o':'',
'i':'',
'j':'',
'i':''
         }
dictionary = {
#biti glagol
'bih':'biti',
'bi':'biti',
'bismo':'biti',
'biste':'biti',
'bisxe':'biti',
'budem':'biti',
'budesx':'biti',
'bude':'biti',
'budemo':'biti',
'budete':'biti',
'budu':'biti',
'bio':'biti',
'bila':'biti',
'bili':'biti',
'bile':'biti',
'biti':'biti',
'bijah':'biti',
'bijasxe':'biti',
'bijasmo':'biti',
'bijaste':'biti',
'bijahu':'biti',
'besxe':'biti',
#jesam
'sam':'jesam',
'si':'jesam',
'je':'jesam',
'smo':'jesam',
'ste':'jesam',
'su':'jesam',
'jesam':'jesam',
'jesi':'jesam',
'jeste':'jesam',
'jesmo':'jesam',
'jeste':'jesam',
'jesu':'jesam',
# glagol hteti
'cyu':'hteti',
'cyesx':'hteti',
'cye':'hteti',
'cyemo':'hteti',
'cyete':'hteti',
'hocyu':'hteti',
'hocyesx':'hteti',
'hocye':'hteti',
'hocyemo':'hteti',
'hocyete':'hteti',
'hocye':'hteti',
'hteo':'hteti',
'htela':'hteti',
'hteli':'hteti',
'htelo':'hteti',
'htele':'hteti',
'htedoh':'hteti',
'htede':'hteti',
'htede':'hteti',
'htedosmo':'hteti',
'htedoste':'hteti',
'htedosxe':'hteti',
'hteh':'hteti',
'hteti':'hteti',
'htejucyi':'hteti',
'htevsxi':'hteti',
# glagol moći
'mogu':'mocyi',
u'možeš':'mocyi',
u'može':'mocyi',
u'možemo':'mocyi',
u'možete':'mocyi',
'mogao':'mocyi',
'mogli':'mocyi',
u'moći':'mocyi'
}

def stem_arr(s):
    s = s.lower()
    s = s.replace(u"š", "sx")
    s = s.replace(u"č", "cx")
    s = s.replace(u"ć", "cy")
    s = s.replace(u"đ", "dx")
    s = s.replace(u"ž", "zx")
    lam = word_tokenize(s)
    i = 0
    for word in lam:
        for key in dictionary:
            if key == word:
                lam[i]= dictionary[key]
                break
        for key in rules:
            if(word.endswith(key) and len(word)-len(key)>2):
                lam[i] = word[:-len(key)]+rules[key]
                break
        i = i+1
    return lam

def stem_str(s):
    s = s.lower()
    s = s.replace(u"š", "sx")
    s = s.replace(u"č", "cx")
    s = s.replace(u"ć", "cy")
    s = s.replace(u"đ", "dx")
    s = s.replace(u"ž", "zx")
    s = s.replace(u"Š", "sx")
    s = s.replace(u"Č", "cx")
    s = s.replace(u"Ć", "cy")
    s = s.replace(u"Đ", "dx")
    s = s.replace(u"Ž", "zx")
    s = s.replace(u"“","\"")
    s = s.replace("\"","")
    s = s.replace(u"”","\"")
    s = s.replace("'","\"")
    s = s.replace(u"’","\"")
    s = s.replace(u"€","eur")
    s = s.replace(u"„","\"")
    lam = word_tokenize(s)
    i = 0
    for word in lam:
        for key in dictionary:
            if key == word:
                lam[i]= dictionary[key]
                break
        for key in rules:
            # Tokenize only words larger than 2 characters, apart from modal verbs
            if(word.endswith(key) and len(word)-len(key)>2):
                lam[i] = word[:-len(key)]+rules[key]
                break
        i = i+1
    end_str = "" 
    for word in lam:
        end_str = end_str+" "+word
    return end_str

def stem_word(s):
    s = s.lower()
    s = s.replace(u"š", "sx")
    s = s.replace(u"č", "cx")
    s = s.replace(u"ć", "cy")
    s = s.replace(u"đ", "dx")
    s = s.replace(u"ž", "zx")
    s = s.replace(u"Š", "sx")
    s = s.replace(u"Č", "cx")
    s = s.replace(u"Ć", "cy")
    s = s.replace(u"Đ", "dx")
    s = s.replace(u"Ž", "zx")
    s = s.replace(u"“","\"")
    s = s.replace("\"","")
    s = s.replace(u"”","\"")
    s = s.replace("'","\"")
    s = s.replace(u"’","\"")
    s = s.replace(u"€","eur")
    s = s.replace(u"„","\"")
    for key in dictionary:
        if key == s:
            s= dictionary[key]
            break
    for key in rules:
        # Tokenize only words larger than 2 characters, apart from modal verbs
        if(s.endswith(key) and len(s)-len(key)>2):
            s = s[:-len(key)]+rules[key]
            break
    return s

out = stem_arr(u'Jovica je išao u školu. Marija je dobra devojka.')
out2 = stem_str(u'Jovica je išao u školu. Marija je dobra devojka.')

#for i in u'Jovica je išao u školu . Marija je dobra devojka .'.split():
#    print stem_word(i)
#print out
#print out2
