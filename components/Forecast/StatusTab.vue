<template>
  <div>
    <div class="grid grid-cols-2">
      <div class="col-span-1">
        <table>
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Job ID</div>
              </td>
              <td class="pl-5">{{ jobId ? jobId : '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Start Time</div>
              </td>
              <td class="pl-5">{{ startTime ? startTime : '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Running Time</div>
              </td>
              <td class="pl-5">{{ runningTime ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
        <table>
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Status</div>
              </td>
              <td class="pl-5">{{ status ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Cycle</div>
              </td>
              <td class="pl-5">{{ cycle ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-2">
        <table style="width:100%">
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold" style="width: 140px;">
                <label class="text-right" for="resultsPathname" style="width: 140px;">Results Pathname</label>
              </td>
              <td class="pl-5">
                <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';

onMounted(() => {
  hilightTab(ForecastTabs.tab_status);
});
</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";
</style>