<h1 align="center">
  goto-vue-loader (quickly open IDE by click  browser component area)
  <a href="https://www.npmjs.org/package/htm"><img src="https://img.shields.io/npm/v/goto-vue-component-loader.svg?style=flat" alt="npm"></a>
</h1>
<p align="center">
  <img src="https://p1.meituan.net/travelcube/5489368421770c046e4bdf0b6bd8fefb2282265.gif" width="572" alt="hyperscript tagged markup demo">
</p>

## Surport IDE
- vscode
- sublime

## Installation

``` 
  npm install -g goto-vue-component-loader
```

## Usage
`Note` This loader only surport Development Enviroment。

webpack.dev.config.js:

```
  const GotoVueComponentLoaderPlugin = require('goto-vue-component-loader/plugin');

  ...
  module: {
            rules: [{
                test: /.vue$/,
                loader: 'goto-vue-component-loader',
                exclude: [/node_modules/],
                enforce: 'pre'
            }]
            ...
        },

  ...
  plugins: [new GotoVueComponentLoaderPlugin()]
  ...

```


## Other
