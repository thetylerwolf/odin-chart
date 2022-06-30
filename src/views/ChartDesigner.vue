<template>
  <div>
    <designer-controls />

    <el-row>

      <el-col :sm="24" :md="17" :lg="18" :xl="20" class="chart-container">
        <el-row v-loading.fullscreen="loading">

          <el-col :sm="24">
            <data-controls />
          </el-col>

        </el-row>

        <el-row>
          <el-col :sm="24">

            <table-viewer v-if="selectedChart.type.name === 'table'" :options="chartOptions"/>

            <div v-else>
              <v-chart
                style="width: 100%;height:500px"
                :options="chartOptions"
                :init-options="{ renderer: chartRenderer }"
                :autoresize="true"
                ref="vChart"
              />
              <!-- <v-chart v-show="false"
                @finished="DoneRendering"
                :options="chartOptions" :init-options="initOptions"/> -->
            </div>

          </el-col>
        </el-row>
      </el-col>

      <el-col :sm="24" :md="7" :lg="6" :xl="4">
        <chart-settings-panel :settings="settings" />
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
  mapActions
} from 'vuex'

import vChart from 'vue-echarts';
// eslint-disable-next-line
import 'zrender/lib/svg/svg';

// TODO: For selecting different maps
// import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/map';
import 'echarts/map/js/world';
// TODO: For selecting different maps
// import USA from'../assets/maps/USA_geo.json';

import errorContainer from '../components/Error';
import loadingContainer from '../components/Loading';
import tableViewer from '../components/TableViewer';
import ChartSettingsPanel from '../components/ChartSettingsPanel'
import DesignerControls from '../components/DesignerControls'
import DataControls from '../components/DataControls'

// TODO: For selecting different maps
// ECharts.registerMap('USA', USA)

export default {
  components: {
    errorContainer,
    loadingContainer,
    tableViewer,
    vChart,
    ChartSettingsPanel,
    DesignerControls,
    DataControls
  },
  watch: {
    // TODO: Good enough for now, but fix this
    chartData() {
      this.rebuildChart()
    }

  },
  computed: {
    ...mapState('user', [
      'colorPalettes'
    ]),
    ...mapState('chart', [
      'selectedChart',
      'chartRenderer',
      'chartOptions',
      'settings',
      'loading'
    ]),
    ...mapState('data', [
      'chartData'
    ]),
    ...mapState('chart', {
      newChart: 'settings',
      saveLocally: 'saveLocally'
    }),
    ...mapGetters('chart', {
      colorPalette: 'getColorPalette'
    })
  },
  methods: {
    ...mapActions('chart', [
      'loadChart',
      'setChart',
      'setChartRenderer',
      'setSaveLocally',
      'rebuildChart'
    ]),
    onSuccess() {
      // this.$emit('success', message);
    },

    onInfo(message) {
      this.$emit('info', message);
    },

    onError(err) {
      this.$emit('error', err);
    },

    // handleRemoveTag(i, j) {
    //   this.chart = {
    //     ...this.chart,
    //     data: this.chartData.map((v1, i1) =>
    //       i1 === i ? v1.filter((v2, i2) => j !== i2) : v1,
    //     ),
    //   };
    // },

    DoneRendering() {
      // eslint-disable-next-line
      return
      // TODO: Do this intelligently somewhere

      // let saveToserver = false;

      // if (saveToserver === true) {
      //   const blob = this.checkAndMakeSvg('blob');
      //   const body = new FormData();
      //   body.append('file', blob, `${this.chart.title}.svg`);
      //   fetch(`${this.API_URL}/saveSVG`, {
      //     method: 'POST',
      //     body,
      //   })
      //     .then(() => this.$router.push('/'))
      //     .catch();
      //   saveToserver = false;
      // } else if (this.saveLocally === true) {
      //   const blob = this.checkAndMakeSvg('url');
      //   const a = document.createElement('a');
      //   a.style = 'display: none';
      //   a.href = blob;
      //   a.download = `${this.chart.title}.svg`;
      //   document.body.appendChild(a);
      //   a.click();
      //   if (this.chartRenderer === 'svg') {
      //     this.setChartRenderer('canvas')
      //   }
      //   this.setSaveLocally( false )
      // }
    },

    // handleRemoveDataset(i) {
    //   this.$confirm(this.$t('messages.confirmDelete'), this.$t('messages.warning'), {
    //     confirmButtonText: this.$t('actions.ok'),
    //     cancelButtonText: this.$t('actions.cancel'),
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       this.chart = {
    //         ...this.chart,
    //         data: this.chartData.filter((value, index) => index !== i),
    //       };
    //     })
    //     .catch(() => {});
    // },

    drawInlineSVG(svgElement, ctx, callback) {
      const svgURL = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();

      // eslint-disable-next-line
      img.onload = function() {
        ctx.drawImage(this, 0, 0);
        callback();
      };
      img.src = `data:image/svg+xml; charset=utf8, ${  encodeURIComponent(svgURL)}`;
    },

    checkAndMakeSvg(type) {
      // get svg element.
      const svg = document.querySelector('svg');
      // get svg source.
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      // add name spaces.
      // eslint-disable-next-line
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      // if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
      //     source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      // }
      // add xml declaration
      source = `<?xml version="1.0" standalone="no"?>\r\n${  source}`;
      // convert svg source to URI data scheme.
      const url = `data:image/svg+xml;charset=utf-8,${  encodeURIComponent(source)}`;
      // set url value to a element's href attribute.
      if (type === 'url') {
        return url;
      } else if (type === 'blob') {
        const blob = new Blob([source], { type: 'image/svg+xml' });
        return blob;
      }

      return {}
    },
  },
  data() {

    return {
      submitting: false,
      selectedPalette: null,
      randomDataOptions: undefined,
      paletteIndex: 3,
      API_URL: null,
      option: {},

      selectedChartType: null,

      chart: {
        title: 'Untitled Chart',
        info: {
          type: {
            key: '',
            name: '',
          },
        },
        data: [],
        metadata: {
          colors: [],
          showAxisTicks: false,
          showGrid: false,
          showAxisValues: true,
          showPointsOnLine: false,
        },
      },

    };
  },

  created() {
    this.API_URL =  process.env.API_URL;
    const {
      currentRoute: {
        params: { id }
      },
    } = this.$router;

    if(id) {

      this.loadChart(id)

    }
  },
};
</script>

<style>

.el-icon-arrow-down {
  font-size: 12px;
}

.class-bold{
  font-weight: bold;
}

.viewAllButton{
  margin-right: 20px;
  float: right;
}

.chart-container {
  overflow:hidden;
}

</style>
