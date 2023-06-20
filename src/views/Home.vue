<template>
  <ProducerSelector />

  <v-container>
    <v-card>
      <v-card-title>Selected Recipes</v-card-title>
      <v-card-text>
        <v-row align="center" class="mx-0">
          <ItemButton v-for="recipeId in selectedRecipes" :item="recipes[recipeId]" :icon="icons[recipeId]"
            :class="['d-flex align-center']" />
        </v-row>
      </v-card-text>
      <v-divider class="mx-4 mb-1"></v-divider>
      <v-card-title>
        Intermediate Products
      </v-card-title>
      <v-card-text>
      <v-row align="center" class="mx-0">
        <ItemButton v-for="recipeId in intermedateRecipes()" :item="recipes[recipeId]" :icon="icons[recipeId]"
          :class="['d-flex align-center']" />
      </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container>
    <v-btn @click="generate(selectedRecipes)">Generate</v-btn>
  </v-container>
  <v-container>

    <v-card variant="outlined"><v-card-text>
        <v-btn @click="copyCode">Copy</v-btn>
        {{ blueprintString }}

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ItemPicker from '@/components/ItemPicker.vue';
import ProducerSelector from '@/components/ProducerSelector.vue';
import ItemButton from '@/components/ItemButton.vue';
import { getBlueprintString, getIntermediateProducts } from '@/blueprinter.js';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia'


let appStore = useAppStore();

const { selectedRecipes } = storeToRefs(appStore);

export default {
  data: () => ({
    selectedRecipes: selectedRecipes,
    recipes: appStore.recipes,
    icons: appStore.icons,
    blueprintString: ''
  }),
  methods: {
    intermedateRecipes() {
      return getIntermediateProducts(this.selectedRecipes,
       ['assembling-machine-1', 'assembling-machine-2', 'assembling-machine-3', 'electric-furnace', 'chemical-plant'],
       true).map(i=> (i.id));
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
    ItemButton
  }
}
</script>
