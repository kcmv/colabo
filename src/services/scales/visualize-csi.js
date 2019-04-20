function readTextFile(file, callback) {
    var mimeType = "application/json";
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType(mimeType);
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//usage:
readTextFile("data/results-fv-2018.json", function(text) {
    var csiData = JSON.parse(text);
    console.log(csiData);
    drawCsiDiagram(csiData);
});

function drawCsiDiagram(csiData) {
    let data1 = ["data1"];

    data1.push(csiData.total["biased_collaboration"]);
    data1.push(csiData.total["biased_effort"]);
    data1.push(csiData.total["biased_enjoyment"]);
    data1.push(csiData.total["biased_exploration"]);
    data1.push(csiData.total["biased_expressiveness"]);
    data1.push(csiData.total["biased_immersion"]);

    diagramDeclaration = {
        bindto: "#chart",
        data: {
            columns: [],
            types: {
                data1: "line",
                data2: "area-spline"
            },
            colors: {
                data1: "red",
                data2: "green"
            }
        }
    };

    // let data1 = [30, 200, 100, 170, 150, 250];
    // data1.unshift("data1");
    diagramDeclaration.data.columns.push(data1);

    // let data2 = [130, 100, 140, 35, 110, 50]
    // data2.unshift("data2");
    data2 = data1.slice(0);
    data2[0] = "data2";
    diagramDeclaration.data.columns.push(data2);

    bb.generate(diagramDeclaration);
}