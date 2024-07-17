<template>
    <div class="waitgif" v-if="loading">
      <img src="/assets/styles/img/wait.gif" />
    </div>
</template>
<script lang="ts" setup>
import  Tabs from "@/components/Tabs.vue"

const loading = ref(true);
const showMap = ref(false);

onMounted(() => {
  setTimeout(() => {
  loading.value = false;
}, 500);
});
</script>
<style lang="scss" scoped>
.waitgif {
  position: absolute;
  top: 40%;
  left: 45%;
  width: 50px;
  margin: 0 auto;
  z-index: 9999;
}
</style>