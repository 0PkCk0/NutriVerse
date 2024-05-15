<script>
import LoginPage from "@/components/loginPage.vue";
export default {
  name: "informationPage",
  components: {LoginPage},
  data() {
    return {
      displayLogin: false,
      ptText: 'Introducing Nutriverse, the ultimate platform designed exclusively for personal trainers seeking seamless client interaction. In the dynamic world of fitness, where personalized guidance and constant communication are paramount, Nutriverse stands out as the perfect solution for professionals like you.\n' +
          '\n' +
          'Imagine having a comprehensive toolkit at your fingertips, crafted to elevate your practice and revolutionize the way you connect with your clients. With Nutriverse, bid farewell to cumbersome paperwork and scattered communication channels. Our intuitive interface consolidates all client data, ensuring it\'s readily accessible whenever and wherever you need it.\n' +
          '\n' +
          'But Nutriverse offers far more than just streamlined data management. It\'s your virtual training partner, empowering you to forge deeper connections with your clients. Engage in real-time conversations, share tailored workout plans, monitor progress, and celebrate achievements together—all within a secure and user-friendly environment.\n' +
          '\n' +
          'What truly sets Nutriverse apart is its commitment to innovation. We\'re constantly evolving to meet the ever-changing needs of personal trainers and their clients. From cutting-edge analytics tools to customizable training templates, we provide the resources you need to stay ahead in a competitive industry.\n' +
          '\n' +
          'Join the Nutriverse community today and experience the difference firsthand. Elevate your training practice, strengthen client relationships, and unlock new opportunities with Nutriverse—the ultimate platform for personal trainers who demand excellence.\n',
      nText: 'Welcome to Nutriverse, the ultimate solution tailored specifically for nutritionists seeking seamless client interaction. In the dynamic world of nutrition, where personalized guidance and constant communication are key, Nutriverse stands out as the ideal platform for professionals like you.\n' +
          '\n' +
          'Imagine a comprehensive toolkit designed to elevate your practice to new heights. With Nutriverse, you not only streamline your workflow but also enhance the client experience like never before. Say goodbye to cumbersome paperwork and scattered communication channels. Our intuitive interface centralizes all client data, making it effortlessly accessible whenever and wherever you need it.\n' +
          '\n' +
          'But Nutriverse is more than just a data management system. It\'s your virtual partner, empowering you to forge stronger connections with your clients. Engage in real-time conversations, share personalized meal plans, track progress, and celebrate milestones together—all within a secure and user-friendly environment.\n' +
          '\n' +
          'What truly sets Nutriverse apart is its commitment to innovation. We\'re constantly evolving to meet the evolving needs of nutritionists and their clients. From advanced analytics tools to customizable templates, we provide the resources you need to stay ahead in an ever-changing industry.\n' +
          '\n' +
          'Join the Nutriverse community today and experience the difference for yourself. Elevate your practice, deepen client relationships, and unlock new possibilities with Nutriverse—the perfect companion for nutritionists who demand excellence.',
    }
  },
  methods: {
    showLogin() {
      this.displayLogin = true;
    },
    hideLogin() {
      this.displayLogin = false;
    },
    logged(password) {
      this.$emit("logged", password);
    }
  }
}
</script>

<template>
    <div id="div_inf_outer">
      <transition name="slide">
        <login-page v-if="displayLogin === true" @hideLogin = "hideLogin" @logged="logged"/>
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
        <div class="c_img_inf">
          <img style="width: 100%; height: 100%" src="@/assets/ptPromo.png" alt="" />
        </div>
        <div id="div_pt">
          <span v-text="ptText"></span>
        </div>
        <div class="c_img_inf">
          <img style="width: 100%; height: 100%" src="@/assets/nFood.png" alt="" />
        </div>
        <div id="div_n">
          <span v-text="nText"></span>
        </div>
      </div>
    </div>

</template>

<style scoped>

.c_img_inf {
  display: flex;
  width: 10vh;
  height: 10vh;
  margin-top: 5vh;
  margin-left: 10vh;
}

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
  font-family: "Merriweather", serif;
  display: flex;
  height: 70vh;
  font-size: 20px;
  justify-content: space-around; /* Distribute space around */
}

#div_pt,
#div_n {
  width: 35%;
  height: 70%;
  text-align: justify;
  margin-top: 15vh;
  margin-right: 15vh;
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