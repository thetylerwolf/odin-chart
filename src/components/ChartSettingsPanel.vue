<template>

<div class="settings-panel">

<el-row class="setting-panel-row">
  <div 
    v-for="(section, index) in selectedChart.basic"
    :key="`basic_setting_${ index }`"
  >
    <chart-option
      v-for="(setting, index) in section.settings"
      :key="`base_setting_${ index }`"
      :setting="setting"
      :onChange="handleMetadataChange"
    />
  </div>
</el-row>
<el-row class="setting-panel-row">
  <el-collapse v-model="activeSections">

    <settings-section
      :settings-section="selectedChart.composition"
      :section-title="$t('settingsSections.composition')"
      index="0"
      :onChange="handleMetadataChange"
    />

    <settings-section
      :settings-section="selectedChart.chartStyle"
      :section-title="$t('settingsSections.chartStyle')"
      index="1"
      :onChange="handleMetadataChange"
    />

    <el-collapse-item
      v-if="colorPalettes.length"
      :title="$t('misc.palette')"
      name="2"
    >
      <color-palette-manager
        :selectable="true"
        :on-select="() => {}"
      />
    </el-collapse-item>

    <settings-section
      :settings-section="selectedChart.titles"
      :section-title="$t('settingsSections.titles')"
      index="3"
      :onChange="handleMetadataChange"
    />

    <settings-section
      :settings-section="selectedChart.legend"
      :section-title="$t('settingsSections.legend')"
      index="4"
      :onChange="handleMetadataChange"
    />

    <settings-section
      :settings-section="selectedChart.axis"
      :section-title="$t('settingsSections.axis')"
      index="5"
      :onChange="handleMetadataChange"
    />

    <settings-section
      :settings-section="selectedChart.annotations"
      :section-title="$t('settingsSections.annotations')"
      index="6"
      :onChange="handleMetadataChange"
    />

    <settings-section
      :settings-section="selectedChart.popover"
      :section-title="$t('settingsSections.popover')"
      index="7"
      :onChange="handleMetadataChange"
    />

  </el-collapse>
</el-row>
</div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'

import { createCopy } from '../utils'
import SettingsSection from './SettingsSection'
import ChartOption from './ChartOption'
import ColorPaletteManager from './ColorPaletteManager'

export default {
  components: {
    ChartOption,
    ColorPaletteManager,
    SettingsSection,
  },
  props: ['settings'],
  data() {
    return {
      activeSections: ['0','1'],
      componentKey: 0
    }
  },
  computed: {
    ...mapState('chart', [
      'chartTypes',
      'selectedChart',
    ]),
    ...mapState('user', [
      'colorPalettes'
    ])
  },
  methods: {
    ...mapActions('chart', [
      'updateSelectedChartType',
      'updateChartSettings',
    ]),
    // settingValue(setting) {
    //   if(setting.value !== undefined) {
    //     return setting.value
    //   }

    //   return setting.default
    // },

    handleMetadataChange(val, key, setting) {
      // TODO: make it so this doesn't happen here
      // eslint-disable-next-line
      setting.value = val

      this.updateChartSettings({ [key]: val })

      if( setting.name === 'selectedChart') {
        this.onSelectedChartChange(val)
      }
    },
    onSelectedChartChange(name) {
      const chartType = this.chartTypes.find(t => t.name === name)

      const selectedType = createCopy( chartType )

      this.updateSelectedChartType( selectedType )
    },
  },
}

</script>

<style>

.el-collapse-item__wrap {
  background-color:transparent !important;
}

.el-collapse-item__header {
  background-color: #d8d8d8;
  padding: 0 10px;
  font-weight:bold;
  height:33px;
}

.settings-panel {
  background-color:#fafafa;
  border: none;
  padding:10px;
  height:calc(90vh - 110px);
  overflow-y:scroll;
}

.setting-panel-row {
  padding: 0;
}

.el-dropdown {
  vertical-align: top;
}

.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

</style>