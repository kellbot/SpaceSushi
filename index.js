const Blueprint = require('factorio-blueprint');
const seData = require('./data-raw-se.json');


const assemblers = ["accumulator", "solar_panel", 'storage_tank', 'steam_turbine', 'roboport', 'explosive_cannon_shell', 'radar', 'electric_motor', "copper_cable", "iron_gear_wheel",
  "se_electric_boiler", "se_heat_shielding", "electronic_circuit", "advanced_circuit", "laser_turret", "se_meteor_defence_ammo", "rail", "iron_stick", "stone_tablet"];

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
  },
  'glass':
  {
    type: 'item',
    recipe: true,
    width: 1,
    height: 1
  },
  'electric_motor': {
    type: 'item',
    recipe: true,
    width: 1,
    height: 1
  },
  'concrete': {
    type: 'item',
    width: 1,
    height: 1,
  },
  'se_electric_boiler': {
    type: "item",
    width: 3,
    height: 2
  },
  "se_heat_shielding": {
    type: "item",
    height: 1,
    width: 1
  },
  "se_meteor_defence_ammo": {
    type: "item",
    height: 1,
    width: 1
  },
  "stone_tablet": {
    type: "item",
    height: 1,
    widht: 1
  }
});

function humanize(string) {
  let spaces = string.replaceAll('_', ' ');
  return spaces.charAt(0).toUpperCase() + spaces.slice(1);
}

function getSeItem(name) {
  return seData.item[name.replaceAll("_", "-")];
}

function getRecipe(name) {
  return seData.recipe[name.replaceAll('_', '-')];
}

function getIngredients(itemName) {
  recipe = getRecipe(itemName);
  let fullIngredients;
  let ingredients = new Set();
  if (!recipe.ingredients) {
    fullIngredients = recipe.normal.ingredients;
  } else {
    fullIngredients = recipe.ingredients;
  }
  for (let j = 0; j < fullIngredients.length; j++) {
    try {
      // sometimes we get an objet with a name property
      if (fullIngredients[j].name) {
        ingredients.add(fullIngredients[j].name.replaceAll('-', '_'));
        // other times it's just an array
      } else {
        ingredients.add(fullIngredients[j][0].replaceAll('-', '_'));
      }
    } catch (e) {
      console.log(e);
      console.log(recipe);
    }

  }
  return Array.from(ingredients);
}

function getAllIngredients(itemNameArray) {
  let allIngredients = new Set();

  for (let i = 0; i < itemNameArray.length; i++) {
    let itemName = itemNameArray[i];
    let ingredients = getIngredients(itemName);
    if (!recipe) console.log(`Error: No recipe for ${recipe}`)
    for (let j = 0; j < ingredients.length; j++) {
      allIngredients.add(ingredients[j]);
    }
  }
  return Array.from(allIngredients);

}

