export default defineNuxtPlugin((nuxtApp) => {
  const isAppLoading = useState<boolean>('isAppLoading', () => false);

  nuxtApp.hook('page:loading:start', () => {
    isAppLoading.value = true;
  });

  nuxtApp.hook('page:loading:end', () => {
    isAppLoading.value = false;
  });
});