<template>
  <v-container>
    <v-card>
      <v-card-text>
        <RailSlider label="Grid Size" :max=96 :min=36 :step=4 :model-value="gridSize" />
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Coming Soon</v-card-title>
      <v-card-text>
        <v-btn @click="generate()">
          Generate
        </v-btn>
        <v-btn @click="copyCode">
          Copy
        </v-btn>
        {{ blueprintString }}
      </v-card-text>
    </v-card>
  </v-container>
</template>
  <script>
import  RailBook  from '@/RailBook.js';
import RailSlider from '@/components/RailSlider.vue';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia'


let appStore = useAppStore();
const { railSettings } = storeToRefs(appStore);

export default {
  data: () => ({
    gridSize: railSettings.gridSize,
    trackSpacing: railSettings.trackSpacing,
    blueprintString: '',    
  }),
  methods: {
    generate() {
      this.blueprintString = new RailBook({gridSize: this.gridSize}).generate();
    },
    async copyCode() {
      await navigator.clipboard.writeText(this.blueprintString);
      this.copyText = "Copied"
    }
  },
  components: {
    RailSlider
  }
}
</script>