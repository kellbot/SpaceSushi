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
    <v-card class="pa-5 my-2">
      <v-row>

        <v-col cols="4">
          <RailSlider label="Grid Size" :max=52 :min=36 :step=4 v-model="gridSize" />
          <RailSlider label="Track Spacing" :max=10 :min=4 :step=2 v-model="trackSpacing" />
          <v-switch v-model="bufferSide" :label="`Buffer Side: ${bufferSide}`"
          true-value="same"
    false-value="opposite"></v-switch>
        </v-col>
        <v-col cols="8">
          <v-card-title>Create blueprint with grid size {{ gridSize }}</v-card-title>
          <v-card-text>          <v-btn @click="generate()">
            Generate
          </v-btn>
          <v-btn @click="copyCode" :enabled="blueprintString ? true : false">
            Copy Blueprint to Clipboard
          </v-btn>

          <v-expansion-panels>
            <v-expansion-panel title="View Blueprint" :text="blueprintString">
            </v-expansion-panel>
          </v-expansion-panels>
</v-card-text>

        </v-col>

      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import RailBook from '@/RailBook.js';
import RailSlider from '@/components/RailSlider.vue';


export default {
  data: () => ({
    gridSize: 48,// railSettings.gridSize,
    trackSpacing: 8, //railSettings.trackSpacing,
    bufferSide: 'same',
    blueprintString: null,
    straightJSON: ''
  }),
  methods: {
    generate() {
      let opts = { gridSize: this.gridSize, trackSpacing: this.trackSpacing, bufferSide: this.bufferSide };
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