// creates the storage boxes and assembler for an item, optionally creates a return to the main belt
function createAssemblerBlueprint(itemName, beltReturn = false) {
  let obSet = getIngredients(itemName);
  const ob = new Blueprint();
  ob.name = `${humanize(itemName)} Assembler`;
  let combinator = ob.createEntity("constant_combinator", { x: 1, y: -5 });

  let lastChest;
  //for each ingredient in the recipe
  let j;
  for (j = 0; j < obSet.length; j++) {
    let xPos = (j == 4)? j+1 : j;
    combinator.setConstant(j, obSet[j], (getSeItem(obSet[j]).stack_size * -1) + 10);
    let chest = ob.createEntity('steel_chest', { x: xPos, y: 0 });
    chest.setBar(1);
    let sfi = ob.createEntity('stack_filter_inserter', { x: xPos, y: 1 }, Blueprint.DOWN);
    ob.createEntity('fast_inserter', { x: xPos, y: -1 }, Blueprint.DOWN);

    sfi.setFilter(0, obSet[j]);
    // wider than assembler
    if(j == 3){
      ob.createEntity("fast_transport_belt", {x: xPos, y: -2}, Blueprint.RIGHT);
      ob.createEntity("fast_transport_belt", {x: xPos+1, y: -2}, Blueprint.UP);
      ob.createEntity("fast_transport_belt", {x: xPos+1, y: -3}, Blueprint.UP);
      ob.createEntity("fast_inserter", {x: xPos, y: -3}, Blueprint.RIGHT);
    }
    if(j == 4){
      ob.createEntity("fast_transport_belt", {x: xPos, y: -2}, Blueprint.LEFT);
    }

    //if there is another chest in this group connect to it with red wire
    if (lastChest) {
      chest.connect(lastChest, null, null, "red");
    }

    //increase the combinator totals
    lastChest = chest;
  }

  let machine = ob.createEntity('assembling_machine_2', { x: 0, y: -4 });
  machine.setRecipe(itemName);
  //add a power pole for easy connections
  let pole = ob.createEntity("medium_electric_pole", { x: 0, y: -5 });
  pole.connect(lastChest, null, null, "red");

  combinator.connect(pole, null, null, "red");

  let returnPos;
  if (beltReturn) {
    if (obSet.length > 3) return;
    //place it under the assembler if there's room, next to it if not
    if (obSet.length < 3) {
      returnPos =  2; 
      ob.createEntity("fast_underground_belt", {x : returnPos, y: -6}, Blueprint.DOWN);
      ob.createEntity("fast_underground_belt", {x : returnPos, y: -1}, Blueprint.DOWN).setDirectionType("output");
      ob.createEntity("fast_transport_belt", {x: returnPos, y: 0}, Blueprint.DOWN);

    } else {
      returnPos = 3;
      //return belt

        ob.createEntity("fast_transport_belt", {x: 2, y: -6}, Blueprint.RIGHT);
        
        ob.createEntity("fast_transport_belt", {x: 3, y: -6}, Blueprint.DOWN);
      for (let yPos = -5; yPos < 1; yPos++){
        ob.createEntity("fast_transport_belt", {x: returnPos, y: yPos}, Blueprint.DOWN);
      }
      
    }
    //output arm
    ob.createEntity('stack_inserter', { x: returnPos, y: 1 }, Blueprint.UP).connect(pole, null, null, "green").setCondition({
      left: itemName,
      right: getSeItem(itemName).stack_size * 5,
      operator: "<"
    });
  } else {
    ob.createEntity("logistic_chest_passive_provider", {x: 2, y: -6}).setBar(1);

  }
  ob.createEntity("fast_inserter", {x: 2, y: -5}, Blueprint.DOWN);
  
  return ob;
}

let storedItems = getAllIngredients(assemblers);
storedItems = storedItems; //.concat(['pipe', 'pipe_to_ground']);
let inputItems = storedItems;



const bp = new Blueprint();
bp.name = "Main Sorter";

let startY = 1;
let segment = 1;
let flipped = false;
let lastSubstation;
let lastBottom;
let lastTop;
let lastSt;
let lastSb;

let boxNo = 0;
//Start with some substations

let bpWidth = Math.ceil(storedItems.length / 16) * 18 + 2;

