import Vue from 'vue';
import gAuth from 'vue-google-oauth2';
import config from '../config.json';

Vue.use(gAuth, {
  clientId: config.GOOGLE_CLIENT_ID,
  scope: 'profile email',
  prompt: 'select_account',
});

export default gAuth;
