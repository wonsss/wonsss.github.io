---
title: React Query v5에서 변경사항
date: 2023-03-16 02:03:57
category: library
thumbnail: { thumbnailSrc }
draft: false
---

TanStack Query v5가 곧 release될 예정이며, 현재(2023.3.16)는 pre-release되어 있습니다.

v5는 메이저 버전이므로, 주의해야 할 주요 변경 사항이 있습니다. 주요 변경 사항에 대한 [관련 공식 문서](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5#eternal-list-scalable-infinite-query-with-new-maxpages-option)를 의역하며 내용을 정리했습니다.

# Breaking Changes

## 1. 하나의 함수 호출 시그니처(객체 형식)만을 지원

useQuery와 그와 비슷한 친구들(useInfiniteQuery 등)은 타입스크립트에서 많은 오버로드를 가지곤 했습니다.  이는 타입을 잘 유지하기 어려웠을 뿐만 아니라, option을 올바르게 생성하기 위해 첫 번째 또는 두 번째 매개변수가 어떤 타입인지 확인하는 런타임 검사도 필요했습니다.

따라서 v5부터는 오직 객체 형식만 지원합니다.

```diff
// useQuery
- useQuery(key, fn, options)
+ useQuery({ queryKey, queryFn, ...options })
- useInfiniteQuery(key, fn, options)
+ useInfiniteQuery({ queryKey, queryFn, ...options })
- useMutation(fn, options)
+ useMutation({ mutationFn, ...options })
- useIsFetching(key, filters)
+ useIsFetching({ queryKey, ...filters })
- useIsMutating(key, filters)
+ useIsMutating({ mutationKey, ...filters })

// queryClient
- queryClient.isFetching(key, filters)
+ queryClient.isFetching({ queryKey, ...filters })
- queryClient.ensureQueryData(key, filters)
+ queryClient.ensureQueryData({ queryKey, ...filters })
- queryClient.getQueriesData(key, filters)
+ queryClient.getQueriesData({ queryKey, ...filters })
- queryClient.setQueriesData(key, updater, filters, options)
+ queryClient.setQueriesData({ queryKey, ...filters }, updater, options)
- queryClient.removeQueries(key, filters)
+ queryClient.removeQueries({ queryKey, ...filters })
- queryClient.resetQueries(key, filters, options)
+ queryClient.resetQueries({ queryKey, ...filters }, options)
- queryClient.cancelQueries(key, filters, options)
+ queryClient.cancelQueries({ queryKey, ...filters }, options)
- queryClient.invalidateQueries(key, filters, options)
+ queryClient.invalidateQueries({ queryKey, ...filters }, options)
- queryClient.refetchQueries(key, filters, options)
+ queryClient.refetchQueries({ queryKey, ...filters }, options)
- queryClient.fetchQuery(key, fn, options)
+ queryClient.fetchQuery({ queryKey, queryFn, ...options })
- queryClient.prefetchQuery(key, fn, options)
+ queryClient.prefetchQuery({ queryKey, queryFn, ...options })
- queryClient.fetchInfiniteQuery(key, fn, options)
+ queryClient.fetchInfiniteQuery({ queryKey, queryFn, ...options })
- queryClient.prefetchInfiniteQuery(key, fn, options)
+ queryClient.prefetchInfiniteQuery({ queryKey, queryFn, ...options })

// queryCahce
- queryCache.find(key, filters)
+ queryCache.find({ queryKey, ...filters })
- queryCache.findAll(key, filters)
+ queryCache.findAll({ queryKey, ...filters })
```

## 2. `queryClient.getQueryData` 와 `queryClient.getQueryState` 는 인자로 queryKey만 받도록 변경됨

```diff
- queryClient.getQueryData(queryKey, filters)
+ queryClient.getQueryData(queryKey)
```

```diff
- queryClient.getQueryState(queryKey, filters)
+ queryClient.getQueryState(queryKey)
```

### Codemod

함수 오버로드를 제거하는 마이그레이션을 쉽게 하기 위해, v5에서는 codemode를 제공합니다.

> codemode는 breaking change로 마이그레이션할 때 도와주는 최고의 도구입니다. 이를 통해 생성된 코드를 철저히 리뷰해주세요! 또한, codemode를 통해 발견되지 못한 엣지 케이스가 있을 수 있으므로, log 결과를 주의 깊게 살펴봐주세요.
>

만약 `.js` 와 `.jsx` 파일을 대상으로 codemod를 실행하기 원한다면, 아래 명령어를 사용하세요.

```bash
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v5/remove-overloads/remove-overloads.js
```

만약 `.ts` 와 `.tsx` 파일을 대상으로 codemod를 실행하기 원한다면, 아래 명령어를 사용하세요.

```bash
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v5/remove-overloads/remove-overloads.js
```

`Typescript` 의 경우 parser로서 `tsx` 를 사용해야 함에 주의하세요. 그렇지 않으면, codemod는 적절하게 적용되지 않을 것입니다.

Note: codmod를 적용하는 것은 코드 포맷에 영향을 줄 수 있으므로, codemode 실행 후 `prettier` 및 `eslinit` 를 실행하는 것을 잊지마세요!

- codemod 동작 원리에 대한 참고 내용
  - 첫 번째 매개변수가 객체 표현식이고 queryKey나 mutationKey 프로퍼티를 포함하고 있다면, 이 코드는 이미 새로운 함수 호출 시그니처를 충족하고 있으므로 codemode가 건드리지 않는다(럭키 케이스).
  - 만약 상기 조건이 충족되지 않는다면, codemod는 첫 번째 매개변수가 배열 표현식이거나 배열 표현식을 참조하는 식별자인지 여부를 확인합니다. 만약 이 케이스에 해당한다면, codemode는 이 매개변수를 객체 표현식 안에 넣은 후 해당 객체를 매개변수로 만듭니다.
  - 만약 매개변수의 타입이 객체로 추론된다면, codemod는 이미 존재하는 프로퍼티를 새로 생성된 프로퍼티에 복사하려고 시도합니다.
  - 만약 codemod가 타입을 추론하지 못한다면, 콘솔에 해당 파일명과 라인 넘버가 담긴 메세지를 남깁니다. 이런 경우, 개발자가 해당 코드에 대하여 직접 마이그레이션을 해야 합니다.
  - 만약 codemod로 인한 변경 결과 에러가 발생한다면, 콘솔에서 무언가 예상치 못한 동작이 발생했다는 메세지를 확인할 수 있습니다. 이런 경우도 마찬가지로 개발자가 직접 마이그레이션을 해야 합니다.

## 3. useQuery에서 `remove` 메서드가 제거됨

remove 메서드는 queryCache에서 query를 제거할 때 옵저버에게 이 행동을 알리지 않고도 행할 수 있는 방식이었습니다. 이 방법은 더 이상 필요하지 않은 데이터를 명령적으로 제거하는 최고의 방법이었습니다. (e.g. 사용자 로그아웃 시)

그러나 query가 여전히 active한 경우, 이러한 remove 메서드의 행위는 말이 되지 않습니다. 왜냐하면 remove 메서드는 다음 리렌더에서 hard loading state를 트리거할 뿐이기 때문입니다.

v5부터 query를 제거하려면, `queryClient.removeQueries({queryKey: key})` 를 사용하세요.

```diff
const queryClient = useQueryClient();
 const query = useQuery({ queryKey, queryFn });
- query.remove()
+ queryClient.removeQueries({ queryKey })
```

## 4. 타입스크립트 최소 요구 버전이 `4.7`로 변경됨

타입스크립트에서 해당 버전 이후부터 타입 추론 관련하여 중요한 버그 [수정](https://github.com/microsoft/TypeScript/issues/43371)이 있었기 때문입니다.

## 5. useQuery에서 `isDataEqual` 옵션이 제거됨

`isDataEqual` 함수는 query에서 resovle된 데이터로서 이전 데이터를 사용할지 아니면 새 데이터를 사용할지 확인하는 데 사용됐습니다.

이제는 `isDataEqual` 를 사용하지 않고,  동일한 기능을 **`structuralSharing` 에 함수를 넘김으로써 대신합니다.**

```diff
import { replaceEqualDeep } from '@tanstack/react-query'

- isDataEqual: (oldData, newData) => customCheck(oldData, newData)
+ structuralSharing: (oldData, newData) => customCheck(oldData, newData) ? oldData : replaceEqualDeep(oldData, newData)
```

## 6. deprecate된 custom logger가 제거됨

커스텀 로거는 v4에서 이미 deprecate되었고 이번 v5에서 제거됩니다.

## 7. 지원 브라우저 변경

더 모던하며 성능이 좋은 작은 번들로 만들기 위해, browserslist를 업데이트하였습니다.

다음 브라우저에서 호환됩니다.

```diff
Chrome >= 84
Firefox >= 90
Edge >= 84
Safari >= 15
iOS >= 15
opera >= 70
```

## 8. Private class 필드와 메서드

TanStack Query는 언제나 class에서 private 필드와 메서드를 갖고 있었으나, 이들은 TypeScript에서만 그저 private일 뿐이었고 진짜 private이 아닙니다.

그러나 이제는 **[ECMAScript Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) 를 사용하기 때문에, 해당 필드들이 정말로 private이 되었고 런타임에 외부에서 접근할 수 없습니다.**

## 9. `cacheTime` 을 `gcTime` 으로 이름 변경

대부분의 개발자들이 `cacheTime` 을 오해하고 있습니다. `cacheTime`은 마치 “데이터가 캐시되는 시간의 합계”처럼 들리는데, 이는 틀린 말입니다.

`cacheTime` 은 query가 여전히 사용되고 있는 경우에는 시간을 재지 않다가, query가 사용되지 않는 즉시 시간을 재기 시작합니다. 해당 시간이 다 지나면, 해당 데이터는 garbage collect 됩니다.

`gc` 는 “garbage collect” 시간을 의미합니다. 이는 조금 기술적인 용어이긴 하나, 컴퓨터 과학에서 잘 알려진 약어이기도 합니다.

```diff
const MINUTE = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
-      cacheTime: 10 * MINUTE,
+      gcTime: 10 * MINUTE,
    },
  },
})
```

## 10. `useErrorBoundary` 옵션 이름이 `throwErrors` 로 변경됨

특정 프레임워크에 종속되지 않으면서 React의 훅의 접미사인 “use”와 “ErrorBoundary” 컴포넌트명과 혼동을 피하기 위해, `useErrorBoundary` 옵션의 이름을 `throwErrors` 로 변경하였습니다. 변경된 이름이 기능을 보다 정확하게 반영합니다.

## 11. 타입스크립트: 에러의 기본 타입이 `unknown` 에서 `Error` 로 변경됨

에러의 기본 타입은 `Error` 입니다. 왜냐하면 이것이 대부분의 사용자가 기대하는 결과이기 때문입니다.

```tsx
const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const error: Error
```

만약 커스텀 에러를 던지고 싶거나 Error가 아닌 것을 던지고 싶다면, 에러 필드의 타입을 구체화할 수 있습니다.

```tsx
const { error } = useQuery<Group[], string>(['groups'], fetchGroups)
//      ^? const error: string | null
```

[https://tanstack.com/query/v5/docs/react/typescript#typing-the-error-field](https://tanstack.com/query/v5/docs/react/typescript#typing-the-error-field)

## 12. eslint `prefer-query-object-syntax` 규칙이 제거됨

지원되는 구문이 객체밖에 없어서, 해당 규칙은 더 이상 필요치 않게 되었습니다.

## 13. `keepPreviousData` 를 제거함

`keepPreviousData` 옵션과 **`isPreviousData` 플래그를 제거하였습니다. 왜냐하면 이들은 `placeholderData` 와 `isPlaceholderData` 플래그와 거의 유사한 동작을 하기 때문입니다.**

```diff
const {
   data,
-  isPreviousData,
+  isPlaceholderData,
} = useQuery({
  queryKey,
  queryFn,
- keepPreviousData: true,
+ placeholderData: keepPreviousData
});
```

하지만 이 변경 사항에는 몇 가지 주의 사항이 있습니다.

- `keepPreviousData` 가 이전 query의 상태를 주었던 것과 다르게, **`placeholderData` 는 언제나 `success` 상태를 줍니다. 이는 데이터를 성공적으로 가져온 후 백그라운드 refetch에러가 발생한 경우, 이러한 success 상태는 잘못된 것으로 볼 수 있습니다. 그러나 에러 자체가 공유되지는 않았으므로, `placeholderData` 의 동작을 그대로 사용하기로 결정했습니다.**
- **`keepPreviousData` 를 사용할 때는 이전 데이터의 `dataUpdatedAt` 타임 스탬프가 제공되던 것과 다르게,`placeholderData` 를 사용하면 `dataUpdatedAt` 은 0으로 유지됩니다. 만약 타임스탬프를 화면에 계속적으로 보여주고 싶은 경우에 이러한 동작은 짜증이 날 수 있습니다. 하지만 `useEffect` 훅을 사용함으로써 이 문제를 해결할 수는 있습니다.**

```tsx
const [updatedAt, setUpdatedAt] = useState(0)

const { data, dataUpdatedAt } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
})

useEffect(() => {
  if (dataUpdatedAt > updatedAt) {
    setUpdatedAt(dataUpdatedAt)
  }
}, [dataUpdatedAt])
```

## 14. Window focus refetch는 이제`focus` 이벤트를 listen하지 않음

 TanStack Query는 **`visibilitychange` 이벤트를 지원하는 브라우저만 지원하게 됐기 때문에, 이제 `visibilitychange` 이벤트만 독점적으로 사용됩니다.  이를 통해 [focus 이벤트와 관련된 버그](https://github.com/TanStack/query/pull/4805) 들이 해결됐습니다.**

## 15. 커스텀 `context` prop을 제거함

커스텀 `queryClient` 인스턴스를 위해 커스텀 `context` prop을 제거하였습니다.

v4에서 커스텀 `context` 를 모든 리액트 쿼리 훅에 전달할 수 있는 방법을 제공하였습니다. 이는 마이크로프론트엔드 사용 시 적절한 격리를 가능하게 했습니다.

하지만, `context` 는 리액트에서만 사용 가능한 기능입니다. context는 queryClient에 접근권을 주는 역할을 할뿐입니다. 이와 동일한 기능을 커스텀 `queryClient` 를 직접 전달 가능하게 함으로써 해결했습니다. 이를 통해 특정 프레임워크에 구애받지 않으면서 동일한 기능을 가능하게 했습니다.

```diff
import { queryClient } from './my-client'

const { data } = useQuery(
  {
    queryKey: ['users', id],
    queryFn: () => fetch(...),
-   context: customContext
  },
+  queryClient,
)
```

## 16. `refetchPage` 를 제거함

`maxPages` 를 위해 `refetchPage` 를 제거했습니다.

`refetchPage` 가 모든 페이지를 refetch하는 방법은 UI 불일치로 이어질 수 있습니다.

v5는 Infinite Queries가 query 데이터에 저장하고 refetch 할 페이지 수를 제한할 수 있는 방법으로 `maxPages` 옵션을 제공합니다.

## 17. Infinite Query는 이제 `defaultPageParam` 이 필요함

이전에는 undefined를 queryFn에 pageParam으로 전달할 수 있었습니다. 또는 queryFn 함수 호출 시그니처에서 pageParam 매개변수를 기본값으로 할당할 수도 있었습니다. 이는 직렬화될 수 없는 undefined를 queryCache에 저장한다는 단점이 있었습니다.

대신에 이제 Infinite Query 옵션에 명시적인 `defaultPageParam` 을 전달합니다.

```diff
useInfiniteQuery({
   queryKey,
-  queryFn: ({ pageParam = 0 }) => fetchSomething(pageParam),
+  queryFn: ({ pageParam }) => fetchSomething(pageParam),
+  defaultPageParam: 0,
   getNextPageParam: (lastPage) => lastPage.next,
})
```

# React Query에서 Breaking Changes

## 18. QueryClientProvider에서 `contextSharing` prop이 제거됨

## 19. React와 React Native에서 함수를 batch할 때, `unstable_batchedUpdates` 를 더 이상 사용하지 않음

## 20. `Hydrate` 는 `HydrationBoundary` 로 이름이 변경됐고, `useHydrate` 훅은 제거됨

## 21. `status: loading` →`status: pending` ,`isLoading` → `isPending`, `isInitialLoading` → `isLoading`

loading 상태의 이름이 pending으로 변경되었습니다.

# 새 기능

## 22.  simplified optimistic update

optimistic update를 수행할 수 있는 간단한 새로운 방법으로서 `useMutation`에서 반환된 `variables` 를 이용합니다.

```tsx
const queryInfo = useTodos()

const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

if (queryInfo.data) {
  return (
    <ul>
      {queryInfo.data.items.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
      {addTodoMutation.isPending && (
        <li
          key={String(addTodoMutation.submittedAt)}
          style={{opacity: 0.5}}
        >
          {addTodoMutation.variables}
        </li>
      )}
    </ul>
  )
}
```

## 23. 새로운 `maxPages` 옵션이 담긴 확장 가능한 Infinite Query

Infinite Query 는 많은 페이지를 가져올수록, 더 많은 메모리를 소비하고, 이는 모든 페이지가 순차적으로 refetch되어야 하므로 query refetch 과정을 느려지게 합니다.

v5는 maxPages 옵션을 제공항므로써, 쿼리 데이터에 저장되며 순차적으로 refetch되는 페이지의 개수를 제한하는 것을 허용합니다.

무한 목록은 반드시 양방향이어야 하며, 이는 `getNextPageParam` 과 `getPreviousPageParam` 이 정의되어야 함을 주의하세요.

## 24. CreateStore

쿼리가 내부적으로 저장되는 방법을 커스터마이징하는 방법을 만들었습니다. 기본적으로 `Map` 자료구조가 사용되지만, 새로운 `createStore` 함수를 통하여 원하는 어떤 자료구조든 사용할 수 있습니다.

```tsx
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    createStore: () => new Map()
  }),
})
```
