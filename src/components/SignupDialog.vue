<template>
  <el-dialog
    :title="$t('labels.signUpFormTitle')"
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @close="hideDialog"
  >
    <el-form
      v-on:submit.native.prevent="onSubmit"
      status-icon
      ref="signupForm"
      :model="user"
      :rules="rules"
      label-width="25%"
    >
      <el-form-item prop="fullName" :label="$t('labels.fullName')">
        <el-input
          v-model="user.fullName"
          :placeholder="$t('labels.fullName')"
          :disabled="submitting"
        />
      </el-form-item>
      <el-form-item prop="email" :label="$t('labels.email')">
        <el-input v-model="user.email" :placeholder="$t('labels.email')" :disabled="submitting"/>
      </el-form-item>
      <el-form-item prop="password" :label="$t('labels.password')">
        <el-input
          type="password"
          v-model="user.password"
          :placeholder="$t('labels.password')"
          :disabled="submitting"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="submitting"
          :disabled="submitting"
        >{{$t('actions.create')}}</el-button>
        <el-button type="text" @click="hideDialog" :disabled="submitting">{{$t('actions.cancel')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  emailPolicy,
  passwordPolicy,
  fullNamePolicy
} from "../utils/validation";
import { createCopy } from "../utils";
import { createUser } from "../utils/authentication";

export default {
  methods: {
    onSuccess(user) {
      this.$emit("success", user);
    },

    onError(err) {
      this.$emit("error", err);
    },

    resetForm() {
      this.$refs.signupForm.resetFields();
    },

    hideDialog() {
      this.resetForm();
      this.$emit("hide");
    },

    onSubmit() {
      this.$refs.signupForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          const { email, fullName, password } = this.user;

          createUser(email, password, fullName)
            .then(result => createCopy(result))
            .then(this.onSuccess)
            .catch(this.onError)
            .then(() => {
              this.submitting = false;
            });
        } else {
          return false;
        }
      });
    }
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      submitting: false,

      user: {
        fullName: "",
        email: "",
        password: ""
      },
      rules: {
        fullName: fullNamePolicy,
        email: emailPolicy,
        password: passwordPolicy
      }
    };
  }
};
</script>
