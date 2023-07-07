<template>
  <private-view title="Type Hints for Python">
    <template #navigation><NavbarComponent /></template>
    <template #title-outer:prepend>
      <div v-html="languages['py'].logo" />
    </template>
    <div class="page">
      <CodeComponent :value="types" language="python" downloadName="types.py" />
    </div>
  </private-view>
</template>

<script lang="ts">
import NavbarComponent from "../components/navigation.vue";
import CodeComponent from "../components/code.vue";
import { getCollections } from "../lib/api";
import generatePyTypes from "../../lib/generate-types/py";
import languages from "../lib/languages";

export default {
  components: { NavbarComponent, CodeComponent },
  inject: ["api"],
  data() {
    return {
      types: "",
      languages,
    };
  },
  mounted() {
    generatePyTypes(getCollections(this.api)).then((types) => (this.types = types));
  },
};
</script>

<style scoped>
.page {
  padding: 0 var(--content-padding);
  display: flex;
}

@media (max-width: 1500px) {
  .page {
    flex-direction: column;
  }
}

code {
  background-color: rgba(0, 0, 0, 0.05);
  font-size: 0.9em;
  padding: 3px;
  border-radius: 4px;
}
</style>
