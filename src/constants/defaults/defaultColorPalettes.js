// eslint-disable-next-line
import {
  schemeBlues,
  schemeReds,
  schemeSet2,
  schemeRdBu,
  interpolateInferno
} from 'd3-scale-chromatic'
// eslint-disable-next-line
import {
  range
} from 'd3-array'

export default [{
  name: 'Odin Categorical',
  colors: [
    "rgba(105, 145, 242, 1)",
    "rgba(220,100,100,1)",
    "rgba(238,177,80,1)",
    "rgba(205,95,185,1)",
    "rgba(134,214,80,1)",
    "rgba(127,133,228,1)",
  ],
  createdAt: 6,
},{
  name: 'Categorial',
  colors: [ ...schemeSet2 ],
  createdAt: 5,
},{
  name: 'Diverging',
  colors: [ ...schemeRdBu[7] ],
  createdAt: 4,
},{
  name: 'Sequential Blues',
  colors: [ ...schemeBlues[6] ],
  createdAt: 3,
},{
  name: 'Sequential Reds',
  colors: [ ...schemeReds[6] ],
  createdAt: 2,
},{
  name: 'Rainbow',
  colors: [
    "rgba(210, 27, 27, 1)",
    "rgba(242, 117, 0, 1)",
    "rgba(238, 226, 4, 1)",
    "rgba(89, 213, 65, 1)",
    "rgba(43, 134, 221, 1)",
    "rgba(80, 78, 207, 1)",
    "rgba(170, 127, 34, 1)",
    "rgba(255, 255, 255, 1)",
    "rgba(0, 0, 0, 1)"
  ],
  createdAt: 1,
},{
  name: 'Inferno',
  colors: range( 0, 1, 1/7 ).map(interpolateInferno),
  createdAt: 0,
}]
