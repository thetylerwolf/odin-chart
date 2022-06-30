<template>
    <el-collapse-item
      :title="sectionTitle"
      :name="index"
      v-if="settingsSection.length"
      class="setting-section-header"
    >
      <el-row 
        v-for="(section, index) in settingsSection"
        :key="`setting_section_${ index }`"
        class="setting-section-row"
      >
        <div 
            v-if="section.title"
            class="setting-section-title"
            >{{ $t(section.title) }}</div>
        <chart-option
          v-for="(setting, index) in section.settings"
          :setting="setting"
          :value="setting.value || setting.default"
          :onChange="onChange"
          :key="`setting_section_${ index }`"
        />
      </el-row>
    </el-collapse-item>
</template>

<script>
import ChartOption from './ChartOption'

export default {
  components: {
    ChartOption,
  },
  data() {
    return {
      debounce: null,
    }
  },
  props: {
    settingsSection: {
        type: Array,
        default: () => []
    },

    sectionTitle: {
        type: String,
        default: ''
    },

    onChange: {
      type: Function,
      default: () => ({}),
    },

    index: {
        type: String,
        default: "0"
    },
  },
};
</script>
<style scoped lang="scss">
  .setting-section-row {
    padding: 0;
  }

  .setting-section-title {
    font-size: 0.8em;
    font-weight: bold;
    opacity: 0.8;
    margin: 0.7em 0 0.5em;
  }

  // .setting-section-header {
  //   .el-collapse-item__header {
  //     font-weight: normal;
  //   }
  // }
</style>
