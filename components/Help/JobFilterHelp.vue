<template>
  <div class="_help-page">
    <div class="_help-title">Job Filter Help</div>
    <p class="text-center">
      Calibration Job Filters allows the user to display only those jobs that meet certain criteria.
    </p>
    <div class="ml-10 mt-3">
      <p>Filters are applied in this manner:</p>
      <ul class="mt-4">
        <li>The base collection of jobs is determined by the Headwater Basic Gage dropdown, which allows the job list
          to be filtered for a specific gage, or "All" to display all jobs returnd by the server.
        </li>
        <li>If enabled by checking the "Enable Data Filters" checkbox, any of three date filters can be used to further
          filter the job list.
        </li>
        <li>Next, if no Status has been selected, no further jobs will be filtered from the list, but the user can
          select one or more status items to use to further filter the job list. Using the checkboxes, below the Status
          items,
          the user can select to apply the Status filter to either Calibration runs, Validation runs, or both.
        </li>
        <li>Lastly, if no Modules are slected, no further jobs will be filtered from the list, but the usewr can select
          one or more Modules to further filter the job list.
        </li>
      </ul>
    </div>
    <div class="ml-10">
      <img alt="Job Filters" src="@/assets/styles/img/job_filters.png" />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

ul li {
  margin-bottom: 20px;
}
</style>
