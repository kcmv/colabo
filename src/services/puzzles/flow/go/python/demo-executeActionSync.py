# __package__ = "use-cases"

# NOTE:
# ColaboFlow.Go version of the previous

import uuid
import json
# from colabo.flow.go import ColaboFlowGo, go_pb2
from colabo.flow.go import ColaboFlowGo
from colabo.flow.go import go_pb2

from random import randint
from time import sleep

colaboFlowGo = ColaboFlowGo()


print("colaboFlowGo = %s" % (colaboFlowGo))

requestData = {
    'query': 'PREFIX cc: <http://creativecommons.org/ns#>\nPREFIX ac: <https://w3id.org/ac-ontology/aco#>\nPREFIX dc: <http://purl.org/dc/elements/1.1/>\nPREFIX iter: <http://w3id.org/sparql-generate/iter/>\nPREFIX fn: <http://w3id.org/sparql-generate/fn/>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX prov: <http://www.w3.org/ns/prov#>\nPREFIX foaf: <http://xmlns.com/foaf/0.1/>\nPREFIX schema: <http://schema.org/>\nPREFIX ebu: <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#>\n\nPREFIX europeana-res: <https://w3id.org/audiocommons/services/europeana/resources>\n\nPREFIX europeana-api: <https://www.europeana.eu/api/v2/>\n\n            GENERATE {\n            \nGENERATE {\n\n  GENERATE {\n    <http://europeana.eu>\n        rdf:type prov:Agent, foaf:Organization ;\n        foaf:name "Europeana" .\n\n    ?searchAction\n        a schema:SearchAction ;\n        schema:object <http://europeana.eu> ;\n        schema:query $pattern ;\n        schema:startTime $startTime;\n        schema:endTime ?endTime;\n        schema:actionStatus ?actionStatus;\n        schema:result ?audioCollection ;\n        schema:error ?error .\n\n    ?audioCollection\n        rdf:type ac:AudioCollection; #, prov:Entity ;\n    #    prov:wasAttributedTo <http://europeana.eu> ;\n        ac:nodeCount ?nodeCount .\n\n    ?error rdfs:label ?errorMessage .\n\n    GENERATE {\n      ?audioCollection ac:memberNode ?audioCollectionNode .\n      ?audioCollectionNode\n          a ac:AudioCollectionNode ;\n          ac:nodeIndex ?index ;\n          ac:nodeContent ?audioClip .\n\n      ?audioClip\n          rdf:type ac:AudioClip ;\n          dc:title ?title ;\n  \t      dc:description ?desc ;\n  \t      ac:author ?author ;\n  \t      cc:license ?license ;\n  #\t      ac:originalFile _:originalFile ;\n          ac:availableAs ?audioPreviewFile .\n  #        rdf:type prov:Entity ;\n  #        prov:wasAttributedTo <http://europeana.eu> .\n      ?audioPreviewFile rdf:type ac:AudioFile ;\n          ebu:locator ?audioPreviewFileUrl .\n\n    }\n    ITERATOR iter:JSONElement(?source,"items[*]") AS ?resIterator\n    WHERE {\n      BIND(BNODE() AS ?audioCollectionNode)\n      BIND(fn:JSONPath(?resIterator, "element") AS ?res)\n      BIND(fn:JSONPath(?resIterator, "position") AS ?indexFromZero)\n      BIND(?indexFromZero + 1 AS ?index)\n\n      BIND(IRI(CONCAT(STR(europeana-res:), STR(fn:JSONPath(?res, "id")))) AS ?audioClip)\n      BIND(fn:JSONPath(?res, "type") AS ?type)\n      BIND(fn:JSONPath(?res, "title[0]") AS ?title)\n      BIND(IRI(fn:JSONPath(?res, "rights[0]")) AS ?license)\n      BIND(fn:JSONPath(?res, "dcCreator[0]") AS ?author)\n      BIND(fn:JSONPath(?res, "dcDescription[0]") AS ?desc)\n  #    BIND(IRI(fn:JSONPath(?res, "edmIsShownAt[0]")) AS ?origFile)\n      BIND(IRI(fn:JSONPath(?res, "edmIsShownBy[0]")) AS ?audioPreviewFileUrl)\n      OPTIONAL {\n        BIND(BNODE() AS ?audioPreviewFile).\n        FILTER(BOUND(?audioPreviewFileUrl))\n      }\n    } .\n  }\n  SOURCE ?serviceCall AS ?source\n  WHERE {\n    BIND(BNODE() AS ?searchAction)\n    BIND(fn:JSONPath(?source, "success") AS ?wasSuccessful)\n    BIND(IF(BOUND(?wasSuccessful), schema:CompletedActionStatus, schema:FailedActionStatus) AS ?actionStatus)\n    OPTIONAL {\n    \tBIND(BNODE() AS ?audioCollection) .\n      FILTER(BOUND(?wasSuccessful))\n    }\n    OPTIONAL {\n    \tBIND(BNODE() AS ?error) .\n      FILTER(!BOUND(?wasSuccessful))\n    }\n    BIND(fn:JSONPath(?source, "error") AS ?errorMessage)  .\n    BIND(NOW() AS ?endTime)\n  } .\n}\nWHERE {\n  BIND(IRI(CONCAT(\n      STR(europeana-api:), "search.json",\n      "?wskey=", ENCODE_FOR_URI("6NPvpkHH4"),\n      "&qf=what:SOUND",\n      "&reusability=RESTRICTED&reusability=OPEN",\n      "&media=true&profile=rich",\n      "&query=", ENCODE_FOR_URI($pattern),\n      IF(BOUND($limit), CONCAT("&rows=", ENCODE_FOR_URI(STR($limit))),""),\n      IF(BOUND($page), CONCAT("&start=", ENCODE_FOR_URI(STR($limit * ($page - 1) + 1))),"")\n  )) AS ?serviceCall)\n}\n.\n            }\n            WHERE {\n            BIND("dog" AS $pattern). BIND("2018-12-17T16:35:15.874683"^^<http://www.w3.org/2001/XMLSchema#dateTime> AS $startTime). BIND(12 AS $limit). BIND(1 AS $page).\n            } '}

requestDataStr = json.dumps(requestData)
request = go_pb2.ActionExecuteRequest(
    flowId='search-sounds', name='sparql-gen', flowInstanceId='fa23', dataIn=requestDataStr)
response = colaboFlowGo.executeActionSync(request)
print("response = %s" % (response))

# request = go_pb2.ActionExecuteRequest(
#     flowId='search-sounds', name='mediator', flowInstanceId='fa23', dataIn='hello from client', params='quick')
# response = colaboFlowGo.executeActionSync(request)
# print("response = %s" % (response))
