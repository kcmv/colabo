curl --header "Accept: application/sparql-results+json"  -G  'http://fdbsun1.cs.umu.se:3030/demo3models/query' --data-urlencode query='prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?class ?label ?description WHERE {  ?class a owl:Class.  OPTIONAL { ?class rdfs:label ?label}  OPTIONAL { ?class rdfs:comment ?description}}'

{
  "head": {
    "vars": [ "class" , "label" , "description" ]
  } ,
  "results": {
    "bindings": [
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "cNEU" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "cCON" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "sEXT" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "cEXT" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "userid" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "status" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "cAGR" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "sOPN" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "cOPN" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "sCON" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "sAGR" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/myPersonality" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "sNEU" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "relationship_status" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "birthday" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "mf_friendship" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "timezone" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "locale" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "mf_relationship" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "mf_dating" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "interested_in" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "userid" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "mf_networking" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "network_size" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "age" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "mf_random" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "gender" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      } ,
      {
        "class": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/Demographic" } ,
        "label": { "type": "literal" , "xml:lang": "en" , "value": "mf_whatever" } ,
        "description": { "type": "literal" , "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" , "value": "Human readable property of Facebook user. Datatype: String" }
      }
    ]
  }
}
