<template>
  <el-container class="app-container">
    <el-header>
      <header-bar v-on:error="onError"/>
    </el-header>
    <el-main>
      <slot/>
    </el-main>
    <el-footer>
      <footer-bar/>
    </el-footer>
  </el-container>
</template>

<script>
import headerBar from '../components/Header';
import footerBar from '../components/Footer';

export default {
  methods: {
    onError(err) {
      this.$emit('error', err);
    },
  },

  components: {
    headerBar,
    footerBar,
  },
};
</script>
<style>
  .app-container {
    height:100%;
  }
</style>