<template>
   
<div class="text-caption">
        {{ label  }}
      </div>
        <v-slider
        v-model="boots"
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
         @input="sync( $event.target.value)"
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
    data: () => ({
        boots: 42
    }),
  props: ['modelValue', 'label', 'min', 'max', 'step'],
    methods: {
        sync(val) {
            this.$emit('update:modelValue', val);
            this.boots =val;
        }
    },
  emits: 
    ['update:modelValue'],
    watch: {
        boots: function(newVal) { 
            this.$emit('update:modelValue', newVal)
        }
      }
  
}

</script>