<template>
  <el-dialog
    title="Color Palette"
    :visible="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="hideDialog"
    @open="onOpen"
  >
    <table class="table">
      <tbody>
        <tr>
          <el-input
            :disabled="submitting"
            v-model="colorPalette.name"
            type="text"
            size="small"
            placeholder="Color Palette Name"
            style="padding-bottom:2%;"
          />
        </tr>
        <tr>
          <table class="table">
            <thead v-show="colorPalette.colors.length">
              <tr>
                <th></th>
                <th>color</th>
                <th>hex</th>
                <th>alpha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr :key="`color_${index}`" v-for="(color, index) in colorPalette.colors">
                <td
                  draggable="true"
                  @dragstart="dragStart(index, $event)"
                  @dragover.prevent
                  @dragend="dragEnd"
                  @drop="dragFinish(index, $event)"
                  style="cursor: grab;"
                >
                  <div class="customDragDrop">
                    <i class="fas el-icon-fa-bars barsCustom"/>
                  </div>
                </td>
                <td align="center">
                  <el-color-picker
                    :value="color"
                    :popper-class="popperClass"
                    :disabled="submitting"
                    @change="(value) => updateColor(value, index)"
                    @active-change="(value) => updateColor(value, index)"
                    show-alpha
                  />
                </td>
                <td align="center">
                  <el-input
                    :disabled="submitting"
                    :value="colorPalette.hex[index]"
                    type="text"
                    size="small"
                    @input="v => updateHexFromInput(v, index)"
                    style="width: 100px;"
                  />
                </td>
                <td align="center">
                  <el-input
                    :disabled="submitting"
                    :value="colorPalette.alpha[index]"
                    type="text"
                    size="small"
                    @input="v => updateAlphaFromInput(v, index)"
                    style="width: 100px;"
                  />
                </td>
                <td align="center">
                  <el-button
                    type="text"
                    :disabled="submitting"
                    icon="el-icon-delete"
                    @click="removeColor(index)"
                    title="Remove Color"
                  />
                </td>
              </tr>
              <tr class="text-center">
                <td colspan="10" style="padding:1%;">
                  <el-button
                    :loading="submitting"
                    size="medium"
                    :disabled="colorPalette.colors.length >= defaults.PALETTE_MAX_LENGTH"
                    @click="addColor"
                    icon="el-icon-plus"
                    type="text"
                  >Add Color ({{ defaults.PALETTE_MAX_LENGTH - colorPalette.colors.length }} more)</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </tr>
        <tr>
          <div class="text-center small">{{status}}</div>
        </tr>
      </tbody>
    </table>
    <span slot="footer">
      <el-button :loading="submitting" type="text" size="medium" @click="hideDialog">Cancel</el-button>
      <el-button
        :loading="submitting"
        type="primary"
        size="medium"
        @click="savePalette"
        :disabled="!valid || status === this.$t('messages.changesUptoDate')"
      >Save & Close</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
// eslint-disable-next-line
import * as d3 from 'd3-color'

import {
  PALETTE_MAX_LENGTH,
  EMPTY_PALETTE
} from '../constants';
import { createCopy, getRandomColor } from '../utils';

