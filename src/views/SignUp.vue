<template>
  <el-row type="flex" justify="center">
    <el-col :xs="24" :sm="12" :md="9" :lg="9" :xl="12">
      <div v-if="confirmationBox" class="text-center box">
        <img id="login-logo" src="../../static/logo-4x.png" style="padding-bottom:5%;" alt="logo">
        <h1 class="text-center">{{$t('messages.signUpSuccessMessage')}}</h1>
        <p class="text-center">{{$t('messages.confirmationLogin')}}</p>
        <el-button size="medium" @click="continueToHome">{{$t('labels.continue')}}</el-button>
      </div>
      <div v-else>
        <div class="text-center">
          <img id="login-logo" src="../../static/logo-4x.png" style="padding-bottom:5%;" alt="logo">
        </div>
        <h2 class="text-center">{{$t('labels.signUpStatement')}}</h2>
        <el-form
          v-on:submit.native.prevent="onSubmit"
          status-icon
          ref="signupForm"
          :model="user"
          :rules="rules"
        >
          <el-form-item prop="fullName">
            <el-input
              v-model="user.fullName"
              :placeholder="$t('labels.fullName')"
              :disabled="submitting"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="user.email"
              :placeholder="$t('labels.email')"
              :disabled="submitting"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="user.password"
              :placeholder="$t('labels.password')"
              :disabled="submitting"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              type="password"
              v-model="user.confirmPassword"
              :placeholder="$t('labels.confirmPassword')"
              :disabled="submitting"
            />
          </el-form-item>
          <el-form-item prop="terms">
            <el-checkbox v-model="user.terms" :disabled="submitting" :required="true">
              {{$t('labels.termsStatement')}}
              <a name="terms" target ="_blank" href="https://app.odinchart.com/tos.html">{{$t('labels.terms')}}</a>
            </el-checkbox>
          </el-form-item>
          <el-form-item v-if="message">
            <el-alert :title="message" type="warning" :closable="false" show-icon/>
          </el-form-item>

          <el-alert v-show="getErrorMessage()" :title="getErrorMessage()" type="error" show-icon :closable="false"/>

          <el-form-item>
            <el-button
              class="btn-block"
              type="primary"
              native-type="submit"
              :loading="submitting"
              :disabled="submitting"
            >{{$t('actions.create')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn-block"
              native-type="submit"
              :loading="submitting"
              :disabled="submitting"
              @click="alreadyHaveAccount"
            >{{$t('labels.alreadyHaveAccount')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex'

import { emailPolicy, passwordPolicy, fullNamePolicy } from '../utils/validation';

export default {
  computed: {
    submitting() {
      return Boolean( this.getLoginStatus() );
    }
  },
  methods: {
    ...mapActions('user', [
      'signup'
    ]),
    ...mapGetters('user', [
      'getErrorMessage',
      'getLoginStatus'
    ]),
    onSuccess() {

      this.confirmationBox = true;

      setTimeout(this.continueToHome, 20000);
    },

    alreadyHaveAccount() {
      this.$router.push('/login');
    },

    onError(err) {
      this.message = err.message;
    },

    continueToHome() {
      this.$router.push('/');
    },

    onSubmit() {
      this.$refs.signupForm.validate(valid => {
        if (valid) {

          return this.signup({
            ...this.user
          })

        }

        return false;

      });
    },
  },

  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.user.password) {
        callback(new Error(this.$t('messages.passwordsNotMatch')));
      } else {
        callback();
      }
    };

    const validateTerms = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('messages.termsRequired')));
      } else {
        callback();
      }
    };

    return {
      message: null,
      confirmationBox: false,

      user: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      },
      rules: {
        fullName: fullNamePolicy,
        email: emailPolicy,
        password: passwordPolicy,
        terms: [
          {
            required: true,
            message: this.$t('messages.termsRequired'),
            validator: validateTerms,
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          ...passwordPolicy,
          {
            validator: validateConfirmPassword,
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
</script>
