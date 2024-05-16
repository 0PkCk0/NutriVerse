<script>
import CardSchedule from "@/components/cardSchedule.vue";

export default {
  name: "interactionDashboard",
  components: {CardSchedule},
  props: {
    IdCode: String,
    interactionCode: String
  },
  methods: {
    back() {
      this.$emit("back");
    }
  }
}
</script>

<template>
  <div id="div_container_inter">
    <div id="div_upper_bar">

      <button id="button_back" @click="$emit('back')">
        <img id="back" src="@/assets/backArrow.png" alt="" />
      </button>
      <div id="div_int_pic">
        <div class="div_inner">
          <img src="@/assets/defaultPIC.png"/>
          <span class="span_inner">{{IdCode}}</span>
        </div>
        <div class="div_inner"  style="margin-left: 6vh">
          <img src="@/assets/defaultPIC.png"/>
          <span class="span_inner">{{interactionCode}}</span>
        </div>
        <button class="inter_button" id="but_money" >
          <img alt="Error" src="@/assets/catIcon.png" style="width: 60%; height: 60%; background-color: transparent; border-radius: 0%">
        </button>
      </div>


    </div>
    <div id="div_schedule">
      <card-schedule/>
      <card-schedule/>
      <card-schedule/>
      <card-schedule/>
      <card-schedule/>
      <card-schedule/>
      <card-schedule/>
    </div>
  </div>
</template>

<style scoped>

  #div_schedule{
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    width: 100%;
    height: 100%;
  }

  .inter_button{
    background-color: transparent;
    border: none;
    margin-top: 3vh;
    width: 12vh;
    height: 12vh;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    margin-left: 8vh;
  }

  .inter_button:hover {
    background-color: #b8e464;
    cursor: pointer;
  }

  .span_inner{
    font-size: 2vh;
    margin-top: 1vh;
    font-family: 'Stinger Fit Trial', sans-serif;
  }

  .div_inner{
    display: flex;
    flex-direction: column;
    margin-left: 2vh;
    height: 100%;
    align-items: center;
  }

  #div_int_pic{
    display: flex;
    height: 70%;
    margin-left: 10vh;
    margin-top: 1vh;
  }

  #div_int_pic img{
    background-color: #e8f4fc;
    border-radius: 50%;
    height: 100%;
  }

  #button_back{
    background-color: transparent;
    border: none;
    margin-top: 5vh;
    margin-left: 3vh;
    width: 10vh;
    height: 10vh;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  #button_back:hover {
    background-color: #b8e464;
    cursor: pointer;
  }

  #back{
    margin-left: -1vh;
    width: 80%;
    height: 80%;
  }

  #div_container_inter{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  #div_upper_bar{
    display: flex;
    width: 100%;
    height: 20vh;
    background-color: #58a43c;
    border-bottom: 2px solid black;
  }

  #div_schedule{
    width: 100%;
    height: 79vh;
  }
</style>