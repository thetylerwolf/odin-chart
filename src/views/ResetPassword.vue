<template>
  <div>

    <el-row type="flex" justify="center" class="text-center">
      <el-col :xs="24" :sm="12" :md="9" :lg="6">
        <img id="login-logo" src="../../static/logo-4x.png" alt="logo">
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" class="text-center">
      <el-col :xs="24" :sm="12" :md="9" :lg="6" v-if="!success">
        <h2 style="margin-top: 8%;">{{ $t('messages.forgotPassword') }}</h2>
        <el-form
          v-on:submit.native.prevent="submitReset"
          status-icon
          ref="resetForm"
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

          <el-form-item>
            <el-button
              type="primary"
              :disabled="submitting"
              :loading="submitting"
              native-type="submit"
              style="width:100%;"
            >{{ $t('actions.resetPassword') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn-block"
              native-type="submit"
              :loading="submitting"
              :disabled="submitting"
              @click="alreadyHaveAccount"
            >{{$t('labels.rememberedPassword')}}</el-button>
          </el-form-item>

          <el-form-item>
            <el-alert v-show="getErrorMessage()" :title="getErrorMessage()" type="error" show-icon :closable="false"/>
          </el-form-item>

        </el-form>

        <p class="pull-right">
          {{ $t('messages.noAccount') }}
          <el-button
            type="text"
            @click="() => this.$router.push('/signup')"
          >{{ $t('labels.createOne') }}</el-button>
        </p>
      </el-col>

      <el-col :xs="24" :sm="12" :md="9" :lg="6" v-if="success">
        <p>You will receive a password reset link in your email shortly.</p>
        <p>If you do not see the email, you may have entered the email (<strong>{{ user.email }}</strong>) incorrectly, it went to your junk folder, or the email does not have an account with Odin Chart.</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex'

import { emailPolicy } from '../utils/validation';

export default {
  methods: {
    ...mapActions('user', [
      'resetPassword'
    ]),
    ...mapGetters('user', [
      'getErrorMessage'
    ]),
    alreadyHaveAccount() {
      this.$router.push('/login');
    },
    submitReset() {

      this.$refs.resetForm.validate(valid => {
        if (valid) {

          this.resetPassword( this.user )
            .then(() => { this.success = true })
            // eslint-disable-next-line
            .catch((err) => console.log(err))

        }

        return false;

      });
    },

  },

  data() {
    return {
      user: {
        email: '',
      },
      rules: {
        email: emailPolicy,
      },
      submitting: false,
      success: false,
    };
  },
};
</script>
