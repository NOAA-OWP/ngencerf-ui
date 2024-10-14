<template>
  <div id="BottomButtons" class="flex">
    <div>
      <div class="inline ngenButtonDiv bg-green mr-6" v-if="getEvaluationTabIndex() === 2">
        <button class="font-normal">Evaluate</button>
      </div>
      <div class="inline mr-3 ngenButtonDiv" v-if="getEvaluationTabIndex() >= 5">
        <button class="font-normal">Run</button>
      </div>
    </div>
    <div class="inline mr-3" v-if="getEvaluationTabIndex() >= 5">
      <button v-if="getEvaluationTabIndex() >= 5" class="c-blue font-normal underline">Cancel</button>
    </div>
    
    <div class="ml-auto">

    </div>

  </div>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
const { getEvaluationTabIndex } = generalStore();

const tabIndex = getEvaluationTabIndex();

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#BottomButtons {
  margin-left: 15px;
  color: #ffffff;
  font-weight: bold;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.disabled {
  opacity: 0.8;
}
</style>
