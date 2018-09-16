# Performing Sustainable CoEvolution (PSC)

# INSTALL

***NOTE***: Before installing this app you need to install **Colabo.Space** ***tools***, ***backend*** and ***fronted***. Please read how to install them in the [INSTALL.md](../../../INSTALL.md) document.

```sh
cd src/frontend/apps/psc #the folder where this INSTALL.MD documnet is residing too
yarn
```

## Install Frontend Colabo Puzzles (Packages)

***NOTE***: This is done automatically during the install process (please check the script `prepare` inside the `package.json`) and it is not necessary to be done manually.

# Run

```sh
cd src/frontend/apps/psc
# run predefined npm script
npm start
# run with local ng
./node_modules/\@angular/cli/bin/ng serve -o -p 8891
# run with local ng using npx
npx ng serve -o --port 8891
# or with global ng
ng serve -o -p 8891
# or with default port (`angular.json` (architect.serve.options.port)) and without openning browser (no `-o`)
ng serve
```

# Deploy

http://psc.colabo.space/ redirects to **/var/www/psc**

## Build

this is done on the local dev machine

```sh
# set the server backend addr in the file
# KnAllEdge/src/frontend/dev_puzzles/knalledge/knalledge_store_core/cf.service.ts
# to
# static serverAP = "http://158.39.75.120:8001"; // colabo-space-1
cd src/frontend/apps/psc
ng build --prod --build-optimizer
# run local server for testing
cd dist/psc
python -m SimpleHTTPServer 8000
# reset the the server backend addr to the old value (for local computer)

```

## Code/Data Upload

uploading the build code on the server

```sh
#the code is built in the following folder:
cd src/frontend/apps/psc
#we put the content of this folder into the server folder:
/var/www/psc
```

# KnAllEdge content

## Map

