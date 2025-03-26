<template>
  <client-only>
    <div id="MultipeJobOps" class="modal-overlay p-4 w-[400px] h-auto bg-[#eee] border border-black rounded-xl">
      <h2>Multiple Job Operations</h2>
      <div class="absolute right-1 top-1 font-bold text-xl border border-solid border-black pl-1 pr-1" title="Close"
        aria-label="Close"><img alt="Close" class="w-5 cursor-pointer" aria-label="Close"
          src="@/assets/styles/img/xclose.png" @click="sendClose()"></div>
      <hr />
      <div class="mt-3">There {{ props.calJobs.length > 1 ? 'are ' : 'is ' }} {{ props.calJobs.length }} selected job{{
        props.calJobs.length > 1 ? 's' : '' }}: </div>

      <div>
        <span v-for="(item, index) of calJobs">
          {{ item }}{{ index < calJobs.length - 1 ? ', ' : '' }} {{ index===calJobs.length - 2 ? ' and ' : '' }} </span>
      </div>

      <Button class="ngenButtonDiv mt-3" @click.stop="sendDelete" aria-label="Delete selected jobs"
        title="Delete selected jobs">DELETE selected jobs</Button>

      <Button class="ngenButtonDiv mt-3" @click.stop="sendArchive" aria-label="Archive selected jobs"
        title="Archive selected jobs">ARCHIVE selected jobs</Button>

      <Button class="ngenButtonDiv mt-3" @click.stop="sendUnarchive" aria-label="Unarchive selected jobs"
        title="Unarchive selected jobs" :disabled="disableArchiveBtn">UNARCHIVE selected jobs</Button>

    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";//NOSONAR
import Button from "primevue/button";
import type { CalibrationJobListItem } from "@/composables/NextGenModel";

import { useUserDataStore } from "@/stores/common/UserDataStore"
const { includeArchivedJobs } = storeToRefs(useUserDataStore());

const props = defineProps<{
  calJobs: number[];
  calJobList: CalibrationJobListItem[];
}>();

const emit = defineEmits(["DeleteSelectedJobs", "ArchiveSelectedJobs", "CloseMultJobWindow", 'UnarchiveSelectedJobs']);

/**
 * Returns true if there are no archived items or if there is 
 *  a mixed bag of archived and non-archived items
 */
const disableArchiveBtn = computed(() => { 
  const runs = props.calJobList;
  if (runs.every(run => run.is_archived === false)) {
    return true
  } else if (runs.every(run => run.is_archived === true)) {
    return false
  } else {
    // There is a mixture of both true and false values.
    return true
  }
})

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendDelete = () => {
  emit("DeleteSelectedJobs");
};

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendArchive = () => {
  emit("ArchiveSelectedJobs");
};

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendUnarchive = () => {
  emit("UnarchiveSelectedJobs");
};

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendClose = () => {
  emit("CloseMultJobWindow");
};

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

</style> 