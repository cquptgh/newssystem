const CracoLessPlugin = require("craco-less");
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            //自定义主题颜色
            modifyVars: { "@primary-color": "#1890ff" },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  babel: {
    plugins: [
      [
        "import",
        {
          libraryName: "antd",
          libraryDirectory: "es",
          style: true //设置为true即是less
        }
      ]
    ]
  }
};
