<template>
	<v-container>

					<template v-slot:extension>
						<v-tabs v-model="tab" bg-color="primary">
							<v-tab v-for="(category, index) in categories" :value="category.id">{{ category.name }}</v-tab>
						</v-tabs>
					</template>
		
				
					<v-item-group mandatory multiple selected-class="item-selected" v-model="appStore.selectedRecipes">
						<v-window v-model="tab">
							<v-window-item v-for="(category, index) in categories" :value="category.id">

								<v-item v-for="recipe in filteredRecipes({ categories: [category.id], producers: selectedProducers })"
									:value="recipe.id" v-slot="{ isSelected, selectedClass, toggle }">
									<ItemButton :style="{ display: isSelected || showAll ? 'block' : 'none !important' }" :item="recipe"
										:icon="recipe.icon" @click="toggle" :class="['d-flex align-center', selectedClass]" />
								</v-item>

							</v-window-item>
						</v-window>
					</v-item-group>
	</v-container>
</template>
<style>
.itemImage {
	background-image: url("/icons.png");
	background-size: 992px;
	min-width: 32px;
	width: 32px !important;
	height: 32px !important;
	padding: 0;
	margin: 2px;
	opacity: 0.5;
}

.item-selected {
	opacity: 1;
	background-color: rgb(var(--v-theme-primary));
}
</style>
<script>
import { resolveComponent } from 'vue';

import ItemButton from '@/components/itemButton.vue';
import itemData from '@/assets/data.json';

// Pre-cleaning of the data
// Scale the icons
let icons = itemData.icons.map(icon => {
	let scale = 1 / 2;
	var resultString = icon.position
		.split(" ")
		.map(value => {
			var parsedValue = parseInt(value, 10);
			if (!isNaN(parsedValue)) {
				return (parsedValue * scale) + "px";
			}
			return value;
		})
		.join(" ");
	icon.scaledPosition = resultString;
	return icon;
});



//get rid of recipes with no icon
let recipes = itemData.recipes.map(r => {
	r.icon = findIcon(r);
	return r;
}).filter(r => {
	return r.icon;
});

// Utility for finding icons
function findIcon(item) {
	return icons.filter(obj => {
		return obj.id === item.id;
	})[0];
}
import { useAppStore } from '@/store/app';

let appStore = useAppStore();

export default {
	data: () => ({
		tab: null,

		//scale icons
		icons: icons,
		recipes: recipes,
		categories: itemData.categories,
		showAll: true,
		appStore: appStore,
	}),

	methods: {
		// return some subset of items. no categories or producers will show items from all 
		filteredRecipes({ showAll = true, categories = [], producers = [] }) {
			let recipes = this.recipes;
			if (producers.length > 0) {
				recipes = recipes.filter(r => {
					return r.producers.some(p => producers.includes(p))
				})
			}

			if (categories.length > 0) {
				recipes = recipes.filter(r => {
					return categories.includes(r.category);
				})
			}
			return recipes;
		}
	},
	props: {
		selectedProducers: Array
	},
	name: 'ItemPicker',
	components: {
		ItemButton
	},

}

</script>      
