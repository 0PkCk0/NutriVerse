<script>
</script>

<template lang="html">
  <div id="app">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.cdnfonts.com/css/stinger-fit-trial" rel="stylesheet" />
      <title>NutriVerse</title>
    </head>
    <body>
      <div id="div_title">
        <div id="div_ham">
          <img src="./assets/ham.png" alt="" />
        </div>
        <div id="div_logo_title">
          <img src="./assets/NutriverseLogo.png" alt="" />
          <h1>utriVerse</h1>
        </div>
        <div id="empty"></div>
      </div>
      <div id="div_information">
        <div id="div_pt">
          <span>ds</span>
        </div>
        <div id="div_n">
          <span>testing</span>
        </div>
      </div>
    </body>
  </div>
</template>

<style lang="css">
body {
  background-color: #e8f4fc;
  margin: 0;
  padding: 0;
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
  font-family: 'Stinger Fit Trial', sans-serif;
  margin: 0; /* Remove any default margin */
}

#login_menu {
  background-color: #588c94;
  display: grid;
  justify-content: center;
  height: 100vh;
  width: 35%;
}
</style>
