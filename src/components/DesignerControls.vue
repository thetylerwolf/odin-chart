<template>
<div>
  <share-link-dialog
      :visible="showShareModal"
      :chartId="chartData.id"
      v-on:hide="() => this.showHideShareModal( false )"
    />
  <el-row>
    <el-col :span="24" class="buttons-container">

      <el-button
        type="info"
        size="small"
        :disabled="submitting"
        @click="cancel"
        icon="el-icon-arrow-left"
      >{{ $t('actions.saveandclose') }}</el-button>

      <div class="right-buttons">
        <el-button
          type="primary"
          size="small"
          :disabled="submitting || !needsSave"
          @click="saveChart"
        >{{ $t('actions.save') }}</el-button>
        <el-button
          type="info"
          size="small"
          :disabled="submitting || !hasBeenSaved"
          @click="copyChart"
        >{{ $t('actions.duplicate') }}</el-button>
        <el-button type="danger"
           size="small"
           :disabled="submitting || !hasBeenSaved"
           @click.native.prevent="() => showShareLinkDialog(chart)"
        >
        {{ $t('actions.share') }}
        </el-button>

        <chart-download />
      </div>

    </el-col>

  </el-row>
</div>
</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex'

import ShareLinkDialog from './ShareLinkDialog'
import ChartDownload from '../components/ChartDownload'
import { createCopy } from '../utils'

export default {
  components: {
    ShareLinkDialog,
    ChartDownload
  },
  computed: {
    ...mapState('chart', [
      'settings',
      'submitting',
      'showShareModal',
      'hasBeenSaved',
      'chartData',
      'needsSave'
    ]),
    ...mapState('chart', {
      chart: 'chartOptions'
    }),
  },
  methods: {
    ...mapActions('chart', [
      'showHideShareModal',
      'clearChart',
      'createChart',
      'updateChart',
      'duplicateChart',
      'setChartSharing'
    ]),
    ...mapActions('data', [
      'clearData'
    ]),
    showShareLinkDialog() {
      this.setChartSharing( true )
      this.updateChart()
        .then(() => {
          this.showHideShareModal( true )
        })
    },
    cancel() {

        this.saveChart().then(() => {
          this.$router.push({ name: 'home' })
          this.clearChart()
          this.clearData()
        })

    },
    saveChart() {

      const chart = createCopy(this.chart);

      if (this.chartData.id) {
        return this.updateChart( chart )
      }

      return this.createChart( chart )

    },
    copyChart() {
      this.duplicateChart()
        .then(result => {
          const routeData = this.$router.resolve({path:`/designer/${result.id}`});
          window.open(routeData.href, '_blank');
        })
    },
    //
    // TODO: Not sure what to do with this (below)
    //
    // makeSvgCopy(id) {
    //   // Invoking render to svg here
    //   if (this.initOptions.renderer != 'svg') {
    //     this.initOptions.renderer = 'svg';
    //   }
    //   saveToserver = true;
    //   serverFileName = id;
    //   // assigning Variables here and rest of the work is being done in
    //   // $watch object in function DoneRendering()
    // },
  }
};
</script>
<style scoped>

.buttons-container {
  display:flex;
}

.right-buttons {
  margin-left:auto
}

</style>
