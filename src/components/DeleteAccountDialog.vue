<template>
  <el-dialog :visible="visible" @close="() => { this.$emit('hide') }">
    <div class="text-center">
      <h2>{{$t('messages.confirmDeleteAccount')}}</h2>
      <p v-html="$t('messages.deleteWarning')"/>
      <p>{{ $t('messages.passwordForDelete') }}</p>
      <p>
        <el-input type="password" v-model="password" :placeholder="$t('labels.password')"/>
      </p>
      <p>
        <el-button
          type="danger"
          :disabled="!password"
          @click="deleteAccount"
          style="width:50%;"
        >{{$t('actions.delete')}}</el-button>
      </p>
    </div>
  </el-dialog>
</template>

<script>
import { logIn, deleteUser } from '../utils/authentication';

export default {
  methods: {
    onSuccess() {
      // this.$emit('success', message);
    },

    onError(err) {
      this.$emit('error', err);
    },

    deleteAccount() {
      logIn(this.email, this.password)
        .then(({ id }) =>
          deleteUser(id).then(() => {
            this.$ga.event({
              eventCategory: 'account',
              eventAction: 'delete',
              eventLabel: 'delete',
              eventValue: 1
            })
            window.location.reload();
          }),
        )
        .catch(this.onError);
    },
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      password: '',
    };
  },
};
</script>