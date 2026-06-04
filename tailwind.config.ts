import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: '#FF5A5F',
        'deep-text': '#222222',
        'body-text': '#484848',
        muted: '#717171',
        'app-bg': '#F7F7F7',
        'data-blue': '#0369A1',
        success: '#008A05',
        warning: '#FFB400',
        danger: '#D93025',
        'hover-surface': '#F2F2F2',
        border: '#EBEBEB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        salary: ['36px', { fontWeight: '700', lineHeight: '1.1' }],
      },
    },
  },
  plugins: [],
}

export default config