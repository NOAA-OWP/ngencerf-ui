<template>
  <div id="BottomButtons" class="grid grid-cols-7">
    <div>
      <button class="start actionBtn">START</button>
    </div>
    <div>
      <button class="stop actionBtn">STOP</button>
    </div>
    <div>
      <button class="save actionBtn">SAVE</button>
    </div>
    <div>
      <button class="reset actionBtn">RESET</button>
    </div>
    <div>
      <div class="buttonSpacer">&nbsp;</div>
    </div>
    <div>
      <button class="prev actionBtnSmall">&#8678; Prev</button>
    </div>
    <div>
      <button class="next actionBtnSmall">Next <span>&#8680;</span></button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
4
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#BottomButtons {
  margin-left: 15px;
  color: #ffffff;
  font-weight: bold;
}
.actionBtn {
  display: inline-block;
  width: 95%;
  height: 55px;
  border-radius: 20px;
  border: 5px solid #59b4c1;
  border-radius: 20px;
  margin-right: 20px;
}

.actionBtnSmall {
  display: inline-block;
  width: 105px;
  height: 55px;
  border-radius: 20px;
  border: 5px solid #59b4c1;
  border-radius: 20px;
  margin-right: 3px;
}

.buttonSpacer {
  display: inline-block;
  width: 60px;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.start {
  background-color: #155e29;
}
.stop {
  background-color: #922222;
}
.save {
  background-color: #333333;
}
.reset {
  background-color: #000000;
}
.prev {
  background-color: #000000;
  display: inline-block;
}
.next {
  background-color: #000000;
  display: inline-block;
}
.disabled {
  opacity: 0.8;
}
</style>
