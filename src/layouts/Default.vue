<template>
  <el-container>
    <el-main>
      <slot/>
    </el-main>
    <el-footer>
      <footer-bar/>
    </el-footer>
  </el-container>
</template>

<script>
import footerBar from '../components/Footer';

export default {
  components: {
    footerBar,
  },
};
</script>
