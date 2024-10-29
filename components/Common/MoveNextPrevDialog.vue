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
      Go to {{ goNext ? 'next' : 'previous'  }} tab
    </button>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue';
const dialogRef = inject<any>('dialogRef')
const params = ref<string>("");
const goNext = ref<boolean>();

onMounted(() => {
  params.value = dialogRef.value.data.body; // {user: 'primetime'}
  goNext.value = dialogRef.value.data.direction;
  console.log(params);
})

const stayOnTab = (w: boolean) => {
  const moveToNextResponse = dialogRef.value.data;
  dialogRef.value.data = true;
    dialogRef.value.close({
      moveToNextResponse: w,
      goNext: goNext.value
    });
}

</script>
<style lang="sass" scoped>
@import "@/assets/styles/styles.scss"

</style>