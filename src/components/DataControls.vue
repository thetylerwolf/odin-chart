<template>
<div>

    <view-data-dialog
      :visible="showDataViewModal"
      :data="chartData"
      @TableUpdated="updateDataTable"
      v-on:hide="showHideDataViewModal( false )"
    />

    <div class="buttons-container">
  <!--
    <table class="table text-center">
      <tbody style="display:block; max-width:21vw; overflow-x:scroll;">
        <tr
          :key="`data_item_${i}`"
          v-for="(item, i) in chart.data.filter((v, index) => index < 10)"
        >
          <td
             v-bind:class="{ 'class-bold': j==0 }"
            :key="`data_item_${i}_${j}`"
            v-for="(subitem, j) in item"
          >{{subitem}}</td>
        </tr>
      </tbody>
    </table> -->

    <div v-if="chartData.length>0">
      <el-button
        type="info"
        size="small"
        @click="showHideDataViewModal( true )"
      >{{$t('labels.viewData')}}</el-button>
    </div>
  </div>

</div>
</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex'

import ViewDataDialog from '../components/ViewDataDialog';

export default {
  components: {
    ViewDataDialog,
  },
  computed: {
    ...mapState('chart', {
      chart: 'selectedChart',
      submitting: 'submitting',
      showDataImportModal: 'showDataImportModal',
      showDataViewModal: 'showDataViewModal',
      showRandomDataSettingsModal: 'showRandomDataSettingsModal'
    }),
    ...mapState('data', [
      'chartData'
    ]),
  },
  methods: {
    ...mapActions('chart', [
      'showHideDataViewModal',
      'notifyDataUpdate'
    ]),
    ...mapActions('data', [
      'updateData',
      'generateRandomData'
    ]),

    updateDataTable(data) {
      this.updateData( data )
      this.notifyDataUpdate()
    },
  },
  created() {
    if(!this.chartData.length) {
      this.generateRandomData( this.chart )
      this.notifyDataUpdate()
    }
  }
}
</script>

<style scoped>
.buttons-container {
  display:flex;
}
</style>
