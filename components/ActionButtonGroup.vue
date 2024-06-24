<template>
    <div id="BottomButtons">
        <button class="start actionBtn disabled">START</button>
        <button class="stop actionBtn disabled">STOP</button>
        <button class="save actionBtn">SAVE</button>
        <button class="reset actionBtn">RESET</button>
        <div class="buttonSpacer">&nbsp;</div>
        <button class="prev actionBtnSmall">&#8678; Prev</button>&nbsp;&nbsp;&nbsp;
        <button class="next actionBtnSmall">Next <span>&#8680;</span></button>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#BottomButtons {
    margin-left: 15px;
    color: #ffffff;
    font-weight: bold;;
}
.actionBtn {
    display: inline-block;
    width: 191.69px;
    height: 55px;
    border-radius: 20px;
    border: 5px solid #59B4C1;
    border-radius: 20px;
    margin-right: 20px;

}

.actionBtnSmall {
    display: inline-block;
    width: 105px;
    height: 55px;
    border-radius: 20px;
    border: 5px solid #59B4C1;
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
    background-color:  #000000;
}
.next {
    background-color:  #000000;
}
.disabled {
    opacity: .8;
}
</style>
