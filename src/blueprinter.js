import Blueprint from 'factorio-blueprint';
import seData from './assets/data.json';
import seBlueprintData from './assets/blueprintData.json';

// eslint-disable-next-line no-unused-vars
let i1x1 = {
  type: "item",
  height: 1,
  width: 1
}

Blueprint.setEntityData(seBlueprintData);

function humanize(string) {
  let spaces = string.replaceAll('_', ' ');
  return spaces.charAt(0).toUpperCase() + spaces.slice(1);
}

function getSeItem(name) {
  return seData.items.filter(i => {
    return i.id == name;
  })[0];
}

function getRecipes(name) {
  if(name == 'electronic-circuit-stone') name = 'electronic-circuit';
  try {
    return seData.recipes.filter(r => {
      return r.out[name]
    });
  } catch (e) {
    console.log(e);
    console.log(name)
  }
}

function getIngredients(itemName) {
  let recipe = getRecipes(itemName)[0];
  if (!recipe) return false;
  return Object.keys(recipe.in);
}

function getAllIngredients(itemNameArray) {
  let allIngredients = new Set();

  for (let i = 0; i < itemNameArray.length; i++) {
    let itemName = itemNameArray[i];
    let ingredients = getIngredients(itemName);

    for (let j = 0; j < ingredients.length; j++) {
      allIngredients.add(ingredients[j]);
    }
  }
  return Array.from(allIngredients);

}

function checkEntity(itemName) {
  if(!Blueprint.getEntityData()[itemName.replaceAll('-','_')]){
    let data = new Object();
    data[itemName.replaceAll('-','_')] = i1x1;
    Blueprint.setEntityData(data);
  } 
}

