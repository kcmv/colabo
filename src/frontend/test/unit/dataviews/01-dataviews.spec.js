//var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
//chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;

xdescribe("Dataviews directive", function() {
	console.log("\n\n=================================\n\nDataviews.spec\n\n=================================\n\n");

	var $compile
		, $q
		, $rootScope
		, $timeout
		, $httpBackend
		, link
		, element
		, $scope
		, $isolateScope;

	// Load our app module definition before each test.
	// beforeEach(module('bukvikApp'));

	// Load our app module definition before each test.
	beforeEach(module('dataviewsDirectives'));

	afterEach(function() {
		//dealoc(element);
	});

	it('should pass', function() {
		expect(true).to.be.true;
	});

	describe("dataviewDiagramCheckbox", function(){

		// The external template file referenced by templateUrl
		beforeEach(module('partials/dataview/diagram-checkbox.html'));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function(_$compile_, _$rootScope_) {
			// The injector unwraps the underscores (_) from around the parameter names when matching
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			
			// creating and setting up the external scope,
			// the scope of the element surrounding the directive of our interest
			$scope = $rootScope.$new(); // $new is not super necessary
			$scope.dataview = {
					"color": "#8888ff"
			};
		}));
		
		beforeEach(function() {
			// compile HTML containing the directive
			link = $compile("<dataview-diagram-checkbox dataview-item='dataview'></dataview-diagram-checkbox>");
		});

		it('replaces the element with the appropriate content', function() {
			console.log("\n\n=================================\n\n Dataviews.spec dataviewDiagramCheckbox\n\n=================================\n\n");
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();
			// Check that the compiled element contains the templated content and $scope property
		    expect(element.find("div").css('color')).equal('rgb(136, 136, 255)');
		    expect(element.find("spectrum-colorpicker")).not.to.be.null;
		    expect(element.find("spectrum-colorpicker").length).to.be.equal(1);
		    console.log("find length: " + element.find("spectrum-colorpicker").length);
		});

		it('scope change propagating to view', function() {
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			console.log("element.find('div').css('color'): %s", element.find("div").css('color'));
		    expect(element.find("div").css('color')).not.equal('rgb(136, 136, 255)');
			$scope.$digest();
			console.log("element.find('div').css('color'): %s", element.find("div").css('color'));
		    expect(element.find("div").css('color')).equal('rgb(136, 136, 255)');
			$scope.dataview.color = "#88ffff";
			$scope.$digest();
		    expect(element.find("div").css('color')).equal('rgb(136, 255, 255)');
		});

		it('dataviewDiagramCheckbox - inner isolated scope', function() {
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();
		    console.log("$scope.onColorChange: %s", $scope.onColorChange);
		    expect($scope.onColorChange).to.be.undefined; // right, it is in the internal isolated scope of directive
		    // right, element.scope(), returns scope of element CONTAINING observed (dataviewDiagramCheckbox) directive
		    expect($scope).to.be.equal(element.scope());
		    $isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element
		 // right, our directive (dataviewDiagramCheckbox) has it is own internal isolated scope
		    expect($scope).not.to.be.equal($isolateScope);

		    console.log("$isolateScope.onColorChange: %s", $isolateScope.onColorChange);
			 // we should find onColorChange in the internal isolated scope of the directive
		    expect($isolateScope.onColorChange).not.to.be.undefined;
		});

		it('dataviewDiagramCheckbox - accessing methods in inner isolated scope', function() {
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();
		    $isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element
		    
		    expect(element.find("div").css('color')).equal('rgb(136, 136, 255)');
		    $isolateScope.onColorChange("#ffff00");
		    expect(element.find("div").css('color')).not.equal('rgb(255, 255, 0)');
			$scope.$digest();
		    expect(element.find("div").css('color')).equal('rgb(255, 255, 0)');

		    mySpy = sinon.spy();
		    $isolateScope.onColorChange = mySpy;
		    expect(mySpy.callCount).to.equal(0);
		    $isolateScope.onColorChange("#ff0000");
		    expect(mySpy.callCount).to.equal(1);
			$scope.$digest();
		    expect(element.find("div").css('color')).not.equal('rgb(255, 0, 0)'); // since we replaced method with the spy one
		});

		it('dataviewDiagramCheckbox - spying on methods in the inner isolated scope', function() {
			element = link($scope);
			$scope.$digest();
		    $isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element
		    
		    expect(element.find("div").css('color')).equal('rgb(136, 136, 255)');

		    mySpy = sinon.spy();
		    $isolateScope.onColorChange = mySpy;
		    expect(mySpy.callCount).to.equal(0);
		    $isolateScope.onColorChange("#ff0000");
		    expect(mySpy.callCount).to.equal(1);
			$scope.$digest();
			// since we have replaced the method with the spy one
		    expect(element.find("div").css('color')).not.equal('rgb(255, 0, 0)');
		});
	});
	
	describe("DataviewDistributionDiagramShow", function(){
		var manipulation
		, datasetTest
		, DatasService
		, DatasetsService
		, ExperimentAnalysisService
		, datasetOriginal;

		beforeEach(module('Config'));
		beforeEach(module('dataTalksServices'));
		beforeEach(module('bukvikServices'));
		beforeEach(module('partials/dataview/diagram-checkbox.html'));
		beforeEach(module('partials/dataview/distribution-diagram-raphael.html'));
		beforeEach(module('partials/dataview/distribution-diagram-show.html'));
		

		// http://docs.angularjs.org/api/ng.$http
		// For unit testing applications that use $http service, see $httpBackend mock
		// http://docs.angularjs.org/api/ngMock.$httpBackend

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function(_$httpBackend_) {
			$httpBackend = _$httpBackend_;

			$httpBackend.whenGET('http://localhost:8088/datas/8/many-name/zhenia-master.data.gary-in-english:pos-joined.json')
			.respond(200, 
				')]}'+"',\n"+
				JSON.stringify(
					{"data":[
						{
							"id":297,
							"name":"zhenia-master.data.gary-in-english:pos-joined",
							"iAmId":2,
							"version":1,
							"ideaId":8,
							"isPublic":true,
							"decoratedDataId":null,
							"createdAt":"2014-12-13T07:17:06.000Z"
						},{
							"id":296,
							"name":"zhenia-master.data.gary-in-english:pos-joined",
							"iAmId":2,
							"version":1,
							"ideaId":8,
							"isPublic":true,
							"decoratedDataId":null,
							"createdAt":"2014-12-12T16:20:32.000Z"
						}
					],
					"accessId":2
					}
				)
			);

			$httpBackend.whenGET('http://localhost:8088/datas/8/one/296.json')
			.respond(200, 
				')]}'+"',\n"+ JSON.stringify(
						{
							"data":{
								"id":296,
								"name":"zhenia-master.data.gary-in-english:pos-joined",
								"iAmId":2,
								"version":1,
								"ideaId":8,
								"dataContentSerialized":
									"{\"name\":\"Gary in english - stats\",\"name-id\":\"gary-in-english-stats\",\"diagramType\":\"distribution.diagram\",\"datasetType\":\"one-dataset\",\"datasetId\":\"zhenia-master.data.gary-in-english.pos-joined\",\"projectName\":\"zhenia-master\",\"JSONTransformFrontend\":\"$.{data}['stats.results']{[*]}.SimpleStats{[*]}.ALL{['RESULT_ITEMS_COUNT', 'RESULT_HITS_COUNT']}\",\"JSONTransformBackend\":\"$.{data}['stats.results']{[*]}.SimpleStats{[*]}.ALL{['RESULT_ITEMS_COUNT', 'RESULT_HITS_COUNT']}\",\"$id\":296,\"$$hashKey\":\"05B\",\"prefs\":{\"datasetsNamesOrders\":[\"SkiBum-en\",\"corpus-en\",\"EurEd-en\",\"WhiteDog-en\",\"LadyL-en\",\"Genghis-en\"],\"colors\":[\"#FFFF88\",\"#8c0303\",\"#bc2b03\",\"#ffbd94\",\"#f65050\",\"#a1816e\"]}}",
								"isPublic":true,
								"decoratedDataId":null
							},
							"accessId":4
						}
					)
			);
	    
			$httpBackend.whenGET('http://localhost:8088/datas/8/one/297.json')
			.respond(200, 
				')]}'+"',\n"+ JSON.stringify(
						{
							"data":{
								"id":297,
								"name":"zhenia-master.data.gary-in-english:pos-joined",
								"iAmId":2,
								"version":1,
								"ideaId":8,
								"dataContentSerialized":"{\"name\":\"Gary in english - unigrams\",\"name-id\":\"gary-in-english-unigrams\",\"diagramType\":\"distribution.diagram\",\"datasetType\":\"one-dataset\",\"datasetId\":\"zhenia-master.data.gary-in-english.pos-joined\",\"projectName\":\"zhenia-master\",\"JSONTransformFrontend\":\"$.{data}['pos.distribution']{[*]}[\\\"1\\\"][*][0,2]\"}",
								"isPublic":true,
								"decoratedDataId":null
							},
							"accessId":3
						}
					)
			);

			datasetOriginal = {
					  "dataset": [
					    {
					      "data": {
					        "stats.results": {
					          "WhiteDog-en": {
					            "SimpleStats": {
					              "paragraphLengthInWords": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 11,
					                  "RESULT_HITS_COUNT": 94736
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                }
					              },
					              "sentenceLength": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2200,
					                  "RESULT_HITS_COUNT": 30781
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 6595,
					                  "RESULT_HITS_COUNT": 94736
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2202,
					                  "RESULT_HITS_COUNT": 30633
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2193,
					                  "RESULT_HITS_COUNT": 33322
					                }
					              },
					              "paragraphLengthInSentences": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 11,
					                  "RESULT_HITS_COUNT": 6595
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                }
					              }
					            }
					          },
					          "corpus-en": {
					            "SimpleStats": {
					              "paragraphLengthInWords": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 1,
					                  "RESULT_HITS_COUNT": 548664
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                }
					              },
					              "sentenceLength": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 10095,
					                  "RESULT_HITS_COUNT": 151153
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 30284,
					                  "RESULT_HITS_COUNT": 548664
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 10095,
					                  "RESULT_HITS_COUNT": 162544
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 10094,
					                  "RESULT_HITS_COUNT": 234967
					                }
					              },
					              "paragraphLengthInSentences": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 1,
					                  "RESULT_HITS_COUNT": 30284
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                }
					              }
					            }
					          },
					          "SkiBum-en": {
					            "SimpleStats": {
					              "paragraphLengthInWords": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2,
					                  "RESULT_HITS_COUNT": 72186
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                }
					              },
					              "sentenceLength": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2058,
					                  "RESULT_HITS_COUNT": 24828
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 6173,
					                  "RESULT_HITS_COUNT": 72186
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2058,
					                  "RESULT_HITS_COUNT": 22990
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2057,
					                  "RESULT_HITS_COUNT": 24368
					                }
					              },
					              "paragraphLengthInSentences": {
					                "MIDDLE": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "ALL": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 2,
					                  "RESULT_HITS_COUNT": 6173
					                },
					                "END": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                },
					                "BEGIN": {
					                  "RESULT_EXAMPLES": [],
					                  "RESULT_ITEMS_COUNT": 0,
					                  "RESULT_HITS_COUNT": 0
					                }
					              }
					            }
					          }
					        }
					      }
					    }
					  ],
					  "accessId": 5
					};
			
			$httpBackend.whenGET('http://localhost:8088/datasets/one-dataset/zhenia-master/zhenia-master.data.gary-in-english.pos-joined.json')
			.respond(200, 
				//')]}'+"',\n"+ 
				JSON.stringify(datasetOriginal)
			);
		}));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function(_$q_, _$compile_, _$rootScope_, _$timeout_, _DatasService_, _DatasetsService_, _ExperimentAnalysisService_) {
			// The injector unwraps the underscores (_) from around the parameter names when matching
			$q = _$q_;
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$timeout = _$timeout_;
			DatasService = _DatasService_;
			DatasetsService = _DatasetsService_;
			ExperimentAnalysisService = _ExperimentAnalysisService_;
			console.log("ExperimentAnalysisService: %s", JSON.stringify(ExperimentAnalysisService, null, "\t"));
			// Just for testing
//			ExperimentAnalysisService.queryFull("zhenia-master.data.gary-in-english", "pos-joined", function(analyses){
//				console.log("analyses: %s", JSON.stringify(analyses, null, "\t"));
//			});
//			$httpBackend.flush();
			
		}));
		
		beforeEach(function(){
			// creating and setting up the external scope,
			// the scope of the element surrounding the directive of our interest
			$scope = $rootScope.$new(); // $new is not super necessary
			$scope.dataviewItem = 
				ExperimentAnalysisService.get(296, function(analyses){
						var cache = [];
						var dataStr = JSON.stringify(analyses, function(key, value) {
						    if (typeof value === 'object' && value !== null) {
						        if (cache.indexOf(value) !== -1) {
						            // Circular reference found, discard key
						        	console.log("JSON.Caching: key=%s", key);
						            return;
						        }
						        // Store value in our collection
						        cache.push(value);
						    }
						    return value;
						});
						cache = null; // Enable garbage collection
						console.log("ExperimentAnalysisService: analysis: ", dataStr);
						console.log("[TESTING] analyses: %s", dataStr);
					});
			$scope.dataset = DatasetsService.get({projectName: "zhenia-master", searchParam: "zhenia-master.data.gary-in-english.pos-joined", 
				type: "one-dataset"}, function(datasetLocal){
					$scope.datasetsManipulation.setDataset($scope.dataset);
				});
			bukvik.dataset.Manipulation.Q = $q;
			$scope.datasetsManipulation = new bukvik.dataset.Manipulation($scope.dataset, true);

			$q.all([$scope.dataviewItem.$promise, $scope.dataset.$promise]).then(function() {
				expect($scope.datasetsManipulation.getDataset().data).to.have.property("stats.results");
				expect($scope.datasetsManipulation.getDataset().data['stats.results']).to.have.property("WhiteDog-en");
				expect($scope.datasetsManipulation.getDataset().data['stats.results']['WhiteDog-en']).to.have.property("SimpleStats");
				expect($scope.datasetsManipulation.getDataset().data['stats.results']['WhiteDog-en'].SimpleStats).to.have.property("paragraphLengthInWords");
				expect($scope.datasetsManipulation.getDataset().data['stats.results']['WhiteDog-en'].SimpleStats.paragraphLengthInWords).to.have.property("ALL");
				expect($scope.datasetsManipulation.getDataset().data['stats.results']['WhiteDog-en'].SimpleStats.paragraphLengthInWords.ALL).to.have.property("RESULT_HITS_COUNT");
				
				console.log("[TESTING] $scope.datasetsManipulation processing finished. $scope.datasetsManipulation.datasets: ", $scope.datasetsManipulation.getDataset());
				$scope.datasetsManipulation.JSONParseDataset($scope.dataviewItem.JSONTransformFrontend);
				expect($scope.datasetsManipulation.getDataset()).to.have.property("content");
				expect($scope.datasetsManipulation.getDataset().content).to.have.property("WhiteDog-en");
				expect($scope.datasetsManipulation.getDataset().content['WhiteDog-en']).to.have.length(3);
				expect($scope.datasetsManipulation.getDataset().content['WhiteDog-en'][0]).to.have.length(2);
				expect($scope.datasetsManipulation.getDataset().content['WhiteDog-en'][0][0]).to.be.equal("paragraphLengthInWords");
				expect($scope.datasetsManipulation.datasetsNames).to.have.length(3);
				expect($scope.datasetsManipulation.datasetsNames).to.be.deep.equal(["WhiteDog-en", "corpus-en", "SkiBum-en"]);

				console.log("[TESTING] $scope.datasetsManipulation processing finished. $scope.datasetsManipulation.datasetsNames: ", $scope.datasetsManipulation.datasetsNames);
				$scope.datasetsManipulation.setProcessingFinished();
			});
			$httpBackend.flush();
//			done();
		});
		
		beforeEach(function() {
			console.log("[TESTING] compiling <dataview-distribution-diagram-show>");
			// compile HTML containing the directive
			link = $compile("<dataview-distribution-diagram-show " +
					"dataview-item=\"dataviewItem\" dataset-item=\"dataset\" dataset-manipulation-item=\"datasetsManipulation\">" +
					"</dataview-distribution-diagram-show>");
			//link = $compile("<b>da</b>");
		});

		it('replaces the element with the appropriate TEMPLATE content', inject(function ($rootScope, $compile, ExperimentAnalysisService) {
			console.log("\n\n=================================\n\n Dataviews.spec DataviewDistributionDiagramShow\n\n=================================\n\n");
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();

			// check if template is injected properly
			//expect(element.hasClass("dataview-distribution-diagram-show")).to.be.true;
			//console.log("[TEST] element: %s", element.text());
		    expect(element.find("div").first().hasClass("dataview-distribution-diagram-show")).to.be.true;
		    expect(element.find(".diagram-items").length).to.be.equal(1);
		}));

		it('scope values', function () {
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element

			expect($isolateScope.datasetsNamesObjs.length).to.be.equal(3);
			console.log("[TESTING] $isolateScope.datasetsNamesObjs[0]=%s", JSON.stringify($isolateScope.datasetsNamesObjs[0]));
			expect($isolateScope.datasetsNamesObjs[0].NsN).to.be.equal("WhiteDog-en");
			expect($isolateScope.datasetsNamesObjs[0].color).to.be.equal("#AA0000");
			expect($isolateScope.datasetsNamesObjs[0].averageChecked).to.be.false;

			expect($isolateScope.datasetsNamesOrdered.length).to.be.equal(3);
			expect($isolateScope.datasetsNamesOrdered).to.be.deep.equal(["WhiteDog-en","corpus-en","SkiBum-en"]);
			expect($isolateScope.firstNsN).to.be.equal("WhiteDog-en");
			expect($isolateScope.datasetsNamesOriginal.length).to.be.equal(3);
			expect($isolateScope.datasetsNamesOriginal).to.be.deep.equal(["WhiteDog-en","corpus-en","SkiBum-en"]);
			expect($isolateScope.datasetsValuesOrdered.length).to.be.equal(3); // 3 datasets
			expect($isolateScope.datasetsValuesOrdered[0].length).to.be.equal(3); // 3 items in dataset
			console.log("[TESTING] $isolateScope.datasetsValuesOrdered[0][0]=%s", JSON.stringify($isolateScope.datasetsValuesOrdered[0][0]));
			expect($isolateScope.datasetsValuesOrdered[0][0].length).to.be.equal(2); // label & value
			expect($isolateScope.datasetsValuesOrdered[0][0][0]).to.be.equal("paragraphLengthInWords"); // label of the 1st item
			expect($isolateScope.datasetsValuesOrdered[0][0][1]).to.be // value of the 1st item
				.equal(
					datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_HITS_COUNT / 
					datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_ITEMS_COUNT
				);
			expect($isolateScope.datasetsValuesWithoutLabels.length).to.be.equal(3); // 3 datasets
			console.log("[TESTING] $isolateScope.datasetsValuesWithoutLabels[0]=%s", JSON.stringify($isolateScope.datasetsValuesWithoutLabels[0]));
			expect($isolateScope.datasetsValuesWithoutLabels[0].length).to.be.equal(3+1); // 3 items in dataset + 1 scalling item
			console.log("[TESTING] $isolateScope.datasetsValuesWithoutLabels[0][0]=%s", JSON.stringify($isolateScope.datasetsValuesWithoutLabels[0][0]));
			expect(typeof $isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal("number"); // there should be only item value
			expect($isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal($isolateScope.datasetsValuesOrdered[0][0][1]); // value of the 1st item
			
			expect($isolateScope.datasetsLabelsList.length).to.be.equal(3); // 3 items
			console.log("[TESTING] $isolateScope.datasetsLabelsList=%s", JSON.stringify($isolateScope.datasetsLabelsList));
			expect($isolateScope.datasetsLabelsList[0]).to.be.deep.equal(["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences", "scaling placeholder"]); // 3 items + scalling
			expect($isolateScope.datasetsLabelsList[1]).to.be.deep.equal(["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences", "scaling placeholder"]); // 3 items + scalling
			expect($isolateScope.datasetsLabelsList[2]).to.be.deep.equal(["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences", "scaling placeholder"]); // 3 items + scalling

			expect($isolateScope.colors.length).to.be.equal(3); // 3 items
			expect($isolateScope.colors[0]).to.be.equal("#AA0000"); // 1st color
			expect($isolateScope.colors[1]).to.be.equal("#0000AA"); // 2nd color
			expect($isolateScope.colors[2]).to.be.equal("#FF5555"); // 3rd color
		});

		it('populates checkboxes with dataset names and colors', function () {
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();

		    expect(element.find(".diagram-items").find("dataview-diagram-checkbox").length).to.be.equal(3);
		    expect(element.find(".diagram-items").find("dataview-diagram-checkbox").eq(0).text()).to.contain("WhiteDog-en");
		    expect(element.find(".diagram-items").find("dataview-diagram-checkbox").eq(1).text()).to.contain("corpus-en");
		    expect(element.find(".diagram-items").find("dataview-diagram-checkbox").eq(2).text()).to.contain("SkiBum-en");

		    expect(element.find(".diagram-items").find("dataview-diagram-checkbox").eq(0).find("spectrum-colorpicker").length).to.be.equal(1);
		    expect(element.find(".diagram-items").find("dataview-diagram-checkbox").eq(0).find('div').css('color')).equal('rgb(170, 0, 0)');
		});

		it('contains diagram-items populated with check-boxes', inject(function ($rootScope, $compile, ExperimentAnalysisService) {
			console.log("\n\n=================================\n\n Dataviews.spec DataviewDistributionDiagramShow\n\n=================================\n\n");
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();

			// check if template is injected properly
			//expect(element.hasClass("dataview-distribution-diagram-show")).to.be.true;
			//console.log("[TEST] element: %s", element.text());
			expect(element.find(".diagram-items")).not.to.be.null;
			expect(element.find(".diagram-items").length).to.be.equal(1);
			expect(element.find(".diagram-items").find("dataview-diagram-checkbox").length).to.be.equal(3);
			console.log("[TEST] $isolateScope.diagramHeight: %s",$isolateScope.diagramHeight);
		}));

		it('should send an HTTP POST request', function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('changing datasets order - scope values', function () {
		//it('changing datasets order - scope values', function (done) {
			var getItemsNsNs = function(){
				var itemsNsNs = [];
				var items =  element.find(".diagram-items").find("dataview-diagram-checkbox");
				for(var i=0; i<items.length; i++){
					expect(items[i]).not.to.be.null;
					expect(items[i]).not.to.be.undefined;
					itemsNsNs.push($(items[i]).attr("data-NsN"));
				}
				return itemsNsNs;
			};
			
			var moveItem = function(id, position){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.updateCallback.constructor: ",
						$isolateScope.datasetsVisualizeSelectors.updateCallback.constructor);
				var tmp = itemsNsNs[position];
				itemsNsNs[position] = itemsNsNs[id];
				itemsNsNs[id] = tmp;
				$isolateScope.datasetsVisualizeSelectors.updateCallback();
			};

			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element

			console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors: %s",$isolateScope.datasetsVisualizeSelectors.getTheFirstItemNsN);
			console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors: %s",$isolateScope.datasetsVisualizeSelectors.getItemsNames);
			
			$isolateScope.datasetsVisualizeSelectors.getTheFirstItemNsN = function(){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.getTheFirstItemNsN called and returned: ", itemsNsNs[0]);
				return itemsNsNs[0];
			};

			$isolateScope.datasetsVisualizeSelectors.getItemsNames = function(){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.getItemsNames called and returned: ", itemsNsNs);
				return itemsNsNs;
			};

			var initializeDatasetNamesControllOriginal = $isolateScope.datasetsVisualizeSelectors.initializeDatasetNamesControll;
			$isolateScope.datasetsVisualizeSelectors.initializeDatasetNamesControll = function(callback){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.initializeDatasetNamesControll called");
				initializeDatasetNamesControllOriginal.call($isolateScope.datasetsVisualizeSelectors, callback);
				sinon.spy($isolateScope.datasetsVisualizeSelectors, "updateCallback");
			};

			var itemsNsNs = getItemsNsNs();
			console.log("[TESTING] itemsNsNs:", itemsNsNs);
			expect(itemsNsNs.length).to.be.equal(3);
			expect(itemsNsNs).to.be.deep.equal(["WhiteDog-en", "corpus-en", "SkiBum-en"]);

			sinon.spy($isolateScope.datasetsVisualizeSelectors, "getItemsNames");
			
			var test2 = function(){
				sinon.spy($isolateScope.datasetsVisualizeSelectors, "updateCallback");
				expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.false;
				expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;
				console.log("[TESTING] expect($isolateScope.datasetsVisualizeSelectors.getItemsNames(): ",
						$isolateScope.datasetsVisualizeSelectors.getItemsNames());

				var updateCallbackOld = $isolateScope.datasetsVisualizeSelectors.updateCallback;
				moveItem(0, +1);
				$scope.$digest();

				console.log("[TESTING] (dragged) $isolateScope.datasetsVisualizeSelectors.getItemsNames.called: ",
						$isolateScope.datasetsVisualizeSelectors.getItemsNames.called);
				expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.true;
				expect(updateCallbackOld.called).to.be.true;
				expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;
				console.log("[TESTING] (dragged) expect($isolateScope.datasetsVisualizeSelectors.getItemsNames(): ",
						$isolateScope.datasetsVisualizeSelectors.getItemsNames());

				var checkAverage = element.find(".diagram-items").find("li").eq(0);
				//checkAverage.simulateDragSortable({ move: 1 }); // simulate moving down
				console.log("[TESTING (dragged) checkAverage.attr('data-NsN')", checkAverage.attr("data-NsN"));			
				checkAverage = element.find(".diagram-items").find("li").eq(1);
				console.log("[TESTING (dragged) checkAverage.attr('data-NsN')", checkAverage.attr("data-NsN"));
				
				console.log("[TESTING] (dragged) itemsNsNs:", itemsNsNs);
				expect(itemsNsNs.length).to.be.equal(3);
				expect(itemsNsNs).to.be.deep.equal(["corpus-en", "WhiteDog-en", "SkiBum-en"]);

				expect($isolateScope.datasetsNamesObjs.length).to.be.equal(3);
				console.log("[TESTING] (dragged) $isolateScope.datasetsNamesObjs[0]=%s", JSON.stringify($isolateScope.datasetsNamesObjs[0]));
				expect($isolateScope.datasetsNamesObjs[0].NsN).to.be.equal("corpus-en");
				expect($isolateScope.datasetsNamesObjs[1].NsN).to.be.equal("WhiteDog-en");
				expect($isolateScope.datasetsNamesObjs[2].NsN).to.be.equal("SkiBum-en");

				expect($isolateScope.datasetsNamesObjs[0].color).to.be.equal("#0000AA");
				expect($isolateScope.datasetsNamesObjs[1].color).to.be.equal("#AA0000");

				expect($isolateScope.datasetsNamesOrdered.length).to.be.equal(3);
				expect($isolateScope.datasetsNamesOrdered).to.be.deep.equal(["corpus-en","WhiteDog-en","SkiBum-en"]);
				expect($isolateScope.firstNsN).to.be.equal("corpus-en");
				expect($isolateScope.datasetsNamesOriginal.length).to.be.equal(3);
				expect($isolateScope.datasetsNamesOriginal).to.be.deep.equal(["WhiteDog-en","corpus-en","SkiBum-en"]);
				expect($isolateScope.datasetsValuesOrdered.length).to.be.equal(3); // 3 datasets
				expect($isolateScope.datasetsValuesOrdered[0].length).to.be.equal(3); // 3 items in dataset
				console.log("[TESTING] $isolateScope.datasetsValuesOrdered[0][0]=%s", JSON.stringify($isolateScope.datasetsValuesOrdered[0][0]));
				expect($isolateScope.datasetsValuesOrdered[0][0].length).to.be.equal(2); // label & value
				expect($isolateScope.datasetsValuesOrdered[0][0][0]).to.be.equal("paragraphLengthInWords"); // label of the 1st item
				expect($isolateScope.datasetsValuesOrdered[0][0][1]).to.be // value of the 1st item
					.equal(
						datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_HITS_COUNT / 
						datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_ITEMS_COUNT
					);
				expect($isolateScope.datasetsValuesWithoutLabels.length).to.be.equal(3); // 3 datasets
				expect($isolateScope.datasetsValuesWithoutLabels[0].length).to.be.equal(3+1); // 3 items in dataset + 1 scalling item
				console.log("[TESTING] $isolateScope.datasetsValuesWithoutLabels[0][0]=%s", JSON.stringify($isolateScope.datasetsValuesWithoutLabels[0][0]));
				expect(typeof $isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal("number"); // there should be only item value
				// $isolateScope.datasetsValuesWithoutLabels follows the order of datasets user organized them
				// therefore we compare 0st dataset with 1st dataset
				expect($isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal($isolateScope.datasetsValuesOrdered[1][0][1]); // value of the 1st item

				expect($isolateScope.datasetsLabelsList.length).to.be.equal(3); // 3 items
				console.log("[TESTING] $isolateScope.datasetsLabelsList=%s", JSON.stringify($isolateScope.datasetsLabelsList));
				expect($isolateScope.datasetsLabelsList[0]).to.be.deep.equal(["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences", "scaling placeholder"]); // 3 items + scalling
				expect($isolateScope.datasetsLabelsList[1]).to.be.deep.equal(["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences", "scaling placeholder"]); // 3 items + scalling
				expect($isolateScope.datasetsLabelsList[2]).to.be.deep.equal(["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences", "scaling placeholder"]); // 3 items + scalling

				expect($isolateScope.colors.length).to.be.equal(3); // 3 items
				expect($isolateScope.colors[0]).to.be.equal("#0000AA"); // 0st color
				expect($isolateScope.colors[1]).to.be.equal("#AA0000"); // 1st color
				expect($isolateScope.colors[2]).to.be.equal("#FF5555"); // 1st color
			};

			if(typeof done !== 'undefined'){
				console.log("[TESTING] running with window.setTimeout");
				window.setTimeout(function(){
					test2();
					done();
				}, 50 );				
			}else{
				console.log("[TESTING] running without window.setTimeout");
				test2();
			}
		});

		it('changing datasets average - scope values', function () {
			var getItemsNsNs = function(){
				var itemsNsNs = [];
				var items =  element.find(".diagram-items").find("dataview-diagram-checkbox");
				for(var i=0; i<items.length; i++){
					expect(items[i]).not.to.be.null;
					expect(items[i]).not.to.be.undefined;
					itemsNsNs.push($(items[i]).attr("data-NsN"));
				}
				return itemsNsNs;
			};
			
			var moveItem = function(id, position){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.updateCallback.constructor: ",
						$isolateScope.datasetsVisualizeSelectors.updateCallback.constructor);
				var tmp = itemsNsNs[position];
				itemsNsNs[position] = itemsNsNs[id];
				itemsNsNs[id] = tmp;
				$isolateScope.datasetsVisualizeSelectors.updateCallback();
			};

			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element

			console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors: %s",$isolateScope.datasetsVisualizeSelectors.getTheFirstItemNsN);
			console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors: %s",$isolateScope.datasetsVisualizeSelectors.getItemsNames);
			
			$isolateScope.datasetsVisualizeSelectors.getTheFirstItemNsN = function(){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.getTheFirstItemNsN called and returned: ", itemsNsNs[0]);
				return itemsNsNs[0];
			};

			$isolateScope.datasetsVisualizeSelectors.getItemsNames = function(){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.getItemsNames called and returned: ", itemsNsNs);
				return itemsNsNs;
			};

			var initializeDatasetNamesControllOriginal = $isolateScope.datasetsVisualizeSelectors.initializeDatasetNamesControll;
			$isolateScope.datasetsVisualizeSelectors.initializeDatasetNamesControll = function(callback){
				console.log("[TESTING] $isolateScope.datasetsVisualizeSelectors.initializeDatasetNamesControll called");
				initializeDatasetNamesControllOriginal.call($isolateScope.datasetsVisualizeSelectors, callback);
				sinon.spy($isolateScope.datasetsVisualizeSelectors, "updateCallback");
			};
			var itemsNsNs = getItemsNsNs();
			console.log("[TESTING] itemsNsNs:", itemsNsNs);
			expect(itemsNsNs.length).to.be.equal(3);
			expect(itemsNsNs).to.be.deep.equal(["WhiteDog-en", "corpus-en", "SkiBum-en"]);

			sinon.spy($isolateScope.datasetsVisualizeSelectors, "getItemsNames");

			var checkAverage = element.find(".diagram-items").find("[data-NsN='WhiteDog-en']").find("dataview-diagram-checkbox").eq(0)
				.find('div').find('.dataset-name-checkbox');
			expect(checkAverage.length).to.be.equal(1);
			expect($isolateScope.datasetsNamesObjs[0].averageChecked).to.be.false;
			expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.false;
			// ITEMS CHANGED: 0,1,2 => +0,1,2
			checkAverage.click();
//			//checkAverage.simulate('click');
			expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.true;
			expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;
			$scope.$digest();
			expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.true;
			expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;

			expect($isolateScope.datasetsNamesObjs.length).to.be.equal(3);
			console.log("[TESTING] $isolateScope.datasetsNamesObjs[0]=%s", JSON.stringify($isolateScope.datasetsNamesObjs[0]));
			expect($isolateScope.datasetsNamesObjs[0].averageChecked).to.be.true;

			expect($isolateScope.datasetsValuesOrdered[0][0].length).to.be.equal(2); // label & value
			expect($isolateScope.datasetsValuesOrdered[0][0][0]).to.be.equal("paragraphLengthInWords"); // label of the 1st item
			expect($isolateScope.datasetsValuesOrdered[0][0][1]).to.be // value of the 1st item
				.equal(
					datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_HITS_COUNT / 
					datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_ITEMS_COUNT
				);
			expect($isolateScope.datasetsValuesWithoutLabels.length).to.be.equal(3); // 3 datasets
			expect($isolateScope.datasetsValuesWithoutLabels[0].length).to.be.equal(3 + 1); // 3 items in dataset + 1 scalling item
			console.log("[TESTING] $isolateScope.datasetsValuesWithoutLabels[0][0]=%s", JSON.stringify($isolateScope.datasetsValuesWithoutLabels[0][0]));
			expect(typeof $isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal("number"); // there should be only item value

			// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
			expect($isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal($isolateScope.datasetsValuesOrdered[0][0][1] - $isolateScope.datasetsValuesOrdered[0][0][1]); // value of the 1st item
			expect($isolateScope.datasetsValuesWithoutLabels[1][0]).to.be.equal($isolateScope.datasetsValuesOrdered[1][0][1] - $isolateScope.datasetsValuesOrdered[0][0][1]); // value of the 1st item
			expect($isolateScope.datasetsValuesWithoutLabels[2][0]).to.be.equal($isolateScope.datasetsValuesOrdered[2][0][1] - $isolateScope.datasetsValuesOrdered[0][0][1]); // value of the 1st item

			var test2 = function(){
				if($isolateScope.datasetsVisualizeSelectors.updateCallback 
						&& $isolateScope.datasetsVisualizeSelectors.updateCallback.restore){
					$isolateScope.datasetsVisualizeSelectors.updateCallback.restore();
				}
				sinon.spy($isolateScope.datasetsVisualizeSelectors, "updateCallback");
				expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;
				console.log("[TESTING] expect($isolateScope.datasetsVisualizeSelectors.getItemsNames(): ",
						$isolateScope.datasetsVisualizeSelectors.getItemsNames());

				var updateCallbackOld = $isolateScope.datasetsVisualizeSelectors.updateCallback;
				// ITEMS CHANGED: 0,1,2 => 1,+0,2
				moveItem(0, +1);
				$scope.$digest();

				console.log("[TESTING] (dragged) $isolateScope.datasetsVisualizeSelectors.getItemsNames.called: ",
						$isolateScope.datasetsVisualizeSelectors.getItemsNames.called);
				expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.true;
				expect(updateCallbackOld.called).to.be.true;
				expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;
				console.log("[TESTING] (dragged) expect($isolateScope.datasetsVisualizeSelectors.getItemsNames(): ",
						$isolateScope.datasetsVisualizeSelectors.getItemsNames());

				var checkAverage = element.find(".diagram-items").find("li").eq(0);
				//checkAverage.simulateDragSortable({ move: 1 }); // simulate moving down
				console.log("[TESTING (dragged) checkAverage.attr('data-NsN')", checkAverage.attr("data-NsN"));			
				checkAverage = element.find(".diagram-items").find("li").eq(1);
				console.log("[TESTING (dragged) checkAverage.attr('data-NsN')", checkAverage.attr("data-NsN"));
				
				console.log("[TESTING] (dragged) itemsNsNs:", itemsNsNs);
				expect(itemsNsNs.length).to.be.equal(3);
				expect(itemsNsNs).to.be.deep.equal(["corpus-en", "WhiteDog-en", "SkiBum-en"]);

				expect($isolateScope.datasetsNamesObjs.length).to.be.equal(3);
				console.log("[TESTING] (dragged) $isolateScope.datasetsNamesObjs[0]=%s", JSON.stringify($isolateScope.datasetsNamesObjs[0]));
				expect($isolateScope.datasetsNamesObjs[0].NsN).to.be.equal("corpus-en");
				expect($isolateScope.datasetsNamesObjs[1].NsN).to.be.equal("WhiteDog-en");
				expect($isolateScope.datasetsNamesObjs[2].NsN).to.be.equal("SkiBum-en");

				expect($isolateScope.datasetsNamesObjs[0].color).to.be.equal("#0000AA");
				expect($isolateScope.datasetsNamesObjs[1].color).to.be.equal("#AA0000");

				expect($isolateScope.datasetsNamesOrdered.length).to.be.equal(3);
				expect($isolateScope.datasetsNamesOrdered).to.be.deep.equal(["corpus-en","WhiteDog-en","SkiBum-en"]);
				expect($isolateScope.firstNsN).to.be.equal("corpus-en");
				expect($isolateScope.datasetsNamesOriginal.length).to.be.equal(3);
				expect($isolateScope.datasetsNamesOriginal).to.be.deep.equal(["WhiteDog-en","corpus-en","SkiBum-en"]);
				expect($isolateScope.datasetsValuesOrdered.length).to.be.equal(3); // 3 datasets
				expect($isolateScope.datasetsValuesOrdered[0].length).to.be.equal(3); // 3 items in dataset
				console.log("[TESTING] $isolateScope.datasetsValuesOrdered[0][0]=%s", JSON.stringify($isolateScope.datasetsValuesOrdered[0][0]));
				expect($isolateScope.datasetsValuesOrdered[0][0].length).to.be.equal(2); // label & value
				expect($isolateScope.datasetsValuesOrdered[0][0][0]).to.be.equal("paragraphLengthInWords"); // label of the 1st item
				expect($isolateScope.datasetsValuesOrdered[0][0][1]).to.be // value of the 1st item
					.equal(
						datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_HITS_COUNT / 
						datasetOriginal.dataset[0].data["stats.results"]["WhiteDog-en"].SimpleStats.paragraphLengthInWords.ALL.RESULT_ITEMS_COUNT
					);
				expect($isolateScope.datasetsValuesWithoutLabels.length).to.be.equal(3); // 3 datasets
				expect($isolateScope.datasetsValuesWithoutLabels[0].length).to.be.equal(3+1); // 3 items in dataset + scalling item
				console.log("[TESTING] $isolateScope.datasetsValuesWithoutLabels[0][0]=%s", JSON.stringify($isolateScope.datasetsValuesWithoutLabels[0][0]));
				expect(typeof $isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal("number"); // there should be only item value
				// $isolateScope.datasetsValuesWithoutLabels follows the order of datasets user organized them
				// therefore we compare 0st dataset with 1st dataset

				// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
				expect($isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal($isolateScope.datasetsValuesOrdered[1][0][1] - $isolateScope.datasetsValuesOrdered[0][0][1]); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[1][0]).to.be.equal($isolateScope.datasetsValuesOrdered[0][0][1] - $isolateScope.datasetsValuesOrdered[0][0][1]); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[2][0]).to.be.equal($isolateScope.datasetsValuesOrdered[2][0][1] - $isolateScope.datasetsValuesOrdered[0][0][1]); // value of the 1st item

				expect($isolateScope.colors.length).to.be.equal(3); // 3 items
				expect($isolateScope.colors[0]).to.be.equal("#0000AA"); // 0st color
				expect($isolateScope.colors[1]).to.be.equal("#AA0000"); // 1st color
				expect($isolateScope.colors[2]).to.be.equal("#FF5555"); // 1st color

				var checkAverage = element.find(".diagram-items").find("[data-NsN='SkiBum-en']").find("dataview-diagram-checkbox").eq(0)
					.find('div').find('.dataset-name-checkbox');
				expect(checkAverage.length).to.be.equal(1);
				expect($isolateScope.datasetsNamesObjs[0].averageChecked).to.be.false;				
				$isolateScope.datasetsVisualizeSelectors.getItemsNames.reset();
				expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.false;
				// ITEMS CHANGED: 1,+0,2 => 1,+0,+2
				checkAverage.click();
				expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.true;
				expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;

				// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
				expect($isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal($isolateScope.datasetsValuesOrdered[1][0][1] 
						- ($isolateScope.datasetsValuesOrdered[0][0][1]+$isolateScope.datasetsValuesOrdered[2][0][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[1][0]).to.be.equal($isolateScope.datasetsValuesOrdered[0][0][1] 
						- ($isolateScope.datasetsValuesOrdered[0][0][1]+$isolateScope.datasetsValuesOrdered[2][0][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[2][0]).to.be.equal($isolateScope.datasetsValuesOrdered[2][0][1] 
						- ($isolateScope.datasetsValuesOrdered[0][0][1]+$isolateScope.datasetsValuesOrdered[2][0][1])/2); // value of the 1st item

				// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
				expect($isolateScope.datasetsValuesWithoutLabels[0][1]).to.be.equal($isolateScope.datasetsValuesOrdered[1][1][1] 
						- ($isolateScope.datasetsValuesOrdered[0][1][1]+$isolateScope.datasetsValuesOrdered[2][1][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[1][1]).to.be.equal($isolateScope.datasetsValuesOrdered[0][1][1] 
						- ($isolateScope.datasetsValuesOrdered[0][1][1]+$isolateScope.datasetsValuesOrdered[2][1][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[2][1]).to.be.equal($isolateScope.datasetsValuesOrdered[2][1][1] 
						- ($isolateScope.datasetsValuesOrdered[0][1][1]+$isolateScope.datasetsValuesOrdered[2][1][1])/2); // value of the 1st item

				expect($isolateScope.colors.length).to.be.equal(3); // 3 items
				expect($isolateScope.colors[0]).to.be.equal("#0000AA"); // 0st color
				expect($isolateScope.colors[1]).to.be.equal("#AA0000"); // 1st color
				expect($isolateScope.colors[2]).to.be.equal("#FF5555"); // 1st color

				updateCallbackOld = $isolateScope.datasetsVisualizeSelectors.updateCallback;
				// ITEMS CHANGED: 1,+0,+2 => +2,+0,1
				moveItem(2, 0);
				expect($isolateScope.datasetsVisualizeSelectors.getItemsNames.called).to.be.true;
				expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.true;
				$scope.$digest();
				expect(updateCallbackOld.called).to.be.true;
				expect($isolateScope.datasetsVisualizeSelectors.updateCallback.called).to.be.false;

				// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
				expect($isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal($isolateScope.datasetsValuesOrdered[2][0][1] 
						- ($isolateScope.datasetsValuesOrdered[0][0][1]+$isolateScope.datasetsValuesOrdered[2][0][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[1][0]).to.be.equal($isolateScope.datasetsValuesOrdered[0][0][1] 
						- ($isolateScope.datasetsValuesOrdered[0][0][1]+$isolateScope.datasetsValuesOrdered[2][0][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[2][0]).to.be.equal($isolateScope.datasetsValuesOrdered[1][0][1] 
						- ($isolateScope.datasetsValuesOrdered[0][0][1]+$isolateScope.datasetsValuesOrdered[2][0][1])/2); // value of the 1st item

				// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
				expect($isolateScope.datasetsValuesWithoutLabels[0][1]).to.be.equal($isolateScope.datasetsValuesOrdered[2][1][1] 
						- ($isolateScope.datasetsValuesOrdered[0][1][1]+$isolateScope.datasetsValuesOrdered[2][1][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[1][1]).to.be.equal($isolateScope.datasetsValuesOrdered[0][1][1] 
						- ($isolateScope.datasetsValuesOrdered[0][1][1]+$isolateScope.datasetsValuesOrdered[2][1][1])/2); // value of the 1st item
				expect($isolateScope.datasetsValuesWithoutLabels[2][1]).to.be.equal($isolateScope.datasetsValuesOrdered[1][1][1] 
						- ($isolateScope.datasetsValuesOrdered[0][1][1]+$isolateScope.datasetsValuesOrdered[2][1][1])/2); // value of the 1st item

				console.log("[TESTING] (just before restored) itemsNsNs:", itemsNsNs);
				expect($isolateScope.datasetsNamesObjs[0].averageChecked).to.be.true;
				expect($isolateScope.datasetsNamesObjs[1].averageChecked).to.be.true;
				expect($isolateScope.datasetsNamesObjs[2].averageChecked).to.be.false;
				expect($isolateScope.datasetsNamesObjs[0].NsN).to.be.equal("SkiBum-en");
				expect($isolateScope.datasetsNamesObjs[1].NsN).to.be.equal("WhiteDog-en");
				expect($isolateScope.datasetsNamesObjs[2].NsN).to.be.equal("corpus-en");
				expect(itemsNsNs).to.be.deep.equal(["SkiBum-en", "WhiteDog-en", "corpus-en"]);
				// ITEMS CHANGED: +2,+0,1 => 1,+0,+2
				moveItem(2, 0);
				// ITEMS CHANGED: 1,+0,+2 => +0,1,+2
				moveItem(1, 0);
				$scope.$digest();
				var checkAverage = element.find(".diagram-items").find("[data-NsN='SkiBum-en']").find("dataview-diagram-checkbox").eq(0)
					.find('div').find('.dataset-name-checkbox');
				// ITEMS CHANGED: +0,1,+2 => +0,1,2
				checkAverage.click();
				var checkAverage = element.find(".diagram-items").find("[data-NsN='WhiteDog-en']").find("dataview-diagram-checkbox").eq(0)
					.find('div').find('.dataset-name-checkbox');
				// ITEMS CHANGED: +0,1,2 => 0,1,2
				checkAverage.click();
				$scope.$digest();

				console.log("[TESTING] (restored) itemsNsNs:", itemsNsNs);
				expect(itemsNsNs).to.be.deep.equal(["WhiteDog-en", "corpus-en", "SkiBum-en"]);
				expect($isolateScope.datasetsNamesObjs[0].NsN).to.be.equal("WhiteDog-en");
				expect($isolateScope.datasetsNamesObjs[1].NsN).to.be.equal("corpus-en");
				expect($isolateScope.datasetsNamesObjs[2].NsN).to.be.equal("SkiBum-en");

				// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
				expect($isolateScope.datasetsValuesWithoutLabels[0][0]).to.be.equal($isolateScope.datasetsValuesOrdered[0][0][1]);
				expect($isolateScope.datasetsValuesWithoutLabels[1][0]).to.be.equal($isolateScope.datasetsValuesOrdered[1][0][1]);
				expect($isolateScope.datasetsValuesWithoutLabels[2][0]).to.be.equal($isolateScope.datasetsValuesOrdered[2][0][1]);

				// $isolateScope.datasetsValuesWithoutLabels are values after reducing from average
				expect($isolateScope.datasetsValuesWithoutLabels[0][1]).to.be.equal($isolateScope.datasetsValuesOrdered[0][1][1]);
				expect($isolateScope.datasetsValuesWithoutLabels[1][1]).to.be.equal($isolateScope.datasetsValuesOrdered[1][1][1]);
				expect($isolateScope.datasetsValuesWithoutLabels[2][1]).to.be.equal($isolateScope.datasetsValuesOrdered[2][1][1]);
			};

			if(typeof done !== 'undefined'){
				console.log("[TESTING] running with window.setTimeout");
				window.setTimeout(function(){
					test2();
					done();
				}, 50 );				
			}else{
				console.log("[TESTING] running without window.setTimeout");
				test2();
			}
		});

	});

	describe("DataviewDistributionDiagramRaphael", function(){
		var datasetOriginal;

		beforeEach(module('partials/dataview/distribution-diagram-raphael.html'));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function(_$q_, _$compile_, _$rootScope_) {
			// The injector unwraps the underscores (_) from around the parameter names when matching
			$q = _$q_;
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			// Just for testing
//			ExperimentAnalysisService.queryFull("zhenia-master.data.gary-in-english", "pos-joined", function(analyses){
//				console.log("analyses: %s", JSON.stringify(analyses, null, "\t"));
//			});
//			$httpBackend.flush();
			
		}));
		
		beforeEach(function(){
			// creating and setting up the external scope,
			// the scope of the element surrounding the directive of our interest
			$scope = $rootScope.$new(); // $new is not super necessary

			$scope.diagramViewItems = {};

			$scope.diagramViewItems.datasetsValuesWithoutLabels =
			[
			 	[94736/11, 94736/6595, 6595/11],
				[548664/1, 548664/30284, 30284/1],
				[72186/2, 72186/6173, 6173/2]
			];
			$scope.diagramViewItems.colors = ["#AA0000", "#0000AA", "#FF5555"];
			$scope.diagramViewItems.datasetsLabelsList = [
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"],
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"],
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"]
			];
			$scope.diagramViewItems.updateDiagram = true;
			$scope.diagramViewItems.datasetsNamesOrdered = ["WhiteDog-en","corpus-en","SkiBum-en"];
		});

		beforeEach(function() {
			console.log("[TESTING] compiling <dataview-distribution-diagram-show>");
			// compile HTML containing the directive
			link = $compile("<dataview-distribution-diagram-raphael " +
					"diagram-view-items='diagramViewItems'>" +
					"</dataview-distribution-diagram-raphael>");
		});

		it('replaces the element with the appropriate TEMPLATE content', inject(function ($rootScope, $compile) {
			console.log("\n\n=================================\n\n Dataviews.spec DataviewDistributionDiagramShow\n\n=================================\n\n");
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			$scope.$digest();

			// check if template is injected properly
			expect(element.find('div').first().hasClass("dataview-distribution-diagram-raphael")).to.be.true;
			var diagramElement = element.find('.graph-view').first();
			expect(diagramElement.length).to.be.equal(1);
		}));

		it('scope values', function () {
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			expect($scope.diagramViewItems.updateDiagram).to.be.true;
			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element

			expect($scope.diagramViewItems.updateDiagram).to.be.false;

			expect($isolateScope.views.length).to.be.equal(2);
			expect($isolateScope.diagramHeight).to.be.equal(180);
			expect($isolateScope._r.constructor).to.be.equal(Raphael);
			expect($isolateScope.classViewId).to.be.equal("graph-view");
			expect($isolateScope.datasetsVisualizeGraph.constructor).to.be.equal(bukvik.dataset.VisualizeGraph);
		});

		it('SVG content', function () {
			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			expect($scope.diagramViewItems.updateDiagram).to.be.true;
			console.log("[TEST] SVG content");

			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element
			expect($scope.diagramViewItems.updateDiagram).to.be.false;

			var diagramElement = element.find('.graph-view').first();
			expect(diagramElement.length).to.be.equal(1);
			expect(Raphael.type).to.be.equal("SVG");
			expect(Raphael.svg).to.be.true;
			var svgElement = diagramElement.find('svg').first();
			expect(svgElement.length).to.be.equal(1);
			expect(svgElement.find("path").length).to.be.equal(3*(3+1)); // 1 additional is scalling item
			expect(svgElement.find("path").eq(0).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("path").eq(1).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(2).attr("fill")).to.be.equal("#ff5555");

			expect(svgElement.find("path").eq(3).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("path").eq(4).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(5).attr("fill")).to.be.equal("#ff5555");

			expect(svgElement.find("path").eq(6).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("path").eq(7).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(8).attr("fill")).to.be.equal("#ff5555");

			console.log('[TEST] svgElement.find("text").find("tspan").eq(0).text(): %s', svgElement.find("text").find("tspan").eq(0).attr("dy"));

			expect(svgElement.find("text").length).to.be.equal(3+1); // 1 additional is scalling item
			expect(svgElement.find("text tspan").length).to.be.equal(3+1); // 1 additional is scalling item
			expect(svgElement.find("rect").length).to.be.equal(3*(3+1)); // 1 additional is scalling item
			
			
			//console.log("[TEST] svgElement: %s", diagramElement.html());
			console.log('[TEST] svgElement.find("text").find("tspan").eq(0).text(): %s', svgElement.find("text").find("tspan").eq(0).text());
			expect(svgElement.find("text").find("tspan").eq(0).text()).to.be.equal("paragraphLengthInWords");
			expect(svgElement.find("text").find("tspan").eq(1).text()).to.be.equal("sentenceLength");
			expect(svgElement.find("text").find("tspan").eq(2).text()).to.be.equal("paragraphLengthInSentences");
			expect(svgElement.find("text").eq(0).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("text").eq(1).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("text").eq(2).attr("fill")).to.be.equal("#aa0000");
			console.log('[TEST] svgElement.find("text").find("tspan").eq(0).text(): %s', svgElement.find("text").find("tspan").eq(0).attr("dy"));
		});

		it('Changed input parameters - scope values', function () {
			// TESTING SCOPES

			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			expect($scope.diagramViewItems.updateDiagram).to.be.true;
			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element

			expect($scope.diagramViewItems.updateDiagram).to.be.false;

			expect($isolateScope.views.length).to.be.equal(2);
			expect($isolateScope.diagramHeight).to.be.equal(180);
			expect($isolateScope._r.constructor).to.be.equal(Raphael);
			expect($isolateScope.classViewId).to.be.equal("graph-view");
			expect($isolateScope.datasetsVisualizeGraph.constructor).to.be.equal(bukvik.dataset.VisualizeGraph);

			// CHANGING VALUES

			// creating and setting up the external scope,
			// the scope of the element surrounding the directive of our interest
			$scope.diagramViewItems.datasetsValuesWithoutLabels =
			[
				[548664/1, 548664/30284, 30284/1], // swapped with the next one
			 	[94736/11, 94736/6595, 6595/11],
				[72186/2, 72186/6173, 6173/2]
			];
			$scope.diagramViewItems.colors = ["#0000AA", "#AA0000", "#FF5555"]; // swapped the 1st and 2nd
			expect($scope.diagramViewItems.updateDiagram).to.be.false;
			$scope.diagramViewItems.updateDiagram = true;

			// TESTING SCOPES
			expect($scope.diagramViewItems.updateDiagram).to.be.true;
			$scope.$digest();
			expect($scope.diagramViewItems.updateDiagram).to.be.false;
			expect($isolateScope.views.length).to.be.equal(2);
			expect($isolateScope.diagramHeight).to.be.equal(180);
			expect($isolateScope._r.constructor).to.be.equal(Raphael);
			expect($isolateScope.classViewId).to.be.equal("graph-view");
			expect($isolateScope.datasetsVisualizeGraph.constructor).to.be.equal(bukvik.dataset.VisualizeGraph);

			$scope.diagramViewItems = {};
			$scope.diagramViewItems.datasetsValuesWithoutLabels =
			[
				[548664/1, 548664/30284, 30284/1],
				[72186/2, 72186/6173, 6173/2]
			];
			$scope.diagramViewItems.colors = ["#0000AA", "#FF5555"];
			$scope.diagramViewItems.datasetsLabelsList = [
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"],
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"]
			];
			$scope.diagramViewItems.updateDiagram = true;
			$scope.diagramViewItems.datasetsNamesOrdered = ["WhiteDog-en","corpus-en"];

			// TESTING SCOPES
			expect($scope.diagramViewItems.updateDiagram).to.be.true;
			$scope.$digest();
			expect($scope.diagramViewItems.updateDiagram).to.be.false;

			expect($isolateScope.views.length).to.be.equal(2);
			expect($isolateScope.diagramHeight).to.be.equal(120);
			expect($isolateScope._r.constructor).to.be.equal(Raphael);
			expect($isolateScope.classViewId).to.be.equal("graph-view");
			expect($isolateScope.datasetsVisualizeGraph.constructor).to.be.equal(bukvik.dataset.VisualizeGraph);
		});

		it('Changed input parameters - svg parameters', function () {
			// TESTING SVG

			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			expect($scope.diagramViewItems.updateDiagram).to.be.true;
			console.log("[TEST] SVG content");

			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element
			expect($scope.diagramViewItems.updateDiagram).to.be.false;

			var diagramElement = element.find('.graph-view').first();
			expect(diagramElement.length).to.be.equal(1);
			expect(Raphael.type).to.be.equal("SVG");
			expect(Raphael.svg).to.be.true;
			var svgElement = diagramElement.find('svg').first();
			expect(svgElement.length).to.be.equal(1);
			expect(svgElement.find("path").length).to.be.equal(3*(3+1)); // 1 additional is scalling item
			expect(svgElement.find("path").eq(0).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("path").eq(1).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(2).attr("fill")).to.be.equal("#ff5555");

			expect(svgElement.find("path").eq(3).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("path").eq(4).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(5).attr("fill")).to.be.equal("#ff5555");

			expect(svgElement.find("path").eq(6).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("path").eq(7).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(8).attr("fill")).to.be.equal("#ff5555");

			console.log('[TEST] svgElement.find("text").find("tspan").eq(0).text(): %s', svgElement.find("text").find("tspan").eq(0).attr("dy"));

			expect(svgElement.find("text").length).to.be.equal(3+1); // 1 additional is scalling item
			expect(svgElement.find("text tspan").length).to.be.equal(3+1); // 1 additional is scalling item
			expect(svgElement.find("rect").length).to.be.equal(3*(3+1)); // 1 additional is scalling item
			
			//console.log("[TEST] svgElement: %s", diagramElement.html());
			console.log('[TEST] svgElement.find("text").find("tspan").eq(0).text(): %s', svgElement.find("text").find("tspan").eq(0).text());
			expect(svgElement.find("text").find("tspan").eq(0).text()).to.be.equal("paragraphLengthInWords");
			expect(svgElement.find("text").find("tspan").eq(1).text()).to.be.equal("sentenceLength");
			expect(svgElement.find("text").find("tspan").eq(2).text()).to.be.equal("paragraphLengthInSentences");
			expect(svgElement.find("text").eq(0).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("text").eq(1).attr("fill")).to.be.equal("#aa0000");
			expect(svgElement.find("text").eq(2).attr("fill")).to.be.equal("#aa0000");
			console.log('[TEST] svgElement.find("text").find("tspan").eq(0).text(): %s', svgElement.find("text").find("tspan").eq(0).attr("dy"));

			// CHANGING VALUES

			// creating and setting up the external scope,
			// the scope of the element surrounding the directive of our interest
			$scope = $rootScope.$new(); // $new is not super necessary

			$scope.diagramViewItems = {};

			$scope.diagramViewItems.datasetsValuesWithoutLabels =
			[
				[548664/1, 548664/30284, 30284/1], // swapped with the next one
			 	[94736/11, 94736/6595, 6595/11],
				[72186/2, 72186/6173, 6173/2]
			];
			$scope.diagramViewItems.colors = ["#0000AA", "#AA0000", "#FF5555"];
			$scope.diagramViewItems.datasetsLabelsList = [
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"],
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"],
				["paragraphLengthInWords", "sentenceLength", "paragraphLengthInSentences"]
			];
			$scope.diagramViewItems.updateDiagram = true;
			$scope.diagramViewItems.datasetsNamesOrdered = ["WhiteDog-en","corpus-en","SkiBum-en"];

			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			expect($scope.diagramViewItems.updateDiagram).to.be.true;
			console.log("[TEST] SVG content");

			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element
			expect($scope.diagramViewItems.updateDiagram).to.be.false;

			// TESTING SVG
			var diagramElement = element.find('.graph-view').first();
			expect(diagramElement.length).to.be.equal(1);
			expect(Raphael.type).to.be.equal("SVG");
			expect(Raphael.svg).to.be.true;
			var svgElement = diagramElement.find('svg').first();
			expect(svgElement.length).to.be.equal(1);
			expect(svgElement.find("path").length).to.be.equal(3*(3+1)); // 1 additional is scalling item
			expect(svgElement.find("path").eq(0).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(1).attr("fill")).to.be.equal("#aa0000");

			expect(svgElement.find("path").eq(3).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("path").eq(4).attr("fill")).to.be.equal("#aa0000");

			expect(svgElement.find("text").length).to.be.equal(3+1); // 1 additional is scalling item
			expect(svgElement.find("text tspan").length).to.be.equal(3+1); // 1 additional is scalling item
			expect(svgElement.find("rect").length).to.be.equal(3*(3+1)); // 1 additional is scalling item
			
			expect(svgElement.find("text").eq(0).attr("fill")).to.be.equal("#0000aa");
			expect(svgElement.find("text").eq(1).attr("fill")).to.be.equal("#0000aa");

			// CHANGING VALUES

			$scope = $rootScope.$new(); // $new is not super necessary
			$scope.diagramViewItems = {};
			$scope.diagramViewItems.datasetsValuesWithoutLabels =
			[
				[72186/2, 6173/2],
				[548664/1, 30284/1]
			];
			$scope.diagramViewItems.colors = ["#FF5555", "#0000AA"];
			$scope.diagramViewItems.datasetsLabelsList = [
				["paragraphLengthInWords", "paragraphLengthInSentences"],
				["paragraphLengthInWords", "paragraphLengthInSentences"]
			];
			$scope.diagramViewItems.updateDiagram = true;
			$scope.diagramViewItems.datasetsNamesOrdered = ["WhiteDog-en","corpus-en","SkiBum-en"];

			// link HTML containing the directive
			element = link($scope);
			// fire all the watches, so the scope expressions will be evaluated
			expect($scope.diagramViewItems.updateDiagram).to.be.true;

			$scope.$digest();
			$isolateScope = element.isolateScope(); // it has to be called AFTER first $digest on the element
			expect($scope.diagramViewItems.updateDiagram).to.be.false;

			// TESTING SVG
			var diagramElement = element.find('.graph-view').first();
			expect(diagramElement.length).to.be.equal(1);
			expect(Raphael.type).to.be.equal("SVG");
			expect(Raphael.svg).to.be.true;
			var svgElement = diagramElement.find('svg').first();
			expect(svgElement.length).to.be.equal(1);
			expect(svgElement.find("path").length).to.be.equal(2*(2+1)); // 1 additional is scalling item
			expect(svgElement.find("path").eq(0).attr("fill")).to.be.equal("#ff5555");
			expect(svgElement.find("path").eq(1).attr("fill")).to.be.equal("#0000aa");

			expect(svgElement.find("path").eq(2).attr("fill")).to.be.equal("#ff5555");
			expect(svgElement.find("path").eq(3).attr("fill")).to.be.equal("#0000aa");

			expect(svgElement.find("text").length).to.be.equal(2+1); // 1 additional is scalling item
			expect(svgElement.find("text tspan").length).to.be.equal(2+1); // 1 additional is scalling item
			expect(svgElement.find("rect").length).to.be.equal(2*(2+1)); // 1 additional is scalling item
			
			expect(svgElement.find("text").find("tspan").eq(0).text()).to.be.equal("paragraphLengthInWords");
			expect(svgElement.find("text").find("tspan").eq(1).text()).to.be.equal("paragraphLengthInSentences");
			expect(svgElement.find("text").eq(0).attr("fill")).to.be.equal("#ff5555");
			expect(svgElement.find("text").eq(1).attr("fill")).to.be.equal("#ff5555");
		});
	});
});