import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        destructive: '#CF6679',
        background: '#121212',
        surface: '#1E1E1E',
        primary: '#25D366',
        'primary-dark': '#1DA851',
        secondary: '#3A3A3A',
        'text-primary': '#EDEDED',
        'text-secondary': '#B3B3B3',
        accent: '#128C7E',
        error: '#CF6679',
        success: '#4CAF50',
        border: '#2C2C2C',
        hover: '#333333',
      },
      borderRadius: {
        lg: '0.75rem', // 12px
        md: '0.5rem',  // 8px
        sm: '0.375rem' // 6px
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in forwards',
        fadeOut: 'fadeOut 0.3s ease-out forwards',
      }
    }
  },
  plugins: [],
}

export default config
