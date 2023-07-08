import Blueprint from 'factorio-blueprint';
const { Book } = Blueprint.Book;
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
  spaces = string.replaceAll('-', ' ');
  return spaces.charAt(0).toUpperCase() + spaces.slice(1);
}

function getSeItem(name) {
  let item = seData.items.filter(i => {
    return i.id == name;
  })[0];

  try {
    if (!item) item = getItemFromRecipe(name);
  } catch (e) {
    console.log(e);
    console.log(`Cannot find ${name}`);
  }
  return item;

}

function getItemFromRecipe(id) {

  let recipe = seData.recipes.filter(r => {

    return r.id == id;

  })[0];
  let item = recipe.out[0];

  return item;
}

export function getRecipes(name) {
  if (name == 'electronic-circuit-stone') name = 'electronic-circuit';
  try {
    return seData.recipes.filter(r => {
      // has object name in output and does not have object name in input
      return r.out[name] && !Object.keys(r.in).includes(name)
    });
  } catch (e) {
    console.log(e);
    console.log(name)
  }
}

// returns the inputs for the first recipe that outputs this item
function getIngredients(itemName) {
  let recipe = getRecipes(itemName)[0];
  if (!recipe) return false;
  return Object.keys(recipe.in);
}

function getAllIngredients(itemNameArray) {
  let allIngredients = new Set();

  for (let i = 0; i < itemNameArray.length; i++) {
    let ingredients = getIngredients(itemNameArray[i]);

    for (let j = 0; j < ingredients.length; j++) {
      allIngredients.add(ingredients[j]);
    }
  }
  return Array.from(allIngredients);

}

function checkEntity(itemName) {
  if (!Blueprint.getEntityData()[itemName.replaceAll('-', '_')]) {
    let data = new Object();
    data[itemName.replaceAll('-', '_')] = i1x1;
    Blueprint.setEntityData(data);
  }
}

export class SushiBook extends Book {
  constructor( {baseItems, allowedProducers} ) {
    if (!baseItems.length) throw Error ("Cannot create empty sushi book");
    super();
    this.baseItems = baseItems
    this.producerPrints = [];
    this.allowedProducers = allowedProducers;

    this.storedItems = getAllIngredients(baseItems);

    this.producerPrints.push(createSorter(baseItems));
    this.addBook(this.createProducerBook());
    this.addBlueprint(createImportRow(this.storedItems));
    this.addBlueprint(createPoleRing());

  }

  createProducerBook() {
    const producerBook = new Book();
    // //make assemblers 
    for (let i = 0; i < this.baseItems.length; i++) {
      let objOutput = this.storedItems.includes(this.baseItems[i]) ? true : false;
      
      let producerName = this.firstProducer(this.baseItems[i]);
      console.log(`Trying to build ${this.baseItems[i]} with ${producerName} `)
      try {
       
        producerBook.addBlueprint(createProducerBlueprint(this.baseItems[i], objOutput, producerName));
      } catch (e) {
        console.log(e);
        console.log(`Problem buliding ${this.baseItems[i]} with ${producerName}`);
      }
    }
    return producerBook;
  }

  allowedRecipes(itemName) {
    if (!this.allowedProducers) throw Error("Error: Allowed producers not set");
       return getRecipes(itemName).filter(
        recipe => {
          return recipe.producers.filter(producer => (this.allowedProducers.includes(producer))).length
        });

  }

  firstProducer(itemName) {
    let producers = [];
    console.log(this.allowedProducers);
    getRecipes(itemName).forEach(
      recipe => {
        producers = producers.concat(recipe.producers.filter(producer => (this.allowedProducers.includes(producer))));
        
      });
      return producers[0]
;  }
  
  createSorter() {
    throw Error("You didn't implement this");
  }
  createImportRow() {
    throw Error("You didn't implement this");
  }
  createPoleRing() {
    throw Error("You didn't implement this");
  }
}

