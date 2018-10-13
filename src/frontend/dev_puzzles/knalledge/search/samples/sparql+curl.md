# Sparql

+ SOH (SPARQL Over HTTP)
+ https://www.w3.org/TR/2013/REC-sparql11-http-rdf-update-20130321/
+ http://blog.mynarz.net/2015/05/curling-sparql-http-graph-store-protocol.html
+ https://gist.github.com/ColinMaudry/6fd6a5f610f0ac3e6696
+ https://jena.apache.org/documentation/fuseki2/soh.html
+ https://jena.apache.org/documentation/serving_data/

# cURL command

## SPARQL (GET/POST) example for DBpedia

+ ***`—data-urlencode`*** - uses HTTP **POST** verb, but it also **encodes** the data following the parameter. data should be **CGI-compliant** (name=value), in our example it is: `query='…'`
+ ***`-G`*** - this command **compensates** the switching to the POST verb effect of the command the `—data-urlencode`, and therefore the GET verb will be used instead and the `name=value` data will be appended to the URL with ***`?`*** separator (or ***`&`*** separator of not the first and only data)
  + NOTE: using the `-G` option is option-al :) = we will get proper response from the SPARQL endpoint
+ ***`—header`*** - provides additional HTTP headers
  + NOTE: you can ask either for XML
    + `Accept: application/sparql-results+xml`
  + or JSON
    + `Accept: application/sparql-results+json`
  + Extra info:
    + https://www.w3.org/TR/rdf-sparql-XMLres/
    + https://www.w3.org/2001/03mr/rdf_mt
      + `application/rdf+xml`

## Dirty way (pure http url)

Since POST verb is not required and media negotiation is not necessary to safe-drop to default types, we can use pure http request but then we have to manually encode url:

+ https://www.urlencoder.org/
+ https://www.url-encode-decode.com/

### SPARQL classes

Dirty way (pure http url): 

http://dbpedia.org/sparql?query=prefix%20owl%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%20prefix%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%20SELECT%20DISTINCT%20%3Fclass%20%3Flabel%20%3Fdescription%20WHERE%20%7B%20%20%3Fclass%20a%20owl%3AClass.%20%20OPTIONAL%20%7B%20%3Fclass%20rdfs%3Alabel%20%3Flabel%7D%20%20OPTIONAL%20%7B%20%3Fclass%20rdfs%3Acomment%20%3Fdescription%7D%7D

Cleaner way with curl:

```sh
curl --header "Accept: application/sparql-results+json"  -G  'http://dbpedia.org/sparql' --data-urlencode query='prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?class ?label ?description WHERE {  ?class a owl:Class.  OPTIONAL { ?class rdfs:label ?label}  OPTIONAL { ?class rdfs:comment ?description}}'
```

### SPARQL data

Dirty way (pure http url):

http://dbpedia.org/sparql?query=prefix%20owl%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%20prefix%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%20SELECT%20DISTINCT%20%3Fsubject%20%3Fpredicate%20%3Fobject%20WHERE%20%7B%3Fsubject%20%3Fpredicate%20%3Fobject%7D%20LIMIT%20100

Cleaner way with curl:

```sh
curl --header "Accept: application/sparql-results+json"  -G  'http://dbpedia.org/sparql' --data-urlencode query='prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 100'
```