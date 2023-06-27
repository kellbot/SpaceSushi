<template>
  <v-container>
    <v-card>
      <v-card-text>
        Rail generator creates a book of blueprints based on the grid size and track spacing. Track spacing must be a
        multiple
        of two, grid size must be a multiple of 4.
        Layouts generated:
        <v-list density="compact">
          <v-list-item>Straight track</v-list-item>
          <v-list-item>Curved track</v-list-item>
          <v-list-item>T intersection</v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
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
    {{ straightJSON }}
  </v-container>
</template>
<script>
import RailBook from '@/RailBook.js';
import RailSlider from '@/components/RailSlider.vue';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia'


let appStore = useAppStore();
const { railSettings } = storeToRefs(appStore);

export default {
  data: () => ({
    gridSize: 48,// railSettings.gridSize,
    trackSpacing: 8, //railSettings.trackSpacing,
    blueprintString: '',
    straightJSON: ''
  }),
  methods: {
    generate() {
      let opts = { gridSize: this.gridSize, trackSpacing: this.trackSpacing };
      [this.blueprintString, this.straightJSON] = new RailBook(opts).generate();
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