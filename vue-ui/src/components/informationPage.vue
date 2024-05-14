<script>
import LoginPage from "@/components/loginPage.vue";
export default {
  name: "informationPage",
  components: {LoginPage},
  data() {
    return {
      displayLogin: false,
      ptText: 'this platform is perect of personal trainers that needs to interface with their clients',
      nText: 'Nutriverse is perfect for nutritionist that needs to interface with their clients',
    }
  },
  methods: {
    showLogin() {
      this.displayLogin = true;
    },
    hideLogin() {
      this.displayLogin = false;
    },
  }
}
</script>

<template>
    <div id="div_inf_outer">
      <transition name="slide">
        <login-page v-if="displayLogin === true" @hideLogin = "hideLogin"/>
      </transition>
      <div id="div_title">
        <div id="div_ham">
          <button id="button_ham" @click="showLogin">
            <img id="hamlogin" src="@/assets/ham.png" alt="" />
          </button>
        </div>
        <div id="div_logo_title">
          <img src="@/assets/NutriverseLogo.png" alt="" />
          <h1>utriVerse</h1>
        </div>
        <div id="empty"></div>
      </div>

      <div id="div_information">
        <div id="div_pt">
          <span v-text="ptText"></span>
        </div>
        <div id="div_n">
          <span v-text="nText"></span>
        </div>
      </div>
    </div>

</template>

<style scoped>

.slide-enter-active {
  animation: slide-in 0.5s ease;
}

.slide-leave-active {
  animation: slide-out 0.5s ease;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

#button_ham:hover #hamlogin {
  content: url("@/assets/ham1.png"); /* Sostituisce l'immagine al passaggio del mouse */
  cursor: pointer;
}

#button_ham {
  background-color: transparent;
  border: none;
}

#div_inf_outer {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#div_information {
  display: flex;
  height: 70vh;
}

#div_pt {
  width: 50%;
  height: 100%;
  align-content: center;
  text-align: center;
}

#div_n {
  width: 50%;
  height: 100%;
  align-content: center;
  text-align: center;
}

#div_title {
  background-color: #b0e464;
  box-sizing: border-box;
  width: 100%;
  height: 30vh; /* 30% of the viewport height */
  display: flex;
  align-items: center; /* Vertically center the content */
  justify-content: space-between; /* Distribute children evenly */
  padding: 10px; /* Add a bit of margin from the border */
  font-family: 'Stinger Fit Trial', sans-serif;
}

#div_title > :first-child {
  align-self: flex-start; /* Align the first child to the left */
}

#div_title > :nth-child(2) {
  align-self: center; /* Align the second child to the center */
  margin-left: -100px; /* Move the element a bit to the left */
}

#div_title > :last-child {
  align-self: flex-end; /* Align the third child to the right */
}

#div_ham img {
  width: 100px;
  height: auto;
  margin-right: 20px;
}

#div_logo_title {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

#div_logo_title img {
  width: 120px;
  height: auto;
}

#div_logo_title h1 {
  color: #58a43c;
  font-size: 10vh; /* Responsive font size */
  margin: 0; /* Remove any default margin */
}
</style>