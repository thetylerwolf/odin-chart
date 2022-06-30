<template>

  <div class="wrapper-jexcel" v-loading="updating">
    <div class="flex">
      <div id="spreadsheet" ref="spreadsheet"></div>
      <div class="button-container">
        <el-button @click="addCol">+ Add Column</el-button>
      </div>
    </div>
    <div class="button-container">
      <el-button @click="addRow">+ Add Row</el-button>
    </div>
  </div>

</template>
<script>
// eslint-disable-next-line
import jexcelStyle from 'jexcel/dist/jexcel.css'
// eslint-disable-next-line
import jexcel from 'jexcel'

import { createCopy } from '../utils'

export default {
  computed: {
    jExcelOptions() {
      const cellWidth = 150;
      const columns = this.tableData[0].map(() => {
        return {
          type: 'text',
          // title: col,
          width: cellWidth,
          decimal: ".",
        }
      });

      return {
        data: createCopy(this.tableData),
        columns,
        rows: {
          height: 300,
        },
        onchange: this.updateTable,
        columnDrag: false,
        columnResize: false,
        rowResize: false,
        rowDrag: false,
        // allowInsertRow: false,
        allowManualInsertRow: false,
        // allowInsertColumn: false,
        allowManualInsertColumn: false,
        // allowDeleteRow: false,
        // allowDeleteColumn: false,
        allowRenameColumn: false,
        allowComments: false,
        contextMenu: false
      };
    },
  },
  watch: {
    rawData() {
      if(!this.rawData.length) return

      this.renderTable()
    }
  },
  methods: {
    // saveData() {
    //   this.$emit('TableUpdated', this.tableData)
    //   this.$emit('hide')
    // },
    addRow() {
      const length = this.tableData[0].length
      const newTable = createCopy(this.tableData)
      newTable.push( Array.from({ length }) )
      this.$emit('TableUpdated', newTable)
    },
    addCol() {
      const newTable = createCopy(this.tableData)
      newTable.forEach(row => row.push(''))
      this.$emit('TableUpdated', newTable)
    },
    updateTable(instance, cell, x, y, value) {
      const updateRow = this.tableData[y]

      if(updateRow === undefined) {
        this.tableData.push(Array.from({ length: this.prevCols }))
      }

      this.tableData[y][x] = value || null
      this.$emit('TableUpdated', this.tableData)
    },
    renderTable() {

      this.updating = true;

      if(this.jExcelObj) {
        this.prevCols = this.tableData[0].length

        // removing all columns and adding empty columns again
        this.jExcelObj.setData([[]]);

        const sameRows = this.tableData.length === this.rawData.length
        const sameCols = this.tableData[0].length === this.rawData[0].length

        this.tableData = createCopy( this.rawData )
        const opts = this.jExcelOptions

        if(!sameRows || !sameCols) {
          // insert columns and their data here
          // if the shape of the updated data is different
          this.jExcelObj.insertColumn(opts.columns.length, 0, false, opts);
          this.jExcelObj.deleteColumn(0, this.prevCols);
        }

        this.jExcelObj.setData(opts.data);

      } else {
        this.tableData = createCopy( this.rawData )
        this.prevCols = this.tableData[0].length

        const jExcelObj = jexcel(this.$refs.spreadsheet, this.jExcelOptions)
        Object.assign(this, { jExcelObj }) // tucks all methods under jExcelObj object in component instance

      }

      this.updating = false;
    }
  },
  mounted() {
    this.renderTable()
  },
  props: {
    rawData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      updating: false,
      tableData: [],
    };
  },
};
</script>
<style lang="scss">
tr:first-child {
  font-weight: bold;
}
.outerCol {
  text-align: -webkit-center;
  text-align: -moz-center;
}
.saveWrapper {
  text-align: right;
  padding-bottom: 25px;
}
.customizeInput::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.customizeInput {
  -moz-appearance: textfield;
}
.introduction {
  font-size: 14px;
  padding: 0.5em;
  margin-bottom: 0.3em;
  color: gold;
  background: #111;
}

.wrapper-jexcel tr:first-child{
  font-weight: normal !important;
}

.wrapper-jexcel {

  .flex {
    display:flex;
  }

}


</style>


