<template>
<div class="upload-container">
  <el-upload
    drag
    class="upload-button"
    ref="upload"
    accept=".xls, .xlsx, .csv"
    :action="`${this.API_URL}/data`"
    :disabled="loading"
    :on-success="handleSuccess"
    :on-error="handleError"
    :http-request="upload"
    slot="reference"
  >
    <div class="upload-button--inner">
      <i class="el-icon-upload"></i>
      <div>{{$t('messages.uploadMessage')}}</div>
    </div>
  </el-upload>
  <div slot="tip">{{$t('messages.uploadInstruction')}}</div>
</div>
</template>

<script>
export default {
  methods: {
    upload(data) {
      const fileTypeCheck = (/\.(csv|xls|xlsx)$/i).test(data.file.name)

      if (!data.file) {
        this.handleError(new Error(this.$t('messages.noFileSelected')));

      }
      else if ( !fileTypeCheck ) {
        this.$refs.upload.clearFiles()
        this.handleError(new Error(this.$t('messages.wrongType')));
      } else {
        const body = new FormData();

        body.append(data.filename || 'file', data.file);

        if (typeof data.headers === 'object') {
          Object.keys(data.headers).forEach(key => {
            body.append(key, data.headers[key]);
          });
        }

        fetch(data.action, {
          method: 'POST',
          body
        })
          .then(data.onSuccess)
          .catch(err => {
            data.onError(err)
          });
      }
    },


    handleSuccess(response) {
      if (response.status === 200) {
        response
          .json()
          .then(result => {
            this.$emit('success', result);
            this.$refs.upload.clearFiles();
          })
          .catch(this.handleError);
      } else {
        this.handleError(new Error(this.$t('messages.resourceNotExists')));
      }
    },

    handleError(err) {
      this.$emit('error', err);
    },
  },
  data() {
    return {
      loading: false,
      API_URL: process.env.API_URL,
    };
  },
};
</script>
<style lang="scss" scoped>
  .upload-button {
    &--inner {
      display:flex;
      line-height:1.5em;
      // height:2em;
      color: #fff;
      i {
        color:#fff;
        font-size:1.5em;
        margin:0 0.5em 0 0;
        line-height:initial;
      }

    }

  }
</style>
<style lang="scss">
  .el-upload-dragger {
    height: auto;
    width: auto;
    padding: 9px 15px;
    border: none;
    background-color: #66b1ff;
  }
</style>
