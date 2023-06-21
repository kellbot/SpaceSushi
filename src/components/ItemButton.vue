<template>
  <v-btn
    :data-recipe-id="item.id"
    :class="['itemImage float-left']"
    :style="{ backgroundPosition: iconPos(icon) }"
  >
    <v-tooltip
      activator="parent"
      location="start"
    >
      {{ item.name }}
    </v-tooltip>
  </v-btn>
</template>
<script>
export default {
  props: {
    item: Object,
    icon: Object,
    show: Boolean
  },
  methods: {
    iconPos(icon) {
      if (!icon) {
        return '0px 0px';
      }
      let scale = 1 / 2;
      var resultString = icon.position
        .split(" ")
        .map(value => {
          var parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            return (parsedValue * scale) + "px";
          }
          return value;
        })
        .join(" ");
      return resultString;

    }
  },
  name: "ItemButton"
}

</script>
