<template>
  <el-dialog
    :title="$t('labels.feedback')"
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @close="hideDialog"
  >
    <div v-if="submitted">
      <table class="table text-center">
        <tbody>
          <tr>
            <h1>{{ $t('messages.thankYou') }}</h1>
          </tr>
          <tr>
            <h4 style="padding:3% 0px 6% 0px;">{{ $t('messages.feedbackReceived') }}</h4>
          </tr>
          <tr>
            <el-button
              type="primary"
              style="text-transform:uppercase;"
              @click="hideDialog"
            >{{ $t('labels.close') }}</el-button>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>{{ $t('messages.feedbackRequest') }}</p>
      <el-form
        v-on:submit.native.prevent="onSubmit"
        status-icon
        ref="feedbackForm"
        :model="feedback"
        :rules="rules"
      >
        <el-form-item prop="comment" :label="$t('labels.comment')">
          <el-input
            type="textarea"
            v-model="feedback.comment"
            :placeholder="$t('labels.comment')"
            :disabled="submitting"
          />
        </el-form-item>
        <p>{{ $t('messages.feedbackType') }}</p>
        <el-form-item>
          <el-radio-group v-model="feedback.type">
            <el-radio-button label="bugReport">{{$t('labels.bugReport')}}</el-radio-button>
            <el-radio-button label="featureRequest">{{$t('labels.featureRequest')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="submitting"
            :disabled="submitting"
          >{{$t('actions.submit')}}</el-button>
          <el-button type="text" @click="hideDialog" :disabled="submitting">{{$t('actions.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { setTimeout } from 'timers'
import { Feedback } from '../models'
import { createCopy } from '../utils'

export default {
  computed: {
    ...mapState('user', [
      'user'
    ])
  },
  methods: {
    onSuccess() {
      // this.$emit('success');
    },

    onError(err) {
      this.$emit('error', err);
    },

    resetForm() {
      // this.$refs.feedbackForm.resetFields();
    },

    hideDialog() {
      if (this.visible) {
        this.resetForm();
        this.$emit('hide');
      }
    },

    onSubmit() {
      this.$refs.feedbackForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          const { comment, type } = this.feedback;

          return Feedback.create({
            comment,
            type,
            user: {
              name: this.user.name,
              email: this.user.email,
              id: this.user.id,
            },
            location: window.location.pathname,
            state: JSON.stringify(this.$store.state)
          })
            .then(result => createCopy(result))
            .then(() => {
              this.submitted = true;

              if (this.visible) {
                setTimeout(this.onSuccess, 3000);
              }
            })
            .catch(this.onError)
            .then(() => {
              this.submitting = false;
            });
        }

        return false
      });
    },
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      submitting: false,
      submitted: false,

      feedback: {
        comment: '',
        type: 'bugReport'
      },
      rules: {
        comment: [
          {
            required: true,
            message: this.$t('messages.fieldRequired'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
};
</script>
