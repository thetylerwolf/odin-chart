<template>

<div>
  <share-link-dialog
      :visible="chartId ? true : false"
      :chartId="chartId"
      v-on:hide="() => { this.chartId = null }"
    />

  <el-table
    :data="getCharts"
    v-show="!getChartsError"
    v-loading="chartsLoading"
    style="padding-top:10px;"
  >
    <el-table-column :label="$t('misc.chartName')">
      <template slot-scope="scope">
        <router-link
          :to="`/designer/${getCharts[scope.$index].objectId}`"
        >{{getCharts[scope.$index].title}}</router-link>
      </template>
    </el-table-column>
    <el-table-column :label="$t('misc.chartType')">
      <template slot-scope="scope">
        <div>{{ $t(getCharts[scope.$index].metadata.type.label) }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="createdAt" :label="$t('misc.dateCreated')"/>
    <el-table-column :label="$t('misc.isShared')">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="() => showShareLinkDialog(getCharts[scope.$index])"
          type="text"
          size="small"
          v-bind:class="{ 'activeLabel': getCharts[scope.$index].shared , 'inactiveLabel': !getCharts[scope.$index].shared }"
          :title="$t('labels.shareLink')"
        >{{ getCharts[scope.$index].shared === true ? $t('labels.sharedLink'): $t('labels.shareLink') }}</el-button>
        <el-checkbox
          @click.native.prevent="toggleShare(scope.$index)"
          :value="getCharts[scope.$index].shared ? true : false"
        />
      </template>
    </el-table-column>
    <el-table-column label="Action">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteChartFromTable(getCharts[scope.$index], scope.$index)"
          type="text"
          size="small"
          :title="$t('actions.delete')"
          icon="el-icon-delete"
        />
      </template>
    </el-table-column>
  </el-table>
</div>

</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'

import { createCopy } from '../utils'
import ShareLinkDialog from '../components/ShareLinkDialog';

export default {
  components: {
    ShareLinkDialog
  },
  data() {
    return {
      chartsLoading: false,
      chartId: null
    }
  },
  computed: {
    ...mapState('user', [
      'chartsError'
    ]),
    ...mapGetters('user', [
      'getCharts',
      'getChartsError'
    ])
  },
  methods: {
    ...mapActions('user', [
      'deleteChart',
      'updateChart',
      'getAllCharts'
    ]),
    ...mapActions('chart', [
      'setSelectedChart'
    ]),
    showShareLinkDialog(chart) {
      this.chartId = chart.objectId;
    },

    toggleShare(index) {

      const selected = this.getCharts[index]
      const shared = !selected.shared;

      this.updateChart({
        chart: createCopy( selected ),
        index,
        keys: { shared }
      })

    },

    deleteChartFromTable(chart, index) {

      const chartCopy = { ...chart }

      this.$confirm(this.$t('messages.deleteChart'), this.$t('messages.warning'), {
        confirmButtonText: this.$t('actions.ok'),
        cancelButtonText: this.$t('actions.cancel'),
        type: 'warning',
      })
        .then(() => {
          const { objectId } = chartCopy
          this.deleteChart({ objectId, index })
        })
        .catch(() => {});
    },

  },
  created() {
    this.getAllCharts()
  }
}

</script>

<style>

.activeLabel {
  color:#409EFF
}

.inactiveLabel {
  color: #afafaf;
  pointer-events: none;
}

</style>
