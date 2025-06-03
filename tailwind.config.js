import { heroui } from '@heroui/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'rojo-oscuro': '#840705',
        'rojo-mate': '#AA1916',
        'rojo-claro': '#FFF1EF',
        'rojo-institucional': '#BC0017',
        'negro-institucional': '#000000',
        'gris-institucional': '#818386',
        'gris-intermedio': '#C0C0C0',
        'gris-claro': '#EBEBEB',
        success: '#4CAF50',
        'success-dark': '#39803D',
        'success-light': '#F0FDF4',
        warning: '#F5A524',
        'warning-light': '#FEFCE8',
        'warning-dark': '#431505',
        info: '#6C6E8B',
        'info-light': '#FBFBFC',
        'info-dark': '363744',
        blanco: '#FFFFFF',
        'danger-dark': '#480807',
        'danger-light': '#F83F3B',
        "azul": "#1e40af",
        "azul-claro": "#eef6ff",
      },
      fontSize: {
        titulos: '30px',
        subtitulos: '24px',
        normal: '16px'
      }
    }
  },
  darkMode: 'light',
  plugins: [heroui()]
}
