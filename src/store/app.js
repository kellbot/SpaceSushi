// Utilities
import { defineStore } from 'pinia'

import { items, recipes, categories, icons } from '@/assets/data.json' 

let namedCategories = {}
categories.forEach(c => {
  namedCategories[c.id] = c;
  namedCategories[c.id].items = [];
});

let namedRecipes = {};
recipes.forEach(r => {
  namedRecipes[r.id] = r;
});
let namedIcons = {};
icons.forEach(i => {
  namedIcons[i.id] = i;
})
let namedItems = {};
items.forEach(i => {
  namedItems[i.id] = i;
  namedCategories[i.category].items.push(i.id);
});

export const useAppStore = defineStore('app', {
  state: () => {
    // if (localStorage.getItem("app"))
    //   return JSON.parse(localStorage.getItem("app"));
    return {
      railSettings: {
        gridSize: 48,
        trackSpacing: 6
      },
      items: namedItems,
      recipes: namedRecipes,
      icons: namedIcons,
      categories: namedCategories,
      selectedRecipes: ['stack-inserter'],
      producers: [{
        "id": "burner-assembling-machine",
        "name": "Burner assembling machine",
        "stack": 50,
        "row": 6,
        "category": "production",
        "factory": {
            "category": "chemical",
            "pollution": 4,
            "type": "burner",
            "usage": 75,
            "modules": 0,
            "speed": 0.5
        }
    },
    {
        "id": "assembling-machine-1",
        "name": "Assembling machine 1",
        "stack": 50,
        "row": 6,
        "category": "production",
        "factory": {
            "drain": 2.5,
            "pollution": 4,
            "type": "electric",
            "usage": 75,
            "modules": 0,
            "speed": 0.5
        }
    },
    {
        "id": "assembling-machine-2",
        "name": "Assembling machine 2",
        "stack": 50,
        "row": 6,
        "category": "production",
        "factory": {
            "drain": 5,
            "pollution": 3,
            "type": "electric",
            "usage": 150,
            "modules": 2,
            "speed": 0.75
        }
    },
    {
        "id": "assembling-machine-3",
        "name": "Assembling machine 3",
        "stack": 50,
        "row": 6,
        "category": "production",
        "factory": {
            "drain": 12.5,
            "pollution": 2,
            "type": "electric",
            "usage": 375,
            "modules": 4,
            "speed": 1.25
        }
    },
    {
        "id": "se-space-assembling-machine",
        "name": "Space assembling machine",
        "stack": 50,
        "row": 6,
        "category": "production",
        "factory": {
            "drain": 12.5,
            "pollution": 2,
            "type": "electric",
            "usage": 375,
            "modules": 4,
            "disallowEffects": [
                "productivity"
            ],
            "speed": 1.25
        }
    },
    {
        "id": "electric-furnace",
        "name": "Electric furnace",
        "stack": 50,
        "row": 3,
        "category": "production",
        "factory": {
            "drain": 5,
            "pollution": 0.5,
            "type": "electric",
            "usage": 150,
            "modules": 2,
            "speed": 2
        }
    },
    {
        "id": "se-space-manufactory",
        "name": "Space manufactory",
        "stack": 1,
        "row": 6,
        "category": "production",
        "factory": {
            "drain": 66.666666666667,
            "pollution": 50,
            "type": "electric",
            "usage": 2000,
            "modules": 6,
            "disallowEffects": [
                "productivity"
            ],
            "speed": 10
        }
    },
    {
        "id": "oil-refinery",
        "name": "Oil refinery",
        "stack": 10,
        "row": 7,
        "category": "production",
        "factory": {
            "drain": 14,
            "pollution": 6,
            "type": "electric",
            "usage": 420,
            "modules": 3,
            "speed": 1
        }
    },
    {
        "id": "chemical-plant",
        "name": "Chemical plant",
        "stack": 10,
        "row": 7,
        "category": "production",
        "factory": {
            "drain": 7,
            "pollution": 4,
            "type": "electric",
            "usage": 210,
            "modules": 3,
            "speed": 1
        }
    },
        {
            "id": "fuel-processor",
            "name": "Fuel processor",
            "stack": 50,
            "row": 7,
            "category": "production",
            "factory": {
                "category": "chemical",
                "pollution": 4,
                "type": "burner",
                "usage": 9090.9090909091,
                "modules": 0,
                "speed": 1
            }
        },
        {
            "id": "se-lifesupport-facility",
            "name": "Lifesupport facility",
            "stack": 10,
            "row": 7,
            "category": "production",
            "factory": {
                "drain": 33.333333333333,
                "pollution": 4,
                "type": "electric",
                "usage": 1000,
                "modules": 4,
                "disallowEffects": [
                    "productivity"
                ],
                "speed": 1
            }
        },
        {
            "id": "se-space-biochemical-laboratory",
            "name": "Biochemical facility",
            "stack": 5,
            "row": 7,
            "category": "production",
            "factory": {
                "drain": 100,
                "pollution": 4,
                "type": "electric",
                "usage": 3000,
                "modules": 4,
                "disallowEffects": [
                    "productivity"
                ],
                "speed": 4
            }
        },
        {
            "id": "se-space-decontamination-facility",
            "name": "Decontamination facility",
            "stack": 10,
            "row": 7,
            "category": "production",
            "factory": {
                "drain": 66.666666666667,
                "pollution": 4,
                "type": "electric",
                "usage": 2000,
                "modules": 4,
                "disallowEffects": [
                    "productivity"
                ],
                "speed": 2
            }
        },
        {
            "id": "se-space-genetics-laboratory",
            "name": "Genetics facility",
            "stack": 5,
            "row": 7,
            "category": "production",
            "factory": {
                "drain": 33.333333333333,
                "pollution": 4,
                "type": "electric",
                "usage": 1000,
                "modules": 4,
                "disallowEffects": [
                    "productivity"
                ],
                "speed": 4
            }
        },
        {
            "id": "se-space-growth-facility",
            "name": "Growth facility",
            "stack": 1,
            "row": 7,
            "category": "production",
            "factory": {
                "drain": 133.33333333333,
                "pollution": 4,
                "type": "electric",
                "usage": 4000,
                "modules": 4,
                "disallowEffects": [
                    "productivity"
                ],
                "speed": 4
            }
        },
        {
            "id": "se-fuel-refinery",
            "name": "Fuel refinery",
            "stack": 10,
            "row": 7,
            "category": "production",
            "factory": {
                "drain": 33.333333333333,
                "pollution": 6,
                "type": "electric",
                "usage": 1000,
                "modules": 3,
                "speed": 1
            }
        },
        {
            "id": "centrifuge",
            "name": "Centrifuge",
            "stack": 50,
            "row": 8,
            "category": "production",
            "factory": {
                "drain": 11.666666666667,
                "pollution": 4,
                "type": "electric",
                "usage": 350,
                "modules": 2,
                "speed": 1
            }
        },
    ]
    }
  },
})
