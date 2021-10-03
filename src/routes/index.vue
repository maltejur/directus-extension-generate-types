<template>
  <private-view title="Generate Types">
    <template #navigation><NavbarComponent /></template>
    <template #title-outer:prepend>
      <v-button class="header-icon" rounded disabled icon secondary>
        <v-icon name="code" />
      </v-button>
    </template>
    <div class="page">
      <p>
        Welcome to <code>generate-types v{{ version }}</code
        >!
      </p>
      <p>
        Select the language you want to generate types for on the left to start.
      </p>
    </div>
  </private-view>
</template>

<script language="ts">
import NavbarComponent from "../components/navigation.vue";
import { version } from "../../package.json";

export default {
  components: { NavbarComponent },
  data() {
    return {
      version,
    };
  },
};
</script>

<style scoped>
.page {
  padding: 0 var(--content-padding) var(--content-padding-bottom);
}

code {
  background-color: rgba(0, 0, 0, 0.05);
  font-size: 0.9em;
  padding: 3px;
  border-radius: 4px;
}
</style>
