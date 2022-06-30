<template>
  <span>
    <div v-if="setting.type === 'checkbox'">
      <el-checkbox
        v-model="settingModel"
      >{{ $t(setting.label) }}</el-checkbox>
    </div>

    <div v-else-if="setting.type === 'radio'">
      <el-radio-group
        v-model="settingModel"
        @change="v => onChange(v, setting.name, setting)"
      >
        <el-radio
          v-for="(option, index) in setting.values"
          :key="`${option.name}_${index}`"
          :label="option.name"
        >{{ $t(option.label) }}</el-radio>
      </el-radio-group>
    </div>

    <div v-else-if="setting.type === 'color-picker'">
      <div class="customLabel ">{{ $t(setting.label) }}</div>
        <el-color-picker
          :value="value || setting.default"
          @active-change="v => delayedChange(v, setting.name, setting)"
      />
    </div>

    <div v-else-if="setting.type === 'text'">
      <div class="customLabel">{{ $t(setting.label) }}</div>
        <el-input
          v-model="settingModel"
          :placeholder="$t(setting.placeholder)"
          @input="v => onChange(v, setting.name, setting)"
        />
    </div>

    <div v-else-if="setting.type === 'number'">
      <div class="customLabel">{{ $t(setting.label) }}</div>
        <el-input-number
          :value="Number(value) || Number(value) === 0 ? Number(value) : setting.default"
          :min="setting.range && Number(setting.range[0]) || 0"
          :max="setting.range && Number(setting.range[1]) || 10"
          :label="$t(setting.label)"
          size="mini"
          @change="v => onChange(v, setting.name, setting)"
        />
    </div>

    <div v-else-if="setting.type === 'select'">
      <el-select
        v-model="settingModel"
        :placeholder="$t(setting.placeholder)"
        style="width:100%;"
      >
        <el-option
          v-for="(item, index) in setting.values"
          :key="index"
          :label="$t(item.label)"
          :value="item.name"
        />
      </el-select>
    </div>

  </span>
</template>

<script>
export default {
  data() {
    return {
      debounce: null,
    }
  },
  props: {
    setting: {
      type: Object,
      default: () => ({}),
    },

    onChange: {
      type: Function,
      default: () => {},
    },

    value: {
      // eslint-disable-next-line
      type: Boolean | Number | String,
    },
  },
  computed: {
    settingModel: {
      get() {
        return this.setting.value === undefined ? this.setting.default : this.setting.value
      },
      set( newValue ) {
        this.onChange(newValue, this.setting.name, this.setting)
      }
    },
    textModel: {
      get() {
        return this.setting.value === undefined ? this.setting.default : this.setting.value
      },
      set( newValue ) {
        this.delayedChange(newValue, this.setting.name, this.setting)
      }
    },
  },
  methods: {
    getItemName(item) {
      if(item.name.indexOf(' ') === -1) {
        return this.$t(item.name)
      }

      return item.name
    },
    delayedChange(v, key, setting) {
      if(this.debounce) {
        clearTimeout( this.debounce )
      }
      this.debounce = setTimeout(() => {
        this.onChange(v, key, setting)
        this.debounce = null
      },10)
    },
  },
};
</script>