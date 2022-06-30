<template>
  <div>
    <el-row v-if="error">
      <error-viewer :message="error.message"/>
    </el-row>
    <el-row v-else>
      <el-col :sm="24" :md="24" :lg="24">
        <div>
          <table-viewer v-if="type === 'table'" :options="chartOptions"/>
          <v-chart v-else
            style="width: 100%;height:500px"
            :options="chartOptions"
            :autoresize="true"
          />
        </div>
        <div class="text-center">
          <div style="padding:5%;">
            <h2>
              {{ $t('messages.createdWith') }}
              <img
                src="../../static/logo.png"
                style="height:16px;"
                alt="logo"
              >
            </h2>
            <p>
              <a href="/signup" target="_blank">{{ $t('messages.startMakingCharts') }}</a>
            </p>
          </div>
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

import vChart from 'vue-echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/map';
import 'echarts/map/js/world';

import errorViewer from '../components/Error';
import tableViewer from '../components/TableViewer';

export default {
  components: {
    errorViewer,
    tableViewer,
    vChart,
  },
  computed: {
    ...mapState('chart', [
      'chartOptions',
    ]),
  },
  methods: {
    ...mapActions('chart', [
      'loadChart'
    ])
  },
  created() {
    const {
      currentRoute: {
        params: { id },
      }
    } = this.$router;

    if(id) {

      const loading = this.$loading();

      this.loadChart(id)
        .then(() => {
          loading.close()
        })

    }
  },

  data() {
    return {
      error: null,
      type: null,
      options: null,
    };
  },
};
</script>
