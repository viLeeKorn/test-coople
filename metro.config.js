const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for absolute imports
config.resolver.alias = {
  '#Screens': path.resolve(__dirname, 'src/Screens'),
  '#Utils': path.resolve(__dirname, 'src/Utils'),
  '#Components': path.resolve(__dirname, 'src/Components'),
};

module.exports = config; 