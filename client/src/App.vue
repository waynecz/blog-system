<template>
  <v-app>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'app',
    mounted() {
    },
    methods: {
    }
  }
</script>

<style lang="stylus">
  @import '../../node_modules/vuetify/src/stylus/settings/_colors'

  $theme := {
    primary: $deep-orange.darken-4
    accent: $red.accent-2
    secondary: $teal.darken-1
    info: $blue.lighten-1
    warning: $amber.darken-2
    error: $red.accent-4
    success: $green.lighten-2
  }

  @import '../../node_modules/vuetify/src/stylus/main'
</style>

<style lang="scss">
  @import "./sass/index";

  .container {
    padding: 0;
  }

  .toasted {
    font-weight: normal !important;
  }
</style>
