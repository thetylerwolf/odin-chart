<template>
  <el-dialog  :visible="visible" :before-close="() => { this.$emit('hide') }">
    <div class="text-center"  style="padding:0 10%">
      <h1>{{ $t('labels.shareChart') }}</h1>
      <div>
      <p>{{ $t('messages.copyShareLink') }}</p>
      <p>{{ $t('messages.anyOneCanViewChart') }}</p>
      <p>
        <el-input size="small" :value="url"/>
      </p>
      <el-button class="btn-block" style="width:80%;" type="primary" @click="copyShareLink">{{$t('labels.copyShareLink')}}</el-button>
      </div>
    </div>
    <div class="text-center"  style="padding:0 10%; margin-top: 30px;">
      <div>
      <p>{{ $t('messages.copyEmbedLink') }}</p>
      <p>
        <el-input size="small" :value="embedLink"/>
      </p>
      <el-button class="btn-block" style="width:80%;" type="primary" @click="copyembedLink">{{$t('labels.copyEmbedLink')}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  computed: {
    url() {
      return `${window.location.origin}/_/${this.chartId}`;
    },
    embedLink(){
      return `<iframe src="${window.location.origin}/_/${this.chartId}" width="98%" height="600" allowfullscreen="allowfullscreen"></iframe>`
    }
  },

  methods: {
    onSuccess() {
      // this.$emit('success');
    },

    copyShareLink() {
      this.$copyText(this.url).then(this.onSuccess);
    },
    copyembedLink() {
      this.$copyText(this.embedLink).then(this.onSuccess);
    },
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    chartId: String || Number,
  },

  data() {
    return {};
  },
};
</script>
