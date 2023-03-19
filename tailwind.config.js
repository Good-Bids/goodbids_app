const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      black: '#000000',
      white: '#ffffff',
      'outerSpace-900': '#232826',
      'outerSpace-800': '#393d3c',
      'outerSpace-700': '#4f5351',
      'outerSpace-600': '#656967',
      'outerSpace-500': '#7b7e7d',
      'outerSpace-400': '#919493',
      'outerSpace-300': '#a7a9a8',
      'outerSpace-200': '#bdbfbe',
      'outerSpace-100': '#d3d4d4',
      'outerSpace-50': '#e9eae9',
      bottleGreen: '#0a3624',
      screaminGreen: '#5bf146',
      hintOfGreen: '#ecffe9',
      pompadour: '#68004b',
      cornflowerLilac: '#ffa7a7',
      fairPink: '#ffeeee'
    },
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: []
}

module.exports = config
