<template>
	<v-container>
		<v-responsive class="align-center text-center">
	
			<v-card>

				<v-tabs v-model="tab" bg-color="secondary">
					<v-tab v-for="category in categories" :value="category.id">{{ category.name }}</v-tab>
				</v-tabs>


				<v-item-group mandatory multiple selected-class="item-selected" v-model="selectedRecipes">
					<v-window v-model="tab">
						<v-window-item v-for="category in categories" :value="category.id" eager>
							<template v-for="recipeId in category.items">
							<v-item  v-if="(recipes[recipeId])"
								:value="recipeId" v-slot="{ isSelected, selectedClass, toggle }">
								<ItemButton :item="recipes[recipeId]" :icon="icons[recipeId]" @click="toggle"
									:class="['d-flex align-center', selectedClass]" />
							</v-item>
						</template>
						</v-window-item>
					</v-window>

				</v-item-group>

			</v-card>
		</v-responsive>
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
import ItemButton from '@/components/ItemButton.vue';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia'

let appStore = useAppStore();

const { selectedRecipes } = storeToRefs(appStore);

export default {
	data: () => ({
		tab: null,

		//scale icons
		icons: appStore.icons,
		recipes: appStore.recipes,
		categories: appStore.categories,
		selectedRecipes: selectedRecipes
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
