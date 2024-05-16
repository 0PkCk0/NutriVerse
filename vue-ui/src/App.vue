<script>
import InformationPage from "@/components/informationPage.vue";
import MainDashboard from "@/components/mainDashboard.vue";
export default {
  name: 'App',
  data() {
    return {
      logged: false,
      typeAcc: 0
    }
  },
  methods: {
    login(password) {
      this.logged = true;
      if(password==="premium"){
        this.typeAcc = 1;
      }
      if(password==="pro"){
        this.typeAcc = 2;
      }
    },
    logout() {
      this.typeAcc = 0;
      this.logged = false;
    }
  },
  components: {MainDashboard, InformationPage},
}
</script>

<template>
  <information-page v-if="!logged" @logged="login"/>
  <main-dashboard v-if="logged" @logout="logout" :type-acc="typeAcc"/>
</template>

<style>
  body {
    background-color: #e8f4fc;
    margin: 0;
    padding: 0;
  }
</style>
