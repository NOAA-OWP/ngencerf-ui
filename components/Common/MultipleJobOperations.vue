<template>
  <client-only>
    <div id="MultipeJobOps" class="modal-overlay p-4">
      <h2>Multiple Job Operations</h2>
      <div class="absolute right-1 top-1 font-bold text-xl border border-solid border-black pl-1 pr-1" title="Close"
        aria-label="Close"><img alt="Close" class="w-5 cursor-pointer" aria-label="Close"
          src="@/assets/styles/img/xclose.png" @click="sendClose()"></div>
      <hr />
      <div class="mt-3">There {{ props.calJobs.length > 1 ? 'are ' : 'is ' }} {{ props.calJobs.length }} selected job{{
        props.calJobs.length > 1 ? 's' : '' }}: </div>

      <div>
        <span v-for="(item, index) of calJobs">
          {{ item }}{{ index < calJobs.length - 1 ? ', ' : '' }} {{ index===calJobs.length - 2
            ? ' and ' : '' }} </span>
      </div>

      <Button class="ngenButtonDiv mt-3" @click.stop="sendDelete" aria-label="Delete selected jobs"
        title="Delete selected jobs">DELETE selected jobs</Button>

      <Button class="ngenButtonDiv mt-3" @click.stop="sendArchive" aria-label="Archive selected jobs"
        title="Archive selected jobs">ARCHIVE selected jobs</Button>

    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";//NOSONAR
import Button from "primevue/button";

const props = defineProps<{
  calJobs: number[];
}>();

const emit = defineEmits(["DeleteSelectedJobs", "ArchiveSelectedJobs", "CloseMultJobWindow"]);

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
const sendClose = () => {
  emit("CloseMultJobWindow");
};

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#MultipeJobOps {
  width: 400px;
  height: auto;
  background-color: #eee;
  border: 1px solid black;
  border-radius: 10px;
}
</style>