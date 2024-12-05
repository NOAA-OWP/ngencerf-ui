<template>
  <NuxtLayout>
    <Toast position="bottom-right"/>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const title = ref('NgenCERF')
const description = ref('')

// This will be reactive when you change title/description above
useHead({
  title,
  meta: [{
    name: '',
    content: description
  }]
})
</script>