---
title: React 컴포넌트 테스트를 위한 좌충우돌 Jest 환경설정(React Testing Library, React Query, MSW) 
date: 2022-11-04 22:11:57
category: test
thumbnail: { thumbnailSrc }
draft: false
---

## 1. 무엇을 테스트하고, 이를 위해 어떤 라이브러리가 필요할까

서버와 네트워크 통신 결과로 렌더된 리액트 페이지에서 상호작용을 테스트하려고 한다.

GET 요청의 결과 응답값으로 리액트 컴포넌트가 의도한대로 변경되었는지 Render 테스트한다.

POST, PUT, DELETE 같은 요청의 결과 응답값 등으로 리액트 컴포넌트가 의도한대로 변경되었는지 Mutation 테스트한다.

- React Query (테스트를 위한 것은 아님)

스모디 프로젝트에서는 React에서 서버와 네트워크 통신을 쉽게 다루게 해주는 라이브러리인 [React Query](https://wonsss.github.io/etc/react-query/)를 사용하고 있는데, 테스트 시 이와 관련한 설정이 필요하다.

- MSW

이를 테스트하기 위해, 네트워크 통신을 흉내내는 것을 돕는 도구인 `MSW`(Mock Service Worker)를 사용한다. MSW는 네트워크 호출을 차단한 후, 새로 정의한 핸들러에 따른 가짜 네트워크 응답을 반환한다.

- Jest

코드가 제대로 동작하는지 확인하는 test case를 만드는 테스팅 프레임워크인 `Jest`를 사용한다. 프레임워크라고 불리는 것처럼, Jest는 여러 테스팅 라이브러리의 기능(Test Runner, Test Matcher, Test Mock 등)을 통합하여 제공하기 때문에 이전에 비해 편리하다고 한다.

- React Testing Library(길다..줄여서 RTL)

`RTL`은 마치 최종 사용자가 사용하는 것처럼 리액트 컴포넌트를 테스트하기 위한 테스팅 라이브러리이다. [React 공식문서](https://reactjs.org/docs/test-utils.html#overview)에서 사용을 권장하는 라이브리러이다.
RTL을 통해 실제 화면에 무엇이 보이고 어떤 이벤트가 발생했을 때 화면에 원하는 변화가 생겼는지 등을 확인할 수 있다. 즉, 사용자의 관점에서 테스트할 수 있도록 DOM 위주의 렌더링 결과에 집중하는 테스팅 라이브러리라고 말할 수 있다.

React Testing Library builds on top of DOM Testing Library by adding APIs for working with React components.
RTL은 `DOM Testing Library` 기반 위에서 React 컴포넌트를 작업하기 위한 API들이 추가함으로써 빌드한다.

React의 컴포넌트를 렌더링하고 테스트하기 위해서는 RTL과 Jest를 함께 사용해야 한다. Jest는 자체적인 test runner와 test util을 제공하지만, 이외에 React 컴포넌트 test util을 사용하려면 RTL도 필요하기 때문이다. 즉, RTL은 test runner 또는 framework가 아니다. RTL은 Jest와 함께 사용하길 선호하나, 반드시 Jest에만 사용할 수 있는 것은 아니고 어떤 테스팅 프레임워크와도 함께 작동한다고 한다.

### 1-1. 설치

위에서 설명한 테스트 관련 라이브러리들을 일단 설치하자. 테스트는 개발 환경에서만 사용하니, devDependencies에 설치하는 것이 바람직한다.

```bash
yarn add jest -D
yarn add @testing-library/react -D
yarn add msw -D
```

또한, 코드를 transform하기 위해 babel-jest와 react나 babel의 preset이 필요하다.

```bash
yarn add babel-jest -D
yarn add @babel/preset-env -D
yarn add @babel/preset-react -D
yarn add @babel/preset-typescript -D  // typescript 사용시
```

그리고 babel 설정 파일에 사용할 preset들의 목록을 적어준다.

```javascript
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
};
```

## 2. Jest 환경 설정하기(jest.config.ts)

스모디 프로젝트에서 설정한 Jest 환경 설정은 다음과 같다. 속성 하나 하나 의미와 사용 이유를 살펴보자.

```typescript
// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|webp)$': '<rootDir>/mocks/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'ts-jest',
    '^.+\\.svg$': 'jest-transformer-svg',
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.(js|jsx|ts|tsx)'],
  moduleDirectories: ['node_modules', 'src'],
  rootDir: './src',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  setupFiles: ['fake-indexeddb/auto'],
};

export default config;
```

### 2-1. moduleFileExtensions

moduleFileExtensions은 사용할 모듈의 파일 확장자로 이루어진 배열이다. 파일 확장자를 적지 않고 모듈을 가져왔을 때, Jest가 이 설정 배열의 왼쪽에서부터 오른쪽 순서로 확장자를 적용하여 찾는다.

### 2-2. moduleNameMapper

```json
moduleNameMapper: {
  '\\.(jpg|ico|jpeg|png|gif|webp)$': '<rootDir>/mocks/fileMock.js',
},
```

이미지나 스타일 같은 리소스를 단일 모듈 stub(속이 빈 가짜 함수)으로 대체할 수 있도록, 모듈의 이름이나 모듈 이름 배열을 정규표현식으로 매핑하는 설정이다. 파일 경로를 사용하려면 `<rootDir>` 문자열 토큰을 사용한다. 순서대로 체크하기 대문에, 가장 구체적인 규칙을 첫번째에 둔다.

사용한 규칙인 `'\\.(jpg|ico|jpeg|png|gif|webp)$': '<rootDir>/mocks/fileMock.js',`는 이러한 이미지 확장자를 가진 파일들을 모킹한 함수로 대체하도록 한 것이다. 사용한 fileMock.js 코드는 다음과 같다.

```jsx
// mocks/fileMock.js
const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  },
};
```

### 2-3. transform

정규표현식을 transformer 경로로 매핑한다. transformer는 소스 파일을 변형하기 위한 동기적인 함수를 제공하는 모듈이다. 예를 들어, 아직 노드에서 지원되지 않는 새 언어 기능을 모듈이나 테스트에서 사용하려고 하면, future 버전 자바스크립트를 현재 사용 가능 버전으로 컴파일하는 컴파일러들을 플러그인으로 써야 한다.

transformer에게 `{filePattern: ['path-to-transformer', {options}]}`와 같은 설정을 넘길 수 있다.

```json
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'ts-jest',
    '^.+\\.svg$': 'jest-transformer-svg',
  },
```

- [ts-jest](https://www.npmjs.com/package/ts-jest)
  - ts-jest는 typescript로 작성된 프로젝트를 Jest로 테스트할 수 있도록 도와주는 Jest transformer이다.
  - 이번 프로젝트에서는 typescript를 사용하고 있어서 transform 설정에  `'^.+\\.(js|jsx|ts|tsx)?$': 'ts-jest',`처럼 ts-jest를 사용하였다.

- [jest-transfomer-svg](https://www.npmjs.com/package/jest-transformer-svg)
  - jest, react용으로 svg 파일을 깔끔한 스냅샷으로 변환하는 Jest transformer이다. 웹팩에서 [@svgr/webpack](https://www.npmjs.com/package/@svgr/webpack) 로더를 사용하여 svg를 리액트 컴포넌트로 바로 사용하고 있는데, 이 트랜스포머를 사용함으로써 svg도 스냅샷을 얻을 수 있다.

### 2-4. testEnvironment

```json
  testEnvironment: 'jsdom',
```

테스트하는 데 사용되는 테스트 환경을 의미한다. Jest의 기본 환경은 [jsdom](https://github.com/jsdom/jsdom) 을 통한 브라우저 같은 환경이다.
만약 node 서비스를 만든다면, `node` 옵션을 설정하여 node-like 환경을 대신 사용할 수 있다.

- jsdom
  - jsdom은 Node.js와 함께 사용하기 위해 많은 웹 표준(특히 WHATWG DOM 및 HTML 표준)의 순수 자바스크립트 구현체이다. 실제 웹 앱에 대한 test나 scrap에 유용하도록 웹 브라우저의 subset을 모방한 것이다

### 2-5. testMatch

```json
  testMatch: ['<rootDir>/**/*.test.(js|jsx|ts|tsx)'],
```

Jest가 테스트할 파일을 감지하는 데 사용하는 패턴이다. 기본적으로 `__test__` 폴더 내부의 `js|jsx|ts|tsx` 파일을 찾을뿐만 아니라, `.test` `.spec` 같은 suffix가 포함된 파일명을 찾는다. 굳이 위 옵션을 적지 않아도, 기본 패턴과 일치하므로 참고만 해도 좋다.

### 2-6. moduleDirectories

```json
  moduleDirectories: ['node_modules', 'src'],
```

디렉터리의 이름의 배열이며, 이는 요청된 모듈 위치를 찾는데 사용된다. 옵션을 설정하면 기본값을 덮어쓰므로, 여전히 `node_modules` 패키지를 찾고 싶으면 다른 옵션과 함께 적어야 한다.

### 2-7.  rootDir

```json
  rootDir: './src',
```

Jest가 테스트들과 모듈을 찾기 위해 스캔해야 하는 루트 디레턱리이다.

### 2-8. setupFilesAfterEnv

```json
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
```

setupFilesAfterEnv 설정은 suite 내부의 각각의 테스트 파일이 실행되기 전에 테스팅 프레임워크를 구성하거나 설정하기 위해 어떤 코드를 실행하는 모듈에 대한 경로의 목록이다.
위에서 설정한 루트디렉터리의 상대 경로로 설정하기 원한다면, `<rootDir>` 문자열을 경로의 문자열에 사용할 수 있다.

### 2-9. setupFiles

```json
  setupFiles: ['fake-indexeddb/auto'],
```

setupFiles 설정은 각각의 테스트 파일마다 실행된다. 모든 테스트는 각자 고유한 환경에서 실행되기 때문에, 이 스크립트는 테스팅 환경에서 테스트 코드가 실행되기 전에 즉시 실행될 것이다.

setupFiles는 setupFilesAfterEnv가 실행되기 전에 실행된다.

프로젝트 내부에서 indexedDB를 사용하는 코드가 있어서, Jest가 그 코드를 읽지 못하고 에러가 발생하는 문제가 있었다. 이를 해결하기 위해, IndexedDB API의 구현체인 `fake-indexeddb/auto`를 사용했다.

- [fake-indexeddb/auto](https://www.npmjs.com/package/fake-indexeddb)
  - 이 라이브러리의 주요 용도는 IndexedDB 의존적인 코드를 Node.js 환경에서 테스트하는 데 도움을 주기 위해서이다.
  - 모든 Jest 테스트 파일에서 매번 이 라이브러리를 가져올 필요 없이, Jest의 setupFiles 설정을 통해 자동으로 스크립트를 setup할 수 있다.

## 3. 테스팅 프레임워크 구성(setupTests.ts)

방금 Jest 환경설정에서 setupFilesAfterEnv를 통해 지정한 테스팅 프레임워크 설정(setupTests.ts)을 살펴보자.
프로젝트에서 사용한 해당 파일의 전체 코드는 다음과 같다.

테스트를 작성할 때, 테스트 실행 전에 수행해야 하는 설정 작업이 있고 테스트 실행 후 수행해야 하는 마무리 작업이 있을 것이다.
이 설정을 통해 반복 작업을 간소화할 수 있다.

많은 테스트에서 반복적으로 수행해야 하는 작업이 있으면, beforeEach나 afterEach를 사용할 수 있다.

또는 파일의 시작 부분에서 한번만 설정하고 싶은 설정은 beforeAll이나 afterAll을 사용할 수 있다.

MSW로 API 모킹의 시작과 마무리 및 리셋 등의 작업은 아래 코드에 주석으로 달았다.

```typescript
import MockIntersectionObserver from 'mocks/MockIntersectionObserver';
import 'mocks/matchMedia';
import { server } from 'mocks/server';

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
  // 모든 테스트들이 시작되기 전에 API 모킹을 준비되도록 한다
  server.listen(); 
  window.IntersectionObserver = MockIntersectionObserver;
});

afterEach(() => {
  // 테스트 도중 추가한 모든 요청 핸들러를 초기화하하여, 다른 테스트에 영향을 미치지 않도록 한다.
  server.resetHandlers(); 
});

afterAll(() => { 
  // 테스크가 끝난 후 마무리한다.
  server.close(); 
  jest.resetAllMocks();
});
```

jest.resetAllMocks()은 모든 mock들의 상태를 초기화한다.

### @testing-library/react에 없는 Web API 기능 mocking하기

프로젝트에서 IntersectionObserver와 matchMedia와 같은 Web API를 사용했는데, @testing-library/react에는 해당 인터페이스가 정의되어 있지 않기 때문에 테스트 실행 시 에러가 발생했다.

이 에러를 해결하려면 부족한 함수를 mocking하고, 그것을 setupTests에서 호출해주면 된다.

```jsx
import MockIntersectionObserver from 'mocks/MockIntersectionObserver';
import 'mocks/matchMedia';
```

- mocks/MockIntersectionObserver.ts 코드 전체

```typescript
export default class {
  readonly root: Element | null;

  readonly rootMargin: string;

  readonly thresholds: ReadonlyArray<number>;

  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }

  disconnect() {}

  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {}
}
```

[JS - Testing code that uses an IntersectionObserver](https://stackoverflow.com/questions/44249985/js-testing-code-that-uses-an-intersectionobserver)

- mocks/matchMedia.ts 코드 전체

```typescript
import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

이외에도 undefined 에러가 발생하는 Web API 인터페이스는 이와 같이 모킹하여 setupTest에서 실행해준다.

[MSW - Integrate Node](https://mswjs.io/docs/getting-started/integrate/node)

## 4. 테스트할 컴포넌트를 provider와 함께 render하기

프로젝트에서 Router, ThemeProvider, QueryClientProvider, Recoil 등을 사용했다면, 컴포넌트를 렌더하는 테스트에서도 마찬가지로 이러한 provider들을 해당 컴포넌트에 wrapping하여 render해야 한다.

예를 들어, 프로필 페이지를 테스트하려면 테스트 전에 프로필 페이지 컴포넌트를 `@testing-library/react`의 `render` 메서드를 사용하여 렌더해야 한다.
그러나 render 메서드에 인자로 `<ProfilePage />` 넘기면 안되고, 프로젝트에서 실제로 적용된 프로바이더들로 감싸서 넘겨야 한다.
프로바이더로 감싸서 렌더하는 작업은 반복되므로, 해당 작업을 `renderWithRouteAndProviders`라는 함수로 만들어 분리하였다.

```tsx
// profile.test.tsx
import { renderWithProviders } from '__test__/renderWithProviders';
import { ProfilePage } from 'pages';

describe('프로필 페이지 테스트', () => {
  beforeEach(() => {
    renderWithProviders(<ProfilePage />);
  });
)
```

```tsx
// testUtils.tsx
import { generateQueryClient } from 'queryClient';
import { ReactElement } from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';

import { render, RenderResult } from '@testing-library/react';

import { darkTheme } from 'styles/theme';

export const generateTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  });

export const renderWithProviders = (Component: ReactElement): RenderResult => {
  return render(
    <RecoilRoot>
      <QueryClientProvider client={generateTestQueryClient()}>
        <ThemeProvider theme={darkTheme}>
          <MemoryRouter>{Component}</MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>,
  );
};
```

- recoil 사용했다면 `<RecoilRoot>`로 감싼다.
- ReactQuery를 사용했다면 client와 함께 `<QueryClientProvider>`로 감싼다.
- styled-components를 통해 다크모드도 적용했기에 `<ThemeProvider>`로 감산다.
- react-router-dom의 `[<MemoryRouter>](https://reactrouter.com/en/main/router-components/memory-router)`은 위치를 배열로서 내부에 저장한다. BrowserHistory나 HashHistory와 다르게, 브라우저의 히스토리 스택과 같은 외부 소스에 묶이지 않는다. 테스트와 같이 히스토리 스택에 대한 완벽한 제어가 필요한 경우 사용하는 것이 적절하다.
  
테스트 환경설정은 여기까지~ :)

## 참고

[React Testing Library 공식문서](https://testing-library.com/docs/react-testing-library/intro/)

[Jest 공식문서 - Configuring Jest](https://archive.jestjs.io/docs/en/configuration.html)

[초심자를 위한 React Testing Library](https://tecoble.techcourse.co.kr/post/2021-10-22-react-testing-library/)

[react-testing-library 사용법](https://learn-react-test.vlpt.us/#/05-react-testing-library)
