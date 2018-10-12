# Networking for Collective Action - (NCA)

# INSTALL

***NOTE***: Before installing this app you need to install Colabo.Space ***tools***, ***backend*** and ***fronted***. Please read how to install them in the [INSTALL.md](../../../INSTALL.md) document.

```sh
cd src/frontend/apps/nca #the folder where this INSTALL.MD documnet is residing too
yarn
```

## Install Frontend Colabo Puzzles (Packages)

***NOTE***: This is done automatically during the install process (please check the script `prepare` inside the `package.json`) and it is not necessary to be done manually.

# Run

```sh
cd src/frontend/demos/colaboarthon/collective_sustainable_activism
# run predefined npm script
npm start
# run with local ng
./node_modules/\@angular/cli/bin/ng serve -o -p 8885
# run with local ng using npx
npx ng serve -o --port 8885
# or with global ng
ng serve -o -p 8885
# or with default port (`angular.json` (architect.serve.options.port)) and without openning browser (no `-o`)
ng serve
```

# Deploy

http://fv.colabo.space/ redirects to **/var/www/fv**

## Build

this is done on the local dev machine

```sh
# set the server backend addr in the file
# KnAllEdge/src/frontend/dev_puzzles/knalledge/knalledge_store_core/cf.service.ts
# to
# static serverAP = "http://158.39.75.120:8001"; // colabo-space-1
cd src/frontend/demos/colaboarthon/collective_sustainable_activism
ng build --prod --build-optimizer
# run local server for testing
cd dist/collective_sustainable_activism
python -m SimpleHTTPServer 8000
# reset the the server backend addr to the old value (for local computer)

```

## Code/Data Upload

uploading the build code on the server

```sh
#the code is built in the following folder:
cd src/frontend/demos/colaboarthon/collective_sustainable_activism/dist
#we put the content of this folder into the server folder:
/var/www/fv
```

# KnAllEdge content

## Map

Add map in kmaps (`right button > insert document`):

```json
{ 
    "_id" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "name" : "Forum Vlasina + Remaking Tesla", 
    "rootNodeId" : ObjectId("5b49e94636390f03580ac9a8"), 
    "type" : "CoLaboArthon", 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "parentMapId" : "", 
    "dataContent" : null, 
    "updatedAt" : ISODate("2018-07-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-07-10T01:07:10.400+0000"),
    "isPublic" : true, 
    "participants" : [
        ObjectId("556760847125996dc1a4a24f")
    ], 
    "version" : NumberInt(1), 
    "activeVersion" : NumberInt(1), 
    "__v" : NumberInt(0)
}
```

## ROOT node

Add ROOT node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b49e94636390f03580ac9a8"),
    "name" : "Forum Vlasina + Remaking Tesla",
    "type" : "model_component",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-07-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-07-10T01:07:10.400+0000"),
    "visual" : {
        "isOpen" : true,
        "yM" : NumberInt(0),
        "xM" : NumberInt(0)
    },
    "isPublic" : true,
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1),
    "__v" : NumberInt(0),
    "decorations" : {

    },
    "up" : {

    },
    "dataContent" : {
        "propertyType" : "text/markdown",
        "property" : "Welcome to 'Networking for collective sustainable activism'"
    }
}
```

## USERS

Add USERS node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b4a16e800ea79029ca0c395"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-07-10T01:18:20.440+0000"),
    "createdAt" : ISODate("2018-07-10T01:18:20.439+0000"),
    "visual" : {
        "isOpen" : true
    },
    "isPublic" : true,
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1),
    "__v" : NumberInt(0),
    "decorations" : {

    },
    "up" : {

    },
    "dataContent" : {
    }
}
```

