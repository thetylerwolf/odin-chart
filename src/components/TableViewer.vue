<template>
  <div class="box containTable" :style="`background:${options.backgroundColor};`" >
    <h1 v-if="options.showTitle && options.title">{{ options.title }}</h1>
    <table
      id="tableCharts"
      v-if="options.data.length"
      class="table text-center"
      :style="options.showGrid && 'border:solid 0px; border-collapse:collapse;'"
    >
      <thead v-if="options.data.length">
        <tr>
          <th
            :key="`header_row_${j}`"
            v-for="(subitem, j) in options.data[0]"
            :style="(options.showGrid && 'border-bottom:solid 1px ') + (options.headerBorderColor+';' + `color:${options.headerTextColor};`)"
          >{{subitem}}</th>
        </tr>
      </thead>
      <tbody v-if ="!options.highlightedOption || options.highlightedOption === 'non-highlighted'">
        <tr
          :key="`option_${i}`"
          v-for="(item, i) in options.data.slice(1,options.data.length)"
          :style="options.rowHighlightColor && i % (options.rowHighlightInterval || 1)  === 0 && `background:${options.rowHighlightColor};`"
        >
          <td
            :key="`option_${i}_${j}`"
            v-for="(subitem, j) in item"
            :style="(options.showGrid && 'border:solid 1px ') + (options.bodyBorderColor || '#000000' +';' + `color:${options.bodyTextColor};`)"
          >{{subitem}}</td>
        </tr>
      </tbody>
      <tbody v-if ="options.highlightedOption === 'highlighted'">
        <tr
          :key="`option_${i}`"
          v-for="(item, i) in options.data.slice(1,options.data.length)"
          :style="options.rowHighlightColor && i % (options.rowHighlightInterval || 1)  !== 0 && `background:${options.rowHighlightColor};`"
        >
          <td
            :key="`option_${i}_${j}`"
            v-for="(subitem, j) in item"
            :style="(options.showGrid && 'border:solid 1px ') + (options.bodyBorderColor || '#000000' +';' + `color:${options.bodyTextColor};`)"
          >{{subitem}}</td>
        </tr>
      </tbody>
    </table>
    <!-- svg Tabels -->

    <!-- <svg width="100%"
      height="100%"
      viewBox="0 0 370 160"
      id="tableCharts"
      v-if="options.data.length"
      class="table text-center"
      :style="options.showGrid && 'border:solid 0px; border-collapse:collapse;'"
     >

      <g id='rowGroup' transform='translate(0, 0)' role="table">
      <rect x='25' y='40' width='310' height='20' fill='gainsboro'/>
      <rect x='25' y='76' width='310' height='20' fill='gainsboro'/>

      <text x='30' y='30' font-size='14px' fill='crimson'
       text-anchor='middle' role="row"
        :key="`option_${i}`"
        v-for="(item, i) in options.data.slice(1,options.data.length)"
        :style="options.rowHighlightColor && i % (options.rowHighlightInterval || 1)  === 0 && `background:${options.rowHighlightColor};`"
       >
       <tspan role="rowheader" x='30' :dy="`${(i+1.5)}em`" text-anchor='start'></tspan>
      <tspan role="cell" :x="`${(j+1)*50}`"
        :key="`option_${i}_${j}`"
        v-for="(subitem, j) in item"
        :style="(options.showGrid && 'border:solid 1px;') + (options.bodyBorderColor && `color:${options.bodyBorderColor};`)"
        >{{subitem}}</tspan>
      </text>
      </g>
      </svg> -->
    <div v-else class="text-center" style="padding:20%;">{{ $t('messages.noData') }}</div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default() {
        return {
          data: []
        }
      },
    },
  },
};
</script>
<style>
.containTable{
  display: block;
  max-width: 38vw;
  overflow-y: auto;
  overflow-x: auto;
  max-height: 15rem;
}
</style>
