<template>
<div class="text-caption">
        {{ label  }}
      </div>
        <v-slider
    v-model="sValue"
    model-value="modelValue"
    class="align-center"
    :max="max"
    :min="min"
    :step="step"
    hide-details
  >
    <template v-slot:append>
      <v-text-field
        v-model="sValue"
        hide-details
        single-line
        density="compact"
        type="number"
        style="width: 70px"
      ></v-text-field>
    </template>
  </v-slider>
</template>
<script>
export default {
  data: () => ({
    sValue: 48
  }),
  props: {
    label: String,
    min: Number,
    max: Number,
    step: Number,
    modelValue: Number
  }
}
</script>