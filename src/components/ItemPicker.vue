<!-- eslint-disable vue/valid-v-for -->
<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
      show-arrows
    >
      <v-tab
        v-for="category in categories"
        :value="category.id"
      >
        {{ category.name }}
      </v-tab>
    </v-tabs>


    <v-item-group
      mandatory
      multiple
      selected-class="item-selected"
      v-model="selectedRecipes"
    >
      <v-window v-model="tab">
        <v-window-item
          v-for="category in categories"
          :value="category.id"
          eager
        >
          <template v-for="itemId in category.items">
            <v-item
              v-if="(items[itemId])"
              :value="itemId"
              v-slot="{ selectedClass, toggle }"
            >
              <ItemButton
                :item="items[itemId]"
                :icon="icons[itemId]"
                @click="toggle"
                :class="['d-flex align-center', selectedClass]"
              />
            </v-item>
          </template>
        </v-window-item>
      </v-window>
    </v-item-group>
  </v-card>
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
}
.v-item-group .item-selected {
	
	background-color: rgb(var(--v-theme-primary));
}
</style>
<script>
import ItemButton from '@/components/ItemButton.vue';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia'
import { namedIcons, namedItems, namedRecipes, namedCategories} from '@/shared';

let appStore = useAppStore();

const { selectedRecipes } = storeToRefs(appStore);

export default {
	data: () => ({
		tab: null,

		//scale icons
		items: namedItems,
		icons: namedIcons,
		recipes: namedRecipes,
		categories: namedCategories,
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
