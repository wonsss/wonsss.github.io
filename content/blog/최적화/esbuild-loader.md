---
title: EsBuild-loader를 통해 웹팩 프로덕션 빌드 타임 절감
date: 2022-09-06 03:09:49
category: 최적화
thumbnail: { thumbnailSrc }
draft: false
---

## EsBuild-loader 를 통한 빌드 타임 절감

EsBuild 적용을 통해 프로덕션 빌드 타임이 거의 1/4 수준으로 줄었다.

- before
  ![babelloader](../image/babelloader.jpg)
- after
  ![esbuild-loader](../image/esbuilder.jpg)

BabelLoader(최신 ES 문법 트랜스파일링), TsLoader(타입스크립트 로더), TerserPlugin(JS 압축), CssMinimizerPlugin(CSS 압축)를 삭제하고 기존 기능들을 아래와 같이 EsBuild를 통해 대체하였다.

```javascript
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2020'
        }
      },
```

```javascript
const { ESBuildMinifyPlugin } = require('esbuild-loader');


  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2020',
        css: true
      })
    ]
  }
```

> 참고
>
> - <https://fe-developers.kakaoent.com/2022/220707-webpack-esbuild-loader/>
