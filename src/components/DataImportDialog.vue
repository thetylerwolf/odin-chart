<template>
  <el-dialog
    :title="$t('misc.dataImport')"
    :visible="visible"
    :before-close="() => { this.$emit('hide') }"
  >
    <table class="table text-center">
      <tr>
        <td>
          <el-upload
            drag
            ref="upload"
            accept=".xls, .xlsx, .csv"
            :action="`${this.API_URL}/data`"
            :disabled="loading"
            :on-success="handleSuccess"
            :on-error="handleError"
            :http-request="upload"
          >
            <i class="el-icon-upload"></i>
            <div>{{$t('messages.uploadMessage')}}</div>
            <div slot="tip">{{$t('messages.uploadInstruction')}}</div>
          </el-upload>
        </td>
      </tr>
      <tr>
        <td>
          {{ $t('labels.importFrom') }}
          <el-button
            type="text"
            :disabled="loading"
            @click="showCodeTextbox = !showCodeTextbox"
          >Google Sheet</el-button>or
          <el-button
            type="text"
            class="margin0"
            :disabled="loading"
            @click="showCodeTextboxURL = !showCodeTextboxURL"
          >URL</el-button>
        </td>
      </tr>
      <tr v-show="showCodeTextbox">
        <td>
          <el-form inline>
            <el-form-item>
              <el-input
                v-model="code"
                :disabled="loading"
                :placeholder="$t('labels.googleSheetCode')"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                :disabled="loading || !code"
                @click="() => importData(`https://docs.google.com/spreadsheets/d/e/${code}/pub?output=csv`, 'google_sheet')"
              >{{ $t('labels.import') }}</el-button>
            </el-form-item>
          </el-form>
        </td>
      </tr>
      <tr v-show="showCodeTextboxURL">
        <td>
          <el-form inline>
            <el-form-item>
              <el-input
                v-model="urlCode"
                :disabled="loading"
                :placeholder="$t('labels.UrlCode')"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                :disabled="loading || !urlCode"
                @click="() => importDataURL(urlCode,'url')"
              >{{ $t('labels.import') }}</el-button>
            </el-form-item>
          </el-form>
        </td>
      </tr>
    </table>
  </el-dialog>
</template>

<script>
export default {
  methods: {
    importData(url, src) {
      if (url) {
        this.loading = true;
        fetch(`${this.API_URL}/data?${src && `src=${src}&`}url=${url}`)
          .then(this.handleSuccess)
          .catch(this.handleError)
          .then(() => {
            this.loading = false;
          });
      }
    },

    importDataURL(url, src) {
      if (url) {
        this.loading = true;
        fetch(`${this.API_URL}/data?${src && `src=${src}&`}url=${url}`)
          .then(this.handleSuccess)
          .catch(this.handleError)
          .then(() => {
            this.loading = false;
          });
      }
    },

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

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    default:{}
  },
  created(){
    this.API_URL=process.env.API_URL;
  },
  data() {
    return {
      loading: false,
      showCodeTextbox: false,
      showCodeTextboxURL: false,
      code: null,
      urlCode: null,
      API_URL:'',
    };
  },
};
</script>
