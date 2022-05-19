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
        :loading="loading"
      />
      <div class="div">
        <p>
          To use these types with the <code>@directus/sdk</code>, include the
          <code>types.ts</code> like this:
        </p>
        <CodeComponent :value="exampleCode" language="typescript" />
        <h3 class="type-title">Options</h3>
        <v-checkbox v-model="useIntersectionTypes" @click="generateTypes">
          <span>
            Use Intersection Types (<code>&</code>) instead of Union Types
            (<code>|</code>) for relational fields.
            <a
              href="https://github.com/maltejur/directus-extension-generate-types/pull/3#issuecomment-1037243032"
            >
              Learn more
            </a>
          </span>
        </v-checkbox>
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
      useIntersectionTypes:
        localStorage.getItem(
          "directus-extension-generate-types-use-intersection-types"
        ) === "true",
      loading: false,
    };
  },
  methods: {
    generateTypes() {
      console.log(window.localStorage);
      localStorage.setItem(
        "directus-extension-generate-types-use-intersection-types",
        this.useIntersectionTypes
      );
      generateTsTypes(this.api, this.useIntersectionTypes).then((types) => {
        this.types = types;
        this.loading = false;
      });
    },
  },
  mounted() {
    this.generateTypes();
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

.type-title {
  margin: 10px 0;
}

a {
  color: var(--primary-110);
  font-weight: 500;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
