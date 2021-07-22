module.exports = function (api) {
  api.assertVersion("^7.12.10")
  api.cache(false)

  const presets = ["next/babel"]
  const plugins = [
    [
      "babel-plugin-inline-import",
      {
        extensions: [".cdc"],
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
