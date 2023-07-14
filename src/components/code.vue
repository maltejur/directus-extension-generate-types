<template>
  <div class="code">
    <i>
      {{ downloadName }}
      <v-progress-circular
        indeterminate
        v-if="loading && rendered"
        class="inline-progress"
      />
    </i>

    <div class="generate-types-textarea">
      <pre v-html="rendered" v-if="rendered" />
      <v-progress-circular indeterminate v-else />
    </div>

    <div class="buttonRow">
      <v-button class="copyBtn" v-if="isCopySupported" @click="copyValue">
        <v-icon
          name="content_copy"
          style="margin-right: 8px"
          :disabled="!types"
        />
        {{ t("copy") }}
      </v-button>

      <v-button
        class="downloadBtn"
        v-on:click="downloadTypes"
        v-if="this.downloadName"
      >
        <v-icon
          name="cloud_download"
          style="margin-right: 8px"
          :disabled="!types"
        />
        {{ t("download") }}
      </v-button>
    </div>
  </div>
</template>

<script lang="ts">
import Prism from "prismjs";
import download from "lib/download";
import { useStores } from "@directus/extensions-sdk";
import { useClipboard } from "utils/use-clipboard";
import { useI18n } from "vue-i18n";

export default {
  props: {
    value: String,
    language: String,
    downloadName: String,
    loading: Boolean,
  },
  computed: {
    rendered() {
      return Prism.highlight(
        this.value,
        Prism.languages[this.language],
        this.language
      );
    },
  },
  methods: {
    downloadTypes() {
      download(this.value, this.downloadName, "application/json");
    },
  },
  setup(props) {
    const { useNotificationsStore } = useStores();
    const notificationStore = useNotificationsStore();
    const { t } = useI18n();
    const { isCopySupported, copyToClipboard } = useClipboard();

    async function copyValue() {
      await copyToClipboard(props.value, notificationStore);
    }

    return { isCopySupported, copyValue, t };
  },
};
</script>

<style scoped>
.code {
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 100%;
  margin-top: 10px;
  margin-bottom: 25px;
  margin-right: 25px;
}

.generate-types-textarea {
  position: relative;
  width: 100%;
  height: auto;
  max-height: 65vh;
  padding: 15px;
  overflow: auto;
  background-color: var(--background-input);
  border: var(--border-width) solid var(--border-normal);
  border-radius: var(--border-radius);
  transition: border-color var(--fast) var(--transition);
}
.generate-types-textarea:hover:not(.disabled) {
  border-color: var(--border-normal-alt);
}
.generate-types-textarea:focus:not(.disabled),
.generate-types-textarea:focus-within:not(.disabled) {
  border-color: var(--primary);
}

.buttonRow {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 15px;
}

.buttonRow > div {
  margin-left: 15px;
}

.inline-progress {
  --v-progress-circular-size: 1em;
  display: inline;
  /* vertical-align: sub; */
  margin: 0 5px;
}
</style>

<style>
.generate-types-textarea,
.generate-types-textarea * {
  user-select: text;
}
</style>