for (let i = 0; i <= bpWidth; i += 18) {

  flipped = (segment % 2 == 0) ? true : false;
  let lastSegment = (i + 18 < bpWidth) ? false : true;
  let topDirection = flipped ? Blueprint.RIGHT : Blueprint.LEFT;
  let bottomDirection = flipped ? Blueprint.LEFT : Blueprint.RIGHT;
  let midDirection = flipped ? Blueprint.DOWN : Blueprint.UP;

  bp.createEntity('fast_underground_belt', { x: i, y: startY - 1 }, Blueprint.DOWN);
  bp.createEntity('fast_underground_belt', { x: i + 1, y: startY - 1 }, Blueprint.DOWN);

  let substation = bp.createEntity('substation', { x: i, y: startY }, Blueprint.RIGHT);
  //connect first one to combinator
  if (lastSubstation) {
    substation.connect(lastSubstation, null, null, 'red');
    substation.connect(lastSubstation, null, null, 'green');
  }
  if (lastBottom) {
    substation.connect(lastBottom, null, null, 'green');
    substation.connect(lastTop, null, null, 'green');
  }

  if (flipped) {
    bp.createEntity('fast_underground_belt', { x: i, y: startY + 2 }, Blueprint.DOWN).setDirectionType('output');
    bp.createEntity('fast_underground_belt', { x: i + 1, y: startY + 2 }, Blueprint.DOWN).setDirectionType('output');
  } else {
    bp.createEntity('fast_underground_belt', { x: i, y: startY + 2 }, Blueprint.UP);
    bp.createEntity('fast_underground_belt', { x: i + 1, y: startY + 2 }, Blueprint.UP);
  }
  // Put 2x2 boxes between them

  if (!lastSegment) {
    for (let j = 2; j < 18; j += 2) {

      let bottomBox = bp.createEntity('aai_strongbox_passive_provider', { x: j + i, y: startY + 1 }, Blueprint.RIGHT);
      let topBox = bp.createEntity('aai_strongbox_passive_provider', { x: j + i, y: startY - 1 }, Blueprint.RIGHT);

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
        sbx = j + i + 1;
      } else {
        sfbx = j + i + 1;
        sftx = j + i;
        stx = j + i + 1;
        sbx = j + i;
      }

      let sfb = bp.createEntity('stack_filter_inserter', { x: sfbx, y: startY + 3 }, Blueprint.DOWN);
      let sb = bp.createEntity('stack_inserter', { x: sbx, y: startY + 3 }, Blueprint.UP);

      if (boxNo < storedItems.length) {
        let itemName = storedItems[boxNo];
        sfb.setFilter(0, itemName);
        sb.setCondition({
          left: itemName,
          right: 0,
          operator: '<', // If arithmetic, +-*/, if decider, <>=
        });
      }
      boxNo++;

      itemName = storedItems[boxNo];
      let sft = bp.createEntity('stack_filter_inserter', { x: sftx, y: startY - 2 }, Blueprint.UP);
      let st = bp.createEntity('stack_inserter', { x: stx, y: startY - 2 }, Blueprint.DOWN);
      if (boxNo < storedItems.length) {
        sft.setFilter(0, itemName);
        st.setCondition({
          left: itemName,
          right: 0,
          operator: '<', // If arithmetic, +-*/, if decider, <>=
        });
      }
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
      bp.createEntity('fast_transport_belt', { x: k + i, y: 5 }, topDirection);
      bp.createEntity('fast_transport_belt', { x: k + i, y: -2 }, bottomDirection);

    }


  }
  if (!flipped) {
    bp.createEntity('fast_transport_belt', { x: 1 + i, y: -2 }, Blueprint.RIGHT);
    bp.createEntity('fast_transport_belt', { x: i, y: -2 }, Blueprint.LEFT);
    bp.createEntity('fast_transport_belt', { x: i, y: 5 }, midDirection);
    bp.createEntity('fast_transport_belt', { x: 1 + i, y: 5 }, midDirection);
  } else {
    bp.createEntity('fast_transport_belt', { x: 1 + i, y: -2 }, midDirection);
    bp.createEntity('fast_transport_belt', { x: i, y: -2 }, midDirection);
    bp.createEntity('fast_transport_belt', { x: i, y: 5 }, Blueprint.LEFT);
    bp.createEntity('fast_transport_belt', { x: 1 + i, y: 5 }, Blueprint.RIGHT);
  }


  bp.createEntity('fast_transport_belt', { x: 1 + i, y: -1 }, midDirection);


  bp.createEntity('fast_splitter', { x: i, y: 4 }, midDirection);
  bp.createEntity('fast_transport_belt', { x: i, y: -1 }, midDirection);
  lastSubstation = substation;
  segment++;
}
// Center the blueprint around the entities instead of position (0,0)
bp.fixCenter();

/// export
let obPrints = [];
//make assemblers here
for (let i = 0; i < assemblers.length; i++) {
  let objOutput = storedItems.includes(assemblers[i]) ? true : false;
  try {
    obPrints.push(createAssemblerBlueprint(assemblers[i], objOutput));
  } catch (e) {
    console.log(e);
    console.log(`Building ${assemblers[i]}`);
  }
}

//********** Import Row *************/
// Inserters for imported items
let inputBp = new Blueprint();
inputBp.name = 'Input Row';
let lastInserter;
for (let i = 0; i < inputItems.length; i++) {
  let name = inputItems[i];
  let stackSize = getSeItem(name).stack_size;
  inputBp.createEntity('fast_transport_belt', { x: i, y: -1 }, Blueprint.RIGHT);
  let inputInserter = inputBp.createEntity('stack_filter_inserter', { x: i, y: 0 }, Blueprint.DOWN);
  inputInserter.setFilter(0, name);
  if (lastInserter) {
    inputInserter.connect(lastInserter, null, null, "green");
  }
  inputInserter.setCondition({
    left: name,
    right: stackSize * 5,
    operator: '<'
  });
  inputBp.createEntity('fast_transport_belt', { x: i, y: 1 }, Blueprint.UP);
  lastInserter = inputInserter;
}
obPrints.push(inputBp);
obPrints.push(bp);

// Output the blueprint string!
console.log(Blueprint.toBook(obPrints));