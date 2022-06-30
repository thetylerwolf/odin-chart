<template>

<div>

  <table class="table">
    <tbody>
      <tr
        :key="'palette' + colorPalette.objectId"
        v-for="(colorPalette, index) in colorPalettes.data.slice(0, paletteIndex)"
      >
        <el-radio
          v-model="selectedPalette"
          :label="colorPalette.objectId"
          class="responsive hideRadio"
          border
        >
        <color-palette-container
          :palette="colorPalette"
          v-on:edit="showColorPaletteDialog"
          v-on:deleted="onDeleteColorPalette"
          v-on:success="onSuccess"
          v-on:error="onError"
          v-on:info="onInfo"
          :index="index"
          show-edit
          show-delete
        />
        </el-radio>
      </tr>
      <tr v-if="!colorPalettes.error">
        <td style="padding:10px;">
          <el-button
            type="text"
            @click="showColorPaletteDialog"
            icon="el-icon-plus"
          >{{$t('misc.createNewColorPalette')}}</el-button>
        </td>
        <td align="right">
          <el-button
            type="text"
            v-if="colorPalettes.data.length > paletteIndex"
            size="mini"
            style="margin-top:1%;"
            @click="paletteIndex += 3"
          >{{ $t('labels.seeMore') }}</el-button>
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

import { mapActions } from 'vuex'
import { ColorPalette } from "../models";
import { createCopy } from "../utils";

export default {
  methods: {
    ...mapActions('user', [
      'deleteColorPalette'
    ]),
    edit() {
      const { objectId: id, name, colors } = this.palette;

      this.$emit("edit", {
        id,
        name,
        colors,
        index: this.index
      });
    },

    remove() {
      this.$confirm(
        "This will permanently delete the color palette. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          this.deleting = true;
          const { objectId } = this.palette,
            index = this.index

          this.deleteColorPalette({ objectId, index })
            .then(() => this.deleting = false)
        })
        .catch(() => {});
    }
  },

  props: {
    palette: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: false
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      deleting: false
    };
  }
};
</script>
