<template>
  <div class="_help-page">
    <div class="_help-title">Job Filter Help</div>
    <p class="text-center">
      Calibration Job Filters allows the user to display only those jobs that meet certain criteria.
    </p>
    <div class="ml-10 mt-3">
      <p>Filters are applied in this manner:</p>
      <ul class="mt-4">
        <li>The base collection of jobs is determined by the value of the Headwater Basic Gage dropdown, which allows
          the job list
          to be filtered for a specific gage, or "All" to display all jobs returned by the server.
        </li>
        <li>If enabled by checking the "Enable Date Filters" checkbox, any of three date filters can be used to further
          filter the job list.
        </li>
        <li>After the job list is optionally filtered by the two previous filters, one or more Status selections can be made to further filter the job list.
          If there are no Status items selected, the filter will be bypassed.<br />
          The two checkboxes, "Calibrations" and "Validations" selects whether Calibrations with or without Validations should be affected by the filters.
          If both boxes are checked, or both boxes are unchecked, then the filters is applied to both.
          Otherwise, the filter will be applied to one or the other checked item.
        </li>
        <li>Lastly, if no Modules are slected, no further jobs will be filtered from the list, but the user may select
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
