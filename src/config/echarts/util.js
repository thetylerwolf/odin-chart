import Chance from 'chance'
// eslint-disable-next-line
import * as d3 from 'd3-array'

// import { getRandomInteger, getRandomNumber } from '../../utils';


export const DEFAULT_COLORS = [
  '#9400D3',
  '#4B0082',
  '#0000FF',
  '#00FF00',
  '#FFFF00',
  '#FF7F00',
  '#FF0000',
];

const items = [
  ['IT', 'Financials', 'Energy', 'Transport', 'Politics', 'education'],
  ['Toyota', 'Suzuki', 'Honda', 'FAW', 'Nissan', 'Daihatsu', 'Mitsubishi'],
  ['NOC', 'DRI ', 'FTI', 'NWS', 'CAH', 'Keys', 'ATVI', 'WDC'],
  [
    'Officer',
    'Accountant ',
    'Lawyer',
    'Architect',
    'Programmer',
    'Designer',
    'Consultant',
    'Secretary',
  ],
  [
    'Audiologist',
    'Allergist ',
    'Cardiologist',
    'Dentist',
    'Endocrinologist',
    'Epidemiologist',
    'Immunologist',
  ],
  ['detective', 'corporal ', 'sergeant', 'lieutenant', 'captain', 'officer'],
];

export const getRandomData = (option = {}) => {
  const chance = new Chance()
  const length = option.length || chance.integer({min: 2, max: 7})

  // let m;
  // let c;
  const add1 = option.trend === 'downwards' ? -25 : -5
  const add2 = option.trend === 'downwards' ? 5 : 25
  const randomDigit = chance.integer({min: 0, max: 5})
    const columns = Array.from({ length }, (v, i) => {
      // eslint-disable-next-line
      return i === 0 ? 'x' : option.genRandomLabels ? items[randomDigit][i] : `y${i}`
    })

    const seriez = Array.from({ length }, () => {

      const phaseShift = Math.PI * chance.floating({min: 0, max: 2})

      let prev = chance.integer({ min: 0, max: 100 })

      return Array.from({ length: 11 }, (val2, i) => {

        const harmonicNoise = chance.floating({min: 0.9, max: 1.1})

        if (option.formatType === 'harmonic') {
          const num = harmonicNoise * 100 * Math.sin( Math.PI * i/6 + phaseShift )
          return num.toFixed(0)
        }

        // const low1 = (option.range && option.range[0]) || m || -25;
        // const high1 =
        //   (option.range && option.range[1]) || (m && getRandomInteger(m + add1, m + add2)) || 25;
        // const low2 = (option.range && option.range[0]) || c || -25;
        // const high2 =
        //   (option.range && option.range[1]) || (c && getRandomInteger(c + add1, c + add2)) || 25;

        // m =
        //   option.dataType === 'decimals'
        //     ? getRandomNumber(low1, high1)
        //     : getRandomInteger(low1, high1);
        // c =
        //   option.dataType === 'decimals'
        //     ? getRandomNumber(low2, high2)
        //     : getRandomInteger(low2, high2);

        // return m * x + c;

        const move = chance.integer({ min: add1, max: add2 })

        prev += move

        return prev
      })
    })

  const rows = d3.zip(...seriez.slice(1))
  rows.forEach((row,i) => row.unshift(i))
  const temp = [ columns, ...rows ]


  if (option.formatType === 'normallyDist') {
    for (let i = 1; i < temp.length; i += 1) {
      for (let j = 2; j < temp.length - i; j += 1) {
        for (let k = 0; k < temp[0].length; k += 1) {
          if (temp[j - 1][k] > temp[j][k]) {
            const swap = temp[j - 1][k];
            temp[j - 1][k] = temp[j][k];
            temp[j][k] = swap;
          }
        }
      }
    }

    let z = 1;
    const y = [Math.round(temp.length / 2)][0];
    for (let x = Math.round(temp.length / 2); x > 0; x -= 1) {
      const tempVal = y + z - 1;
      temp[y + z] = temp[x].slice();
      temp[y + z][0] = tempVal;
      z += 1;
    }

    return temp;
  }

  return temp;
};
