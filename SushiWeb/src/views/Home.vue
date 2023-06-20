<template>
  <ProducerSelector />
  <v-container>
    <v-btn @click="generate">Generate</v-btn>
      <v-card variant="outlined"><v-card-text>
        <v-btn @click="copyCode">Copy</v-btn>
      {{ blueprintString }}
        </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import ItemPicker from '@/components/ItemPicker.vue'
  import ProducerSelector from '@/components/ProducerSelector.vue'
  import getBlueprintString from '@/blueprinter.js';
import { useAppStore } from '@/store/app';
 
  let appStore = useAppStore();

  export default {
    data: () => ({
      appStore: appStore,
      blueprintString: ''
    }),
    methods: {
      createBlueprintString(selected) {
        return getBlueprintString(this.appStore.selectedRecipes)
      },
      generate() {
        this.blueprintString = this.createBlueprintString(this.appStore.selectedRecipes);
      },
      async copyCode() {
      await navigator.clipboard.writeText(this.blueprintString);
      this.copyText = "Copied"
      }
    },
    components: {
      ProducerSelector
    }
  }
</script>
