<template>
  <v-app>
      <default-nav />
      <v-main>
      <router-view />
      </v-main>
  </v-app>
</template>

<script setup>
import DefaultNav from './AppNav.vue'
</script>