class ProducerPrint extends Blueprint {
  constructor({ itemName: itemName, producerName: producerName, beltReturn: beltReturn } = {}) {
    if(!producerName) throw Error ("Must provide producer name")
    super();
    this.produerName = producerName;
    this.itemName = itemName;
    this.beltReturn = beltReturn || false;
    this.name = `${humanize(itemName)} Producer`;
    this.icons = [itemName.replaceAll('-', '_')];
    this.icons.push(producerName.replaceAll('-', '_'));
    this.ingredients =  getIngredients(itemName);

    this.producerPosition = ProducerPrint.calculatePositon(producerName);

    this.combinator = this.createEntity("constant_combinator", { x: 1, y: -2 + this.producerPosition.y });

    this.producer = this.createEntity(producerName, this.producerPosition);
    this.producer.setRecipe(itemName);
    this.returnPos = this.producerPosition.w <= this.ingredients.length ? this.ingredients.length : this.producerPosition.w;
    this.pipes = ProducerPrint.calculatePipeOutlets(producerName);

     //add a power pole for easy connections
     this.pole = this.createEntity("medium_electric_pole", { x: 0, y: -2 + this.producerPosition.y });

     // Ingredient Buffers
    
    let lastChest;
    //for each ingredient in the recipe
    let j;
    for (j = 0; j < this.ingredients.length; j++) {
      let xPos = (j == 4) ? j + 1 : j;
      let activeItem = getSeItem(this.ingredients[j]);
      // if it's stackabke, set a limit and build a chest
      if (activeItem.stack) {
        this.combinator.setConstant(j, activeItem.id, (activeItem.stack * -1) + 10);
        let chest = this.createEntity('steel_chest', { x: xPos, y: 0 });
        chest.setBar(1);
        let sfi = this.createEntity('stack_filter_inserter', { x: xPos, y: 1 }, Blueprint.DOWN);
        this.createEntity('fast_inserter', { x: xPos, y: -1 }, Blueprint.DOWN);

        sfi.setFilter(0, activeItem.id);

        // wider than assembler
        if (j == this.producerPosition.w + 1) {
          this.createEntity("fast_transport_belt", { x: xPos, y: -2 }, Blueprint.RIGHT);
          this.createEntity("fast_transport_belt", { x: xPos + 1, y: -2 }, Blueprint.UP);
          this.createEntity("fast_transport_belt", { x: xPos + 1, y: -3 }, Blueprint.UP);
          this.createEntity("fast_inserter", { x: xPos, y: -3 }, Blueprint.RIGHT);
        }
        if (j== this.producerPosition.w + 2) {
          this.createEntity("fast_transport_belt", { x: xPos, y: -2 }, Blueprint.LEFT);
        }

        //if there is another chest in this group connect to it with red wire
        if (lastChest) {
          chest.connect(lastChest, null, null, "red");
        }

        //increase the combinator totals
        lastChest = chest;

        //add a pipe to ground for fluids
      } else if (activeItem.category == "fluids" && this.pipes) {

        this.pipes.forEach(pipeX => {

          this.createEntity("pipe_to_ground", { x: pipeX, y: this.producerPosition - 1 }, Blueprint.DOWN);
          this.createEntity("pipe_to_ground", { x: pipeX, y: this.producerPosition - 4 }, Blueprint.UP);

        })
      }
    }
   
     this.pole.connect(lastChest, null, null, "red");

     // Return to main sushi belt

    if (this.beltReturn) {
      let returnPos = this.returnPos;

      let currentItem = getSeItem(itemName);
      
      if (returnPos == 2 && this.producerPosition.y > -6){
        this.createEntity("fast_underground_belt", { x: returnPos, y: -2 + this.producerPosition.y }, Blueprint.DOWN);
        this.createEntity("fast_underground_belt", { x: returnPos, y: -1 }, Blueprint.DOWN).setDirectionType("output");
        this.createEntity("fast_transport_belt", { x: returnPos, y: 0 }, Blueprint.DOWN);
      } else {
      
        //return belt
  
        this.createEntity("fast_transport_belt", { x: 2, y: -2 + this.producerPosition.y }, Blueprint.RIGHT);
  
        this.createEntity("fast_transport_belt", { x: 3, y: -2 + this.producerPosition.y }, Blueprint.DOWN);
        for (let yPos = -5; yPos < 1; yPos++) {
          this.createEntity("fast_transport_belt", { x: returnPos, y: yPos }, Blueprint.DOWN);
        }
      }
      
      //output arm
      this.createEntity('stack_inserter', { x: returnPos, y: 1 }, Blueprint.UP).connect(this.pole, null, null, "green").setCondition({
        left: itemName,
        right: currentItem.stack * 5,
        operator: "<"
      });
    } else {
      this.createEntity("logistic_chest_passive_provider", { x: 2, y:this.producerPosition.y - 2  }).setBar(1);

  
    }

    this.createEntity("fast_inserter", { x: 2, y: this.producerPosition.y - 1  }, Blueprint.DOWN);

  this.combinator.connect(this.pole, null, null, "red");




  }

