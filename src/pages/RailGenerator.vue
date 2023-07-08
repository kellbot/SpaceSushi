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
          <RailSlider
            label="Grid Size"
            :max="52"
            :min="36"
            :step="4"
            v-model="gridSize"
          />
          <RailSlider
            label="Track Spacing"
            :max="10"
            :min="4"
            :step="2"
            v-model="trackSpacing"
          />
          <RailSlider
            label="Engine Count"
            :max="3"
            :min="1"
            :step="1"
            v-model="engineCount"
          />
          <RailSlider
            label="Car Count"
            :max="10"
            :min="1"
            :step="1"
            v-model="carCount"
          />
          <v-switch
            v-model="doubleEnded"
            :label="`Double Ended Trains: ${doubleEnded}`"
          />
        </v-col>
        <v-col cols="8">
          <v-card-title>Create blueprint with grid size {{ gridSize }}</v-card-title>
          <v-card-text>          
            <v-btn
              class="ma-2"
              @click="generate()"
            >
              Generate
            </v-btn>
            <v-btn
              class="ma-2"
              @click="copyCode"
              :disabled="blueprintString ? false : true"
            >
              Copy Blueprint to Clipboard
            </v-btn>

            <v-expansion-panels class="ma-2">
              <v-expansion-panel
                title="View Blueprint"
                :disabled="blueprintString ? false : true"
                :text="blueprintString"
              />
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
    engineCount: 1,
    carCount: 4,
    doubleEnded: true,
    blueprintString: null,
    straightJSON: ''
  }),
  methods: {
    generate() {
      let opts = { gridSize: this.gridSize, trackSpacing: this.trackSpacing, doubleEnded: this.doubleEnded, carCount: this.carCount };
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