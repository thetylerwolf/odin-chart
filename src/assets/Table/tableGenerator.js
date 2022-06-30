import * as d3 from 'd3';

export default class Table {
  constructor(settings, data, id) {
    super(settings, data, id);
    return this;
  }

  draw() {
    const settings = this.settings;

    let headerHeight = 14,
      rowWidth = 100,
      rowHeight = 20;

    const container = d3
      .select(`#${  this.id}`)
      .append('g')
      .attr('class', 'table-container')
      .attr('id', (d, i) => `table-${  this.instanceID}`)
      .attr('transform', `translate(${this.padding.left},${this.padding.top})`);

    const header = container
      .append('g')
      .attr('class', 'header')
      .selectAll('g.header-cell')
      .data(this.data.columns);

    header
      .enter()
      .append('g')
      .attr('class', 'header-cell')
      .attr('transform', (d, i) => `translate(${i * rowWidth},${0})`)
      .append('text')
      .attr('y', '0.7em')
      .text(d => d);

    container
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.data.columns.length * rowWidth)
      .attr('y1', headerHeight)
      .attr('y2', headerHeight)
      .style('stroke', '#1a1a1a');

    const columns = container
      .selectAll('g.column')
      .data(this.data.columns)
      .enter()
      .append('g')
      .attr('class', (d, i) => `column column-${  i}`)
      .attr('transform', (d, i) => `translate(${i * rowWidth},${headerHeight})`);
    // .attr('transform', `translate( ${ this.padding.left }, ${ this.padding.top } )`)

    columns
      .selectAll('text')
      .data((key, i) => this.data.map(d => d[i]))
      .enter()
      .append('text')
      .attr('y', (d, i) => headerHeight + 6 + i * rowHeight)
      .text(d => d);
  }
}
