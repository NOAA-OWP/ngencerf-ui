<template>
  <div>You may lose data if you do not save.</div>
  <div>&nbsp;</div>
  <div v-for="line in params">
    {{ line }}
  </div>
  <div>&nbsp;</div>
  <div>
    <button class="ngenButtonDiv" @click="stayOnTab(false)">
      Stay on tab
    </button> &nbsp;
    <button class="ngenButtonDiv" @click="stayOnTab(true)">
      Discard changes
    </button>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue';
const dialogRef = inject<any>('dialogRef')
const params = ref<string>("");
const goNext = ref<boolean>();

onMounted(() => {
  params.value = dialogRef.value.data.body;
  goNext.value = dialogRef.value.data.direction;
})

const stayOnTab = (w: boolean) => {
  dialogRef.value.data = true;
    dialogRef.value.close({
      moveToNextResponse: w,
      goNext: goNext.value
    });
}

</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>