  static calculatePositon(producerName) {
    let producer = Blueprint.getEntityData()[producerName.replaceAll('-', '_')];

    return {x: 0, y: -1 - producer.height, w: producer.width};

  }
  static calculatePipeOutlets(producerName) {
    let middle = ['assembling-machine-1', 'assembling-machine-2', 'assembling-machine-3', 'burner-assembling-machine'];
    if (middle.includes(producerName)) return [1];
    let threeboth = ['chemical-plant'];
    if (threeboth.includes(producerName)) return [0, 2];
    return false;
  }

}


// creates the storage boxes and assembler for an item, optionally creates a return to the main belt
function createProducerBlueprint(itemName, beltReturn = false, producerName = 'assembling-machine-2') {
  checkEntity(itemName);
  
  let recipe = getRecipes(itemName)[0];
  

  if (recipe.category == 'fluids') return false;
  const ob = new ProducerPrint({ itemName: itemName, producerName, beltReturn: beltReturn });


  return ob;
}

// Returns a blueprint object for the input inserter row
function createImportRow(inputItems) {
  let inputBp = new Blueprint();
  inputBp.name = 'Input Row';
  let lastInserter;
  for (let i = 0; i < inputItems.length; i++) {
    let name = inputItems[i];
    checkEntity(name);
    if (name == 'electronic-circuit-stone') name = 'electronic-circuit';
    let seItem = getSeItem(name);
    if (!seItem) continue;
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
      let pole = pr.createEntity('medium_electric_pole', { x: i * 3, y: row });
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
  let ref1 = pr.createEntity("substation", { x: -2, y: 2 });
  let ref2 = pr.createEntity("substation", { x: 16, y: 2 });
  // substations for connection
  pr.createEntity("substation", { x: -2, y: -10 })
    .connect(ref1, null, null, "red")
    .connect(ref1, null, null, "green")
    .connect(poles[0][0]);

  pr.createEntity("substation", { x: -2, y: 14 }).connect(ref1, null, null, "red")
    .connect(ref1, null, null, "green")
    .connect(poles[1][0]);


  pr.createEntity("substation", { x: 16, y: -10 }).connect(ref2, null, null, "red")
    .connect(ref2, null, null, "green")
    .connect(poles[0].slice(-1)[0], null, null, "red")
    .connect(poles[0].slice(-1)[0], null, null, "green");

  pr.createEntity("substation", { x: 16, y: 14 }).connect(ref2, null, null, "red")
    .connect(ref2, null, null, "green")
    .connect(poles[1].slice(-1)[0], null, null, "red")
    .connect(poles[1].slice(-1)[0], null, null, "green");


  return pr;
}

function createSorter(assemblers) {

  const bp = new Blueprint();
  bp.name = "Main Sorter";

  let storedItems = getAllIngredients(assemblers);
  storedItems = storedItems.filter(s => {
    let i = getSeItem(s);
    return !(i.category == 'fluids');
  });

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
export function getIntermediateProducts(itemList, producerTypes = [], recursive = true) {

  //these should be items
  let intermediates = getAllIngredients(itemList);

  if (producerTypes.length > 0) {
    intermediates = intermediates.filter(itemName => {
      return (producerTypes.some(e => {
        return (getRecipes(itemName)[0].producers.includes(e))
      }));
    });
  }
  // get rid of fluids because they're annoying
  intermediates = intermediates.filter(itemName => (getSeItem(itemName).category != 'fluids'));

  if (recursive && intermediates.length > 0) {
    intermediates = Array.from(new Set(intermediates.concat(getIntermediateProducts(intermediates, producerTypes, recursive))));
  }

  return intermediates;
}






export function getBlueprintString(assemblerList, selectedProducers) {
  return new SushiBook({baseItems: assemblerList, allowedProducers: selectedProducers}).encode();
}

export default { getBlueprintString, getIntermediateProducts };

