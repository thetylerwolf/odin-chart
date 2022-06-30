<template>
  <table class="table">
    <thead>
      <tr>
        <td>{{ palette.name || 'Untitled' }}</td>
        <td>
          <span class="small pull-right">
            <el-button
              v-if="showEdit"
              type="text"
              size="mini"
              icon="el-icon-edit"
              title="Edit"
              :disabled="deleting"
              @click="edit"
            />
            <el-button
              v-if="showDelete"
              type="text"
              size="mini"
              icon="el-icon-delete"
              title="Delete"
              :disabled="deleting"
              @click="remove"
            />
          </span>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="2">
          <div style="width:100%; height:40px;">
            <div
              :key="'color_' + color"
              v-for="color in palette.colors"
              v-bind:style="{ background: color, width: `${100/palette.colors.length}%`, height: '100%', display: 'inline-block', marginTop: '5px'}"
            ></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapActions } from 'vuex'

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
        index: this.index,
        data: this.palette
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
          const { objectId } = this.palette
          const index = this.index

          this.deleteColorPalette({ objectId, index })
            .then(() => {
              this.deleting = false
            })
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