Add USERS edge in kedges (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b4a1b3c00ea79029ca0c39a"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"),
    "targetId" : ObjectId("5b4a16e800ea79029ca0c395"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-07-10T01:18:20.619+0000"),
    "createdAt" : ISODate("2018-07-10T01:18:20.618+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

## SDGs

Add SDG node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b4a91d800ea790a4738a6e5"),
    "name" : "SDGs",
    "type" : "const.sdgs",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-07-10T01:25:34.694+0000"),
    "createdAt" : ISODate("2018-07-10T01:25:34.693+0000"),
    "visual" : {
        "isOpen" : true
    },
    "isPublic" : true,
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1),
    "__v" : NumberInt(0),
    "decorations" : {

    },
    "up" : {

    },
    "dataContent" : {
    }
}
```

Add SDG edge in kedges (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b4a922700ea790a4738a6e9"),
    "name" : "SDGs",
    "type" : "const.sdgs",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("5b4a91d800ea790a4738a6e5"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"),
    "targetId" : ObjectId("5af39f8e2843ddf04b459cba"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

## CONTENT

Add CONTENT node in knodes (`right button > insert document`):

```json
{ 
    "_id" : ObjectId("5b4a926600ea790a4738a6ea"), 
    "name" : "Content", 
    "type" : "clathon.content", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "visual" : {
        "isOpen" : true
    }, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "isPublic" : true, 
    "version" : NumberInt(1), 
    "activeVersion" : NumberInt(1), 
    "__v" : NumberInt(0), 
    "decorations" : {

    }, 
    "up" : {

    }, 
    "dataContent" : {

    }
}
```

Add CONTENT edge in kedges (`right button > insert document`):

```json
{ 
    "_id" : ObjectId("5b4a92ca00ea790a4738a6eb"),
    "name" : "Content", 
    "type" : "clathon.content", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"), 
    "targetId" : ObjectId("5b4a926600ea790a4738a6ea"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
}
```

## SDGs Population

**Nodes:**

Add SDG nodes in `knodes`  (`right button > Paste document(s)...`):
```JSON
[
  {
      "name" : "БЕЗ СИРОМАШТВА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(1),
          goal:  "Превазићи сиромаштво у свим облицима свуда у свету до 2030. године.",
          desc: "Више од 700 милиона људи још увек живе у условима екстремног сиромаштва и боре се да задовоље своје најосновније животне потребе као што су здравље, образовање, приступ води и санитарним условима итд. Огромна већина људи који преживљавају са мање од  1.90 долара дневно живе у јужној Азији и потсахарској Африци. Међутим, овај проблем такође погађа и развијене земље. Тренутно има преко 30 милиона деце која живе у сиромаштву у најбогатијим земљама света."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "БЕЗ ГЛАДИ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(2),
          goal:  "Сузбити глад, обезбедити сигуран приступ храни, квалитетнију исхрану и промовисати одрживу пољопривреду",
          desc: "Неопходна је темељна промена у глобалним системима земљорадње и обезбеђивања хране како би се прехранило данашњих 795 милиона гладних и додатних 2 милијарде људи који ће се према очекивањима придружити овом броју до 2050. године.  Екстремна глад и потхрањеност су и даље препрека одрживом развоју и представљају замку из које се људи не могу лако ослободити. Глад и потхрањеност значе мањи број продуктивних појединаца који су истовремено склонији болестима и самим тим онемогућени да зараде више и поправе своје животне услове."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ДОБРО ЗДРАВЉЕ И БЛАГОСТАЊЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(3),
          goal:  "Обезбедити здрав живот и промовисати благостање за све грађане у свим животним добима ",
          desc: "Више од 6 милиона деце још увек умре пре свог петог рођендана сваке године. Шеснаест хиљада деце сваке године умре од болести које се могу спречити као што су заушке или туберкулоза. Сваког дана стотине жена умру током трудноће или од пост-порођајних компликација. У многим руралним областима, свега 56% порођаја обави адекватно обучено стручно особље. Сида је сада водећи узрок смртности међу тинејџерима у потсахарској Африци, која још увек представља област опустошену епидемијом вируса ХИВ-а"
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "КВАЛИТЕТНО ОБРАЗОВАЊЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(4),
          goal:  "Обезбедити инклузивно и квалитетно образовање за све и промовисати учење током целог живота",
          desc: "Упркос томе што је потсахарска Африка постигла највећи напредак у погледу броја уписаних ђака у основне школе међу свим регионима у развоју - са 52 процента у 1990. години до 78 процената у 2012. години - и даље остају велике недоследности. Постоји до четири пута већа вероватноћа да деца из најсиромашнијих домаћинстава нису укључена у образовни систем у односу на децу из најбогатијих домаћинства. Недоследност између руралних и урбаних подручја је такође и даље велика."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ЈЕДНАКОСТ ПОЛОВА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(5),
          goal:  "Остварити једнакост полова и оснажити све жене и девојке",
          desc: "Још увек постоји велики проблем неједнакости на тржишту рада у неким регионима, док се женама систематски ускраћује једнак приступ пословима. Сексуално насиље и експлоатација, неједнака заступљеност полова у неплаћеним пословима бриге и неге, рад у домаћинству и дискриминација на јавним функцијама остају огромне препреке. Увек се изнова доказује да оснаживање жена и девојака има вишеструки ефекат и помаже да се успостави економски раст и развој у свим областима."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ЧИСТА ВОДА И САНИТАРИЈЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(6),
          goal:  "Обезбедити приступ води и санитарним условима за све",
          desc: "Оскудица воде погађа више од 40%  људи широм света, што представља узнемирујући податак а тај број ће према проценама расти с порастом глобалних температура које су последица климатских промена. Према подацима из 2011. године, 10 земаља су биле близу исцрпљивања обновљивих ресурса воде за пиће и сада морају да се ослањају на алтернативне изворе. Процењује се да ће до 2050. године бар један од четворо људи бити погођен несташицом воде."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ДОСТУПНА И ЧИСТА ЕНЕРГИЈА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(7),
          goal:  "Обезбедити приступ приступачним, поузданим, одрживим и савременим изворима енергије за све грађане",
          desc: "Између 1990. и 2010. године, број људи с приступом електричној енергији порастао је за 1,7 милијарди, а како се глобално становништво и даље повећава, повећаваће се и потреба за јефтином енергијом. Глобална економија која се ослања на потрошљу фосилних горива, као и повећање емисије гасова с ефектом стаклене баште ствара драстичне промене у нашем климатском систему, што  утиче на сваки континент. Једна од пет особа нема приступ електричној енергији, а како потражња наставља да расте, неопходно је значајно повећање производње обновљиве енергије широм света."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ДОСТОЈАН РАД И ЕКОНОМСКИ РАСТ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(8),
          goal:  "Промовисати инклузиван и одржив економски раст, запосленост и хумане радне услове за све",
          desc: "У земљама у развоју средња класа сада чини више од 34% укупног броја запослених, што представља скоро утростручен број људи у периоду између 1991. и 2015. године. Међутим, у потоњим фазама опоравка глобалне  економије, темпо раста се успорава док се продубљују неједнакости а број радних места је недовољан да би оджао корак с растућом радном снагом. На основу података Међународне организације рада, више од 204 милиона људи било је незапослено у 2015. години"
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ИНДУСТРИЈА, ИНОВАЦИЈА И ИНФРАСТРУКТУРА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(9),
          goal:  "Изградити стабилну инфраструктуру, промивисати одрживу индустријализацију и неговати иновативност",
          desc: "С обзиром да више од половине светске популације сада живи у градовима, јавни транспорт и обновљива енергија постају све важнији, као и развој нових индустрија и информационих и комуникационих технологија. Промовисање одрживих грана индустрије и улагање у научна истраживања и иновације су веома важни у циљу обезбеђивања одрживог развоја. Више од 4 милијарде људи још увек нема приступ интернету, а 90 процената од овог броја их живи у земљама у развоју."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "СМАЊЕНА НЕЈЕДНАКОСТ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(10),
          goal:  "Смањити неједнакост унутар земаља и на интернационалном плану",
          desc: "Неједнакост у погледу личног дохотка је у порасту, тако да 10 процената најбогатијег становништва зарађује до 40 посто укупне глобалне зараде. Десет процената најсиромашнијих зарађују свега између 2 и 7 посто укупне глобалне зараде. У земљама у развоју неједнакост је порасла за 11 процената ако се узме у обзир пораст популације."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ОДРЖИВИ ГРАДОВИ И ЗАЈЕДНИЦЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(11),
          goal:  "Учинити градове инклузивним, безбедним, стабилним и одрживим",
          desc: "Више од половине светске популације сада живи у урбаним срединама. До 2050. године овај број ће се повећати на две трећине укупног човечанства. Одрживи развој се не може постићи без значајније трансформације начина на који се обавља изградња и управљање урбаним простором. Екстремно сиромаштво је често концентрисано у урбаним срединама, а државне и градске власти се боре да обезбеде одговарајући смештај растућем становништву у овим областима."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ОДГОВОРНА ПОТРОШЊА И ПРОИЗВОДЊА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(12),
          goal:  "Обезбедити одрживе моделе потрошње и производње",
          desc: "Пољопривреда је највећи потрошач воде широм света, а на наводњавање одлази близу 70 посто свих водених ресурса за људску употребу. Ефикасно управљање системима за одлагање токсичног отпада и загађујућих материја представља важне параметре за постизање овог циља. Од једнаког је значаја и подстицање индустрије, предузећа и потрошача да рециклирају и смањују количину произведеног отпада.
"
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "КЛИМАТСКЕ АКЦИЈЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(13),
          goal:  "Предузети хитне мере у борби с климатским променама и њиховим последицама",
          desc: "Емисија  гасова са ефектом стаклене баште наставља да расте, и сада је више од 50 процената већа од нивоа из 1990. године. Док источна Европа и централна Азија нису велики емитери гасова с ефектом стаклене баште, ови региони трпе несразмерне последице климатских промена.Поплаве на западном Балкану уништиле су домове и раселиле хиљаде људи."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ВОДЕНИ ЖИВОТ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(14),
          goal:  "Очувати и на одржив начин користити океане, мора и морске ресурсе",
          desc: "Више од три милијарде људи зависи од морског и приобалног биодиверзитета како би обезбедили средства за живот. Међутим, данас смо сведоци чињенице да је  30% светских залиха рибе прекомерно експлоатисано, што за последицу има да је њихов број пао испод нивоа на ком оне могу обезбедити одрживу бројност. Загађење мора које у највећој мери потиче од копнених извора достиже алармантне нивое, са просеком од 13.000 комада пластичног отпада на сваком квадратном километру океана."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ЖИВОТ НА ЗЕМЉИ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(15),
          goal:  "Управљати шумама на одржив начин, борити се против опустињавања, зауставити и вратити уназад процес деградације земљишта, зауставити губитак биодиверзитета",
          desc: "While Sub-Saharan Africa made the greatest progress in primary school enrolment among all developing regions – from 52 percent in 1990, up to 78 percent in 2012 – large disparities still remain. Children from the poorest households are up to four times more likely to be out of school than those of the richest households. Disparities between rural and urban areas also remain high"
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "МИР, ПРАВДА И СНАЖНЕ ИНСТИТУЦИЈЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(16),
          goal:  "Промовисати праведно, мирно и инклузивно друштвено окружење",
          desc: "Живимо у свету који је све више подељен. Неки региони уживају одрживе нивое мира, сигурности и просперитета, док други упадају у наизглед бескрајне циклусе сукоба и насиља. Оружани сукоби  и несигурност имају разоран утицај на развој земље, утичући на економски раст и често резултирајући дуготрајним непријатељствима које могу трајати генерацијама. Сексуално насиље, криминал, експлоатација и мучење су такође присутни када постоји сукоб или нема владавина права."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "name" : "ПАРТНЕРСТВА ЗА ОСТВАРЕЊЕ ЦИЉЕВА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(17),
          goal:  "Подстаћи глобалну сарадњу у домену одрживог развоја",
          desc: "Циљеви одрживог развоја се могу реализовати само уз снажну посвећеност глобалном партнерству и сарадњи. Хуманитарне кризе изазване сукобима или природним непогодама и даље захтевају више финансијских средстава и помоћи. Многе земље такође захтевају Службу развојне помоћи за подстицање раста и трговине. Данас је свет међусобно повезан више него икада раније. Побољшање приступа технологији и знању је важан начин за размену идеја и подстицање иновација."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  }    
]
```

**Edges:**

Add SDG edges in `kedges`  (`right button > Paste document(s)...`):
```json
[
  { 
    "_id" : ObjectId("5b4b22d900ea790a4738a705"),
    "name" : "SDG", 
    "type" : "const.sdgs.sdg", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5af5fa2f054a87e71f4ed862"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  },
  { 
    "_id" : ObjectId("5b4b22fd00ea790a4738a706"),
    "name" : "SDG", 
    "type" : "const.sdgs.sdg", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5b4b21b700ea790a4738a703"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  },
  { 
    "_id" : ObjectId("5b4b231e00ea790a4738a707"),
    "name" : "SDG", 
    "type" : "const.sdgs.sdg", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5b4b21d900ea790a4738a704"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  },
  { 
    "_id" : ObjectId("5b4d105a280f6211059ff60c"),
    "name" : "SDG", 
    "type" : "const.sdgs.sdg", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5b4d1009280f6211059ff606"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  }
]
```

## Users Population

(TEST ONLY)

```JSON
[
  {
    "name": "01. Hawskbill Turtle",
    "number": "01",
    "image": {
      "url": "http://r.ddmcdn.com/s_f/o_1/cx_0/cy_34/cw_2001/ch_2001/w_720/APL/uploads/2015/11/Hawksbill-Turtle-FRONT-PAGE.jpg"
    },
    "coLaboWareData": {
        "type": 1,
        "value": "0009592295"
    }
  },
  {
    "name": "02. Giant Panda",
    "number": "02",
    "image": {
      "url": "http://r.ddmcdn.com/s_f/o_1/cx_11/cy_776/cw_1957/ch_1957/w_720/APL/uploads/2015/11/giant-panda-FRONT-PAGE.jpg"
    },
    "coLaboWareData": {
        "type": 1,
        "value": "0009595752"
    }
  }
]
```

# Interests population

Interesting images
+ https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fpositive-and-neutral-character-traits-alphabet-v-w%2F281%2Fpositive-wxyz003-512.png&imgrefurl=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F2306705%2Fhobbies_hobby_interests_man_skill_skillful_well-rounded_icon&docid=CNrs61HBDNW4JM&tbnid=60jNBkVYemEYdM%3A&vet=10ahUKEwixouGogLDaAhUODKwKHQY-B8UQMwjHASgdMB0..i&w=466&h=512&bih=780&biw=1440&q=interests&ved=0ahUKEwixouGogLDaAhUODKwKHQY-B8UQMwjHASgdMB0&iact=mrc&uact=8#h=512&imgdii=60jNBkVYemEYdM:&vet=10ahUKEwixouGogLDaAhUODKwKHQY-B8UQMwjHASgdMB0..i&w=466

(TEST ONLY)

```JSON
{
  "tagsGroups": [
    {
      "name": "Diversity Background",
      "parentTagsGroup": null,
      "image": {
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuUi6NLEdnBBJxtgrclUt2o5orAvHNc79vV01mfr39wtF_6Hq"
      }
    },
    {
      "name": "Interests",
      "parentTagsGroup": null,
      "image": {
        "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
      }
    },
    {
      "name": "Interest Helping",
      "parentTagsGroup": "Interests",
      "image": {
        "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
      }
    },
    {
      "name": "Interest 2",
      "parentTagsGroup": "Interests",
      "image": {
        "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
      }
    }
  ],
  "tags": [
    {
      "name": "Art",
      "tagGroup": "Diversity Background",
      "image": {
        "url": "https://images.fineartamerica.com/images-medium-large-5/hummingbird-of-watercolor-rainbow-olga-shvartsur.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009592295"
      }
    },
    {
      "name": "Refugee",
      "tagGroup": "Diversity Background",
      "image": {
        "url": "http://www.refugeesarewelcome.org/wp-content/uploads/2016/04/RS4622_jordan2012jeffrey-2675-copy.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009595752"
      }
    },
    {
      "name": "Hunger",
      "tagGroup": "Interest Helping",
      "image": {
        "url": "https://i.ndtvimg.com/i/2015-12/hunger-problem-india-istock_650x400_51449064006.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009595752"
      }
    }
  ]
}
```

(TEST ONLY)
Here is also a test interest between the user and tag:
USER_ID: 5acd58f603c526c90d8b124a
TAG_ID: 5acd65aa03c526c90d8b1254
```json
{
    "_id" : ObjectId("fa379b0f800f2fdd33d2d980"),
    "name" : "Interest",
    "type" : "rima.user_interest",
    "mapId" : ObjectId("f7baf6923c0c84b84f0d402a"),
    "iAmId" : ObjectId("556760847125996dc1a4a241"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5acd58f603c526c90d8b124a"),
    "targetId" : ObjectId("5acd65aa03c526c90d8b1254"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "createdAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}

```

Users:
01. African Wild Dog, 0000627088
02. Amur Leopard, 0009893200
03. Amur Tiger, 0009610151

Tags:

ROLES:
Refugee, 0009592295
Local, 0009672284
Activist, 0009671736

Interest Helping:
Hunger, 0009609788
Health, 0009595752
Food, 0009668945

Interest 2:
Interest A1, 0003739468
Interest A2, 0003678978
Interest A3, 0003736466