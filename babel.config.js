module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated 4 plugin auto-included via babel-preset-expo
    // если что-то не работает — добавьте явно:
    // plugins: ['react-native-worklets/plugin'],
  };
};