<template>
  <Head>
    <Title>NEXTGEN</Title>
  </Head>

</template>
<script lang="ts" setup>
const appConfig = useAppConfig();
onMounted(() => {
   window.location.href = "login";
});
</script>
