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
      selectedRecipes: ['stack-inserter']
    }
  },
})
