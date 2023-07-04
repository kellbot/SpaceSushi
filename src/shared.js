import { items, recipes, categories, icons } from '@/assets/data.json'
import { getRecipes } from './blueprinter';

export let namedCategories = {}
categories.forEach(c => {
  namedCategories[c.id] = c;
  namedCategories[c.id].items = [];
});

export let namedIcons = {};
icons.forEach(i => {
  namedIcons[i.id] = i;
});

export let namedItems = {};
items.forEach(i => {
    namedItems[i.id] = i;
    namedCategories[i.category].items.push(i.id);
});
namedItems.filterByProducers = function( producerTypes ){
  const newArr = [];
  Object.entries(this).forEach(([key, value]) => {
    if ((producerTypes.some(e => {
            return (getRecipes(key).length && getRecipes(key)[0].producers.includes(e))
          }))) 
     newArr.push(value);
  });
  return newArr; 
  
 
  }
