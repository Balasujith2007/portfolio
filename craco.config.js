/**
 * craco configuration to enable Tailwind CSS with Create React App.
 */
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
