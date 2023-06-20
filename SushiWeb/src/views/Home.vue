<template>
  <ProducerSelector />
  <v-container>
		<ItemButton v-for="recipeId in selectedRecipes" :item="recipes[recipeId]" :icon="icons[recipeId]"
									:class="['d-flex align-center']" />
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
  import getBlueprintString from '@/blueprinter.js';
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
      createBlueprintString() {
        return getBlueprintString(this.selectedRecipes)
      },
      generate() {
        console.log(this.selectedRecipes);
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
