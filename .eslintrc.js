module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
  ],
  rules: {
    "vue/valid-v-for": "off",
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off"
  }
}
