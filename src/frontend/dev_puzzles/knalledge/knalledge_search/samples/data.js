curl --header "Accept: application/sparql-results+json"  -G  'http://fdbsun1.cs.umu.se:3030/demo3models/query' --data-urlencode query='prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 100'

{
  "head": {
    "vars": [ "subject" , "predicate" , "object" ]
  } ,
  "results": {
    "bindings": [
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/525972ece5cf44c2a7619ee809e92cb5" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/525972ece5cf44c2a7619ee809e92cb5" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "525972ece5cf44c2a7619ee809e92cb5" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/525972ece5cf44c2a7619ee809e92cb5" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/525972ece5cf44c2a7619ee809e92cb5" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/525972ece5cf44c2a7619ee809e92cb5" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/525972ece5cf44c2a7619ee809e92cb5" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/773b93dc0e3deaf76c6ea851d8199bd1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/773b93dc0e3deaf76c6ea851d8199bd1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "773b93dc0e3deaf76c6ea851d8199bd1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/773b93dc0e3deaf76c6ea851d8199bd1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/birthday" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "1977-08-27" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/773b93dc0e3deaf76c6ea851d8199bd1" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/773b93dc0e3deaf76c6ea851d8199bd1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/773b93dc0e3deaf76c6ea851d8199bd1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "35" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/773b93dc0e3deaf76c6ea851d8199bd1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "28" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bced78d9f60bfbb67c897111fdc3d1a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "3" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bced78d9f60bfbb67c897111fdc3d1a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "1bced78d9f60bfbb67c897111fdc3d1a" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bced78d9f60bfbb67c897111fdc3d1a" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bced78d9f60bfbb67c897111fdc3d1a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bced78d9f60bfbb67c897111fdc3d1a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bced78d9f60bfbb67c897111fdc3d1a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "293" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e359824c359b52e86e1575700033c91e" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e359824c359b52e86e1575700033c91e" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "e359824c359b52e86e1575700033c91e" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e359824c359b52e86e1575700033c91e" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/birthday" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "1991-08-19" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e359824c359b52e86e1575700033c91e" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e359824c359b52e86e1575700033c91e" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e359824c359b52e86e1575700033c91e" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "21" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e359824c359b52e86e1575700033c91e" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "95" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bb1ec4fff0f13f2fbf7aa54c40b9975" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bb1ec4fff0f13f2fbf7aa54c40b9975" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "1bb1ec4fff0f13f2fbf7aa54c40b9975" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bb1ec4fff0f13f2fbf7aa54c40b9975" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bb1ec4fff0f13f2fbf7aa54c40b9975" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bb1ec4fff0f13f2fbf7aa54c40b9975" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/1bb1ec4fff0f13f2fbf7aa54c40b9975" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/b431101468761caaaaffb9fdcb764445" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/b431101468761caaaaffb9fdcb764445" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "b431101468761caaaaffb9fdcb764445" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/b431101468761caaaaffb9fdcb764445" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/b431101468761caaaaffb9fdcb764445" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/b431101468761caaaaffb9fdcb764445" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/b431101468761caaaaffb9fdcb764445" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/21b8ec76698b3f3bb4d46f126e2e46f6" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/21b8ec76698b3f3bb4d46f126e2e46f6" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "21b8ec76698b3f3bb4d46f126e2e46f6" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/21b8ec76698b3f3bb4d46f126e2e46f6" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/birthday" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "1984-11-02" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/21b8ec76698b3f3bb4d46f126e2e46f6" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/21b8ec76698b3f3bb4d46f126e2e46f6" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/21b8ec76698b3f3bb4d46f126e2e46f6" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "28" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/21b8ec76698b3f3bb4d46f126e2e46f6" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1033" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/f55f08076b792ee37014056617915411" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/f55f08076b792ee37014056617915411" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "f55f08076b792ee37014056617915411" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/f55f08076b792ee37014056617915411" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/birthday" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "1995-11-21" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/f55f08076b792ee37014056617915411" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/f55f08076b792ee37014056617915411" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/f55f08076b792ee37014056617915411" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "17" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/f55f08076b792ee37014056617915411" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e22e4963e4fd387b3083a23222a742c8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e22e4963e4fd387b3083a23222a742c8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "e22e4963e4fd387b3083a23222a742c8" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e22e4963e4fd387b3083a23222a742c8" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e22e4963e4fd387b3083a23222a742c8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e22e4963e4fd387b3083a23222a742c8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/e22e4963e4fd387b3083a23222a742c8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/36bc78204aaf7164357882a6023e74d1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "2" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/36bc78204aaf7164357882a6023e74d1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "36bc78204aaf7164357882a6023e74d1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/36bc78204aaf7164357882a6023e74d1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/birthday" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "1978-02-01" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/36bc78204aaf7164357882a6023e74d1" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/36bc78204aaf7164357882a6023e74d1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/36bc78204aaf7164357882a6023e74d1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "34" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/36bc78204aaf7164357882a6023e74d1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "110" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/5a229d182c211431412fe63d42d0a02c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/5a229d182c211431412fe63d42d0a02c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "5a229d182c211431412fe63d42d0a02c" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/5a229d182c211431412fe63d42d0a02c" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/5a229d182c211431412fe63d42d0a02c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/5a229d182c211431412fe63d42d0a02c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/5a229d182c211431412fe63d42d0a02c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/38435b793c411876d314b92f507b2e9c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/38435b793c411876d314b92f507b2e9c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "38435b793c411876d314b92f507b2e9c" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/38435b793c411876d314b92f507b2e9c" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/38435b793c411876d314b92f507b2e9c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/38435b793c411876d314b92f507b2e9c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/38435b793c411876d314b92f507b2e9c" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/cd0fc6f315946b8b51c48d281fae959a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "2" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/cd0fc6f315946b8b51c48d281fae959a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "cd0fc6f315946b8b51c48d281fae959a" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/cd0fc6f315946b8b51c48d281fae959a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/birthday" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "1990-09-04" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/cd0fc6f315946b8b51c48d281fae959a" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/cd0fc6f315946b8b51c48d281fae959a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/cd0fc6f315946b8b51c48d281fae959a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "22" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/cd0fc6f315946b8b51c48d281fae959a" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "39" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/da773ef9795bf8176a2d78d69849b5a8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/da773ef9795bf8176a2d78d69849b5a8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "da773ef9795bf8176a2d78d69849b5a8" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/da773ef9795bf8176a2d78d69849b5a8" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/da773ef9795bf8176a2d78d69849b5a8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "0" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/da773ef9795bf8176a2d78d69849b5a8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/da773ef9795bf8176a2d78d69849b5a8" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/77ea3564cbe30bf0f539cb4cb6d7b865" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "-1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/77ea3564cbe30bf0f539cb4cb6d7b865" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "77ea3564cbe30bf0f539cb4cb6d7b865" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/77ea3564cbe30bf0f539cb4cb6d7b865" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/birthday" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "1992-05-13" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/77ea3564cbe30bf0f539cb4cb6d7b865" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/77ea3564cbe30bf0f539cb4cb6d7b865" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/gender" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/77ea3564cbe30bf0f539cb4cb6d7b865" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/age" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "20" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/77ea3564cbe30bf0f539cb4cb6d7b865" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/network_size" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "74" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/a503ce08fa647a4ee42f8b306a94aac1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/interested_in" } ,
        "object": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#int" , "value": "1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/a503ce08fa647a4ee42f8b306a94aac1" } ,
        "predicate": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/0.1/userid" } ,
        "object": { "type": "literal" , "value": "a503ce08fa647a4ee42f8b306a94aac1" }
      } ,
      {
        "subject": { "type": "uri" , "value": "http://mypersonality.ddm.cs.umu.se/a503ce08fa647a4ee42f8b306a94aac1" } ,
        "predicate": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" } ,
        "object": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" }
      }
    ]
  }
}
