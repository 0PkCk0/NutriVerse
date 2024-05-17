<script>
export default {
  name: "loginPage",
  data() {
    return {
      signUp : false,
      password: '',
      retypePassword: ''
    }
  },
  methods: {
    signupRequest() {
      if(!this.signUp){
        this.signUp = true;
      }
    },
    loginRequest() {
      if(this.signUp) {
        this.signUp = false;
      }
    },
    hidePage() {
      this.$emit("hideLogin");
    },
    submitForm() {
      if ((this.password !== this.retypePassword) && (this.signUp)) {
        alert('Password and Retype Password should match');
      }else {
        if(this.signUp) {
          alert('Sign Up');
        }else {
          this.$emit("logged", this.password);
        }
      }
    }
  }
}
</script>

<template>
  <div id = "login_menu" :class="{ 'signupBackground': signUp, 'loginBackground': !signUp }">
        <div>
          <button @click="hidePage" id="closeButton" :class="{ 'closeSignupBG': signUp, 'closeLoginBG' : !signUp }">
            <img src="@/assets/closeButton.png" />
          </button>

          <div id = "ico_container">
            <div id = "log_ico">
                <img id="img_ico" src="@/assets/defaultPIC.png"  />
            </div>
          </div>
        </div>

        <div id="div_form">
            <div class = "outer_fdiv">
              <form id = "login_form">
                  <input type="text" name="username" placeholder="Email" required>
                  <input type="password" name="password" placeholder="Password"  v-model="password" required>
                  <div style="display: flex;">
                  <div v-if="!signUp" style="height: 85px"></div>
                  <transition name="slide">
                    <input type="password" name="retpas" placeholder="Retype Password" v-if="signUp" v-model="retypePassword" required>
                  </transition>
                  </div>
                  <button :class="{ 'smenuButton': signUp, 'lmenuButton' : !signUp }" @click="submitForm">Send</button>
              </form>
            </div>
            <div class = "outer_fdiv">
                <div id = "div_butt_men">
                    <button :class="{ 'smenuButton': signUp, 'lmenuButton' : !signUp }" @click="loginRequest" :id="!signUp ? 'rad_log' : ''">Login</button>
                    <button :class="{ 'smenuButton': signUp, 'lmenuButton' : !signUp }" @click="signupRequest" :id="signUp ? 'rad_sign' : ''">Signup</button>
                    <button :class="{ 'smenuButton': signUp, 'lmenuButton' : !signUp }">Google</button>
                </div>
            </div>
        </div>
  </div>
</template>

<style scoped>

  #rad_log {
    background-color: #9064e4;
  }

  #rad_sign {
    background-color: #946860;
  }

  .slide-enter-active {
    animation: slide-in 0.5s ease;
  }

  .slide-leave-active {
    animation: slide-out 0.5s ease;
  }

  @keyframes slide-in {
    from {
      transform: translateX(-150%);
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
      transform: translateX(-150%);
    }
  }

  .closeSignupBG {
    background-color: #588c94;
  }

  .closeLoginBG {
    background-color: #4d8330;
  }

  .closeSignupBG:hover {
    background-color: #9bbabf;
  }

  .closeLoginBG:hover {
    background-color: #79b663;
  }

  .loginBackground {
    background-color: #4d8330;
  }

  .signupBackground {
    background-color: #588c94;
  }

  .loginBackground, .signupBackground {
    transition: background-color 0.5s ease;
  }

  #div_butt_men{
    display: flex;
    justify-content: space-around;
    width: 70%;
    margin-top: -2%;
  }

  .outer_fdiv {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #div_form {
    vertical-align: top;
    justify-content: center;
    height: 55vh;
    width: 100%;
    margin-top: -10%;
  }

  #login_form {
    width: 70%; /* Imposta la larghezza del form al 100% */
    justify-content: center;
  }

  #login_form input:focus {
    outline: none; /* Rimuove l'outline quando l'input è selezionato */
    border-color: #4CAF50; /* Cambia il colore del bordo quando l'input è selezionato */
  }

  #login_form input {
    display: block;
    padding: 15px;
    width: 100%;
    border: 1px solid black;
    border-radius: 5px;
    margin-bottom: 30px;
    font-size: 20px;
    text-align: center;
    box-sizing: border-box;
    background-color: #e8f4fc;
  }

  .lmenuButton {
    display: inline-block; /* Aggiunge un margine superiore per separare il bottone dal form */
    padding: 5px; /* Aggiunge un padding al bottone */
    margin-bottom: 30px;
    width: 33.3%; /* Imposta la larghezza del bottone al 100% */
    background-color: #e8f4fc; /* Imposta il colore di sfondo del bottone */
    border: 1px solid black;
    height: 70px;
    color: black; /* Imposta il colore del testo del bottone */
    border-radius: 5px; /* Aggiunge un bordo arrotondato al bottone */
    cursor: pointer; /* Cambia il cursore al passaggio del mouse sopra il bottone */
    transition: background-color 0.3s ease;
    font-size: 20px;
  }

  .lmenuButton:hover {
    background-color: #80b663; /* Cambia il colore di sfondo del bottone al passaggio del mouse */
  }

  .smenuButton {
    display: inline-block; /* Aggiunge un margine superiore per separare il bottone dal form */
    padding: 5px; /* Aggiunge un padding al bottone */
    margin-bottom: 30px;
    width: 33.3%; /* Imposta la larghezza del bottone al 100% */
    background-color: #e8f4fc; /* Imposta il colore di sfondo del bottone */
    border: 1px solid black;
    height: 70px;
    color: black; /* Imposta il colore del testo del bottone */
    border-radius: 5px; /* Aggiunge un bordo arrotondato al bottone */
    cursor: pointer; /* Cambia il cursore al passaggio del mouse sopra il bottone */
    transition: background-color 0.3s ease;
    font-size: 20px;
  }

  .smenuButton:hover {
    background-color: #8aafb4; /* Cambia il colore di sfondo del bottone al passaggio del mouse */
  }

  #ico_container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh;
    margin-bottom: 17%;
    margin-top: 8%;
  }

  #log_ico {
    width: 250px; /* Imposta la larghezza desiderata */
    height: 250px; /* Imposta l'altezza desiderata */
    border-radius: 50%; /* Rende il bordo circolare */
    background-color: #e8f4fc; /* Imposta il colore di sfondo bianco */
    overflow: hidden; /* Assicura che l'immagine non esca dal bordo circolare */
  }

  #img_ico {
    width: 100%; /* Riempie il contenitore */
    height: auto; /* Mantieni l'aspetto proporzionato */
  }

  #closeButton {
    height: 70px;
    width: 70px;
    position: absolute; /* Posiziona il pulsante in modo assoluto all'interno del div */
    top: 0; /* Allineamento in alto */
    left: 0; /* Allineamento a sinistra */
    margin: 10px; /* Margine per dare spazio dal bordo */
    border: none;
    border-radius: 50%; /* Rende il bordo circolare */
    overflow: hidden;
    transition: background-color 0.3s ease;
    align-content: center;
  }


  #closeButton img {
    width: 50px; /* Imposta la larghezza desiderata */
    height: auto; /* Mantieni l'aspetto proporzionato */
  }

  #login_menu {
    position: fixed;
    justify-content: center;
    height: 100vh;
    width: 35%;
  }
</style>