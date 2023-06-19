<template>

      <v-btn :data-recipe-id="item.id" 
      :class="['itemImage float-left', show ? 'd-block' : 'd-none']" :style="{ backgroundPosition: icon.position}">
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
