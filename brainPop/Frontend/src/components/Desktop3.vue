<template>
  <div class="desktop-3">
    <img class="box-1" src="../assets/icons/box.png" alt = "" />
    <img class="box-4" src="../assets/icons/box.png" alt = ""/>
    <img class="box-5" src="../assets/icons/box.png" alt = ""/>
    <img class="box-6" src="../assets/icons/box.png" alt = ""/>
    <img class="plus-2-1" src="../assets/icons/box.png" alt = ""/>
    <div class="brainpop">Brainpop</div>
    <div class="set-1">Set 1</div>
    <div class="set-4">Set 4</div>
    <div class="flashcards-1">Flashcards 1</div>
    <div class="set-2">Set 2</div>
    <div class="set-3">Set 3</div>
    <img class="brain-process-1" src="../assets/icons/brain-process.png" alt = ""/>
      <img class="karteikarten-zum-lernen-1" src="../assets/icons/karteikarten-zum-lernen.png" alt = ""/>
    />
  </div>
</template>
<script>
export default {
  name: "Desktop3",
  components: {},
  props: {},
  data() {},
};
</script>
<style scoped>
.desktop-3,
.desktop-3 * {
  box-sizing: border-box;
}
.desktop-3 {
  background: #302c34;
  height: 1024px;
  position: relative;
  overflow: hidden;
}
.box-1 {
  width: 144px;
  height: 141px;
  position: absolute;
  left: 88px;
  top: 223px;
  object-fit: cover;
}
.box-4 {
  width: 144px;
  height: 141px;
  position: absolute;
  left: 360px;
  top: 223px;
  object-fit: cover;
}
.box-5 {
  width: 145px;
  height: 141px;
  position: absolute;
  left: 631px;
  top: 223px;
  object-fit: cover;
}
.box-6 {
  width: 143px;
  height: 141px;
  position: absolute;
  left: 904px;
  top: 223px;
  object-fit: cover;
}
.plus-2-1 {
  width: 75px;
  height: 75px;
  position: absolute;
  left: 1281px;
  top: 882px;
  object-fit: cover;
}
.brainpop {
  color: #ffffff;
  text-align: left;
  font-family: "Bayon-Regular", sans-serif;
  font-size: 96px;
  font-weight: 400;
  position: absolute;
  left: 70px;
  top: 0;
  width: 770px;
  height: 98px;
}
.set-1 {
  color: #ffffff;
  text-align: left;
  font-family: "Bayon-Regular", sans-serif;
  font-size: 32px;
  font-weight: 400;
  position: absolute;
  left: 133px;
  top: 391px;
  width: 99px;
  height: 40px;
}
.set-4 {
  color: #ffffff;
  text-align: left;
  font-family: "Bayon-Regular", sans-serif;
  font-size: 32px;
  font-weight: 400;
  position: absolute;
  left: 944px;
  top: 391px;
}
.flashcards-1 {
  color: #ffffff;
  text-align: left;
  font-family: "Bayon-Regular", sans-serif;
  font-size: 32px;
  font-weight: 400;
  position: absolute;
  left: 1146px;
  top: 392px;
  width: 173px;
  height: 40px;
}
.set-2 {
  color: #ffffff;
  text-align: left;
  font-family: "Bayon-Regular", sans-serif;
  font-size: 32px;
  font-weight: 400;
  position: absolute;
  left: 413px;
  top: 391px;
  width: 84px;
  height: 40px;
}
.set-3 {
  color: #ffffff;
  text-align: left;
  font-family: "Bayon-Regular", sans-serif;
  font-size: 32px;
  font-weight: 400;
  position: absolute;
  left: 665px;
  top: 391px;
  width: 78px;
  height: 40px;
}
.brain-process-1 {
  width: 125px;
  height: 125px;
  position: absolute;
  left: 1256px;
  top: 17px;
  object-fit: cover;
}
.karteikarten-zum-lernen-1 {
  width: 144px;
  height: 141px;
  position: absolute;
  left: 1157px;
  top: 223px;
  object-fit: cover;
}
</style>
