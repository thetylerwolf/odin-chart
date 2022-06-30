<template>
  <el-popover
    placement="bottom"
    :width="350"
    v-model="visible"
    >
    <el-form label-width="50%" size="small">

<!--       <el-form-item :label="$t('labels.numberType')">
        <el-radio-group v-model="dataType">
          <el-radio-button label="integers">{{$t('labels.integers')}}</el-radio-button>
          <el-radio-button label="decimals">{{$t('labels.decimals')}}</el-radio-button>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item v-if="chartType!=='pie' && chartType!=='map' && chartType!=='table'" :label="$t('labels.numberDist')">
        <el-radio-group v-model="formatType" @change="(value) => this.onChange({ formatType: value })">
          <!-- <el-radio-button label="normallyDist">{{$t('labels.normallyDistributed')}}</el-radio-button> -->
          <el-radio-button label="harmonic">{{$t('labels.harmonic')}}</el-radio-button>
          <el-radio-button label="random">{{$t('labels.random')}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('labels.trend')" v-if="chartType!=='pie' && chartType!=='map' ">
        <el-radio-group v-model="trend" @change="(value) => this.onChange({ trend: value })" :disabled="formatType === 'harmonic'">
          <el-radio-button label="upwards">{{$t('labels.upwards')}}</el-radio-button>
          <el-radio-button label="downwards">{{$t('labels.downwards')}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

<!--       <el-form-item :label="$t('labels.range')" v-if="chartType!=='pie' && chartType!=='map'">
        <el-slider ref="tooltip" v-model="range" range show-input-controls :min="-150" :max="150"></el-slider>
      </el-form-item> -->

      <!-- <div v-if="chartSubType == 'symbols' && chartType =='map'">
      <el-form-item :label="$t('labels.rangeLat')">
        <el-slider ref="tooltip" v-model="rangeLat" range show-input-controls :min="-90" :max="90"></el-slider>
      </el-form-item>
       <el-form-item :label="$t('labels.rangeLng')">
        <el-slider ref="tooltip" v-model="rangeLng" range show-input-controls :min="-180" :max="180"></el-slider>
      </el-form-item>
      </div>-->

      <!-- <el-form-item v-if="chartType!=='pie' && chartType!=='map' && chartType!=='table'">
        <el-checkbox :label="$t('labels.normallyDistributed')" v-model="normallyDist"></el-checkbox>
        <el-checkbox :label="$t('labels.harmonic')" v-model="harmonic"></el-checkbox>
      </el-form-item> -->


      <el-form-item>
        <el-checkbox :label="$t('labels.genRandomLabels')" v-model="genRandomLabels" @change="(value) => this.onChange({ genRandomLabels: value })"></el-checkbox>
      </el-form-item>
    </el-form>
    <el-button
      type="text"
      size="small"
      slot="reference"
    >{{ $t('labels.randomDataSetting') }}</el-button>
  </el-popover>
</template>

<script>
export default {
  props: {
    onChange: {
      type: Function,
      default: () => {},
    },
    chartType: {
      type: String,
      default: null,
    },
    chartSubType: {
      type: String,
      default: null,
    },
  },

  data() {
    const defaultType = {
      trend: 'upwards',
      dataType: 'integers',
      formatType: 'random',
      range: [-90, 90],
      rangeLat: [-90, 90],
      rangeLng: [-180, 180],
      normallyDist: false,
      harmonic: false,
      genRandomLabels: true,
    };
    // if(chartType ==='pie'){
    //   defaultType.trend ='upwards',
    //   defaultType.range = [-90, 90],
    //   defaultType.normallyDist = false,
    //   defaultType.harmonic = false,
    // }
    return {
      trend: defaultType.trend,
      dataType: defaultType.dataType,
      formatType: defaultType.formatType,
      range: defaultType.range,
      rangeLat: defaultType.rangeLat,
      rangeLng: defaultType.rangeLng,
      normallyDist: defaultType.normallyDist,
      harmonic: defaultType.harmonic,
      genRandomLabels: defaultType.genRandomLabels,
      visible: false
    };
  },
};
</script>
<style>
.el-tooltip__popper {
  display: block !important;
}
</style>
