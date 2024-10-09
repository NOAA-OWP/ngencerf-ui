<template>
  <Head>
    <Title>NgenCERF</Title>
  </Head>

</template>
<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(() => {
  console.log('MOUNTED: Index.vue');
   window.location.href = "login";
});
</script>
