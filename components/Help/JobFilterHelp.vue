<template>
  <div class="_help-page">
    <div class="_help-title">Job Filter Help</div>
    <p class="text-center">
      Calibration Job Filters allows the user to display only those jobs that meet certain criteria.
    </p>
    <div class="ml-8 mt-3">
      <p>Filters are applied in this manner:</p>
      <ul class="mt-4">
        <li>The base collection of jobs is determined by the value of the Headwater Basic Gage dropdown, which allows
          the job list
          to be filtered for a specific gage, or "All" to display all jobs returned by the server.
        </li>
        <li>After the job list is optionally filtered by Headwater Basic Gage, one or more Status selections can be made
          to further filter the job list.
          If there are no Status items selected, the filter will be bypassed.
        </li>
        <li>Lastly, if no Modules are slected, no further jobs will be filtered from the list, but the user may select
          one or more Modules to further filter the job list.
        </li>
      </ul>
    </div>
    <div class="ml-8">
      <h2>Archived Jobs</h2>
      <p>If the <strong>Include Archived</strong> checkbox is checked then the job list will include any and all jobs 
        that have been archived.</p>
      <p>To archive a job, right click on an un-archived job and select "Archive". </p>
      <p>If a job has been previousl archived, you can right click and choose "Un-archive".</p>
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
