/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./*.html','./*.js', './src/**/*.css'],
  theme: {
    extend: {
      colors: {
        // primary: {
        //   DEFAULT: '#4F46E5',
        //   light: '#6366F1',   
        //   dark: '#4338CA',    
        // },
        textReal: '#dfe7f1',
        // bgReal: '#05070a',
        bgReal: {
          DEFAULT: '#05070a',
          border: '#0c1012',     
        },
        primary: '#99b7d1',
        secondary: {
          DEFAULT: '#753338',
          light: '#793240',
          hover: '#622634',
          outline: '#271418',   
          border: '#100b0f',    
        },
        // secondary: '#753338',
        // secondaryHover: '#271418',
        // secondaryBorder: '#100b0f',
        accent: {
          DEFAULT: '#97a8ba',
          hover: '#99b7d1',     
        },
        'accent-hover': '#99b7d1',
        // accent: '#97a8ba',  
        tertiary: '#222b32',

        // disabled: '#04070c',
        // success: '#10B981',
        // error: '#EF4444',
        // warning: '#F59E0B',
        // info: '#3B82F6',
        // neutral: '#F3F4F6',
        // border: '#E5E7EB',
      },
    },
  },
  plugins: [],
}