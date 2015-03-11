//var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
//chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;

describe("Manipulation", function() {
	var manipulation;
	var datasetTest;
	beforeEach(function() {
		datasetTest = {
			"content": {
				"ds0": [
					["L1", 1],
					["L2", 2],
					["L3", 3]
				],
				"ds1": [
					["L2", -1],
					["L1", 1],
					["L3", 0]
				],
				"ds2": [
					["L3", 1],
					["L1", 2]
				],
				"ds3": [
					["L1", 1],
					["L2", -1],
					["L6", 0],
					["L4", 2]
				],
				"ds4": [1, -1, 2, 5],
				"ds5": [
					["L5", 1],
					["L2", -3],
					["L4", 4],
					["L7", 1],
					["L6", 2]
				]
			}
		};
		manipulation = new bukvik.dataset.Manipulation(datasetTest);
	});

	afterEach(function() {
		
	});

	it('should pass', function() {
		console.log("\n\n=================================\n\nManipulation.spec\n\n=================================\n\n");

		expect(true).to.be.true;
	});

	it('maxSamplesNo', function() {
		expect(manipulation.getDataset()).to.be.equal(datasetTest);
	});

	it('maxSamplesNo', function() {
		expect(manipulation.maxSamplesNo()).to.be.equal(5);
	});

	it('datasetsLabelsList', function() {
		expect(manipulation.datasetsLabelsList).to.have.length(6);
		// ds0
		expect(manipulation.datasetsLabelsList[0]).to.have.length(3);
		expect(manipulation.datasetsLabelsList[0]).to.be.deep.equal(["L1", "L2", "L3"]);
		// ds4
		expect(manipulation.datasetsLabelsList[4]).to.have.length(0);
		expect(manipulation.datasetsLabelsList[4]).to.be.deep.equal([]);
		// ds5
		expect(manipulation.datasetsLabelsList[5]).to.have.length(5);
		expect(manipulation.datasetsLabelsList[5]).to.be.deep.equal(["L5", "L2", "L4", "L7", "L6"]);
	});

	it('datasetsLabelsByNsN', function() {
		var n = 0;
		for(var i in manipulation.datasetsLabelsByNsN){n++;}
		expect(n).to.be.equal(6);

		expect(manipulation.datasetsLabelsByNsN).to.have.property("ds0");
		expect(manipulation.datasetsLabelsByNsN["ds0"]).to.have.length(3);
		expect(manipulation.datasetsLabelsByNsN["ds0"]).to.be.deep.equal(["L1", "L2", "L3"]);

		expect(manipulation.datasetsLabelsByNsN).to.have.property("ds4");
		expect(manipulation.datasetsLabelsByNsN["ds4"]).to.have.length(0);
		expect(manipulation.datasetsLabelsByNsN["ds4"]).to.be.deep.equal([]);

		expect(manipulation.datasetsLabelsByNsN).to.have.property("ds5");
		expect(manipulation.datasetsLabelsByNsN["ds5"]).to.have.length(5);
		expect(manipulation.datasetsLabelsByNsN["ds5"]).to.be.deep.equal(["L5", "L2", "L4", "L7", "L6"]);
	});

	it('datasetHasLabels', function() {
		var n = 0;
		for(var i in manipulation.datasetHasLabels){n++;}
		expect(n).to.be.equal(6);

		expect(manipulation.datasetHasLabels).to.have.property("ds0");
		expect(manipulation.datasetHasLabels).to.have.property("ds5");

		expect(manipulation.datasetHasLabels["ds0"]).to.be.equal(true);
		expect(manipulation.datasetHasLabels["ds4"]).to.be.equal(false);
		expect(manipulation.datasetHasLabels["ds5"]).to.be.equal(true);
	});

	it('datasetsNames', function() {
		expect(manipulation.datasetsNames.length).to.be.equal(6);
		expect(manipulation.datasetsNames[0]).to.be.equal("ds0");
		expect(manipulation.datasetsNames[5]).to.be.equal("ds5");
	});

	it('datasetsNamesPositions', function() {
		var n = 0;
		for(var i in manipulation.datasetsNamesPositions){n++;}
		expect(n).to.be.equal(6);

		expect(manipulation.datasetsNamesPositions).to.have.property("ds0");
		expect(manipulation.datasetsNamesPositions).to.have.property("ds5");

		expect(manipulation.datasetsNamesPositions["ds0"]).to.be.equal(0);
		expect(manipulation.datasetsNamesPositions["ds4"]).to.be.equal(4);
		expect(manipulation.datasetsNamesPositions["ds5"]).to.be.equal(5);
	});

	it('trimDatas', function() {
		manipulation.trimDatas(datasetTest.content, 3, false);

		expect(datasetTest.content).to.have.property("ds0");
		expect(datasetTest.content).to.have.property("ds2");
		expect(datasetTest.content).to.have.property("ds3");
		expect(datasetTest.content).to.have.property("ds4");
		expect(datasetTest.content).to.have.property("ds5");

		expect(datasetTest.content["ds0"]).to.have.length(3);
		expect(datasetTest.content["ds2"]).to.have.length(2);
		expect(datasetTest.content["ds3"]).to.have.length(3);
		expect(datasetTest.content["ds4"]).to.have.length(3);
		expect(datasetTest.content["ds5"]).to.have.length(3);

		manipulation.trimDatas(datasetTest.content, 3, true);
		expect(datasetTest.content["ds2"]).to.have.length(3);
	});
	

	it('reorderDatas', function() {
		var testArray = [0, 2, 4, 5, 7];
		manipulation.reorderDatas(testArray, 3, 0);
		expect(testArray).to.have.length(5);
		expect(testArray).to.be.deep.equal([5, 0, 2, 4, 7]);
	});

	it('cloneDatas array', function() {
		var testArray = [0, 2, 4, 5, 7];
		var clonedArray = manipulation.cloneDatas(testArray);
		expect(testArray).to.have.length(5);
		expect(clonedArray).to.be.deep.equal([0, 2, 4, 5, 7]);
		testArray[1] = 5;
		expect(clonedArray).to.be.deep.equal([0, 2, 4, 5, 7]);
	});

	it('cloneDatas datasets', function() {
		var clonedDatasets = manipulation.cloneDatas(datasetTest.content);
		expect(datasetTest.content).to.have.property("ds0");
		delete clonedDatasets["ds0"];
		expect(clonedDatasets).to.not.have.property("ds0");
		expect(datasetTest.content).to.have.property("ds0");
	});

	it('orderDatas array', function() {
		var testArray = [0, 2, 4, 5, 7];
		var newOrder = [2, 0, 4, 1, 3];
		manipulation.orderDatas(testArray, newOrder);
		expect(testArray).to.have.length(5);
		expect(testArray).to.be.deep.equal([2, 5, 0, 7, 4]);
	});

	it('orderDatas datasets', function() {
		var newOrder = {"ds0": "ds3", "ds1": "ds2", "ds2": "ds1", "ds3": "ds4", "ds4": "ds5", "ds5": "ds0"};
		var cloneDataset = manipulation.cloneDatas(datasetTest.content);
		manipulation.orderDatas(datasetTest.content, newOrder);
		expect(datasetTest.content).to.have.property("ds0");
		expect(datasetTest.content).to.have.property("ds5");
		expect(datasetTest.content["ds0"]).to.be.deep.equal(cloneDataset["ds5"]); // ds5 came on the place of ds0
		expect(datasetTest.content["ds5"]).to.be.deep.equal([1, -1, 2, 5]); // ds4 came on the place of ds3
	});

	it('getPureDatasetValuesWithoutLabels', function() {
		// ds0
		var pureDataset = manipulation.getPureDatasetValuesWithoutLabels(datasetTest.content["ds0"]);
		expect(pureDataset).to.have.length(3);
		expect(pureDataset).to.be.deep.equal([1, 2, 3]);
		// ds4
		pureDataset = manipulation.getPureDatasetValuesWithoutLabels(datasetTest.content["ds4"]);
		expect(pureDataset).to.have.length(4);
		expect(pureDataset).to.be.deep.equal([1, -1, 2, 5]);
		// ds5
		pureDataset = manipulation.getPureDatasetValuesWithoutLabels(datasetTest.content["ds5"]);
		expect(pureDataset).to.have.length(5);
		expect(pureDataset).to.be.deep.equal([1, -3, 4, 1, 2]);
	});

	it('getPureDatasetsValuesWithoutLabels', function() {
		var pureDatasets = manipulation.getPureDatasetsValuesWithoutLabels(datasetTest.content);
		expect(pureDatasets).to.have.length(6);
		// ds0
		expect(pureDatasets[0]).to.have.length(3);
		expect(pureDatasets[0]).to.be.deep.equal([1, 2, 3]);
		// ds4
		expect(pureDatasets[4]).to.have.length(4);
		expect(pureDatasets[4]).to.be.deep.equal([1, -1, 2, 5]);
		// ds5
		expect(pureDatasets[5]).to.have.length(5);
		expect(pureDatasets[5]).to.be.deep.equal([1, -3, 4, 1, 2]);
	});

	it('getPositionsOfData', function() {
		var dataPositions = manipulation.getPositionsOfData("ds1", "ds0");
		expect(dataPositions).to.have.length(3);
		expect(dataPositions).to.be.deep.equal([1, 0, 2]);

		var dataPositions = manipulation.getPositionsOfData("ds0", "ds1");
		expect(dataPositions).to.be.deep.equal([1, 0, 2]);

		var dataPositions = manipulation.getPositionsOfData("ds3", "ds1");
		expect(dataPositions).to.have.length(3);
		expect(dataPositions).to.be.deep.equal([1, 0, undefined]);

		var dataPositions = manipulation.getPositionsOfData("ds1", "ds3");
		expect(dataPositions).to.have.length(4);
		expect(dataPositions).to.be.deep.equal([1, 0, undefined, undefined]);

		var dataPositions = manipulation.getPositionsOfData("ds4", "ds3");
		expect(dataPositions).to.be.equal(null);

		var dataPositions = manipulation.getPositionsOfData("ds3", "ds4");
		expect(dataPositions).to.be.deep.equal([]);
	});

	it('getDatasetDataOrderedByLabels', function() {
		var dataPositions = manipulation.getPositionsOfData("ds1", "ds0");
		expect(dataPositions).to.have.length(3);
		expect(dataPositions).to.be.deep.equal([1, 0, 2]);

		var datasetOrdered = manipulation.getDatasetDataOrderedByLabels("ds1", dataPositions, [bukvik.dataset.Manipulation.LABEL_UNKNOWN, 0]);
		expect(datasetOrdered).to.have.length(3);
		console.log("datasetOrdered: %s", datasetOrdered);
		expect(datasetOrdered).to.be.deep.equal([["L1", 1], ["L2", -1], ["L3", 0]]);
		var pureDatasetValues = manipulation.getPureDatasetValuesWithoutLabels(datasetOrdered);
		expect(pureDatasetValues).to.be.deep.equal([1, -1, 0]);

		dataPositions = manipulation.getPositionsOfData("ds0", "ds1");
		datasetOrdered = manipulation.getDatasetDataOrderedByLabels("ds0", dataPositions, [bukvik.dataset.Manipulation.LABEL_UNKNOWN, 0]);
		pureDatasetValues = manipulation.getPureDatasetValuesWithoutLabels(datasetOrdered);
		expect(pureDatasetValues).to.be.deep.equal([2, 1, 3]);

		dataPositions = manipulation.getPositionsOfData("ds0", "ds3");
		datasetOrdered = manipulation.getDatasetDataOrderedByLabels("ds0", dataPositions, [bukvik.dataset.Manipulation.LABEL_UNKNOWN, undefined]);
		pureDatasetValues = manipulation.getPureDatasetValuesWithoutLabels(datasetOrdered);
		expect(pureDatasetValues).to.be.deep.equal([1, 2, undefined, undefined]);
	});

	it('orderDataByDataset (keepLabelForUnknownDatum = false, assumeOrderdForNonLabeledDataset = true)', function() {
		var datasetsOrdered = manipulation.orderDataByDataset("ds0", false, true);

		expect(datasetsOrdered).to.have.length(6);
		
		expect(datasetsOrdered[0]).to.have.length(3);
		expect(datasetsOrdered[1]).to.have.length(3);
		expect(datasetsOrdered[2]).to.have.length(3);
		expect(datasetsOrdered[3]).to.have.length(3);
		expect(datasetsOrdered[4]).to.have.length(3);
		expect(datasetsOrdered[5]).to.have.length(3);

		// ds0
		expect(datasetsOrdered[0]).to.be.deep.equal([
		                         					["L1", 1],
		                        					["L2", 2],
		                        					["L3", 3]
		                        				]);
		// ds1
		expect(datasetsOrdered[1]).to.be.deep.equal([
			                         					["L1", 1],
			                        					["L2", -1],
			                        					["L3", 0]
			                        				]);
		// ds2
		expect(datasetsOrdered[2]).to.be.deep.equal([
			                         					["L1", 2],
			                         					bukvik.dataset.Manipulation.DATUM_UNKNOWN,
			                        					["L3", 1]
			                        				]);
		// ds3
		expect(datasetsOrdered[3]).to.be.deep.equal([
			                         					["L1", 1],
			                        					["L2", -1],
			                        					bukvik.dataset.Manipulation.DATUM_UNKNOWN
			                        				]);
		// ds4
		expect(datasetsOrdered[4]).to.be.deep.equal([
			                         					["L1", 1],
			                        					["L2", -1],
			                        					["L3", 2],
			                        				]);
		// ds5
		expect(datasetsOrdered[5]).to.be.deep.equal([
			                         					bukvik.dataset.Manipulation.DATUM_UNKNOWN,
			                        					["L2", -3],
			                        					bukvik.dataset.Manipulation.DATUM_UNKNOWN
			                        				]);
	});
	it('orderDataByDataset (keepLabelForUnknownDatum = false, assumeOrderdForNonLabeledDataset = false)', function() {
		var datasetsOrdered = manipulation.orderDataByDataset("ds0", false, false);
		expect(datasetsOrdered).to.have.length(6);
		expect(datasetsOrdered[2]).to.have.length(3);
		expect(datasetsOrdered[4]).to.have.length(3);

		expect(datasetsOrdered[2]).to.be.deep.equal([
			                        					["L1", 2],
			                         					bukvik.dataset.Manipulation.DATUM_UNKNOWN,
			                         					["L3", 1]
			                        				]);
		expect(datasetsOrdered[4]).to.be.deep.equal([
			                         					bukvik.dataset.Manipulation.DATUM_UNKNOWN,
			                         					bukvik.dataset.Manipulation.DATUM_UNKNOWN,
			                        					bukvik.dataset.Manipulation.DATUM_UNKNOWN
			                        				]);

	});
	it('orderDataByDataset (keepLabelForUnknownDatum = true, assumeOrderdForNonLabeledDataset = false)', function() {
		var datasetsOrdered = manipulation.orderDataByDataset("ds0", true, false);
		expect(datasetsOrdered).to.have.length(6);
		expect(datasetsOrdered[2]).to.have.length(3);
		expect(datasetsOrdered[2]).to.be.deep.equal([
			                         					["L1", 2],
			                         					["L2", bukvik.dataset.Manipulation.VALUE_UNKNOWN],
			                        					["L3", 1]
			                        				]);
		expect(datasetsOrdered[4]).to.be.deep.equal([
			                         					["L1", bukvik.dataset.Manipulation.VALUE_UNKNOWN],
			                         					["L2", bukvik.dataset.Manipulation.VALUE_UNKNOWN],
			                         					["L3", bukvik.dataset.Manipulation.VALUE_UNKNOWN]
			                        				]);
		//console.log("datasetsOrdered[4]: %s", JSON.stringify(datasetsOrdered[4], null, "\t"));
	});

	it('orderDataByDataset (keepLabelForUnknownDatum = true, assumeOrderdForNonLabeledDataset = true)', function() {
		var datasetsOrdered = manipulation.orderDataByDataset("ds0", true, true);
		expect(datasetsOrdered).to.have.length(6);
		expect(datasetsOrdered[2]).to.have.length(3);
		expect(datasetsOrdered[2]).to.be.deep.equal([
			                         					["L1", 2],
			                         					["L2", bukvik.dataset.Manipulation.VALUE_UNKNOWN],
			                        					["L3", 1]
			                        				]);
		expect(datasetsOrdered[4]).to.be.deep.equal([
			                         					["L1", 1],
			                         					["L2", -1],
			                         					["L3", 2]
			                        				]);
		//console.log("datasetsOrdered[4]: %s", JSON.stringify(datasetsOrdered[4], null, "\t"));
	});

	it('orderDataByDataset + getPureDatasetsValuesWithoutLabels', function() {
		var datasetsOrdered = manipulation.orderDataByDataset("ds0", true, false);
		var datasetsOrderedWithoutLabels = manipulation.getPureDatasetsValuesWithoutLabels(datasetsOrdered);
		expect(datasetsOrderedWithoutLabels).to.have.length(6);
		expect(datasetsOrderedWithoutLabels[0]).to.have.length(3);
		expect(datasetsOrderedWithoutLabels[2]).to.have.length(3);

		expect(datasetsOrderedWithoutLabels[0]).to.be.deep.equal([1, 2, 3]);
		expect(datasetsOrderedWithoutLabels[1]).to.be.deep.equal([1, -1, 0]);
		expect(datasetsOrderedWithoutLabels[2]).to.be.deep.equal([2, bukvik.dataset.Manipulation.VALUE_UNKNOWN, 1]);
		expect(datasetsOrderedWithoutLabels[3]).to.be.deep.equal([1, -1, bukvik.dataset.Manipulation.VALUE_UNKNOWN]);
		expect(datasetsOrderedWithoutLabels[4]).to.be.deep.equal([bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN]);
		expect(datasetsOrderedWithoutLabels[5]).to.be.deep.equal([bukvik.dataset.Manipulation.VALUE_UNKNOWN, -3, bukvik.dataset.Manipulation.VALUE_UNKNOWN]);

		var datasetsOrdered = manipulation.orderDataByDataset("ds0", true, true);
		var datasetsOrderedWithoutLabels = manipulation.getPureDatasetsValuesWithoutLabels(datasetsOrdered);
		expect(datasetsOrderedWithoutLabels[4]).to.be.deep.equal([1, -1, 2]);
		//console.log("datasetsOrdered[4]: %s", JSON.stringify(datasetsOrdered[4], null, "\t"));

		var datasetsOrdered = manipulation.orderDataByDataset("ds5", true, false);
		var datasetsOrderedWithoutLabels = manipulation.getPureDatasetsValuesWithoutLabels(datasetsOrdered);
		expect(datasetsOrderedWithoutLabels).to.have.length(6);
		expect(datasetsOrderedWithoutLabels[0]).to.have.length(5);
		expect(datasetsOrderedWithoutLabels[2]).to.have.length(5);

		expect(datasetsOrderedWithoutLabels[0]).to.be.deep.equal(
				[bukvik.dataset.Manipulation.VALUE_UNKNOWN, 2, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN]);
		expect(datasetsOrderedWithoutLabels[1]).to.be.deep.equal(
				[bukvik.dataset.Manipulation.VALUE_UNKNOWN, -1, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN]);
		expect(datasetsOrderedWithoutLabels[2]).to.be.deep.equal(
				[bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN]);
		expect(datasetsOrderedWithoutLabels[3]).to.be.deep.equal(
				[bukvik.dataset.Manipulation.VALUE_UNKNOWN, -1, 2, bukvik.dataset.Manipulation.VALUE_UNKNOWN, 0]);
		expect(datasetsOrderedWithoutLabels[4]).to.be.deep.equal(
				[bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN, bukvik.dataset.Manipulation.VALUE_UNKNOWN]);
		expect(datasetsOrderedWithoutLabels[5]).to.be.deep.equal([1, -3, 4, 1, 2]);
	});

	it('getPositionsOfDatasets', function() {
		var referentialArray = ["први", "andere", "third", "4", 5];
		var observedArray = [5, "third", "први", "4", "andere"];

		var order = manipulation.getPositionsOfDatasets(referentialArray, observedArray);
		expect(order).to.be.deep.equal([2, 4, 1, 3, 0]);

		observedArray = [5, "third", "први", "4", "andere", "шести"];		
		var order = manipulation.getPositionsOfDatasets(referentialArray, observedArray);
		expect(order).to.be.deep.equal([2, 4, 1, 3, 0]);

		observedArray = [5, "third", "први", "шести", "andere"];		
		var order = manipulation.getPositionsOfDatasets(referentialArray, observedArray);
		expect(order).to.be.deep.equal([2, 4, 1, undefined, 0]);
	});

	it('calculateAverage', function() {
		// keepLabelForUnknownDatum = true, assumeOrderdForNonLabeledDataset = false
		var datasetsOrdered = manipulation.orderDataByDataset("ds0", true, false);
		//console.log("datasetsOrdered: %s", JSON.stringify(datasetsOrdered, null, "\t"));

		var averageArray = manipulation.calculateAverage(datasetsOrdered, ["ds0"], [0]);
		expect(averageArray).to.be.deep.equal([
			                   					["L1", 1],
			                					["L2", 2],
			                					["L3", 3]
		                                       ]);

		var averageArray = manipulation.calculateAverage(datasetsOrdered, ["ds0", "ds1"], [0, 1]);
		//console.log("averageArray: %s", JSON.stringify(averageArray, null, "\t"));
		expect(averageArray).to.be.deep.equal([
			                   					["L1", 1],
			                					["L2", 0.5],
			                					["L3", 1.5]
		                                       ]);

		var averageArray = manipulation.calculateAverage(datasetsOrdered, ["ds0", "ds2"], [0, 2]);
		expect(averageArray).to.be.deep.equal([
			                   					["L1", 1.5],
			                					["L2", 1],
			                					["L3", 2]
		                                       ]);

		var averageArray = manipulation.calculateAverage(datasetsOrdered, ["ds3", "ds5"], [3, 5]);
		expect(averageArray).to.be.deep.equal([
			                   					["L1", 0.5],
			                					["L2", -2],
			                					["L3", 0]
		                                       ]);

		var averageArray = manipulation.calculateAverage(datasetsOrdered, ["ds0", "ds3", "ds5"], [0, 3, 5]);
		//console.log("averageArray: %s", JSON.stringify(averageArray, null, "\t"));
		expect(averageArray).to.be.deep.equal([
			                   					["L1", 2/3],
			                					["L2", -2/3],
			                					["L3", 1]
		                                       ]);

		var averageArray = manipulation.calculateAverage(datasetsOrdered, ["ds0", "ds3", "ds5"]);
		//console.log("averageArray: %s", JSON.stringify(averageArray, null, "\t"));
		expect(averageArray).to.be.deep.equal([
			                   					["L1", 2/3],
			                					["L2", -2/3],
			                					["L3", 1]
		                                       ]);
	});

	it('setDatasetsRelativeToAverage', function() {
		// keepLabelForUnknownDatum = true, assumeOrderdForNonLabeledDataset = false
		var datasetsOrdered = manipulation.orderDataByDataset("ds0", true, false);
		//console.log("datasetsOrdered: %s", JSON.stringify(datasetsOrdered, null, "\t"));
		var datasetsOrderedWithoutLabels = manipulation.getPureDatasetsValuesWithoutLabels(datasetsOrdered);
		//console.log("datasetsOrderedWithoutLabels: %s", JSON.stringify(datasetsOrderedWithoutLabels, null, "\t"));
		
		var datasetAverage = manipulation.calculateAverage(datasetsOrdered, ["ds0"], [0]);
		expect(datasetAverage).to.be.deep.equal([
			                   					["L1", 1],
			                					["L2", 2],
			                					["L3", 3]
		                                       ]);
		manipulation.setDatasetsRelativeToAverage(datasetsOrderedWithoutLabels, datasetAverage);
		//console.log("datasetsOrderedWithoutLabels (relative): %s", JSON.stringify(datasetsOrderedWithoutLabels, null, "\t"));
		expect(datasetsOrderedWithoutLabels).to.have.length(6);
		expect(datasetsOrderedWithoutLabels[0]).to.be.deep.equal([0,0,0]);
		expect(datasetsOrderedWithoutLabels[1]).to.be.deep.equal([0,-3,-3]);
		expect(datasetsOrderedWithoutLabels[2]).to.be.deep.equal([1,-2,-2]);
		expect(datasetsOrderedWithoutLabels[3]).to.be.deep.equal([0,-3,-3]);
		expect(datasetsOrderedWithoutLabels[4]).to.be.deep.equal([-1,-2,-3]);
		expect(datasetsOrderedWithoutLabels[5]).to.be.deep.equal([-1,-5,-3]);
	
		datasetsOrdered = manipulation.orderDataByDataset("ds0", true, true);
		datasetsOrderedWithoutLabels = manipulation.getPureDatasetsValuesWithoutLabels(datasetsOrdered);		
		datasetAverage = manipulation.calculateAverage(datasetsOrdered, ["ds0"], [0]);
		manipulation.setDatasetsRelativeToAverage(datasetsOrderedWithoutLabels, datasetAverage);
		//console.log("datasetsOrderedWithoutLabels (relative): %s", JSON.stringify(datasetsOrderedWithoutLabels, null, "\t"));
		expect(datasetsOrderedWithoutLabels[4]).to.be.deep.equal([0,-3,-1]);

		datasetsOrdered = manipulation.orderDataByDataset("ds0", true, true);
		datasetsOrderedWithoutLabels = manipulation.getPureDatasetsValuesWithoutLabels(datasetsOrdered);		
		datasetAverage = manipulation.calculateAverage(datasetsOrdered, ["ds1"], [1]);
		expect(datasetAverage).to.be.deep.equal([
			                   					["L1", 1],
			                					["L2", -1],
			                					["L3", 0]
		                                       ]);
		manipulation.setDatasetsRelativeToAverage(datasetsOrderedWithoutLabels, datasetAverage);
		//console.log("datasetsOrderedWithoutLabels (relative): %s", JSON.stringify(datasetsOrderedWithoutLabels, null, "\t"));
		expect(datasetsOrderedWithoutLabels).to.have.length(6);
		expect(datasetsOrderedWithoutLabels[0]).to.be.deep.equal([0,3,3]);
		expect(datasetsOrderedWithoutLabels[1]).to.be.deep.equal([0,0,0]);
		expect(datasetsOrderedWithoutLabels[2]).to.be.deep.equal([1,1,1]);
		expect(datasetsOrderedWithoutLabels[3]).to.be.deep.equal([0,0,0]);
		expect(datasetsOrderedWithoutLabels[4]).to.be.deep.equal([0,0,2]);
		expect(datasetsOrderedWithoutLabels[5]).to.be.deep.equal([-1,-2,0]);
	});


	it('setDatasetsRelativeToAverage (with 2 average datasets)', function() {
		// keepLabelForUnknownDatum = true, assumeOrderdForNonLabeledDataset = false
		var datasetsOrdered = manipulation.orderDataByDataset("ds1", true, true);
		expect(datasetsOrdered[0]).to.be.deep.equal([
				                					["L2", 2],
				                   					["L1", 1],
				                					["L3", 3]
			                                       ]);
		//console.log("datasetsOrdered: %s", JSON.stringify(datasetsOrdered, null, "\t"));
		var datasetsOrderedWithoutLabels = manipulation.getPureDatasetsValuesWithoutLabels(datasetsOrdered);
		//console.log("datasetsOrderedWithoutLabels: %s", JSON.stringify(datasetsOrderedWithoutLabels, null, "\t"));
		
		var datasetAverage = manipulation.calculateAverage(datasetsOrdered, ["ds3", "ds5"], [3, 5]);
		expect(datasetAverage).to.be.deep.equal([
			                					["L2", -2],
			                   					["L1", 0.5],
			                					["L3", 0]
		                                       ]);
		manipulation.setDatasetsRelativeToAverage(datasetsOrderedWithoutLabels, datasetAverage);
		//console.log("datasetsOrderedWithoutLabels (relative): %s", JSON.stringify(datasetsOrderedWithoutLabels, null, "\t"));
		expect(datasetsOrderedWithoutLabels).to.have.length(6);
		expect(datasetsOrderedWithoutLabels[0]).to.be.deep.equal([4,0.5,3]);
		expect(datasetsOrderedWithoutLabels[1]).to.be.deep.equal([1,0.5,0]);
		expect(datasetsOrderedWithoutLabels[2]).to.be.deep.equal([2,1.5,1]);
		expect(datasetsOrderedWithoutLabels[3]).to.be.deep.equal([1,0.5,0]);
		expect(datasetsOrderedWithoutLabels[4]).to.be.deep.equal([3,-1.5,2]);
		expect(datasetsOrderedWithoutLabels[5]).to.be.deep.equal([-1,-0.5,0]);
	});

	it('testing promises library', function(done) {
		this.timeout(500); // reducing standard mocha 2000ms timeout
		var data = {
			'$promise': null,
			'value': null,
			'tempValue': null
		};
		var deferred;
		expect(Q).not.to.be.null;
		
		function setDataset(value){
			data.tempValue = value;
			var deferred = Q.defer();
			data.$promise = deferred.promise;
			
			console.log("[TEST-async] Q. setting timeout");
			window.setTimeout(function(){
				data.value = data.tempValue;
				console.log("[TEST-async] Q. deferred.resolve");
				deferred.resolve(data);
			}, 250 );
			return data;
		}

		function getDataset(){
			return data;
		}

		setDataset({'hello': "world"});
		var finalData = getDataset();
		expect(data.tempValue).not.to.be.null;
		expect(data.value).to.be.null;

		finalData.$promise.then(function(finalizedData){
			expect(data.value).not.to.be.null;
			expect(finalizedData).to.be.equal(finalData);
			expect(data).to.be.equal(finalData);
			console.log("[TEST-async] Q. finalizedData.value: %s, finalizedData.tempValue=%s", finalizedData.value, finalizedData.tempValue);
			done();
		}).done(null, done);
		console.log("[TEST-async] Q. data.value: %s, data.tempValue=%s", data.value, data.tempValue);
	});

	it('testing datasetProcessed promise existance', function() {
		expect(Q).not.to.be.null;
		expect(manipulation.datasetProcessedDeferred).not.to.be.null;
	});

	it('testing datasetProcessed promise fulfilment (without delay)', function(done) {
		expect(Q).not.to.be.null;
		expect(manipulation.datasetProcessed.$resolved).to.be.true;
		manipulation.getProcessedDataset().$promise.then(function(datasetProcessed){
			expect(manipulation.datasetProcessed.$resolved).to.be.true;
			expect(manipulation.datasetProcessed.content).to.be.equal(manipulation.getDataset().content);
			done();
		}).done(null, done);
		expect(manipulation.datasetProcessed.$resolved).to.be.true;
	});

	it('testing datasetProcessed promise fulfilment', function(done) {
		// reset dataset with insisting on delay for processed datasets
		manipulation.setDataset(manipulation.getDataset(), true);

		expect(Q).not.to.be.null;
		expect(manipulation.datasetProcessed.$resolved).to.be.false;
		manipulation.getProcessedDataset().$promise.then(function(datasetProcessed){
			expect(manipulation.datasetProcessed.$resolved).to.be.true;
			expect(manipulation.datasetProcessed.content).to.be.equal(manipulation.getDataset().content);
			done();
		}).done(null, done);
		expect(manipulation.datasetProcessed.$resolved).to.be.false;
		manipulation.setProcessingFinished();

		expect(manipulation.datasetsNames.length).to.be.equal(6);
		expect(manipulation.datasetsNames[0]).to.be.equal("ds0");
		expect(manipulation.datasetsNames[5]).to.be.equal("ds5");
	});

	it('testing datasetProcessed callback fulfilment', function(done) {
		// reset dataset with insisting on delay for processed datasets
		manipulation.setDataset(manipulation.getDataset(), true);

		expect(manipulation.datasetProcessed.$resolved).to.be.false;
		manipulation.getProcessedDataset(function(datasetProcessed){
			expect(manipulation.datasetProcessed.$resolved).to.be.true;
			expect(manipulation.datasetProcessed.content).to.be.equal(manipulation.getDataset().content);
			done();
		});
		expect(manipulation.datasetProcessed.$resolved).to.be.false;
		manipulation.setProcessingFinished();
	});

/*
				"ds0": [
					["L1", 1],
					["L2", 2],
					["L3", 3]
				],
				"ds1": [
					["L2", -1],
					["L1", 1],
					["L3", 0]
				],
				"ds2": [
					["L3", 1],
					["L1", 2]
				],
				"ds3": [
					["L1", 1],
					["L2", -1],
					["L6", 0],
					["L4", 2]
				],
				"ds4": [1, -1, 2, 5],
				"ds5": [
					["L5", 1],
					["L2", -3],
					["L4", 4],
					["L7", 1],
					["L6", 2]
				]
 */
});