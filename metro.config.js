const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Watchman cannot access ~/Documents on macOS without Full Disk Access.
config.resolver = {
  ...config.resolver,
  useWatchman: false,
  // `.txt` is not a default asset extension, so the file-download demo could not
  // bundle assets/documents/sample-text.txt. `.pdf` is already a default.
  assetExts: [...config.resolver.assetExts, 'txt'],
};

module.exports = withNativeWind(config, { input: './global.css' });
