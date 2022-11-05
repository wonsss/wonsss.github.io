---
title: React 컴포넌트 테스트를 위한 좌충우돌 Jest 환경설정(React Testing Library, React Query, MSW) 
date: 2022-11-04 22:11:57
category: test
thumbnail: { thumbnailSrc }
draft: true
---

## 무엇을 테스트하고, 이를 위해 어떤 라이브러리가 필요할까

서버와 네트워크 통신 결과로 렌더된 리액트 페이지를 테스트하려고 한다.
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

React의 컴포넌트를 렌더링하고 테스트하기 위해서는 RTL과 Jest를 함께 사용해야 한다. Jest는 자체적인 test runner와 test util을 제공지만, 이외에 React 컴포넌트 test util을 사용하려면 RTL도 필요하기 때문이다. 즉, RTL은 test runner나 framework가 아니다. RTL은 Jest와 함께 사용하길 선호하나, 반드시 Jest에만 사용할 수 있는 것은 아니고 어떤 테스팅 프레임워크와도 함께 작동한다고 한다.

위에서 설명한 테스트 관련 라이브러리들을 일단 설치하자. 테스트는 개발 환경에서만 사용하니, devDependencies에 설치하는 것이 바람직한다.

```bash
yarn add jest -D
yarn add @testing-library/react -D
yarn add msw -D
```

## Jest 환경 설정하기(jest.config.ts)

스모디 프로젝트에서 설정한 Jest 환경 설정은 다음과 같다. 속성 하나 하나 의미와 사용 이유를 살펴보자.

```typescript
// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  bail: 2,
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'ts-jest',
    '^.+\\.svg$': 'jest-transformer-svg',
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.(js|jsx|ts|tsx)'],
  moduleDirectories: ['node_modules', 'src'],

  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/mocks/fileMock.js',
    '\\.(css|less)$': '<rootDir>/mocks/fileMock.js',
  },
  rootDir: './src',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  setupFiles: ['fake-indexeddb/auto'],
};

export default config;
```

### bail

기본적으로 Jest는 모든 테스트를 실행하고 완료되면 모든 에러를 콘솔에 생성한다. bail 설정 옵션은 Jest가 n번의 실패 후 중단할 수 있게 한다. 기본값은 0이다.

## React Query 테스트 관련 유의사항

# Jest

```typescript
// setupTests.ts
import MockIntersectionObserver from '__test__/MockIntersectionObserver';
import { server } from 'mocks/server';

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

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

beforeAll(() => {
  server.listen();
  window.IntersectionObserver = MockIntersectionObserver;
});

afterAll(() => {
  server.close();
  jest.resetAllMocks();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

beforeEach(() => {
  // @ts-ignore
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

jest.doMock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();
```

```typescript
// certPage.test.ts
import { renderWithProviders } from 'utils/testUtils';

import { screen, waitFor } from '@testing-library/react';

import { CertPage } from 'pages';

describe('인증 페이지 테스트', () => {
  beforeEach(() => {
    renderWithProviders(<CertPage />);
  });

  test('[useGetMyCyclesInProgress] query 응답에 따라 내가 진행중인 챌린지가 렌더링되는지 확인한다.', () => {
    jest.isolateModules(async () => {
      const challengeName = await waitFor(
        () => screen.getAllByLabelText('진행중인 챌린지 이름')[1],
      );
      await waitFor(() => expect(challengeName).toHaveTextContent('운동'));
    });
  });
});
```

## 참고

[react-testing-library 사용법](https://learn-react-test.vlpt.us/#/05-react-testing-library)
[초심자를 위한 React Testing Library](https://tecoble.techcourse.co.kr/post/2021-10-22-react-testing-library/)
[React Testing Library 공식문서](https://testing-library.com/docs/react-testing-library/intro/)
