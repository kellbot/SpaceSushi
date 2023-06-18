<template>
	<v-container class="fill-height">
		<v-responsive class="align-center text-center fill-height">

			<v-card>
				<v-tabs v-model="tab" bg-color="primary">
					<v-tab v-for="(category, index) in categories" :value="category.id">{{ category.name }}</v-tab>

				</v-tabs>

				<v-card-text>
					<v-window v-model="tab">
						<v-window-item v-for="(category, index) in categories" :value="category.id">  
							<v-container>
							<v-row>
								<ItemButton v-for="(recipe, index) in getRecipesByProducer('assembling-machine-2').filter(obj => {return obj.category === category.id})" :item="recipe" :icon="findIcon(recipe)" :index="index" />
							</v-row>
							</v-container>
						</v-window-item>
					</v-window>
				</v-card-text>
			</v-card>



		</v-responsive>
	</v-container>
</template>

<script>
import ItemButton from '@/components/itemButton.vue';
import itemData from '@/assets/data.json';

export default {
    data: () => ({
      tab: null,
			items: itemData.items,
			icons: itemData.icons,
			categories: itemData.categories,
			recipes: itemData.recipes,
			 
			findIcon: (item) => itemData.icons.filter(obj => {
				return obj.id === item.id;
			})[0],
			getRecipesByProducer: (producer) => itemData.recipes.filter(obj => {
				return obj.producers.includes(producer);
			})
    }),  
		name: 'ItemPicker',
		components: {
    ItemButton
		},

}

</script>      
