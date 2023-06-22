<template>
  <v-container>
    <v-card>
      <v-card-title>Coming Soon</v-card-title>
      <v-card-text>
        {{ rb.generate() }}
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
    rb: new RailBook()
  }),
  methods: {
    generate() {
      this.rb.generate();
    },
  },
  components: {
  }
}
</script>