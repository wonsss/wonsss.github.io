---
title: NextJS 개발 환경 설정하기
date: 2024-01-23 01:01:17
category: nextjs
thumbnail: { thumbnailSrc }
draft: false
---

react, react-dom, NextJS, typescript, eslint, prettier, styled-components 를 사용하는 개발 환경을 create-next-app 사용하지 않고 직접 설정해보자.

## 라이브러리 설치

```bash
npm i react react-dom next
```

```bash
npm i @types/node @types/react @types/react-dom eslint eslint-config-next typescript -D
```

## tsconfig.json 작성

```json
{
 "$schema": "http://json.schemastore.org/tsconfig.json", // 해당 JSON 파일이 무엇을 의미하는지, 또 어떤 키와 어떤 값이 들어갈 수 있는지 알려주는 schemastore에서 제공하는 도구이다. 이를 통해 옵션 JSON 파일에서 IDE의 자동완성이 가능하다.
 "compilerOptions": {
  // 타입스크립트를 자바스크립트로 컴파일할 때 사용하는 옵션
  "target": "es5", //타입스크립트가 변환을 목표로 하는 언어의 버전. 단, 폴리필까지는 지원하지 않는다.
  "lib": ["DOM", "DOM.Iterable", "ESNext"], // 폴리필을 붙여서 지원할 환경이 준비됐다고 가정하고, 타입스크립트가 사용할 수 있는 라이브러리를 지정한다.
  "allowJs": true, // 자바스크립트 파일을 허용할지 여부
  "skipLibCheck": true, // 라이브러리에서 제공하는 d.ts에 대한 타입체크 여부. 이 옵션이 켜져 있으면 라이브러리의 d.ts까지 검사해서 전체적인 프로젝트의 컴파일 시간이 길어지므로 일반적으로 꺼놓는다.
  "outDir": "dist",
  "strict": true, // alwaysStrict, strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, useUnknownInCatchVariables 옵션을 한꺼번에 켜는 옵션
  "forceConsistentCasingInFileNames": true, // 파일 이름의 대소문자 구분
  "noEmit": true, // 컴파일을 하지 않고, 타입 체크만 하는 옵션이다. 이 옵션을 켠 이유는 Next.js에서 swc가 타입스크립트 파일을 컴파일하므로 굳이 타입스크립트가 컴파일을 할 필요가 없기 때문이다.
  "esModuleInterop": true, // CommonJS 방식으로 보낸 모듈을 ES 모듈 방식의 import로 가져올 수 있게 해주는 옵션
  "module": "esnext", // 모듈 시스템 설정한다.commonjs는 require를 사용하고 esnext는 import를 사용한다.
  "moduleResolution": "node", // 모듈을 해석하는 방식을 지정한다. node는 node_modules을 기준으로 모듈을 해석하고, classic은 tsconfig.json이 있는 디렉터리를 기준으로 모듈을 해석한다.
  "resolveJsonModule": true, // JSON 파일을 import할 수 있게 한다.
  "isolatedModules": true, // 파일에 import나 export가 없는 모듈을 허용하지 않는 옵션
  "jsx": "preserve", // tsx 파일 내부의 JSX를 어떻게 처리할지 설정한다. preserve는 JSX를 변환하지 않고 JSX 코드를 그대로 두는 것인데, Next.js에서는 swc가 JSX 또한 변환해주므로 이 옵션을 사용한다.
  "incremental": true, // 이전에 컴파일한 결과를 캐싱해서 다음번 컴파일 시간을 줄여주는 옵션
  "baseUrl": "src", // 모듈을 해석할 때 기준이 되는 디렉터리를 지정한다. 아래 paths 옵션과 함께 사용한다.
  "paths": {
   "#pages/*": ["pages/*"],
   "#hooks/*": ["hooks/*"], // 예를 들어, #hooks/useToggle는 src/hooks/useToggle 경로로 해석된다.
   "#types/*": ["types/*"],
   "#components/*": ["components/*"],
   "#utils/*": ["utils/*"]
  }
 },
 "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "tsconfig.json"], // 타입스크립트 컴파일 대상에서 포함시킬 파일 목록을 의미한다. ts, tsx 확장자 파일 및 Next.js에서 자동 생성하는 next-env.d.ts 파일을 포함시킨다.
 "exclude": ["node_modules"] // 타입스크립트 컴파일 대상에서 제외시킬 파일 목록을 의미한다.
}

```

## next.config.js 작성

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 리액트 엄겸 모드 활성화
  poweredByHeader: false, // 보안 취약점인 X-Powered-By 헤더를 비활성화
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 eslint 검사를 하지 않도록 설정한다. 이후에 CI 과정에서 ESLint 검사를 진행할 예정이므로 빌드 시간 단축을 위함이다.
  },
  compiler: {
    styledComponents: true, // styled-components를 사용하기 위한 설정
  },
};

module.exports = nextConfig;

// https://github.com/vercel/next.js/blob/v14.1.0/packages/next/src/server/config-shared.ts 에서 사용 가능 옵션 참고
```

## ESLint와 Prettier 설정

```bash
npm i @titicaca/eslint-config-triple -D
```

```js
// .eslintrc.js
module.exports = {
  extends: [
    "@titicaca/eslint-config-triple",
    "@titicaca/eslint-config-triple/frontend",
    "@titicaca/eslint-config-triple/prettier",
    "next/core-web-vitals",
  ],
  rules: {
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
  },
};
```

## 스타일(styled-components) 설정

- styled-components 설치

```bahs
npm i styled-components
```

- `_documents.tsx` 에 ServerStyleSheet 추가

```tsx
// _documents.tsx 
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

export default function MyDocument() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        // useful for wrapping the whole react tree
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        // useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      });

    const initialProps: DocumentInitialProps =
      await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};

```

- next.config.js 설정에 complier 옵션에서 styledComponents를 true로 켜기
  - 이렇게 하면 swc가 styled-components를 사용하는 코드를 더 빨리 변환한다.

### scripts

```js
  "scripts": {
    "dev": "next dev",
    "start": "next start",
    "build": "next build",
    "lint:es": "eslint '**/*.{js,ts,tsx}'",
    "lint:fix": "npm run lint:es -- --fix",
    "prettier": "prettier '**/*' --check",
    "prettier:fix": "prettier '**/*' --write"
  },
```

<https://github.com/wonsss/next-app> 에서 위와 같은 방법으로 개발환경 설정을 진행했다.

> 참고 자료 : 모던 리액트 딥다이브 - 김용찬 -
