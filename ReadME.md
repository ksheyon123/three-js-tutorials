### Initializing

type command `npm init` to create package.json

### Create Directory

```
ㄴ public
  ㄴ index.html
ㄴ src
  ㄴ index.js
ㄴ webpack.config.js

```

### Webpack configuration

```
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

```

### Create index.js

> "You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file." will be returned.

First of all, type this `npm install @babel/preset-env @babel/preset-react babel-loader` on terminal.

And then, start the React project using webpack-dev-server, Webpack configuration need to be updated.

```
module.exports = {

  // ... Configurations
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
}


```
