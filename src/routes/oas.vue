<template>
  <private-view title="OpenAPI Specification">
    <template #navigation><NavbarComponent /></template>
    <template #title-outer:prepend>
      <div v-html="languages['oas'].logo" />
    </template>
    <div class="page">
      <CodeComponent :value="types" language="json" downloadName="oas.json" />
      <p>
        You can use the OpenAPI Specification to automatically generate a
        Documentation for your Directus project with something like
        <a href="https://swagger.io/">Swagger</a>.
      </p>
    </div>
  </private-view>
</template>

<script lang="ts">
import NavbarComponent from "../components/navigation.vue";
import CodeComponent from "../components/code.vue";
import generateOasTypes from "../lib/generateTypes/oas";
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
    generateOasTypes(this.api).then((types) => (this.types = types));
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

p {
  max-width: 600px;
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