export default {
  computed: {
    visible() {
      if (this.palette && typeof this.palette === 'object') return true;
      return false;
    },

    valid() {
      if (this.colorPalette.name && this.colorPalette.colors.length >= 1) {
        return true;
      }
      return false;
    },

    status() {
      if (this.submitting) return 'Saving...';
      if (this.colorPalette.id) {
        if (
          JSON.stringify(this.colorPalette.colors) === JSON.stringify(this.savedObj.colors) &&
          this.colorPalette.name === this.savedObj.name &&
          this.moved === false
        ) {
          return this.$t('messages.changesUptoDate');
        }
      }

      return '';
    },
  },

  methods: {
    ...mapActions('user', [
      'updateColorPalette',
      'createColorPalette'
    ]),
    onOpen() {
      const palette = this.palette && createCopy(this.palette);

      if (palette) {
        const { id = undefined, name = '', colors = [], index } = palette;

        this.colorPalette = {
          id,
          name,
          colors,
          hex: colors.map(color => d3.color(color).hex()),
          alpha: colors.map(color => d3.color(color).opacity),
          index
        };

        if (id) {
          this.savedObj = { id, name, colors };
        }
      }
    },

    updateHexFromInput(value, index) {

      let color = d3.color(value)
      if(color) {
        color = `rgba(${ color.r },${ color.g },${ color.b },1)`
      }

      this.colorPalette.colors.splice(index, 1, color)
      this.colorPalette.hex.splice(index, 1, value)

    },

    updateAlphaFromInput(value, index) {
      const currentColor = this.colorPalette.colors[ index ]

      this.colorPalette.colors.splice(index, 1, this.alphaToRgbA(value || 0, currentColor))
      this.colorPalette.alpha.splice(index, 1, value || 0)
    },

    hideDialog(changed = false) {
      this.submitting = false;
      this.colorPalette = createCopy(EMPTY_PALETTE);
      this.savedObj = null;
      this.$emit('hide', changed);
    },

    savePalette() {
      const obj = createCopy(this.colorPalette);
      this.submitting = true;

      if (obj.id) {

        this.updateColorPalette(obj)
          .then(() => this.hideDialog( true ))

      } else {

        this.createColorPalette(obj)
          .then(() => this.hideDialog( true ))

      }
    },

    addColor() {
      if (this.colorPalette.colors.length < PALETTE_MAX_LENGTH) {
        const randomColor = getRandomColor();
        this.colorPalette.colors = [...this.colorPalette.colors, randomColor];
        const hexOfColor = d3.color(randomColor).hex()
        this.colorPalette.hex = [...this.colorPalette.hex, hexOfColor];
        const alphaOfColor = d3.color(randomColor).opacity
        this.colorPalette.alpha = [...this.colorPalette.alpha, alphaOfColor];
      }
    },

    updateColor(value, index) {
      this.colorPalette.colors.splice(index, 1, value)
      this.colorPalette.hex.splice(index, 1, d3.color(value).hex())
      this.colorPalette.alpha.splice(index, 1, d3.color(value).opacity)
    },

    removeColor(index) {
      this.colorPalette.colors = this.colorPalette.colors.filter((val, i) => i !== index);
    },

    alphaToRgbA(alpha, rgba) {
      const valid = Number(alpha) >= 0 && Number(alpha) <= 1;
      // eslint-disable-next-line
      return rgba.replace(/[\d\.]+\)$/g, `${valid ? alpha : 1})`);
    },

    // draging methods
    removeItemAt(index) {
      this.colorPalette.colors.splice(index, 1);
    },

    dragStart(which, ev) {
      const event = ev
      event.path[1].bgColor = '#d8d8d8';
      event.dataTransfer.setData('Text', this.id);
      event.dataTransfer.dropEffect = 'move';
      this.dragging = which;
    },

    dragEnd(ev) {
      const event = ev

      event.path[1].bgColor = '';
      this.dragging = -1;

    },

    dragFinish(to) {
      this.moveItem(this.dragging, to);
    },

    moveItem(from, to) {
      if (to === -1) {
        this.removeItemAt(from);
      } else {
        this.colorPalette.colors.splice(to, 0, this.colorPalette.colors.splice(from, 1)[0]);
      }

      this.moved = true;
    },
  },

  props: {
    palette: Object
  },

  data() {
    return {
      submitting: false,
      popperClass: 'odinPalletPicker',
      colorPalette: createCopy(EMPTY_PALETTE),
      savedObj: null,
      defaults: {
        PALETTE_MAX_LENGTH
      },
    };
  },
};
</script>
<style>
.odinPalletPicker .el-color-dropdown__link-btn {
  display: none;
}
.barsCustom {
  display: block;
  text-align: center;
}
.customDragDrop {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  width: 38rem;
  /* margin-left: 2.79rem; */
}
</style>