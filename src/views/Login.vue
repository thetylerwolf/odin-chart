<template>
  <div>

    <el-row type="flex" justify="center" class="text-center">
      <el-col :xs="24" :sm="12" :md="9" :lg="9" :xl="12">
        <img id="login-logo" src="../../static/logo-4x.png" alt="logo">
        <h2 style="margin-top: 8%;">{{ $t('messages.signUpMessage') }}</h2>
        <el-form
          v-on:submit.native.prevent="submitLogin"
          status-icon
          ref="loginForm"
          :model="user"
          :rules="rules"
        >
          <el-form-item prop="email">
            <el-input
              v-model="user.email"
              type="text"
              :disabled="submitting"
              :placeholder="$t('labels.email')"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="user.password"
              type="password"
              :disabled="submitting"
              :placeholder="$t('labels.password')"
            />
            <span class="pull-right">
              <el-button
                type="text"
                @click="() => this.$router.push('/resetpassword')"
              >{{ $t('labels.forgotPassword') }}</el-button>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="submitting"
              :loading="submitting"
              native-type="submit"
              style="width:100%;"
            >{{ $t('labels.signIn') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-alert v-show="getErrorMessage()" :title="getErrorMessage()" type="error" show-icon :closable="false"/>
          </el-form-item>
<!--           <el-form-item>
            <div style="display:flex;">
              <el-button
                class="btn-block"
                :loading="submitting"
                :disabled="submitting"
                @click="handleGoogleSignIn"
              >
                <span class="googleSignInOuter">
                  <img class="google-icon" src="../../static/Google_G_Logo.svg">
                  {{$t('labels.googleSignIn')}}
                </span>
              </el-button>
              <el-button
                class="btn-block"
                :loading="submitting"
                :disabled="submitting"
                @click="handleTwitterSignIn"
              >
                <span class="twitterSignInOuter">
                  <img class="twitter-icon" src="../../static/Twitter_Bird.svg">
                  {{$t('labels.twitterSignIn')}}
                </span>
              </el-button>
            </div>
          </el-form-item> -->
        </el-form>

        <p class="pull-right">
          {{ $t('messages.noAccount') }}
          <el-button
            type="text"
            @click="() => this.$router.push('/signup')"
          >{{ $t('labels.createOne') }}</el-button>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex'

import { emailPolicy, passwordPolicy } from '../utils/validation';

export default {
  computed: {
    submitting() {
      return Boolean( this.getLoginStatus() );
    }
  },
  methods: {
    ...mapActions('user', [
      'login',
      'googleSignin',
      'twitterSignin'
    ]),
    ...mapGetters('user', [
      'getErrorMessage',
      'getLoginStatus'
    ]),
    handleGoogleSignIn() {

      this.googleSignin();

    },

    handleTwitterSignIn() {

      this.twitterSignin();

    },

    submitLogin() {

      this.$refs.loginForm.validate(valid => {
        if (valid) {

          return this.login( this.user )

        }

        return false;

      });
    },

  },

  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      rules: {
        email: emailPolicy,
        password: passwordPolicy,
      },
    };
  },
};
</script>
