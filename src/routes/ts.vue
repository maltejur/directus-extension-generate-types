<template>
  <private-view title="Types for TypeScript">
    <template #navigation><NavbarComponent /></template>
    <template #title-outer:prepend>
      <div v-html="languages['ts'].logo" />
    </template>
    <div class="page">
      <CodeComponent
        :value="types"
        language="typescript"
        downloadName="types.ts"
      />
      <div class="div">
        <p>
          To use these types with the <code>@directus/sdk</code>, include the
          <code>types.ts</code> like this:
        </p>
        <CodeComponent :value="exampleCode" language="typescript" />
      </div>
    </div>
  </private-view>
</template>

<script lang="ts">
import NavbarComponent from "../components/navigation.vue";
import CodeComponent from "../components/code.vue";
import generateTsTypes from "lib/generateTypes/ts";
import languages from "lib/languages";

export default {
  components: { NavbarComponent, CodeComponent },
  inject: ["api"],
  data() {
    return {
      types: "",
      languages,
      exampleCode: `import { Directus } from "@directus/sdk";
import { CustomDirectusTypes } from "./types";

const directus = new Directus<CustomDirectusTypes>("<directus url>");`,
    };
  },
  mounted() {
    generateTsTypes(this.api).then((types) => (this.types = types));
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
