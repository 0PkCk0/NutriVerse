<script>
export default {
  name: "loginPage",
  methods: {
    hidePage() {
      this.$emit("hideLogin");
    }
  }
}
</script>

<template>
  <div id = "login_menu">
        <div>
          <button @click="hidePage" id="closeButton">
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
                  <input type="text" name="username" placeholder="Username" required>
                  <input type="password" name="password" placeholder="Password" required>
                  <button class="menuButton">Login</button>
              </form>
            </div>
            <div class = "outer_fdiv">
              <div id = "div_butt_men">
                <button class="menuButton">Signup</button>
                <button class="menuButton">Google</button>
              </div>
            </div>
        </div>
  </div>
</template>

<style scoped>

  #div_butt_men{
    display: flex;
    justify-content: space-around;
    width: 70%;
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

  .menuButton {
    display: inline-block; /* Aggiunge un margine superiore per separare il bottone dal form */
    padding: 5px; /* Aggiunge un padding al bottone */
    margin-bottom: 30px;
    width: 50%; /* Imposta la larghezza del bottone al 100% */
    background-color: #e8f4fc; /* Imposta il colore di sfondo del bottone */
    border: 1px solid black;
    height: 70px;
    color: black; /* Imposta il colore del testo del bottone */
    border-radius: 5px; /* Aggiunge un bordo arrotondato al bottone */
    cursor: pointer; /* Cambia il cursore al passaggio del mouse sopra il bottone */
    transition: background-color 0.3s ease;
    font-size: 20px;
  }

  .menuButton:hover {
    background-color: #293c3f; /* Cambia il colore di sfondo del bottone al passaggio del mouse */
  }

  #ico_container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45vh;
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
    background-color: transparent;
    border: none;
    border-radius: 50%; /* Rende il bordo circolare */
    overflow: hidden;
    transition: background-color 0.3s ease;
    align-content: center;
  }

  #closeButton:hover {
    background-color: #97dce9; /* Colore di sfondo al passaggio del mouse */
    cursor: pointer; /* Cambia il cursore al passaggio del mouse */
  }

  #closeButton img {
    width: 50px; /* Imposta la larghezza desiderata */
    height: auto; /* Mantieni l'aspetto proporzionato */
  }

  #login_menu {
    position: absolute;
    background-color: #588c94;
    justify-content: center;
    height: 100vh;
    width: 35%;
  }
</style>