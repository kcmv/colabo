# cURL command

## SPARQL (POST) example

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

### SPARQL classes

```sh
curl --header "Accept: application/sparql-results+json"  -G  'http://fdbsun1.cs.umu.se:3030/demo3models/query' --data-urlencode query='prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?class ?label ?description WHERE {  ?class a owl:Class.  OPTIONAL { ?class rdfs:label ?label}  OPTIONAL { ?class rdfs:comment ?description}}'
```

### SPARQL data

```sh
curl --header "Accept: application/sparql-results+json"  -G  'http://fdbsun1.cs.umu.se:3030/demo3models/query' --data-urlencode query='prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 100'
```