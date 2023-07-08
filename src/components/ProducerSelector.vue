<template>
  <v-container>
    <v-card>

      <v-toolbar density="compact" color="primary" title="Settings">

      </v-toolbar>

      <v-sheet class="d-flex flex-wrap">
        <v-sheet class="flex-1-1-100 mx-2 pa-2">
          <div class="text-h5">Enabled Producers</div>
        </v-sheet>
        <v-sheet class="mx-2 pa-2">
        <v-item-group mandatory multiple selected-class="item-selected" v-model="selectedProducers">
          <template  v-for="producer in producers">
          <v-item class="ma-2 pa-2" :value="producer.id" v-slot="{ selectedClass, toggle }">
            <ItemButton :item="namedItems[producer.id]" :icon="icons[producer.id]" @click="toggle" :class="['d-flex align-center', selectedClass]" />
          </v-item>
          </template>
        </v-item-group>
      </v-sheet>
      </v-sheet>
      <v-sheet class="d-flex flex-wrap">
        <v-sheet class="flex-1-1-100 mx-2 pa-2">
          <div class="text-h5">Defaults</div>
        </v-sheet>
        <v-sheet class="mx-2 mt-0 mb-2 pa-2">
          Transport Belt

          <v-item-group mandatory selected-class="item-selected" v-model="defaultBelt">
            <template v-for="itemId in ['transport-belt', 'fast-transport-belt', 'express-transport-belt']">
              <v-item :value="itemId" v-slot="{ selectedClass, toggle }">
                <ItemButton :item="namedItems[itemId]" :icon="icons[itemId]" @click="toggle"
                  :class="['d-flex align-center', selectedClass]" />
              </v-item>
            </template>
          </v-item-group>
        </v-sheet>
        <v-sheet class="pa-2">
          Assembler

          <v-item-group mandatory selected-class="item-selected" v-model="defaultAssembler">
            <template
              v-for="itemId in ['burner-assembling-machine', 'assembling-machine-1', 'assembling-machine-2', 'assembling-machine-3']">
              <v-item :value="itemId" v-slot="{ selectedClass, toggle }">
                <ItemButton :item="namedItems[itemId]" :icon="icons[itemId]" @click="toggle"
                  :class="['d-flex align-center', selectedClass]" />
              </v-item>
            </template>
          </v-item-group>
        </v-sheet>
        <v-sheet class="pa-2">
          Strongbox

          <v-item-group mandatory selected-class="item-selected" v-model="defaultStrongbox">
            <template
              v-for="itemId in ['aai-strongbox', 'aai-strongbox-storage', 'aai-strongbox-passive-provider', 'aai-strongbox-buffer', 'aai-strongbox-requester']">
              <v-item :value="itemId" v-slot="{ selectedClass, toggle }">
                <ItemButton :item="namedItems[itemId]" :icon="icons[itemId]" @click="toggle"
                  :class="['d-flex align-center', selectedClass]" />
              </v-item>
            </template>
          </v-item-group>
        </v-sheet>
      </v-sheet>
    </v-card>
    <KeepAlive>
      <ItemPicker :selected-producers="selectedProducers" eager :available-items="items" />
    </KeepAlive>

  </v-container>
</template>

<script>
import { useAppStore } from '@/store/app';
import producerData from '@/assets/producers.json';
import { storeToRefs } from 'pinia'

const { selectedProducers } = storeToRefs(useAppStore());
import ItemPicker from '@/components/ItemPicker.vue';
import ItemButton from '@/components/ItemButton.vue';
import { namedItems, namedIcons } from '@/shared';
export default {
  data: () => ({
    panel: [0],
    selectedProducers: selectedProducers,
    producers: producerData,
    icons: namedIcons,
    namedItems: namedItems,
    defaultBelt: 'fast-transport-belt',
    defaultAssembler: 'assembling-machine-2',
    defaultStrongbox: 'aai-strongbox-storage',
  }),
  computed: {
    items: function () { return namedItems.filterByProducers(this.selectedProducers) },
  },
  name: "ProducerSelector",
  components: { ItemPicker, ItemButton }
}

</script>
