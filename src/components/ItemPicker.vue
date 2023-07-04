<!-- eslint-disable vue/valid-v-for -->
<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary" show-arrows>
      <v-tab v-for="category in categories" :value="category.id">
        {{ category.name }}
      </v-tab>
    </v-tabs>


    <v-item-group mandatory multiple selected-class="item-selected" v-model="selectedItems">
      <v-window v-model="tab">
        <v-window-item v-for="category in categories" :value="category.id" eager>
          <template v-for="itemObj in categoryItems(category.id)">
            <v-item :value="itemObj.id" v-slot="{ selectedClass, toggle }">
              <ItemButton :item="itemObj" :icon="icons[itemObj.id]" @click="toggle"
                :class="['d-flex align-center', selectedClass]" />
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
import { namedIcons, namedCategories } from '@/shared';

const { selectedItems } = storeToRefs(useAppStore());

export default {
  data: () => ({
    tab: null,
    icons: namedIcons,
    categories: namedCategories,
    selectedItems: selectedItems,
  }),
  props: {
    selectedProducers: Array,
    availableItems: Array
  },
  methods: {
    categoryItems: function (catId) {
      return this.availableItems.filter(item => (item.category == catId));
    }
  },
  name: 'ItemPicker',
  components: {
    ItemButton
  },

}

</script>      
