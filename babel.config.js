module.exports = function (api) {
  const env = api.env()
  api.assertVersion("^7.12.10")

  const removeDataTestAttributes =
    env === "production" && !process.env.PRESERVE_DATA_TEST_ATTRIBUTES

  const presets = ["next/babel"]
  const plugins = []

  if (removeDataTestAttributes)
    plugins.push(["react-remove-properties", {properties: ["data-test"]}])

  return {
    presets,
    plugins,
  }
}
