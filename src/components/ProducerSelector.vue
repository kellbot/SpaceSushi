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
              v-model="selected"
              :label="producer.name"
              :value="producer.id"
            />
          </v-sheet>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <KeepAlive>
      <ItemPicker
        :selected-producers="selected"
        eager
      />
    </KeepAlive>
  </v-container>
</template>
<script>
import { useAppStore } from '@/store/app';
import producerData from '@/assets/producers.json';

let appStore = useAppStore();
import ItemPicker from '@/components/ItemPicker.vue';
export default {
  data: () => ({
    panel: [0],
    selected: ['electric-furnace', 'assembling-machine-3'],
    producers: producerData,
  }),
  name: "ProducerSelector",
  components: { ItemPicker }
}

</script>
