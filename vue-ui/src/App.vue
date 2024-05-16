<script>
import InformationPage from "@/components/informationPage.vue";
import MainDashboard from "@/components/mainDashboard.vue";
import InteractionDashboard from "@/components/interactionDashboard.vue";
export default {
  name: 'App',
  data() {
    return {
      interacting: false,
      IdCode : "ALDKSIFN",
      interactionCode : "",
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
    },
    openInteractionDashboard(code) {
      this.interacting = true;
      this.interactionCode = code;
    },
    exitInteraction() {
      this.interacting = false;
    }
  },
  components: {InteractionDashboard, MainDashboard, InformationPage},
}
</script>

<template>
  <information-page v-if="!logged" @logged="login"/>
  <main-dashboard v-if="logged && !interacting" @logout="logout" @openInteractionDashboard="openInteractionDashboard" :type-acc="typeAcc" :id-code="IdCode"/>
  <interaction-dashboard v-if="interacting" :IdCode="IdCode" :interactionCode="interactionCode" @back="exitInteraction"/>
</template>

<style>
  body {
    background-color: #e8f4fc;
    margin: 0;
    padding: 0;
  }
</style>
