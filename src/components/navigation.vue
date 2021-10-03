<template>
  <v-list large>
    <v-list-item to="/generate-types/index" class="version">
      <v-list-item-icon><v-icon name="code" /></v-list-item-icon>
      <v-list-item-content>
        <v-text-overflow class="version" :text="`generate-types ${version}`" />
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list-item
      v-for="language in Object.keys(languages)"
      :key="language"
      :to="`/generate-types/${language}`"
    >
      <v-list-item-icon>
        <div v-html="languages[language].icon" />
      </v-list-item-icon>
      <v-list-item-content>
        <v-text-overflow :text="languages[language].name" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script language="ts">
import languages from "../lib/languages.ts";
import { version } from "../../package.json";

export default {
  data: () => ({
    languages,
    version,
  }),
};
</script>

<style scoped>
svg {
  height: 1em;
  width: 1em;
  fill: rgb(23, 41, 64);
}

.version .v-icon {
  color: var(--foreground-subdued);
  transition: color var(--fast) var(--transition);
}

.version :deep(.v-text-overflow) {
  color: var(--foreground-subdued);
  transition: color var(--fast) var(--transition);
}

.version:hover .v-icon {
  color: var(--foreground-normal-alt);
}

.version:hover :deep(.v-text-overflow) {
  color: var(--foreground-normal-alt);
}
</style>
