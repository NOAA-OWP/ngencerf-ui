<template>
  <client-only>
    <div id="MultipeJobOps" class="modal-overlay p-4 w-[400px] h-auto bg-[#eee] border border-black rounded-xl">
      <h2>Multiple Job Operations</h2>

      <div class="absolute right-1 top-1 font-bold text-xl pl-1 pr-1" title="Close"
        aria-label="Close"><img alt="Close" class="w-5 cursor-pointer" aria-label="Close"
          src="@/assets/styles/img/xclose.png" @click="sendClose()"></div>
      <hr />
      <div class="mt-3">There {{ props.calJobs.length > 1 ? 'are ' : 'is ' }} {{ props.calJobs.length }} selected job{{
        props.calJobs.length > 1 ? 's' : '' }}: </div>

      <div>
        <span v-for="(item, index) of calJobs">
          {{ item }}{{ index < calJobs.length - 1 && calJobs.length > 2 ? ', ' : '' }} {{ index === calJobs.length - 2 ? ' and ' : '' }} </span>
      </div>

      <div v-if="!showConfirm" id="ButtonsAndMessages">
        <Button class="ngenButtonDiv mt-2" @click="confirmAction('delete')" aria-label="Delete selected jobs"
          title="Delete selected jobs">DELETE selected jobs</Button>

        <Button class="ngenButtonDiv mt-2" @click="confirmAction('archive')" aria-label="Archive selected jobs"
          title="Archive selected jobs" v-if="!hideArchiveBtn">ARCHIVE selected jobs</Button>

        <Button class="ngenButtonDiv mt-2" @click="confirmAction('unarchive')" aria-label="Unarchive selected jobs"
          title="Unarchive selected jobs" v-if="!hideUnarchiveBtn">UNARCHIVE selected jobs</Button>

        <Button class="ngenButtonDiv mt-2" @click="confirmAction('lock')" aria-label="Lock selected jobs"
          title="Lock selected jobs" v-if="!hideLockBtn">LOCK selected jobs</Button>

        <Button class="ngenButtonDiv mt-2" @click="confirmAction('unlock')" aria-label="Unlock selected jobs"
          title="Unlock selected jobs" v-if="!hideUnlockBtn">UNLOCK selected jobs</Button>
      </div>
      <div v-else>
        <div class="font-bold font-lg">Are you sure you want to<br /> {{ actionType }} the selected jobs?</div>
         <Button class="ngenButtonDiv mt-3" @click="actionSelect(true)" :aria-label="actionType + 'selected jobs'"
          :title="actionType + 'selected jobs'">Yes</Button>
        <Button class="ngenButtonDiv mt-3 ml-3" @click="actionSelect(false)" :aria-label="actionType + 'selected jobs'"
          :title="actionType + 'selected jobs'">Cancel</Button>       
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import Button from "primevue/button";

import type { CalibrationJobListItem } from "@/composables/NgencerfModels";

const props = defineProps<{
  calJobs: number[];
  calJobList: CalibrationJobListItem[];
}>();

const showConfirm = ref<boolean>(false);
const actionType = ref<string>()

const emit = defineEmits(["DeleteSelectedJobs", "ArchiveSelectedJobs", "UnarchiveSelectedJobs", "LockSelectedJobs", "UnlockSelectedJobs", "CloseMultJobWindow"]);

/**
 * Returns true if there are no non-archived items or if there is 
 *  a mixed bag of archived and non-archived items
 */
const hideArchiveBtn = computed(() => {
  const runs = props.calJobList;
  if (runs.every(run => run.is_archived === true)) {
    return true
  } else if (runs.every(run => run.is_archived === false)) {
    return false
  } else {
    // There is a mixture of both true and false values.
    return false
  }
})

/**
 * Returns true if there are no archived items or if there is 
 *  a mixed bag of archived and non-archived items
 */
const hideUnarchiveBtn = computed(() => {
  const runs = props.calJobList;
  if (runs.every(run => run.is_archived === false)) {
    return true
  } else if (runs.every(run => run.is_archived === true)) {
    return false
  } else {
    // There is a mixture of both true and false values.
    return false
  }
})

  /**
 * Returns true if there are no unlocked items or if there is 
 *  a mixed bag of locked and unlocked items
 */
const hideLockBtn = computed(() => {
  const runs = props.calJobList;
  if (runs.every(run => run.is_locked === true)) {
    return true
  } else if (runs.every(run => run.is_locked === false)) {
    return false
  } else {
    // There is a mixture of both true and false values.
    return false
  }
})

  /**
 * Returns true if there are no locked items or if there is 
 *  a mixed bag of locked and unlocked items
 */
const hideUnlockBtn = computed(() => {
  const runs = props.calJobList;
  if (runs.every(run => run.is_locked === false)) {
    return true
  } else if (runs.every(run => run.is_locked === true)) {
    return false
  } else {
    // There is a mixture of both true and false values.
    return false
  }
})

const confirmAction = (action: string) => {
  actionType.value = action;
  showConfirm.value = true;
}

const actionSelect = (action: boolean) => {
  if( !action ) {
    sendClose();
  } else {
    if( actionType.value === 'delete') {
      sendDelete();
    }    
    if( actionType.value === 'archive') {
      sendArchive();
    }    
    if( actionType.value === 'unarchive') {
      sendUnarchive();
    }
    if( actionType.value === 'lock') {
      sendLock();
    }    
    if( actionType.value === 'unlock') {
      sendUnlock();
    }
  }
}

/**
 * gLet the caller Apply the dialog
 * @param: MouseEvent
 */
const sendDelete = () => {
    emit("DeleteSelectedJobs");
    sendClose();
};

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendArchive = () => {
    emit("ArchiveSelectedJobs");
    sendClose();
};

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendUnarchive = () => {
    emit("UnarchiveSelectedJobs");
    sendClose();
};

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendLock = () => {
    emit("LockSelectedJobs");
    sendClose();
};

/**
 * Let the caller Apply the dialog
 * @param: MouseEvent
 */
const sendUnlock = () => {
    emit("UnlockSelectedJobs");
    sendClose();
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