<template>
  <Head>
    <Title>NgenCERF</Title>
  </Head>

</template>
<script lang="ts" setup>
import { onMounted } from "vue";
const appConfig = useAppConfig();
onMounted(() => {
   window.location.href = "login";
});
</script>
