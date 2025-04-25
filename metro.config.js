// metro.config.js
// Learn more https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure resolver and assetExts exist, based on defaults
config.resolver = config.resolver || {};
config.resolver.assetExts = config.resolver.assetExts || [];

// Add 'png' to asset extensions if not already present
if (!config.resolver.assetExts.includes('png')) {
  config.resolver.assetExts.push('png');
}

// Add font types like 'ttf' and 'otf' if not already present
if (!config.resolver.assetExts.includes('ttf')) {
  config.resolver.assetExts.push('ttf');
}
if (!config.resolver.assetExts.includes('otf')) {
  config.resolver.assetExts.push('otf');
}

// Remove svg from assetExts (keep it in sourceExts)
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);

// Ensure svg is treated as a source file
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes('svg')) {
  config.resolver.sourceExts.push('svg');
}

module.exports = config;