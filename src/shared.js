import { items, recipes, categories, icons } from '@/assets/data.json' 

export let namedCategories = {}
categories.forEach(c => {
  namedCategories[c.id] = c;
  namedCategories[c.id].items = [];
});

export let namedRecipes = {};
recipes.forEach(r => {
  namedRecipes[r.id] = r;
});
export let namedIcons = {};
icons.forEach(i => {
  namedIcons[i.id] = i;
})
export let namedItems = {};
items.forEach(i => {
  namedItems[i.id] = i;
  namedCategories[i.category].items.push(i.id);
});

