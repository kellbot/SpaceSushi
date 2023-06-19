<template>
	<v-container>
		<v-responsive class="align-center text-center">

			<v-card  >
				<v-toolbar title="Item Picker" color="primary">
					<v-btn icon @click="showAll = !showAll">
						<v-icon>mdi-eye-off-outline </v-icon>
						<v-tooltip activator="parent" location="start">Hide Unselected</v-tooltip>
					</v-btn>
					<template v-slot:extension>
						<v-tabs v-model="tab" bg-color="primary">
							<v-tab v-for="(category, index) in categories" :value="category.id">{{ category.name }}</v-tab>

						</v-tabs>
					</template>
				</v-toolbar>
				<v-card-text>
					<v-item-group mandatory multiple selected-class="item-selected" v-model="activeRecipes">
					<v-window v-model="tab">
						<v-window-item v-for="(category, index) in categories" :value="category.id">

								<v-item v-for="recipe in getRecipesByCatAndProd(category.id, selectedProducers)" :value="recipe.id"
									v-slot="{ isSelected, selectedClass, toggle }">
									<ItemButton :style="{ display: isSelected || showAll ? 'block' : 'none !important' }" :item="recipe"
										:icon="findIcon(recipe)" @click="toggle" :class="['d-flex align-center', selectedClass]" />
								</v-item>

						</v-window-item>
					</v-window>
				</v-item-group>
				</v-card-text>
			</v-card>

			<v-card>
				{{activeRecipes }}
			</v-card>

		</v-responsive>
	</v-container>
</template>

<script>
import ItemButton from '@/components/itemButton.vue';
import itemData from '@/assets/data.json';

function findIcon(item) {

	let icons = itemData.icons.filter(obj => {
		return obj.id === item.id;
	});
	return icons[0];
}

export default {
	data: () => ({
		tab: null,
		items: itemData.items,
		icons: itemData.icons,
		categories: itemData.categories,
		recipes: itemData.recipes,
		showAll: true,
		activeRecipes: [],

		findIcon: findIcon,
		getSelected: () => {
			let selectedItems = [];
			return selectedItems;
		},
		getRecipesByCatAndProd: (category, producers) => itemData.recipes.filter(recipe => {
			return recipe.category === category && findIcon(recipe);
		})
			.filter(obj => {
				return obj.producers.some(producer => producers.includes(producer));
			})
	}),
	props: {
		selectedProducers: Array
	},
	name: 'ItemPicker',
	components: {
		ItemButton
	},

}

</script>      
