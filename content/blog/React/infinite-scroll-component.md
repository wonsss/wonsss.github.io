---
title: React에서 무한스크롤을 돕는 InfiniteScroll 컴포넌트 만들기
date: 2022-12-11 16:12:84
category: react
thumbnail: { thumbnailSrc }
draft: false
---

## InfiniteScroll 컴포넌트 설명

다음은 프로젝트할 때 만들었던 InfiniteScroll 컴포넌트 코드 전체이다.
반복되는 무한스크롤 적용을 조금 더 편리하게 하기 위해, 복잡한 로직은 감추고 사용부만 드러내는 추상화를 한 결과 본 컴포넌트를 만들었다.

[react-infinite-scroll-component](https://www.npmjs.com/package/react-infinite-scroll-component) 라이브러리의 사용 인터페이스와 비슷하게 구현해보려고 했다.

우선 본 컴포넌트 사용 예시부터 살펴보자.

## 컴포넌트 사용 예시

다음 두 예시처럼 `<InfiniteScroll>`은 useInfiniteQuery 훅에 대하여 사용하기 편리하다.
컴포넌트의 props로 `loadMore`, `hasMore`, `loader`이 있고, `children`으로 무한스크롤할 콘텐츠(node list)를 받는다.

`loadMore` prop은 바닥에 닿으면 호출해야 하는 함수이며, 호출 시 다음 데이터를 가져오도록 트리거한다. 여기에 리액트쿼리의 useInfiniteQuery의 `fetchNextPage`를 넣으면 된다.  

`hasMore` prop은 바닥에 닿으면 다음 함수를 호출할지 여부에 대해 컴포넌트에게 알려준다.  여기에는 리액트쿼리의 useInfiniteQuery의 `hasNextPage`를 넣으면 된다.

`loader` props에는 다음 데이터의 로딩을 기다리는 동안 표시할 로딩 스피너나 메시지 등을 컴포넌트로 넘길 수 있다.

```tsx
// 첫번째 예시
import { InfiniteScroll, LoadingSpinner, FeedItem} from 'components';

const Feeds = () => {
  const {
    data: feedInfiniteData,
    hasNextPage,
    fetchNextPage,
  } = useGetAllFeeds(); // ReactQuery useInfiniteQuery hook

  return (
    <InfiniteScroll
      loadMore={fetchNextPage}
      hasMore={hasNextPage}
      loader={<LoadingSpinner />}
    >
      <div>
        {feedInfiniteData?.pages.map((page) =>
          page?.data.map((feedInfo) => (
            <li key={feedInfo.cycleDetailId}>
              <FeedItem {...feedInfo} />
            </li>
          )),
        )}
      </div>
    </InfiniteScroll>
  );
}
```

```tsx
// 두번째 예시
import { InfiniteScroll, LoadingMessage, CardBox} from 'components';

export const Cards = () => {
  const {
    data: myChallengeInfiniteData,
    hasNextPage,
    fetchNextPage,
  } = useGetMyChallenges(); // ReactQuery useInfiniteQuery hook

  return (
      <InfiniteScroll
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
        loader={<LoadingMessage />}
      >
        <div>
          {myChallengeInfiniteData?.pages.map((page) =>
            page?.data?.map((challenge) => (
              <CardBox key={challenge.challengeId} {...challenge} />
            )),
          )}
        </div>
      </InfiniteScroll>
  );
};

```

## InfiniteScroll 컴포넌트 전체 코드 설명

```typescript
// InfiniteScroll.tsx 전체 코드

import { RefObject, useMemo, useRef, PropsWithChildren, ReactNode} from 'react';
import styled from 'styled-components';

import useIntersect, { OnIntersect } from 'hooks/useIntersect'; // 아래에 해당 hook 코드도 있다.

type InfiniteScrollProps = {
  loadMore: () => void;
  hasMore?: boolean;
  loader?: ReactNode;
  threshold?: number;
};

export const InfiniteScroll = ({
  children,
  loadMore,
  hasMore,
  loader,
  threshold = 0.5,
}: PropsWithChildren<InfiniteScrollProps>) => {
  const rootRef = useRef() as RefObject<HTMLDivElement>;

  const onIntersect: OnIntersect = (entry, observer) => {
    if (hasMore) {
      loadMore();
    }
    observer.unobserve(entry.target);
  };
  const options = useMemo(() => ({ root: rootRef.current, threshold }), []);
  
  const targetRef = useIntersect<HTMLDivElement>(onIntersect, options);

  return (
    <Wrapper ref={rootRef} flexDirection="column">
      {children}
      <div ref={targetRef} />
      {isFetching && loader}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;
```

useIntersectRef는 InfiniteScroll 컴포넌트에서 onIntersect와 options를 인자로 받는다. 그리고 IntersectionObserver를 통해 관찰 요소에 observe 이벤트를 부착하고 관찰 요소의 ref를 반환한다.

```typescript
// useIntersectRef.ts 전체 코드

import { useRef, useEffect, useCallback } from 'react';

export type OnIntersect = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver,
) => void;

const useIntersectRef = <T extends HTMLElement>(
  onIntersect: OnIntersect,
  options: IntersectionObserverInit,
) => {
  const ref = useRef<T>(null);
  const callback = useCallback<IntersectionObserverCallback>(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry, observer);
        }
      });
    },
    [onIntersect],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [callback]);

  return ref;
};

export default useIntersectRef;
```

Intersection observer는 설정한 요소와 뷰포트가 교차하는 지점을 관찰함으로써, 해당 요소가 현재 화면에 보이는 요소인지 여부를 구별한다.

생성자 함수는 `new IntersectionObserver(callback, options)`처럼 callback과 options라는 2개의 인수를 받으며, 이를 통해 관찰할 요소를 지정한다.

인스턴스의 observe 메서드를 호출하여 대상 요소에 관찰을 시작한다.

```typescript
const observer = new IntersectionObserver(callback, options);
observer.observe(ref.current);
```

callback은 다음과 같이 entries와 observer를 인자로 받는다.

```typescript
// callback의 호출시그니처
interface IntersectionObserverCallback {
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
}
```

callback에 useIntersectRef 훅이 InfiniteScroll로부터 전달받은 onIntersect 함수를 전달하며, IntersectionObserverEntry 인스턴스의 배열인 entries에 대해 각각 onIntersect하도록 지정한다. 관찰 요소의 가시성에 변화가 생기면 IntersectionObserver는 callback을 실행한다.

```typescript
  const callback = useCallback<IntersectionObserverCallback>(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry, observer);
        }
      });
    },
    [onIntersect],
  );
```

관찰할 대상(Target)이 등록되거나 가시성(Visibility, 보이는지 보이지 않는지)에 변화가 생기면 관찰자는 콜백(Callback)을 실행합니다.
콜백은 2개의 인수(entries, observer)를 가진다.

entries는 IntersectionObserverEntry 인스턴스의 배열이며, IntersectionObserverEntry는 isIntersecting, target 등의 속성을 지닌다.

isIntersecting이 true이면 관찰 요소가 루트 요소(option을 통해 알린 rootRef의 요소)와 교차 상태가 된 것이고, useIntersectProps는 props로 받은 onIntersect 함수에 entry와 observer를 전달하여 실행한다.

InfiniteScroll 컴포넌트에서 onIntersect 함수 코드는 다음과 같았다. 데이터가 더 있으면(hasMore) 더 fetch하고(loadMore), 이후 대상 요소의 관찰을 중지한다(observer.unobserve(entry.target)).

```typescript
  const onIntersect: OnIntersect = (entry, observer) => {
    if (hasMore) {
      loadMore();
    }
    observer.unobserve(entry.target);
  };
```
