<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <Menu />
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
            <router-view/>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <Footer/>
    </v-footer>
  </v-app>
</template>

<script>
  import Menu from '@/views/Menu.vue'
  import Footer from '@/views/Footer.vue'
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
    components: {
      Menu,
      Footer,
    },
  }
</script>
