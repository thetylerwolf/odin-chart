<template>

<el-dropdown
  :disabled="submitting || !chartData.length"
  trigger="click"
  class="download-dropdown"
>
  <el-button type="info" size="small"
    :disabled="submitting || !chartData.length">
    {{$t('misc.downloadButton')}}
    <i class="el-icon-arrow-down el-icon--right"></i>
  </el-button>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item
      :disabled="submitting || !chartData.length"
      icon="el-icon-download"
    >
      <span @click="downloadPNG()">{{$t('misc.downloadPNG')}}</span>
    </el-dropdown-item>
    <el-dropdown-item
      v-if ="selectedChart.type.key !== 'table'"
      :disabled="submitting || !chartData.length"
      icon="el-icon-download"
    >
      <span @click="downloadSvg()">{{$t('misc.downloadSVG')}}</span>
    </el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>

</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex'

import domtoimage from 'dom-to-image';

export default {
  computed: {
    ...mapState('chart', {
      chart: 'chartOptions',
      submitting: 'submitting',
      chartRenderer: 'chartRenderer'
    }),
    ...mapState('chart', [
      'selectedChart'
    ]),
    ...mapState('data', [
      'chartData'
    ])
  },
  methods: {
    ...mapActions('chart', [
      'setChartRenderer'
    ]),
    ...mapActions('chart', [
      'setSaveLocally'
    ]),
    downloadSvg() {
      if (this.selectedChart.type.key === 'table') {
        domtoimage
          .toSvg(document.getElementById('tableCharts'), { filter: this.filter })
          .then((responseUrl) => {
            const dataUrl = responseUrl.replace('data:image/svg+xml;charset=utf-8,', '');

            const img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
            const a = document.createElement('a');
            a.style = 'display: none';
            a.href = dataUrl;
            a.download = `${this.chart.title.text}.svg`;
            document.body.appendChild(a);
            a.click();
          });
      } else {
        // Invoking render to svg here
        if (this.chartRenderer !== 'svg') {
          this.setChartRenderer( 'svg' )
        }
        this.setSaveLocally( true )
        // assigning Variables here and rest of the work is being done in
        // $watch object in function DoneRendering()
      }
    },
    downloadPNG() {
      if (this.selectedChart.type.key === 'table') {
        const node = document.getElementById('tableCharts');
        domtoimage
          .toPng(node)
          .then((dataUrl) => {
            const a = document.createElement('a');
            a.style = 'display: none';
            a.href = dataUrl;
            a.download = `${this.chart.title.text}.png`;
            document.body.appendChild(a);
            a.click();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.error('oops, something went wrong!', error);
          });
      } else {
        if (this.chartRenderer !== 'canvas') {
          this.setChartRenderer( 'canvas' );
        }
        setTimeout(() => {
          const canvas = document.querySelector('canvas');
          const blob = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.style = 'display: none';
          a.href = blob;

          a.download = `${this.chart.title.text}.png`;
          document.body.appendChild(a);
          a.click();
        }, 1000);
      }
    },
  },
}

</script>
<style scoped>
.download-dropdown {
  margin-left:10px;
}
</style>
