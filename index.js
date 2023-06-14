const Blueprint = require('factorio-blueprint');
const seData = require('./data-raw-se.json');

const bp = new Blueprint();

Blueprint.setEntityData({
  'aai_strongbox_passive_provider':
  {
    type: 'item', // 'item', 'fluid', 'virtual', 'tile', or 'recipe'
    width: 2,
    height: 2,
    recipe: true,
    modules: 4,
    inventorySize: 96, // How many slots this container has (such as a chest)
    filterAmount: false, // Set to false for filter inserters which have filters but no "amounts" on the filters
    directionType: false // true for underground belts
  }
});
let startY = 1;
let segment = 1;
let flipped = false;
let lastSubstation;
let lastBottom;
let lastTop;
let lastSt;
let lastSb;
let storedItems = [
  'copper_plate', 'iron_plate', 'steel_plate', 'stone',
  'plastic_bar', 'sulfur', 'coal', 'explosives',
  'copper_cable', 'iron_gear_wheel'];
let boxNo = 0;
//Start with some substations
for (let i = 0; i < 40; i += 18) {
  flipped = (segment % 2 == 0) ? true : false;
  let lastSegment = (i + 18 < 40) ? false : true;
  let topDirection = flipped ? Blueprint.RIGHT : Blueprint.LEFT;
  let bottomDirection = flipped ? Blueprint.LEFT : Blueprint.RIGHT;
  let midDirection = flipped ? Blueprint.DOWN : Blueprint.UP;

  bp.createEntity('fast_underground_belt', { x: i, y: startY - 1} , Blueprint.DOWN);
  bp.createEntity('fast_underground_belt', { x: i+1, y: startY - 1} , Blueprint.DOWN);

  let substation = bp.createEntity('substation', { x: i, y: startY }, Blueprint.RIGHT);
  if (lastSubstation) {
    substation.connect(lastSubstation, null, null, 'red');
    substation.connect(lastSubstation, null, null, 'green');
  }
  if (lastBottom) {
    substation.connect(lastBottom, null, null, 'green');
    substation.connect(lastTop, null, null, 'green');
  }

  if (flipped) {
    bp.createEntity('fast_underground_belt', { x: i, y: startY + 2} , Blueprint.DOWN).setDirectionType('output');
    bp.createEntity('fast_underground_belt', { x: i+1, y: startY + 2} , Blueprint.DOWN).setDirectionType('output');
  } else {
    bp.createEntity('fast_underground_belt', { x: i, y: startY + 2} , Blueprint.UP);
    bp.createEntity('fast_underground_belt', { x: i+1, y: startY + 2} , Blueprint.UP);
  }
    // Put 2x2 boxes between them

  if (!lastSegment) {
    for (let j = 2; j < 18; j +=2 ) {

      let bottomBox = bp.createEntity('aai_strongbox_passive_provider', { x: j + i, y: startY + 1}, Blueprint.RIGHT);
      let topBox = bp.createEntity('aai_strongbox_passive_provider', { x: j + i, y: startY - 1}, Blueprint.RIGHT);
      
      if (j < 4) {

        topBox.connect(substation, null, null, 'green');
        bottomBox.connect(substation, null, null, 'green');

    } else {
      bottomBox.connect(lastBottom, null, null, 'green');
      topBox.connect(lastTop, null, null, "green");
    }
    lastBottom = bottomBox;
    lastTop = topBox;

    //inserters
      if (flipped) {
        sfbx = j + i;
        sftx = j + i + 1;
        stx = j + i;
        sbx = j + i  + 1;
      } else {
        sfbx = j + i + 1;
        sftx = j + i;
        stx = j + i  + 1;
        sbx = j + i;
      }

      let sfb = bp.createEntity('stack_filter_inserter', { x: sfbx, y: startY + 3 }, Blueprint.DOWN);
      let sb = bp.createEntity('stack_inserter', { x: sbx, y: startY + 3 }, Blueprint.UP);
      
      if (boxNo < storedItems.length) {
        let seItem = seData.item[storedItems[boxNo].replace("_", "-")];
        sfb.setFilter(0, storedItems[boxNo]);
        sb.setCondition({
          left: storedItems[boxNo],
          right: seItem.stack_size,
          operator: '<', // If arithmetic, +-*/, if decider, <>=
        });


      }
      boxNo++;

     
      let sft = bp.createEntity('stack_filter_inserter', { x: sftx, y: startY - 2 }, Blueprint.UP);
      let st = bp.createEntity('stack_inserter', { x: stx, y: startY -2 }, Blueprint.DOWN);
      if (boxNo < storedItems.length) sft.setFilter(0, storedItems[boxNo]);
      boxNo++;

      if (j > 2) {
        sb.connect(lastSb, null, null, "red");
        st.connect(lastSt, null, null, "red");
      } else {
        sb.connect(substation, null, null, "red");
        st.connect(substation, null, null, "red");
      }
      lastSb = sb;
      lastSt = st;

    }
 
  // Add belts


    for (let k = 2; k < 18; k++) {
      bp.createEntity('fast_transport_belt', { x: k + i, y: 5}, topDirection);
      bp.createEntity('fast_transport_belt', { x: k + i, y: -2}, bottomDirection);

    }
  
 
}
if (!flipped) {
  bp.createEntity('fast_transport_belt', { x: 1 + i, y: -2}, Blueprint.RIGHT);
  bp.createEntity('fast_transport_belt', { x: i, y: -2}, Blueprint.LEFT);
  bp.createEntity('fast_transport_belt', { x: i, y: 5}, midDirection);
  bp.createEntity('fast_transport_belt', { x: 1 + i, y: 5}, midDirection);
} else {
  bp.createEntity('fast_transport_belt', { x: 1 + i, y: -2}, midDirection);
  bp.createEntity('fast_transport_belt', { x: i, y: -2}, midDirection);
  bp.createEntity('fast_transport_belt', { x: i, y: 5}, Blueprint.LEFT);
  bp.createEntity('fast_transport_belt', { x: 1 + i, y: 5}, Blueprint.RIGHT);
}

bp.createEntity('fast_transport_belt', { x: 1 + i, y: 4}, midDirection);
bp.createEntity('fast_transport_belt', { x: 1 + i, y: -1}, midDirection);


bp.createEntity('fast_transport_belt', { x: i, y: 4}, midDirection);
bp.createEntity('fast_transport_belt', { x: i, y: -1}, midDirection);
  lastSubstation = substation;
  segment++;
}
// Center the blueprint around the entities instead of position (0,0)
bp.fixCenter();

//and now some exporters
let outBoxes = [
  ['explosives', 'plastic_bar', 'steel_plate']
];

let obPrints = [];

for (let i = 0; i < outBoxes.length; i++) {

  const ob = new Blueprint();
  let obSet = outBoxes[i];
  let lastChest;
  //for each ingredient in the recipe
  for (let j = 0; j< obSet.length; j++) {
    let chest = ob.createEntity('steel_chest', { x: j, y: 0});
    chest.setBar(1);
    let sfi = ob.createEntity('stack_filter_inserter', {x: j, y: 1}, Blueprint.DOWN);
    ob.createEntity('fast_inserter', {x: j, y: -1}, Blueprint.DOWN);
    sfi.setFilter(0, obSet[j]);

    if (lastChest) {
      chest.connect(lastChest, null, null, "red");
    }
  
    lastChest = chest
  }
  obPrints.push(ob);
}

obPrints.push(bp);

// Output the blueprint string!
console.log(Blueprint.toBook(obPrints));