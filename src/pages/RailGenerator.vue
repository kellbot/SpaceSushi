<template>
  <v-container>
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
import { useAppStore } from '@/store/app';
// import { storeToRefs } from 'pinia'


// let appStore = useAppStore();

export default {
  data: () => ({
    rb: new RailBook(),
    blueprintString: ''
  }),
  methods: {
    generate() {
      this.blueprintString = this.rb.generate();
    },
    async copyCode() {
      await navigator.clipboard.writeText(this.blueprintString);
      this.copyText = "Copied"
    }
  },
  components: {
  }
}
</script>