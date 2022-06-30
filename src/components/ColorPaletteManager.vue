<template>

<div>
  <table class="table" v-loading="loading">
    <tbody>
      <tr v-if="getColorPaletteError">
        <td colspan="2">
          <error-container :message="getColorPaletteError"/>
        </td>
      </tr>
      <tr
        :key="colorPalette.id"
        v-show="!loading && !getColorPaletteError"
        v-for="(colorPalette, index) in getColorPalettes.slice(0, paletteIndex)"
      >

        <el-radio
          v-if="selectable"
          v-model="selectedChartPalette"
          :label="colorPalette.objectId"
          class="responsive hideRadio"
          border
        >
          <color-palette-container
            v-on:edit="showDialog"
            v-on:success="onSuccess"
            v-on:error="onError"
            :palette="colorPalette"
            :index="index"
            show-edit
            show-delete
          />
        </el-radio>

        <td v-if="!selectable" colspan="2">
          <color-palette-container
            v-on:edit="showDialog"
            v-on:success="onSuccess"
            v-on:error="onError"
            :palette="colorPalette"
            :index="index"
            show-edit
            show-delete
          />
        </td>
      </tr>
      <tr v-if="!getColorPaletteError">
        <td style="padding:10px;">
          <el-button
            type="text"
            @click="showDialog"
            icon="el-icon-plus"
          >{{$t('misc.createNewColorPalette')}}</el-button>
        </td>
        <td align="right">
          <el-button
            type="text"
            v-if="getColorPalettes.length > paletteIndex"
            size="mini"
            style="margin-top:1%;"
            @click="paletteIndex = getColorPalettes.length"
          >{{ $t('labels.seeMore') }}</el-button>
          <!-- <el-button
            type="text"
            v-if="getColorPalettes.length > paletteIndex"
            size="mini"
            style="margin-top:1%;"
            @click="paletteIndex -= 3"
          >{{ $t('labels.seeMore') }}</el-button> -->
        </td>
      </tr>
    </tbody>
  </table>

  <color-palette-dialog
    :palette="selectedPalette"
    v-on:hide="hideColorPaletteDialog"
    v-on:success="onSuccess"
    v-on:error="onError"
  />

</div>

</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
} from 'vuex'

import ColorPaletteContainer from './ColorPalette'
import ColorPaletteDialog from './ColorPaletteDialog'
import ErrorContainer from '../components/Error';

import { createCopy } from '../utils';

export default {
  components: {
    ColorPaletteContainer,
    ColorPaletteDialog,
    ErrorContainer
  },
  props: {
    selectable: {
      type: Boolean,
      default: false
    },
    onSelect: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters('user', [
      'getColorPalettes',
      'getColorPaletteError',
    ]),
    ...mapState('chart', {
      chartPalette: 'colorPalette'
    }),
    loading() {
      // Connect this to user loading
      return false
    }
  },
  data() {
    return {
      paletteIndex: 3,
      selectedPalette: null,
      selectedPaletteIndex: null,
      selectedChartPalette: {},
      lastChanged: null
    }
  },
  methods: {
    ...mapActions('chart', {
      setChartPalette: 'setColorPalette'
    }),
    onSuccess() {
      // Global Error
    },
    onError() {
      // Global Errors
    },
    showDialog(palette) {
      if (palette) {
        this.selectedPalette = createCopy(palette);
      } else {
        this.selectedPalette = {};
      }
    },

    hideColorPaletteDialog() {
      this.lastChanged = this.selectedPalette.id
      this.selectedPalette = null;
    },
  },
  watch: {
    selectedChartPalette(selectedId) {
      const selected = this.getColorPalettes.find(p => p.objectId === selectedId)
      this.setChartPalette( selected )
    },
    getColorPalettes() {
      if( this.selectable && this.lastChanged === this.selectedChartPalette ) {
        const selected = this.getColorPalettes.find(p => p.objectId === this.lastChanged)
        this.setChartPalette( selected )
      }
    }
  },
  created() {
    if(!this.selectable) return

    if(this.chartPalette) {
      this.selectedChartPalette = this.chartPalette.objectId
    } else {
      this.selectedChartPalette = this.getColorPalettes[0].objectId
      this.setChartPalette( this.getColorPalettes[0] )
    }
  }
}

</script>

<style>

.hideRadio .el-radio__input{
  display: none;
}

</style>
