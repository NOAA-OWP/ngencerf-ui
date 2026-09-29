import { defineAsyncComponent } from 'vue';

export function useAsyncTabComponent() {
  const isAppLoading = useState<boolean>('isAppLoading');

  function asyncTabComponent(loader: () => Promise<any>) {
    return defineAsyncComponent({
      loader: async () => {
        isAppLoading.value = true;

        try {
          return await loader();
        } finally {
          isAppLoading.value = false;
        }
      }
    });
  }

  return {
    asyncTabComponent
  };
}