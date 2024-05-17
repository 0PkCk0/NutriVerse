<script>
export default {
  name: "cardProfile",
  props: {
    code: String,
    nameP: String,
    typeP: String
  },
  methods: {
    removeSub() {
      this.$emit("removeSub", this.code);
    },
    openInteractionDashboard() {
      this.$emit("openInteractionDashboard", this.code);
    }
  }
}
</script>

<template>
  <button class="button_card_profile" @click="openInteractionDashboard">
    <div id="container_card">
      <button class="close_button" @click="removeSub">
        <img src="@/assets/closeButton.png" style="width: 100%; height: 100%"/>
      </button>
      <div id="div_card_pic">
        <img src="@/assets/defaultPIC.png" />
      </div>
      <div id="div_info_card">
        <div class="show_info">
          <h2 class="h2_card"> Code: {{ code }}</h2>
        </div>
        <div class="show_info">
          <h2 class="h2_card"> Name: {{nameP}}</h2>
        </div>
        <div class="show_info">
          <h2 class="h2_card"> Professionist: {{typeP}}</h2>
        </div>
      </div>
    </div>
  </button>
</template>

<style scoped>

  .button_card_profile{
    background-color: transparent;
    border: none;
  }

  .close_button{
    margin-top: 1vh;
    margin-left: -11.5vw;
    border-radius: 30%;
    border:none;
    background-color: transparent;
    width: 2vw;
    transition: background-color 0.3s ease;
  }

  .close_button:hover {
    background-color: #844034;
    cursor: pointer;
  }

  #div_info_card {
    margin-top: 3vh;
    display: flex;
    flex-direction: column;
    align-items: center; /* Per centrare verticalmente */
    justify-content: center; /* Per centrare orizzontalmente */
  }

  .show_info {
      display: flex;
      margin-top: -2vh;
  }

  .h2_card {
    font-family: 'Stinger Fit Trial', sans-serif;
    font-size: 16px;
  }


  #div_card_pic {
    display: flex;
    width: 100%;
    height: 20vh;
    border-radius: 50%;
    margin-top: -2vh;
    align-items: center;
    justify-content: center;
  }

  #div_card_pic img {
    width: 20vh;
    height: 20vh;
    border-radius: 50%;
    background-color: #e8f4fc;
  }

  #container_card {
      display: block;
      width: 14vw;
      height: 100%;
      margin-top: 5vh;
      margin-left: 2vw;
      background-color: #4d8330;
      border: 1px solid black;
      align-items: center; /* Per centrare verticalmente */
      justify-content: center; /* Per centrare orizzontalmente */
      transition: background-color 0.3s ease;
      cursor: pointer;
  }

  #container_card:hover {
    background-color: #73a25a;
  }
</style>