// creates the storage boxes and assembler for an item, optionally creates a return to the main belt
function createProducerBlueprint(itemName, beltReturn = false) {
  checkEntity(itemName);
  let currentItem = getSeItem(itemName);
  let obSet = getIngredients(itemName);
  let recipe = getRecipes(itemName)[0];
  const ob = new Blueprint();
  ob.name = `${humanize(itemName)} Producer`;
  ob.icons = [itemName.replaceAll('-','_')];

  let combinator = ob.createEntity("constant_combinator", { x: 1, y: -6 });
  if (recipe.category == 'fluids') return false;

  let machine, pipePos;
  if (recipe.producers.includes('assembling-machine-2')) {
    ob.icons.push('assembling_machine_2');
    machine = ob.createEntity('assembling_machine_2', { x: 0, y: -4 });
    machine.setRecipe(itemName);
    pipePos = 1;
  } else if (recipe.producers.includes('chemical-plant')) {
    machine = ob.createEntity('chemical_plant', { x: 0, y: -4 });
    machine.setRecipe(itemName);
    pipePos = 0;
    ob.icons.push('chemical_plant');
  } else if (recipe.producers.includes('electric-furnace')) {
    machine = ob.createEntity('electric_furnace', { x: 0, y: -4 });
    ob.icons.push('electric_furnace');
  } else {
    return false;
  }

  let lastChest;
  //for each ingredient in the recipe
  let j;
  for (j = 0; j < obSet.length; j++) {
    let xPos = (j == 4) ? j + 1 : j;
    let activeItem = getSeItem(obSet[j]);
    // if it's stackabke, set a limit and build a chest
    if (activeItem.stack) {
      combinator.setConstant(j, activeItem.id, (activeItem.stack * -1) + 10);
      let chest = ob.createEntity('steel_chest', { x: xPos, y: 0 });
      chest.setBar(1);
      let sfi = ob.createEntity('stack_filter_inserter', { x: xPos, y: 1 }, Blueprint.DOWN);
      ob.createEntity('fast_inserter', { x: xPos, y: -1 }, Blueprint.DOWN);

      sfi.setFilter(0, activeItem.id);

      // wider than assembler
      if (j == 3) {
        ob.createEntity("fast_transport_belt", { x: xPos, y: -2 }, Blueprint.RIGHT);
        ob.createEntity("fast_transport_belt", { x: xPos + 1, y: -2 }, Blueprint.UP);
        ob.createEntity("fast_transport_belt", { x: xPos + 1, y: -3 }, Blueprint.UP);
        ob.createEntity("fast_inserter", { x: xPos, y: -3 }, Blueprint.RIGHT);
      }
      if (j == 4) {
        ob.createEntity("fast_transport_belt", { x: xPos, y: -2 }, Blueprint.LEFT);
      }

      //if there is another chest in this group connect to it with red wire
      if (lastChest) {
        chest.connect(lastChest, null, null, "red");
      }

      //increase the combinator totals
      lastChest = chest;

      //add a pipe to ground for fluids
    } else if (activeItem.category == "fluids") {
      ob.createEntity("pipe_to_ground", {x: pipePos, y: -5}, Blueprint.DOWN);
      ob.createEntity("pipe_to_ground", {x: pipePos, y: -7}, Blueprint.UP);

    }
  }



  //add a power pole for easy connections
  let pole = ob.createEntity("medium_electric_pole", { x: 0, y: -6 });
  pole.connect(lastChest, null, null, "red");

  combinator.connect(pole, null, null, "red");

  let returnPos;
  if (beltReturn) {
    if (obSet.length > 3) return;
    //place it under the assembler if there's room, next to it if not
    if (obSet.length < 3) {
      returnPos = 2;
      ob.createEntity("fast_underground_belt", { x: returnPos, y: -6 }, Blueprint.DOWN);
      ob.createEntity("fast_underground_belt", { x: returnPos, y: -1 }, Blueprint.DOWN).setDirectionType("output");
      ob.createEntity("fast_transport_belt", { x: returnPos, y: 0 }, Blueprint.DOWN);

    } else {
      returnPos = 3;
      //return belt

      ob.createEntity("fast_transport_belt", { x: 2, y: -6 }, Blueprint.RIGHT);

      ob.createEntity("fast_transport_belt", { x: 3, y: -6 }, Blueprint.DOWN);
      for (let yPos = -5; yPos < 1; yPos++) {
        ob.createEntity("fast_transport_belt", { x: returnPos, y: yPos }, Blueprint.DOWN);
      }

    }
    //output arm
    ob.createEntity('stack_inserter', { x: returnPos, y: 1 }, Blueprint.UP).connect(pole, null, null, "green").setCondition({
      left: itemName,
      right: currentItem.stack * 5,
      operator: "<"
    });
  } else {
    ob.createEntity("logistic_chest_passive_provider", { x: 2, y: -6 }).setBar(1);

  }
  ob.createEntity("fast_inserter", { x: 2, y: -5 }, Blueprint.DOWN);

  return ob;
}

