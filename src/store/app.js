// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    // if (localStorage.getItem("app"))
    //   return JSON.parse(localStorage.getItem("app"));
    return {
      railSettings: {
        gridSize: 48,
        trackSpacing: 6
      },
      selectedItems: ['stack-inserter'],
      selectedProducers: ['assembling-machine-2', 'assembling-machine-3'],
    }
  },
})
