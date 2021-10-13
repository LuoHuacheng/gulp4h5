module.exports = {
  // Override the baseConfig value in gulp.config.js
  autoprefixerConfig: {
    overrideBrowserslist: ['Android >= 4', 'iOS >= 9'],
  },
  injectScripts: ['public/scripts/alloy_touch.transform.js'],
  injectStyles: ['public/styles/animate.min.css'],
};