// Returns a blueprint object for the input inserter row
function createImportRow(inputItems) {
  let inputBp = new Blueprint();
  inputBp.name = 'Input Row';
  let lastInserter;
  for (let i = 0; i < inputItems.length; i++) {
    let name = inputItems[i];
    if (name == 'electronic-circuit-stone') name = 'electronic-circuit';
    let seItem = getSeItem(name);
    if (seItem.category == 'fluids') continue;

    let stackSize = seItem.stack;

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
  return inputBp;
}

function createPoleRing() {
  const pr = new Blueprint();
  pr.name = "Electric Pole Ring";
  pr.description = "It is what it sounds like";
  let rows = [-9, 14];

  let row;
  let poles = [];
  for (row of rows) {
    let poleRow = [];
    let oldPole;
    for (let i = 0; i < 5; i++) {
      let pole = pr.createEntity('medium_electric_pole', {x: i*3, y: row});
      if (oldPole) {
        pole.connect(oldPole, null, null, "red");
        pole.connect(oldPole, null, null, "green");
      }
      poleRow.push(pole);
      oldPole = pole;
    }
    poles.push(poleRow);
  }
    // substations for reference
  let ref1 = pr.createEntity("substation", {x: -2, y: 2});
  let ref2 = pr.createEntity("substation", {x: 16, y: 2});
      // substations for connection
  pr.createEntity("substation", {x: -2, y: -10})
    .connect(ref1, null, null, "red")
    .connect(ref1, null, null, "green")
    .connect(poles[0][0]);

      pr.createEntity("substation", {x: -2, y: 14}).connect(ref1, null, null, "red")
      .connect(ref1, null, null, "green")
      .connect(poles[1][0]);


      pr.createEntity("substation", {x: 16, y: -10}).connect(ref2, null, null, "red")
      .connect(ref2, null, null, "green")
      .connect(poles[0].slice(-1)[0], null, null, "red")
      .connect(poles[0].slice(-1)[0], null, null, "green");

      pr.createEntity("substation", {x: 16, y: 14}).connect(ref2, null, null, "red")
      .connect(ref2, null, null, "green")
      .connect(poles[1].slice(-1)[0], null, null, "red")
      .connect(poles[1].slice(-1)[0], null, null, "green");;


  return pr;
}

function createSorter(assemblers) {

  const bp = new Blueprint();
  bp.name = "Main Sorter";

  let storedItems = getAllIngredients(assemblers);
  storedItems = storedItems.filter(s => {
    let i = getSeItem(s);
    console.log(i);
    return !(i.category == 'fluids');
  });
  console.log(storedItems);

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

        let bottomBox = bp.createEntity('aai_strongbox_storage', { x: j + i, y: startY + 1 }, Blueprint.RIGHT);
        let topBox = bp.createEntity('aai_strongbox_storage', { x: j + i, y: startY - 1 }, Blueprint.RIGHT);

        if (j < 4) {

          topBox.connect(substation, null, null, 'green');
          bottomBox.connect(substation, null, null, 'green');

        } else {
          bottomBox.connect(lastBottom, null, null, 'green');
          topBox.connect(lastTop, null, null, "green");
        }
        lastBottom = bottomBox;
        lastTop = topBox;

        let sfbx, sftx, stx, sbx, itemName;
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
          itemName = storedItems[boxNo];
          checkEntity(itemName);
            sfb.setFilter(0, itemName);

          bottomBox.setRequestFilter(0, itemName);
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
          checkEntity(itemName);
          sft.setFilter(0, itemName);
          
          topBox.setRequestFilter(0, itemName);
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

  return bp;

}

// get intermediate products, optionally filtered by a list of producers
export function getIntermediateProducts(primaryProducers, producerTypes = [], recursive = false) {
  let ingredients = getAllIngredients(primaryProducers);

  //find ingrediets for all primary producers
  let intermediates = ingredients.map(i => ( getRecipes(i)[0] ) );
  //filter out items not produced in these types
  if (producerTypes.length > 0)
    intermediates = intermediates.filter(m => (producerTypes.some(e => (m.producers.includes(e)))))
  
    if (recursive && intermediates.length > 0) {
  
      let tertiary = getIntermediateProducts( intermediates.map(i=> (i.id)), producerTypes, true);
      intermediates = Array.from(new Set(intermediates.concat(tertiary)));
    }
  return intermediates;
  }


function createBook(assemblers) {
  let obPrints = [];
  
  let storedItems = getAllIngredients(assemblers);

  obPrints.push(createSorter(assemblers));
  obPrints.push(createImportRow(assemblers));
  obPrints.push(createPoleRing());
  //make assemblers 
  for (let i = 0; i < assemblers.length; i++) {
    let objOutput = storedItems.includes(assemblers[i]) ? true : false;
    try {
      obPrints.push(createProducerBlueprint(assemblers[i], objOutput));
    } catch (e) {
      console.log(e);
      console.log(`Problem buliding ${assemblers[i]}`);
    }
  }

  return obPrints;
}

export function getBlueprintString(assemblerList) {
  return Blueprint.toBook(createBook(assemblerList));
  }

export default { getBlueprintString, getIntermediateProducts};

