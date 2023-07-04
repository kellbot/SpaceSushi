<template>
  <BlueprintHeader />
  <ProducerSelector />

  <v-container>
    <v-card>
      <v-card-title>Selected Recipes</v-card-title>
      <v-card-text>
        <v-row
          align="center"
          class="mx-0"
        >
          <ItemButton
            v-for="itemId in selectedItems"
            :item="items[itemId]"
            :icon="icons[itemId]"
            :class="['d-flex align-center item-selected']"
          />
        </v-row>
      </v-card-text>
      <v-card-title>
        Intermediate Products
      </v-card-title>
      <v-card-text class="m0 p0">
        <v-row
          align="center"
          class="mx-0"
        >
          <ItemButton
            v-for="itemId in intermedateItems()"
            :item="items[itemId]"
            :icon="icons[itemId]"
            :class="['d-flex align-center item-selected']"
          />
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="generate(selectedItems)">
          Generate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-container>
    <v-card variant="outlined">
      <v-card-text>
        <v-btn @click="copyCode">
          Copy
        </v-btn>
        {{ blueprintString }}
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


import { namedIcons, namedItems } from '@/shared';

let appStore = useAppStore();

const { selectedItems, selectedProducers } = storeToRefs(appStore);

export default {
  data: () => ({
    selectedItems: selectedItems,
    selectedProducers: selectedProducers,
    items: namedItems,
    icons: namedIcons,
    blueprintString: ''
  }),
  methods: {
    intermedateItems() {
      return getIntermediateProducts(this.selectedItems,
       this.selectedProducers,
       true);
    },
    createBlueprintString() {
      return getBlueprintString(Array.from(new Set(this.selectedItems.concat(this.intermedateItems(this.selectedItems)))))
    },
    generate() {
      this.blueprintString = this.createBlueprintString(this.selectedItems);
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