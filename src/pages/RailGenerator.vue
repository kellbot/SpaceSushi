<template>
  <v-container>
    <v-card>
      <v-card-title>Coming Soon</v-card-title>
      <v-card-text>
        A tool for generating rail books
      </v-card-text>
    </v-card>
  </v-container>
</template>
  <script>
  

import ProducerSelector from '@/components/ProducerSelector.vue';
import ItemButton from '@/components/ItemButton.vue';
import BlueprintHeader from '@/components/BlueprintHeader.vue';
import { getBlueprintString, getIntermediateProducts } from '@/blueprinter.js';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia'


let appStore = useAppStore();

const { selectedRecipes } = storeToRefs(appStore);

export default {
  data: () => ({
    selectedRecipes: selectedRecipes,
    items: appStore.items,
    recipes: appStore.recipes,
    icons: appStore.icons,
    blueprintString: ''
  }),
  methods: {
    intermedateRecipes() {
      return getIntermediateProducts(this.selectedRecipes,
       ['assembling-machine-1', 'assembling-machine-2', 'assembling-machine-3', 'electric-furnace', 'chemical-plant'],
       true);
    },
    createBlueprintString() {
      return getBlueprintString(Array.from(new Set(this.selectedRecipes.concat(this.intermedateRecipes(this.selectedRecipes)))))
    },
    generate() {
      this.blueprintString = this.createBlueprintString(this.selectedRecipes);
    },
    async copyCode() {
      await navigator.clipboard.writeText(this.blueprintString);
      this.copyText = "Copied"
    }
  },
  components: {
    ProducerSelector,
    ItemButton,
    BlueprintHeader
  }
}
</script>