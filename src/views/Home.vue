<template>
  <div v-loading="loading">
    <!-- <share-link-dialog
      :visible="chartId ? true : false"
      :chartId="chartId"
      v-on:success="() => onSuccess($t('messages.linkCopied'))"
      v-on:hide="() => { this.chartId = null }"
    /> -->
    <el-row>
      <el-col :sm="24">

        <h3 v-html="$t('messages.welcomeBack', {name: user.name })"/>

      </el-col>
    </el-row>

    <el-row>
      <el-col :sm="24" :md="12">
        <h3 class="title">{{$t('misc.createNewChart')}}</h3>
        <chart-select/>

      </el-col>

      <el-col :sm="24" :md="8">

          <h3 class="title">{{$t('misc.savedColorPalettes')}}</h3>
          <color-palette-manager/>

      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :xl="24">
        <h3 class="title">{{$t('misc.savedCharts')}} ({{ charts.length }})</h3>
        <chart-table />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex'

import ColorPaletteManager from '../components/ColorPaletteManager'
import ColorPaletteDialog from '../components/ColorPaletteDialog';
import ChartSelect from '../components/ChartSelect';
import ChartTable from '../components/ChartTable'

export default {
  components: {
    ColorPaletteManager,
    ColorPaletteDialog,
    ChartSelect,
    ChartTable,
  },
  computed: {
    ...mapState('user', [
      'user',
      'charts'
    ])
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapActions('chart', [
      'clearChart'
    ]),
    ...mapActions('data', [
      'clearData'
    ])
  },
  created() {
    this.clearChart()
    this.clearData()
  }

};
</script>

<style>

</style>
