---
title: webpack5의 Asset Modules
date: 2022-09-03 02:09:60
category: webpack
thumbnail: { thumbnailSrc }
draft: false
---

## file-loader 등이 webpack5에서 Asset Modules로 대체된다

> [https://webpack.js.org/guides/asset-modules/#resource-assets](https://webpack.js.org/guides/asset-modules/#resource-assets)

-   `Asset Modules`
    -   `Asset Modules` 은 asset files(fonts, icons, etc)을 부가적인 로더 설정없이 사용할 수 있도록 하는 모듈이다.
    -   webpack 5 이전에는 보통 이렇게 쓰인곤 했다.
        -   `raw-loader` : 파일을 string으로서 import
        -   `url-loader` : 파일을 data URI로서 번들에 inline
        -   `file-loader` : output 디렉터리에 파일을 emit할 때
    -   webpack 5 이후 도입된 `Asset Modules` 타입은 4개의 새 모듈 타입들을 추가함으로써 이러한 로더들을 모두 대체했다.
        -   `asset/source` : asset의 소스코드를 export한다. `raw-loader` 를 대체한다.
        -   `asset/inline` : asset의 data URI를 export한다. `url-loader` 를 대체한다.
        -   `asset/resource` : 각각의 파일을 emit하고 URL을 export한다. `file-loader` 를 대체한다.
        -   `asset` : data URI를 export할 지 각각의 파일을 emit할 지 자동적으로 선택한다. asset size limit이 있는 `url-loader` 를 대체한다.
-   before webpack5

    ```jsx
    {
      test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp4|webp)$/i,
      loader: 'file-loader',
      options: {
        name: 'static/[name].[ext]'
      }
    }
    ```

-   after webpack5

    ```jsx
    {
      test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp4|webp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/[name][ext]'
      }
    }
    ```
