<template>
  <Head>
    <Title>NEXTGEN</Title>
  </Head>

</template>
<script lang="ts" setup>
const appConfig = useAppConfig();
onMounted(() => {
  //this can be removed once we implement the page
   window.location.href = "calibration";
});
</script>
