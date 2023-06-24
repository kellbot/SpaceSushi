<template>
   
<div class="text-caption">
        {{ label  }}
      </div>
        <v-slider
    :modelValue = "modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="align-center"
    :max="max"
    :min="min"
    :step="step"
    hide-details
  >
  <template v-slot:append>
      <v-text-field
      :value = "modelValue"
         @input="$emit('update:modelValue', $event.target.value)"
        hide-details
        single-line
        :step="step"
        density="compact"
        type="number"
        style="width: 70px"
      ></v-text-field>
    </template>
  </v-slider>
</template>
<script>

export default {
  props: ['modelValue', 'label', 'min', 'max', 'step'],

  emits: 
    ['update:modelValue']
  
}

</script>