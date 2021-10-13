const project = process.env.npm_config_project;
const env = process.env.npm_config_mode || 'development';

if (!project) {
  throw Error('project dir is required');
}

let baseConfig = {
  project,
  env,
  pathSrc: {
    html: `${project}/src`,
    css: `${project}/src/css`,
    script: `${project}/src/js`,
    image: `${project}/src/images`,
  },
  pathDist: {
    html: `${project}/${env}`,
    css: `${project}/${env}/css`,
    script: `${project}/${env}/js`,
    image: `${project}/${env}/images`,
  },
  autoprefixerConfig: {
    overrideBrowserslist: ['last 2 version'],
  },
  base64Config: {
    extensions: ['png'],
    maxImageSize: 8 * 1024,
  },
  pxtoviewportConfig: {
    viewportWidth: 750,
    viewportUnit: 'vmin',
  },
  proxyOptions: {},
  injectScripts: [
    'public/scripts/alloy_touch.all.js',
    'public/scripts/alloy_touch.fullpage.js',
  ],
  injectStyles: ['public/styles/common.css'],
};

let projectConfig = require('./' + project + '/project.config');

if (projectConfig) {
  for (let k in projectConfig) {
    if (projectConfig[k] !== undefined) {
      if (k === 'injectScripts' || k === 'injectStyles') {
        baseConfig[k] = baseConfig[k].concat(projectConfig[k]);
      } else {
        baseConfig[k] = projectConfig[k];
      }
    }
  }
}

module.exports = baseConfig;
