<template>
  <div style="padding:2%;">
    <el-alert type="error" :title="message" show-icon :closable="false"/>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'There was an error while processing your request',
    },
  },
};
</script>
