<template>
  <el-dialog
    :title="$t('labels.viewData')"
    :visible="visible"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    width="100%"
    top="40vh"
    @close="hideDialog"
    custom-class="view-data-container"
  >

<!--     <data-import-dialog
      :visible="showDataImportModal"
      v-on:hide="showHideDataImportModal( false )"
      v-on:success="handleDataImportSuccess"
      v-on:error="onError"
    /> -->
    <!-- <random-data-settings-dialog
      :visible="showRandomDataSettingsModal"
      :chartType="chart && chart.type && chart.type.key"
      :chartSubType ="chart.mod"
      v-on:success="handleRandomDataSettingsUpdate"
      v-on:hide="showHideRandomDataSettingsModal( false )"
    /> -->

    <el-row>
      <el-col :sm="24" class="data-settings">
        <data-import-button
          v-on:success="handleDataImportSuccess"
          v-on:error="onError"
        />
        <!-- <el-button
          type="info"
          size="small"
          icon="el-icon-upload"
          :disabled="submitting"
          @click="showHideDataImportModal( true )"
        >{{$t('actions.upload')}}</el-button> -->

        <div class="right-side">
          <el-button
            type="info"
            size="small"
            :disabled="submitting"
            @click="onRandomDataPress"
          >{{$t('misc.generateRandom')}}</el-button>

          <random-data-settings :on-change="onRandomDataSettingChange"/>
        </div>
      </el-col>
    </el-row>

    <el-row class="table-container">
      <data-table
        :raw-data="rawData"
        @TableUpdated="saveData"
      />
    </el-row>

  </el-dialog>
</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex'

import DataImportButton from '../components/DataImportButton';
import RandomDataSettings from '../components/RandomDataSettings';
import DataTable from '../components/DataTable';

export default {
  components: {
    DataImportButton,
    RandomDataSettings,
    DataTable,
  },
  computed: {
    ...mapState('chart', {
      chart: 'selectedChart',
      submitting: 'submitting',
      showDataImportModal: 'showDataImportModal',
      showDataViewModal: 'showDataViewModal',
    }),
    ...mapState('data', [
      'rawData'
    ])
  },

  methods: {
    ...mapActions('chart', [
      'showHideDataImportModal',
      'notifyDataUpdate'
    ]),
    ...mapActions('data', [
      'updateData',
      'generateRandomData',
      'updateRandomSettings'
    ]),
    onRandomDataSettingChange(options) {
      this.$ga.event({
        eventCategory: 'randomSettings',
        eventAction: 'change',
        eventLabel: Object.keys(options)[0],
        eventValue: Object.values(options)[0]
      })
      this.updateRandomSettings(options)
    },
    hideDialog() {
      if (this.visible) {
        this.$emit('hide')
      }
    },
    saveData(newData) {
      this.updateData( newData )
      this.notifyDataUpdate()
    },
    updateTable(instance, cell, x, y, value) {
      this.tableData[y][x] = Number(value) || 0
    },
    onRandomDataPress() {
      this.generateRandomData( this.chart )
      this.notifyDataUpdate()
    },
    handleDataImportSuccess(data) {
      this.updateData( data )
      this.notifyDataUpdate()
      // this.showHideDataImportModal( false )
    },
    onError(err) {
      // eslint-disable-next-line
      console.error(err)
    },
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      updating: false,
      tableData: [],
      firstRow: [],
      firstColumn: [],
    };
  },
};
</script>
<style lang="scss" scoped>

.data-settings {
  display:flex;

  .right-side {
    margin-left:auto;
    display:flex;
    flex-direction:column;
  }
}

.table-container {
  overflow:scroll;
}

.wrapper-jexcel tr:first-child{
  font-weight: normal !important;
}
</style>


