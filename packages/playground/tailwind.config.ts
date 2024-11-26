import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const spacingList = [
  '0',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '44',
  '48',
  '52',
  '56',
  '60',
  '64',
  '72',
  '80',
  '96'
]

const spacing = spacingList.reduce((acc, item) => Object.assign(acc, { [`${item}`]: `${item}px` }), {})

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    spacing,
    'f-size': {
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      24: '24px',
      32: '32px'
    },
    'extend': {}
  },
  plugins: [
    plugin(p => {
      const { addComponents, addBase, addUtilities, addVariant, theme, matchUtilities } = p

      addComponents({
        '.flex-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      })

      matchUtilities(
        {
          'f-size': value => ({ 'font-size': value })
        },
        {
          values: theme('f-size')
        }
      )
    })
  ],
  corePlugins: {
    // preflight: false
  }
} satisfies Config
