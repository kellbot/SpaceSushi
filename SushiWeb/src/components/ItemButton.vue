<template>

      <v-btn :data-recipe-id="item.id" 
      :class="['itemImage float-left']" :style="{ backgroundPosition: icon.scaledPosition}">
        <v-tooltip
        activator="parent"
        location="start"
      >{{ item.name }}</v-tooltip>
      </v-btn>
</template>
<script>
export default {
  props: {
    item: Object,
    icon: Object,
    show: Boolean
  },
  name: "ItemButton"
}

</script>
