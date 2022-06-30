<template>

  <el-row class="text-center">
    <el-col
      :xs="12"
      :sm="12"
      :md="8"
      :key="chartType.id"
      v-for="chartType in chartTypes"
    >
      <el-button
        style="margin:10px; padding:12px 20px 0px 20px; width:120px;"
        :icon="`${chartType.icon} el-icon-fa-4x`"
        @click="() => openChartDesigner(chartType)"
      >
        <div style="padding-top:10px;">{{ $t(chartType.label) }}</div>
      </el-button>
    </el-col>
  </el-row>

</template>

<script>
import {
  mapActions,
  mapState
} from 'vuex'

export default {
  computed: {
    ...mapState('chart', [
      'chartTypes'
    ])
  },
  methods: {
    ...mapActions('chart', [
      'updateSelectedChartType'
    ]),
    ...mapActions('data', [
      'generateRandomData'
    ]),
    openChartDesigner(chartType) {
      // console.log(chartType)
      // this.generateRandomData( chartType )
      this.updateSelectedChartType( chartType )
      this.$router.push('/designer');
    }
  }
}

</script>

<style>

</style>