Add map in kmaps (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b96619b86f3cc8057216a03"),
    "name" : "Performing Sustainable CoEvolution @ PTW2018",
    "rootNodeId" : ObjectId("5b9662cb86f3cc8057216a09"),
    "type" : "CoLaboArthon",
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "parentMapId" : "",
    "dataContent" : null,
    "updatedAt" : ISODate("2018-09-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-09-10T01:07:10.400+0000"),
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
    "_id" : ObjectId("5b9662cb86f3cc8057216a09"),
    "name" : "Performing Sustainable CoEvolution @ PTW2018",
    "type" : "model_component",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-09-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-09-10T01:07:10.400+0000"),
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
        "property" : "Welcome to 'Performing Sustainable CoEvolution @ PTW2018'"
    }
}
```

## USERS

Add USERS node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b96691086f3cc8057216a13"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-09-10T01:18:20.440+0000"),
    "createdAt" : ISODate("2018-09-10T01:18:20.439+0000"),
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
    "_id" : ObjectId("5b96698e86f3cc8057216a14"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"),
    "targetId" : ObjectId("5b96691086f3cc8057216a13"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:18:20.619+0000"),
    "createdAt" : ISODate("2018-09-10T01:18:20.618+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

## SDGs

Add SDG node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b9669e986f3cc8057216a15"),
    "name" : "SDGs",
    "type" : "const.sdgs",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-09-10T01:25:34.694+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.693+0000"),
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
    "_id" : ObjectId("5b966a0086f3cc8057216a16"),
    "name" : "SDGs",
    "type" : "const.sdgs",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("5b4a91d800ea790a4738a6e5"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"),
    "targetId" : ObjectId("5af39f8e2843ddf04b459cba"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

## CONTENT

Add CONTENT node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b966a1286f3cc8057216a17"),
    "name" : "Content",
    "type" : "clathon.content",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "visual" : {
        "isOpen" : true
    },
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
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
    "_id" : ObjectId("5b966a3386f3cc8057216a18"),
    "name" : "Content",
    "type" : "clathon.content",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"),
    "targetId" : ObjectId("5b966a1286f3cc8057216a17"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

## SDGs Population

**Nodes:**

Add SDG nodes in `knodes`  (`right button > Paste document(s)...`):

I18N support according to the approach:

- https://medium.com/@_PierreMary/approache-to-mongodb-internationalisation-i18n-with-meteor-584933ae71dc
- https://github.com/TAPevents/tap-i18n-db

```JSON
[
  {
      "name" : "NO POVERTY",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(1),
          goal: "To end poverty in all its forms everywhere by 2030.",
          desc: "More than 700 million people still live in extreme poverty and are struggling to fulfil the most basic needs like health, education, and access to water and sanitation, to name a few.The overwhelming majority of people living on less than $1.90 a day live in Southern Asia and sub-Saharan Africa. However, this issue also affects developed countries. Right now there are 30 million children growing up poor in the world’s richest countries",

      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "БЕЗ СИРОМАШТВА",
            dataContent: {
          		goal:  "Превазићи сиромаштво у свим облицима свуда у свету до 2030. године.",
            	desc: "Више од 700 милиона људи још увек живе у условима екстремног сиромаштва и боре се да задовоље своје најосновније животне потребе као што су здравље, образовање, приступ води и санитарним условима итд. Огромна већина људи који преживљавају са мање од  1.90 долара дневно живе у јужној Азији и потсахарској Африци. Међутим, овај проблем такође погађа и развијене земље. Тренутно има преко 30 милиона деце која живе у сиромаштву у најбогатијим земљама света."
            }   
		}   
      }
  },
  {
      "name" : "ZERO HUNGER",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(2),
          goal:  "To end hunger, achieve food security and improved nutrition and promote sustainable agriculture",
          desc: "A profound change of the global food and agriculture system is needed to nourish today’s 795 million hungry and the additional 2 billion people expected by 2050. Extreme hunger and malnutrition remains a barrier to sustainable development and creates a trap from which people cannot easily escape. Hunger and malnutrition mean less productive individuals, who are more prone to disease and thus often unable to earn more and improve their livelihoods."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "БЕЗ ГЛАДИ",
            dataContent: {
          		goal:  "Сузбити глад, обезбедити сигуран приступ храни, квалитетнију исхрану и промовисати одрживу пољопривреду",
            	desc: "Неопходна је темељна промена у глобалним системима земљорадње и обезбеђивања хране како би се прехранило данашњих 795 милиона гладних и додатних 2 милијарде људи који ће се према очекивањима придружити овом броју до 2050. године.  Екстремна глад и потхрањеност су и даље препрека одрживом развоју и представљају замку из које се људи не могу лако ослободити. Глад и потхрањеност значе мањи број продуктивних појединаца који су истовремено склонији болестима и самим тим онемогућени да зараде више и поправе своје животне услове."
            }   
		}   
      }
  },
  {
      "name" : "GOOD HEALTH AND WELL-BEING FOR PEOPLE",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(3),
          goal:  "Ensure healthy lives and promote well-being for all at all ages",
          desc: "Мore than 6 million children still die before their fifth birthday every year. 16,000 children die each day from preventable diseases such as measles and tuberculosis. Every day hundreds of women die during pregnancy or from child-birth related complications. In many rural areas, only 56 percent of births are attended by skilled professionals. AIDS is now the leading cause of death among teenagers in sub-Saharan Africa, a region still severely devastated by the HIV epidemic"
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "ДОБРО ЗДРАВЉЕ И БЛАГОСТАЊЕ",
            dataContent: {
          		goal:  "Обезбедити здрав живот и промовисати благостање за све грађане у свим животним добима",
            	desc: "Више од 6 милиона деце још увек умре пре свог петог рођендана сваке године. Шеснаест хиљада деце сваке године умре од болести које се могу спречити као што су заушке или туберкулоза. Сваког дана стотине жена умру током трудноће или од пост-порођајних компликација. У многим руралним областима, свега 56% порођаја обави адекватно обучено стручно особље. Сида је сада водећи узрок смртности међу тинејџерима у потсахарској Африци, која још увек представља област опустошену епидемијом вируса ХИВ-а"
            }   
		}   
      }
  },
  {
      "name" : "QUALITY EDUCATION",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(4),
          goal:  "Ensure inclusive and quality education for all and promote lifelong learning",
          desc: "While Sub-Saharan Africa made the greatest progress in primary school enrolment among all developing regions – from 52 percent in 1990, up to 78 percent in 2012 – large disparities still remain. Children from the poorest households are up to four times more likely to be out of school than those of the richest households. Disparities between rural and urban areas also remain high."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	"name" : "КВАЛИТЕТНО ОБРАЗОВАЊЕ",
            dataContent: {
          		goal:  "Обезбедити инклузивно и квалитетно образовање за све и промовисати учење током целог живота",
          		desc: "Упркос томе што је потсахарска Африка постигла највећи напредак у погледу броја уписаних ђака у основне школе међу свим регионима у развоју - са 52 процента у 1990. години до 78 процената у 2012. години - и даље остају велике недоследности. Постоји до четири пута већа вероватноћа да деца из најсиромашнијих домаћинстава нису укључена у образовни систем у односу на децу из најбогатијих домаћинства. Недоследност између руралних и урбаних подручја је такође и даље велика."
            }   
		}   
      }
  },
  {
      "name" : "GENDER EQUALITY",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(5),
          goal:  "Achieve gender equality and empower all women and girls",
          desc: "There are still huge inequalities in the labour market in some regions, with women systematically denied equal access to jobs. Sexual violence and exploitation, the unequal division of unpaid care and domestic work, and discrimination in public office, all remain huge barriers. It has been proven time and again, that empowering women and girls has a multiplier effect, and helps drive up economic growth and development across the board."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	"name" : "ЈЕДНАКОСТ ПОЛОВА",
            dataContent: {
          		goal:  "Остварити једнакост полова и оснажити све жене и девојке",
         		desc: "Још увек постоји велики проблем неједнакости на тржишту рада у неким регионима, док се женама систематски ускраћује једнак приступ пословима. Сексуално насиље и експлоатација, неједнака заступљеност полова у неплаћеним пословима бриге и неге, рад у домаћинству и дискриминација на јавним функцијама остају огромне препреке. Увек се изнова доказује да оснаживање жена и девојака има вишеструки ефекат и помаже да се успостави економски раст и развој у свим областима."
            }   
		}   
      }
  },
  {
      "name" : "CLEAN WATER AND SANITATION",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(6),
          goal:  "Ensure access to water and sanitation for all",
          desc: "Water scarcity affects more than 40 percent of people around the world, an alarming figure that is projected to increase with the rise of global temperatures as a result of climate change. In 2011, 10 countries are close to depleting their supply of renewable freshwater and must now rely on alternative sources. By 2050, it is projected that at least one in four people will be affected by recurring water shortages."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	"name" : "ЧИСТА ВОДА И САНИТАРИЈЕ",
            dataContent: {
          		goal:  "Обезбедити приступ води и санитарним условима за све",
          		desc: "Оскудица воде погађа више од 40%  људи широм света, што представља узнемирујући податак а тај број ће према проценама расти с порастом глобалних температура које су последица климатских промена. Према подацима из 2011. године, 10 земаља су биле близу исцрпљивања обновљивих ресурса воде за пиће и сада морају да се ослањају на алтернативне изворе. Процењује се да ће до 2050. године бар један од четворо људи бити погођен несташицом воде."
            }   
		}   
      }
  },

    /*
    *
    *
    TO DO - TO FINISH
    *
    *
    */

  {
      "name" : "ДОСТУПНА И ЧИСТА ЕНЕРГИЈА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(7),
          goal:  "Обезбедити приступ приступачним, поузданим, одрживим и савременим изворима енергије за све грађане",
          desc: "Између 1990. и 2010. године, број људи с приступом електричној енергији порастао је за 1,7 милијарди, а како се глобално становништво и даље повећава, повећаваће се и потреба за јефтином енергијом. Глобална економија која се ослања на потрошљу фосилних горива, као и повећање емисије гасова с ефектом стаклене баште ствара драстичне промене у нашем климатском систему, што  утиче на сваки континент. Једна од пет особа нема приступ електричној енергији, а како потражња наставља да расте, неопходно је значајно повећање производње обновљиве енергије широм света."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "ДОСТОЈАН РАД И ЕКОНОМСКИ РАСТ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(8),
          goal:  "Промовисати инклузиван и одржив економски раст, запосленост и хумане радне услове за све",
          desc: "У земљама у развоју средња класа сада чини више од 34% укупног броја запослених, што представља скоро утростручен број људи у периоду између 1991. и 2015. године. Међутим, у потоњим фазама опоравка глобалне  економије, темпо раста се успорава док се продубљују неједнакости а број радних места је недовољан да би оджао корак с растућом радном снагом. На основу података Међународне организације рада, више од 204 милиона људи било је незапослено у 2015. години"
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "ИНДУСТРИЈА, ИНОВАЦИЈА И ИНФРАСТРУКТУРА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(9),
          goal:  "Изградити стабилну инфраструктуру, промивисати одрживу индустријализацију и неговати иновативност",
          desc: "С обзиром да више од половине светске популације сада живи у градовима, јавни транспорт и обновљива енергија постају све важнији, као и развој нових индустрија и информационих и комуникационих технологија. Промовисање одрживих грана индустрије и улагање у научна истраживања и иновације су веома важни у циљу обезбеђивања одрживог развоја. Више од 4 милијарде људи још увек нема приступ интернету, а 90 процената од овог броја их живи у земљама у развоју."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "СМАЊЕНА НЕЈЕДНАКОСТ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(10),
          goal:  "Смањити неједнакост унутар земаља и на интернационалном плану",
          desc: "Неједнакост у погледу личног дохотка је у порасту, тако да 10 процената најбогатијег становништва зарађује до 40 посто укупне глобалне зараде. Десет процената најсиромашнијих зарађују свега између 2 и 7 посто укупне глобалне зараде. У земљама у развоју неједнакост је порасла за 11 процената ако се узме у обзир пораст популације."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "ОДРЖИВИ ГРАДОВИ И ЗАЈЕДНИЦЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(11),
          goal:  "Учинити градове инклузивним, безбедним, стабилним и одрживим",
          desc: "Више од половине светске популације сада живи у урбаним срединама. До 2050. године овај број ће се повећати на две трећине укупног човечанства. Одрживи развој се не може постићи без значајније трансформације начина на који се обавља изградња и управљање урбаним простором. Екстремно сиромаштво је често концентрисано у урбаним срединама, а државне и градске власти се боре да обезбеде одговарајући смештај растућем становништву у овим областима."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "ОДГОВОРНА ПОТРОШЊА И ПРОИЗВОДЊА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(12),
          goal:  "Обезбедити одрживе моделе потрошње и производње",
          desc: "Пољопривреда је највећи потрошач воде широм света, а на наводњавање одлази близу 70 посто свих водених ресурса за људску употребу. Ефикасно управљање системима за одлагање токсичног отпада и загађујућих материја представља важне параметре за постизање овог циља. Од једнаког је значаја и подстицање индустрије, предузећа и потрошача да рециклирају и смањују количину произведеног отпада.
"
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "КЛИМАТСКЕ АКЦИЈЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(13),
          goal:  "Предузети хитне мере у борби с климатским променама и њиховим последицама",
          desc: "Емисија  гасова са ефектом стаклене баште наставља да расте, и сада је више од 50 процената већа од нивоа из 1990. године. Док источна Европа и централна Азија нису велики емитери гасова с ефектом стаклене баште, ови региони трпе несразмерне последице климатских промена.Поплаве на западном Балкану уништиле су домове и раселиле хиљаде људи."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "ВОДЕНИ ЖИВОТ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(14),
          goal:  "Очувати и на одржив начин користити океане, мора и морске ресурсе",
          desc: "Више од три милијарде људи зависи од морског и приобалног биодиверзитета како би обезбедили средства за живот. Међутим, данас смо сведоци чињенице да је  30% светских залиха рибе прекомерно експлоатисано, што за последицу има да је њихов број пао испод нивоа на ком оне могу обезбедити одрживу бројност. Загађење мора које у највећој мери потиче од копнених извора достиже алармантне нивое, са просеком од 13.000 комада пластичног отпада на сваком квадратном километру океана."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "ЖИВОТ НА ЗЕМЉИ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(15),
          goal:  "Управљати шумама на одржив начин, борити се против опустињавања, зауставити и вратити уназад процес деградације земљишта, зауставити губитак биодиверзитета",
          desc: "While Sub-Saharan Africa made the greatest progress in primary school enrolment among all developing regions – from 52 percent in 1990, up to 78 percent in 2012 – large disparities still remain. Children from the poorest households are up to four times more likely to be out of school than those of the richest households. Disparities between rural and urban areas also remain high"
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "МИР, ПРАВДА И СНАЖНЕ ИНСТИТУЦИЈЕ",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(16),
          goal:  "Промовисати праведно, мирно и инклузивно друштвено окружење",
          desc: "Живимо у свету који је све више подељен. Неки региони уживају одрживе нивое мира, сигурности и просперитета, док други упадају у наизглед бескрајне циклусе сукоба и насиља. Оружани сукоби  и несигурност имају разоран утицај на развој земље, утичући на економски раст и често резултирајући дуготрајним непријатељствима које могу трајати генерацијама. Сексуално насиље, криминал, експлоатација и мучење су такође присутни када постоји сукоб или нема владавина права."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
  },
  {
      "name" : "ПАРТНЕРСТВА ЗА ОСТВАРЕЊЕ ЦИЉЕВА",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(17),
          goal:  "Подстаћи глобалну сарадњу у домену одрживог развоја",
          desc: "Циљеви одрживог развоја се могу реализовати само уз снажну посвећеност глобалном партнерству и сарадњи. Хуманитарне кризе изазване сукобима или природним непогодама и даље захтевају више финансијских средстава и помоћи. Многе земље такође захтевају Службу развојне помоћи за подстицање раста и трговине. Данас је свет међусобно повезан више него икада раније. Побољшање приступа технологији и знању је важан начин за размену идеја и подстицање иновација."
      },
      "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0),
      i18n: {
        rs: {
        	name: "",
            dataContent: {
          		goal:  "",
            	desc: ""
            }   
		}   
      }
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
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b9669e986f3cc8057216a15"),
    "targetId" : ObjectId("5b96cb8886f3cc8057216a37"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
  },
  {
    "_id" : ObjectId("5b4b22fd00ea790a4738a706"),
    "name" : "SDG",
    "type" : "const.sdgs.sdg",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b9669e986f3cc8057216a15"),
    "targetId" : ObjectId("5b96cb8986f3cc8057216a38"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
  },
  {
    "_id" : ObjectId("5b4b231e00ea790a4738a707"),
    "name" : "SDG",
    "type" : "const.sdgs.sdg",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b9669e986f3cc8057216a15"),
    "targetId" : ObjectId("5b96cb8986f3cc8057216a39"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
  },
  {
    "_id" : ObjectId("5b4d105a280f6211059ff60c"),
    "name" : "SDG",
    "type" : "const.sdgs.sdg",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b9669e986f3cc8057216a15"),
    "targetId" : ObjectId("5b96cb8986f3cc8057216a3a"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
  },
  {
    "_id" : ObjectId("5b4d105a280f6211059ff60c"),
    "name" : "SDG",
    "type" : "const.sdgs.sdg",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b9669e986f3cc8057216a15"),
    "targetId" : ObjectId("5b96cb8986f3cc8057216a3b"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
  },
  {
    "_id" : ObjectId("5b4d105a280f6211059ff60c"),
    "name" : "SDG",
    "type" : "const.sdgs.sdg",
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b9669e986f3cc8057216a15"),
    "targetId" : ObjectId("5b96cb8986f3cc8057216a3c"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-09-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
  }
]
```

## Opening Cards

### SDG Questions

#### Nodes

```
[
    {
          "name" : "How the future looks when this goal is fulfilled?",
          "iAmId" : ObjectId("556760847125996dc1a4a24f"),
          "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
          "type" : "const.dialogame.opening-card",
          "dataContent" : {
              "humanID" : NumberInt(1),
              img: "assets/images/sdgs/m/sdg1.jpg"
          },
          "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
          "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
          "visual" : {
              "isOpen" : true
          },
          "isPublic" : true,
          "version" : NumberInt(1),
          "activeVersion" : NumberInt(1),
          "__v" : NumberInt(0),
          i18n: {
            rs: {
                name: "Како изгледа будућност када је овај циљ испуњен"
            }   
          }
      },
      {
          "name" : "How the future looks when this goal is fulfilled?",
          "iAmId" : ObjectId("556760847125996dc1a4a24f"),
          "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
          "type" : "const.dialogame.opening-card",
          "dataContent" : {
              "humanID" : NumberInt(2),
              img: "assets/images/sdgs/m/sdg2.jpg"
          },
          "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
          "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
          "visual" : {
              "isOpen" : true
          },
          "isPublic" : true,
          "version" : NumberInt(1),
          "activeVersion" : NumberInt(1),
          "__v" : NumberInt(0),
          i18n: {
            rs: {
                name: "Како изгледа будућност када је овај циљ испуњен"
            }   
          }
      },
      {
          "name" : "How the future looks when this goal is fulfilled?",
          "iAmId" : ObjectId("556760847125996dc1a4a24f"),
          "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
          "type" : "const.dialogame.opening-card",
          "dataContent" : {
              "humanID" : NumberInt(3),
              img: "assets/images/sdgs/m/sdg3.jpg"
          },
          "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
          "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
          "visual" : {
              "isOpen" : true
          },
          "isPublic" : true,
          "version" : NumberInt(1),
          "activeVersion" : NumberInt(1),
          "__v" : NumberInt(0),
          i18n: {
            rs: {
                name: "Како изгледа будућност када је овај циљ испуњен"
            }   
          }
      },
      {
          "name" : "How the future looks when this goal is fulfilled?",
          "iAmId" : ObjectId("556760847125996dc1a4a24f"),
          "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
          "type" : "const.dialogame.opening-card",
          "dataContent" : {
              "humanID" : NumberInt(4),
              img: "assets/images/sdgs/m/sdg4.jpg"
          },
          "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
          "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
          "visual" : {
              "isOpen" : true
          },
          "isPublic" : true,
          "version" : NumberInt(1),
          "activeVersion" : NumberInt(1),
          "__v" : NumberInt(0),
          i18n: {
            rs: {
                name: "Како изгледа будућност када је овај циљ испуњен"
            }   
          }
      },
      {
          "name" : "How the future looks when this goal is fulfilled?",
          "iAmId" : ObjectId("556760847125996dc1a4a24f"),
          "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
          "type" : "const.dialogame.opening-card",
          "dataContent" : {
              "humanID" : NumberInt(5),
              img: "assets/images/sdgs/m/sdg5.jpg"
          },
          "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
          "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
          "visual" : {
              "isOpen" : true
          },
          "isPublic" : true,
          "version" : NumberInt(1),
          "activeVersion" : NumberInt(1),
          "__v" : NumberInt(0),
          i18n: {
            rs: {
                name: "Како изгледа будућност када је овај циљ испуњен"
            }   
          }
      },
      {
          "name" : "How the future looks when this goal is fulfilled?",
          "iAmId" : ObjectId("556760847125996dc1a4a24f"),
          "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
          "type" : "const.dialogame.opening-card",
          "dataContent" : {
              "humanID" : NumberInt(6),
              img: "assets/images/sdgs/m/sdg6.jpg"
          },
          "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
          "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
          "visual" : {
              "isOpen" : true
          },
          "isPublic" : true,
          "version" : NumberInt(1),
          "activeVersion" : NumberInt(1),
          "__v" : NumberInt(0),
          i18n: {
            rs: {
                name: "Како изгледа будућност када је овај циљ испуњен"
            }   
          }
      },
      {
          "name" : "How the future looks when this goal is fulfilled?",
          "iAmId" : ObjectId("556760847125996dc1a4a24f"),
          "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
          "type" : "const.dialogame.opening-card",
          "dataContent" : {
              "humanID" : NumberInt(7),
              img: "assets/images/sdgs/m/sdg7.jpg"
          },
          "updatedAt" : ISODate("2018-09-10T20:16:47.306+0000"),
          "createdAt" : ISODate("2018-09-10T20:16:47.301+0000"),
          "visual" : {
              "isOpen" : true
          },
          "isPublic" : true,
          "version" : NumberInt(1),
          "activeVersion" : NumberInt(1),
          "__v" : NumberInt(0),
          i18n: {
            rs: {
                name: "Како изгледа будућност када је овај циљ испуњен"
            }   
          }
      }

]
```

#### Edges

**TODO**

should connect them with **Content (node)** or with **Content (node)** -> **DialoGame**

## Users Population

### **Test User**

**email**: test_user@gmail.com

**pass**: pass

```JSON
{
    "_id" : ObjectId("5b97c7ab0393b8490bf5263c"),
    "name" : "Test",
    "type" : "rima.user",
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "dataContent" : {
        "hash" : "b4523dcbb2c79cb2347abfe3ac1d10d5d831abd664909d7c45a9d296ab9ee96f701894fe29a702984e92ba4d2fa9cda552ab98e06da1244ce644e7866dd80d52",
        "salt" : "480501a1e8fcf0f213a488489c10ea05",
        "email" : "test_user@gmail.com",
        "lastName" : "User",
        "firstName" : "Test"
    },
    "mapId" : ObjectId("5b96619b86f3cc8057216a03"),
    "updatedAt" : ISODate("2018-09-11T13:48:27.641+0000"),
    "createdAt" : ISODate("2018-09-11T13:48:27.624+0000"),
    "visual" : {
        "isOpen" : false
    },
    "isPublic" : true,
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1),
    "__v" : NumberInt(0)
}
```

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
