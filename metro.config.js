const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Watchman cannot access ~/Documents on macOS without Full Disk Access.
config.resolver = {
  ...config.resolver,
  useWatchman: false,
};

module.exports = withNativeWind(config, { input: './global.css' });
