<script>
import InformationPage from "@/components/informationPage.vue";
import MainDashboard from "@/components/mainDashboard.vue";
export default {
  name: 'App',
  data() {
    return {
      logged: false
    }
  },
  methods: {
    login() {
      this.logged = true;
    },
    logout() {
      this.logged = false;
    }
  },
  components: {MainDashboard, InformationPage},
}
</script>

<template>
  <information-page v-if="!logged" @logged="login"/>
  <main-dashboard v-if="logged" @logout="logout" />
</template>

<style>
  body {
    background-color: #e8f4fc;
    margin: 0;
    padding: 0;
  }
</style>
