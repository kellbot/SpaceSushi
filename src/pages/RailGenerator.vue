<template>
  <v-container>
    <v-card>
      <v-card-text>
        <RailSlider label="Grid Size" :max=96 :min=36 :step=4 v-model="gridSize" />
        <RailSlider label="Track Spacing" :max=10 :min=4 :step=2 v-model="trackSpacing" />
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Create blueprint with grid size {{ gridSize }}</v-card-title>
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
    gridSize: 48,// railSettings.gridSize,
    trackSpacing: 6, //railSettings.trackSpacing,
    blueprintString: '',    
  }),
  methods: {
    generate() {
      let opts = {gridSize: this.gridSize, trackSpacing: this.trackSpacing};
      console.log(opts);
      this.blueprintString = new RailBook(opts).generate();
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