<template>
<div>
  <el-menu
    id="menu"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <el-menu-item index="home">
      <img id="menu-logo" src="../../static/logo-white.png" alt="ODIN">
    </el-menu-item>
    <span v-if="getLoginStatus === true">
      <el-menu-item index="logout" style="float:right;">{{$t('header.logOut')}}</el-menu-item>
      <el-menu-item index="account" style="float:right;">{{$t('header.account')}}</el-menu-item>
      <el-menu-item index="plugins" style="float:right;">{{$t('header.plugins')}}</el-menu-item>
      <el-menu-item index="home" style="float:right;">{{$t('header.home')}}</el-menu-item>
    </span>
  </el-menu>

  <feedback-dialog
    :visible="showFeedbackDialog"
    v-on:hide="() => { this.showFeedbackDialog = false }"
    v-on:success="handleFeedbackSuccess"
    v-on:error="(err) => this.$emit('error', err)"
  />

  <el-button
    v-if="getLoginStatus === true"
    class="feedback-button"
    type="danger"
    style="width:100%; text-transform:uppercase;"
    @click="() => { this.showFeedbackDialog = true; }"
  >{{$t('labels.feedback')}}</el-button>

</div>

</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex'

import feedbackDialog from '../components/FeedbackDialog';

export default {
  components: {
    feedbackDialog
  },
  watch: {
    $route() {
      this.publicRoute = this.$route.meta.publicRoute;
    },
  },
  computed: {
    ...mapGetters('user', [
      'getLoginStatus'
    ]),
  },
  methods: {
    ...mapActions('user', [
      'logout'
    ]),
    home() {
      this.$router.push('/');
    },
    handleSelect(route) {
      if (route === 'logout') {
        this.logout()
      } else if (route !== '') {
        this.$router.push(`/${route}`);
      }
    },
    handleFeedbackSuccess() {
      this.showFeedbackDialog = false;
    },
  },
  data() {
    return {
      publicRoute: this.$route.meta.publicRoute,
      showFeedbackDialog: false
    };
  }
};
</script>

<style>
  .feedback-button {
    position:fixed;
    bottom:30px;
    right:30px;
    width:130px !important;
    box-shadow: 2px 2px 8px 0 #aaa ;
    z-index:1000000;
    transition: transform 0.5s, box-shadow 0.5s;
  }

  .feedback-button:hover {
    transform: translateY(-3px);
    box-shadow: 2px 5px 12px 0 #ccc;
    background-color: #F56C6C;
    border-color: #F56C6C;
  }
</style>
