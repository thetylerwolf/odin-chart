<template>
  <div id="app">
    <component :is="layout" v-on:success="onSuccess" v-on:error="onError" v-on:info="onInfo">
      <router-view v-on:success="onSuccess" v-on:error="onError" v-on:info="onInfo"/>
    </component>
  </div>
</template>

<script>
export default {
  methods: {
    onSuccess(message, title = this.$t("labels.success")) {
      this.$notify({
        title,
        message,
        type: "success"
      });
    },

    onInfo(message, title = this.$t("labels.info")) {
      this.$notify({
        title,
        message,
        type: "info"
      });
    },

    onError(err, title = this.$t("labels.error")) {
      // eslint-disable-next-line
      console.error(err);
      this.$notify({
        title,
        message: err.message,
        type: "error"
      });
    }
  },

  computed: {
    layout() {
      return `${this.$route.meta.layout || "default"}-layout`;
    }
  }
};
</script>
