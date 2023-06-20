<template>
    <v-container>
        <v-expansion-panels v-model="panel">
            <v-expansion-panel>
                <v-expansion-panel-title color="primary">Producers</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-sheet class="d-flex align-content-start flex-wrap">
                        <v-checkbox density="compact" v-for="(producer, index) in producers" v-model="selected"
                            :label="producer.name" :value="producer.id">
                        </v-checkbox>
                    </v-sheet>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        
        <KeepAlive>

        <v-expansion-panels>
            <v-expansion-panel :value="0">
                <v-expansion-panel-title color="primary">Recipe Selector</v-expansion-panel-title>
                <v-expansion-panel-text eager>
                    <ItemPicker :selectedProducers="selected" />
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </KeepAlive>

    </v-container>
</template>
<script>
import { useAppStore } from '@/store/app';

let appStore = useAppStore();
import ItemPicker from '@/components/ItemPicker.vue';
export default {
    data: () => ({
        panel: [0],
        selected: ['electric-furnace', 'assembling-machine-3'],
        producers: appStore.producers
    }),
    name: "ProducerSelector",
    components: { ItemPicker }
}

</script>
