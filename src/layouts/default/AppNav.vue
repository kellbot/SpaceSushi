<template>
  <v-navigation-drawer
    permanent
    location="right"
    class="bg-primary"
  >
    <template #prepend>
      <v-list-item
        lines="two"
        title="Space Garbage Truck"
        subtitle="Factorio blueprint generator"
      />
    </template>

    <v-divider />

    <v-list
      density="compact"
      nav
    >
      <v-list-item
        prepend-icon="mdi-rotate-360"
        title="Sushi Strongbox"
        value="sushi"
        link
        to="/SpaceSushi/sushi-strongbox"
      />
      <v-list-item
        prepend-icon="mdi-train"
        title="Book O' Rails"
        value="rails"
        link
        to="/SpaceSushi/rails"
      />
      <v-list-item
        prepend-icon="mdi-cancel"
        title="Clear Storage"
        value="clear"
        @click="clearData()"
      />

    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  methods: {
    clearData() {
      localStorage.removeItem('app');
    }
  }
}
</script>