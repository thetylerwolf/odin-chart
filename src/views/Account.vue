<template>
  <el-row>
    <delete-account-dialog
      :visible="showDeleteAccountDialog"
      :email="user.email"
      v-on:hide="showDeleteAccountDialog = false"
      v-on:error="onError"
      v-on:success="onSuccess"
    />
    <el-col :sm="24" :md="12">
      <span class="title">Account</span>
      <el-form
        v-on:submit.native.prevent="updateInfo"
        status-icon
        ref="updateInfoForm"
        :model="user"
        :rules="rules"
      >
        <el-form-item label="Email / Login" prop="email">
          <el-input v-model="user.email" type="text" :disabled="submitting" placeholder="Email"/>
        </el-form-item>
        <el-form-item label="Full Name" prop="fullName">
          <el-input
            v-model="user.fullName"
            type="text"
            :disabled="submitting"
            placeholder="Full Name"
          />
        </el-form-item>
        <el-form-item v-if="!user.emailVerified">
          <el-alert type="info" :closable="false">
            {{$t('messages.accountUnverified')}}.
            <el-button
              type="text"
              size="small"
              :disabled="emailSent"
              @click="resendEmail"
            >Resend Email</el-button>.
          </el-alert>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="submitting"
            :loading="submitting"
            native-type="submit"
          >Save Changes</el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-on:submit.native.prevent="updatePassword"
        status-icon
        ref="updatePasswordForm"
        :model="user"
        :rules="rules"
      >
        <el-form-item label="Change Password" prop="currPassword">
          <el-input
            v-model="user.currPassword"
            type="password"
            :disabled="submitting"
            placeholder="Old Password"
          />
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            v-model="user.newPassword"
            type="password"
            :disabled="submitting"
            placeholder="New Password"
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="user.confirmPassword"
            type="password"
            :disabled="submitting"
            placeholder="Re-enter New Password"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="submitting"
            :loading="submitting"
            native-type="submit"
          >Change</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="text"
            @click="showDeleteAccountDialog = true"
          >{{$t('labels.deleteAccount')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :sm="24" :md="12" style="padding:7%;">
      <help-menu/>
    </el-col>
  </el-row>
</template>

<script>
import helpMenu from '../components/Help';
import deleteAccountDialog from '../components/DeleteAccountDialog';

import { emailPolicy, fullNamePolicy, passwordPolicy } from '../utils/validation';
import { getCurrentUser, updateUser, changePassword, resendEmail } from '../utils/authentication';

export default {
  components: {
    helpMenu,
    deleteAccountDialog,
  },

  methods: {
    onSuccess() {

    },

    onError(err) {
      if (err) this.$emit('error', err);
    },

    updateInfo() {
      this.$refs.updateInfoForm.validate(valid => {
        if (valid) {
          this.submitting = true;

          this.$ga.event({
            eventCategory: 'account',
            eventAction: 'updateInfo',
            eventLabel: 'username_email',
            eventValue: 1
          })

          return updateUser(this.user.fullName, this.user.email)
            .then(() => this.$emit('success', 'Changes successfully saved'))
            .catch(err => this.$emit('error', err))
            .then(() => {
              this.submitting = false
            });
        }

        return false;

      });
    },

    updatePassword() {
      this.$refs.updatePasswordForm.validate(valid => {
        if (valid) {
          this.submitting = true;

          this.$ga.event({
            eventCategory: 'account',
            eventAction: 'updateInfo',
            eventLabel: 'password',
            eventValue: 1
          })

          return changePassword(this.user.email, this.user.currPassword, this.user.newPassword)
            .then(() => {
              this.user.currPassword = ''
              this.user.newPassword = ''
              this.user.confirmPassword = ''
              this.$emit('success', 'Password has been successfully updated');
            })
            .catch(err => this.$emit('error', err))
            .then(() => {
              this.submitting = false
            })
        }

        return false;

      });
    },

    resendEmail() {
      this.emailSent = true;
      resendEmail();
    },
  },

  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.user.newPassword) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };

    return {
      submitting: false,
      emailSent: false,
      showDeleteAccountDialog: false,

      user: {
        email: '',
        fullName: '',
        currPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailVerified: true,
      },
      rules: {
        email: emailPolicy,
        fullName: fullNamePolicy,
        currPassword: passwordPolicy,
        newPassword: passwordPolicy,
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

  created() {
    getCurrentUser(true, false).then(user => {
      if (user) {
        this.user.email = user.email;
        this.user.fullName = user.fullName;
        this.user.emailVerified = user.emailVerified;
      }
    });
  },
};
</script>
