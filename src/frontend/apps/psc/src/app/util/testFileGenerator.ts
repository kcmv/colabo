function tempGen(): string {
  let sdgs: string[] = [
    "A world where peace is more important than winning",
    "Love is more powerful than the power",
    "Each man has bread and water",
    "People are not afraid of the dearest ones",
    "Hospitals are not needed anymore",
    "Each man can write",
    "Free elementary education is guaranteed ",
    "Each child has a mobile phone and Internet",
    "Each woman can do the same as men",
    "Girls are free",
    "There is no river that is not drinkable",
    "All the waste is recycled",
    "No smokes of coal",
    "Green forests, green energy",
    "A strong economy, rich countries",
    "Every nation has highly developed industry",
    "Clean industries",
    "All parts of the world are interlinked",
    "Every village has a good quality road",
    "Each company has an R&D sector",
    "Each company is socially aware",
    "All skin colors make the world flag",
    "Afrika is equal to Europe, no neocolonialism",
    "Villagers are the first-order citizens",
    "Cities are smart and self-contained"
  ];
  let output = [];
  let userIdStr: string = "0x556760847125996dc1a4";
  let itemIdStr: string = "0x5be3fddce1b7970d8c6d";
  let userId: number = parseInt(userIdStr);
  let itemId: number = parseInt(itemIdStr);
  function toPaddedHexString(num, len) {
    let str = num.toString(16);
    return "0".repeat(len - str.length) + str;
  }

  for (var i: number = 0; i < sdgs.length; i++) {
    output.push({
      userId: userIdStr + toPaddedHexString(i, 4), //(userId++).toString(16),
      itemId: itemIdStr + toPaddedHexString(i, 4), //(itemId++).toString(16),
      item: sdgs[i],
      itemHId: i + 1
    });
  }
  let outputStr: string = JSON.stringify(output);
  console.log("sdgTest", outputStr);
  return outputStr;
}
