<template>
    <div class="text-caption">
        {{ label }}
    </div>
    <v-slider v-model="sliderValue" class="align-center" :max="max"
        :min="min" :step="step" hide-details>
        <template v-slot:append>
            <v-text-field v-model="sliderValue" hide-details single-line :step="step"
                density="compact" type="number" style="width: 70px"></v-text-field>
        </template>
    </v-slider>
</template>
<script>

export default {
    props: ['modelValue', 'label', 'min', 'max', 'step'],
    data: () => ({
        boots: 48
    }),
    computed: {
        sliderValue: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
            }
        },
    },

    methods: {
        sync(val) {
            this.$emit('update:modelValue', val);
            this.boots = val;
        }
    },
    emits:
        ['update:modelValue'],
    watch: {
        boots: function (newVal) {
            this.$emit('update:modelValue', newVal)
        }
    }

}

</script>