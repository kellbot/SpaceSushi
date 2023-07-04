<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title color="primary">
          Producers
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-sheet class="d-flex align-content-start flex-wrap">
            <v-checkbox
              density="compact"
              v-for="producer in producers"
              v-model="selectedProducers"
              :label="producer.name"
              :value="producer.id"
            />
          </v-sheet>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <KeepAlive>
      <ItemPicker
        :selected-producers="selectedProducers"
        eager

        :available-items="items"
      />
    </KeepAlive>
  </v-container>
</template>
<script>
import { useAppStore } from '@/store/app';
import producerData from '@/assets/producers.json';
import { storeToRefs } from 'pinia'

const { selectedProducers } = storeToRefs(useAppStore());
import ItemPicker from '@/components/ItemPicker.vue';
import { namedItems } from '@/shared';
export default {
  data: () => ({
    panel: [0],
    selectedProducers: selectedProducers,
    producers: producerData,
  }),
  computed : {
    items: function () { return namedItems.filterByProducers(this.selectedProducers) },
  },
  name: "ProducerSelector",
  components: { ItemPicker }
}

</script>
