const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
        screaminGreen: '#70FF8F',
        hintOfGreen: '#D9FFD2',
        pompadour: '#68004B',
        cornflowerLilac: '#FFB3B3',
        fairPink: '#FFE7EF'
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0px' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0px' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  // @ts-ignore
  plugins: [require('tailwindcss-animate')]
}

module.exports = config
