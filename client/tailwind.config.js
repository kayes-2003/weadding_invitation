const v = (n) => `rgb(var(--${n}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // names kept from v1; values now come from the admin "Theme" settings
      colors: { paper: v('bg'), plum: v('ink'), coral: v('accent'), rose: v('accent2'), marigold: v('band'), teal: v('band2') },
      fontFamily: { script: ['var(--f-script)', 'cursive'], display: ['var(--f-display)', 'serif'], body: ['var(--f-body)', 'sans-serif'] },
    },
  },
}
