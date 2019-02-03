const { addBabelPlugin } = require('customize-cra');

module.exports = function override(config, env) {
  config = addBabelPlugin('styled-jsx/babel')(config);
  config = addBabelPlugin('react-hot-loader/babel')(config);

  return config;
};
