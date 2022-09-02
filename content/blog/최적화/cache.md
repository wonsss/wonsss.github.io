---
title: 같은 건 매번 새로 요청하지 않기(CloudFront 캐시, 클라이언트 내 캐시)
date: 2022-09-03 02:09:42
category: 최적화
thumbnail: { thumbnailSrc }
draft: false
---

## CloudFront 캐시 설정 (설정값, 해당 값을 설정한 이유 포함)

> [https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/Expiration.html](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)

- 특정 콘텐츠가 브라우저 캐시를 사용할지 아닐지는 일반적으로 `웹 서버` 에서 먼저 결정해야 한다.

  - `웹 서버` 는 다음과 같이 캐시 생존 기간(TTL, Time To Live) 설정 내용을 `Cache-Control` 응답 헤더를 통해 `클라이언트` 에게 전달한다.

    ```json
    Cache-Control: max-age=3600 // 브라우저가 다운로드한 후 1시간 동안 캐시 사용 가능
    ```

  - 캐시 비허용

    ```json
    Cache-Control: no-store
    ```

  - 원본 서버의 콘텐츠 변경 확인

    - 브라우저 캐시를 사용하지만, 원본 서버의 콘텐츠 갱신 여부를 확인하여 변경이 없을 때만 캐시된 콘텐츠를 사용하도록 설정

      ```json
      Cache-Control: no-cache
      ```

  - 캐시 불가 명시

    ```json
    Cache-Control: no-cache, no-store, must-revalidate
    ```

  - 캐시 가능 명시

    ```json
    Cache-Control: public, max-age=31536000
    ```

- 캐시 정책

  - S3에서 특정 파일 각각 메타테이터로 캐시 설정
    - ex) bundle.js, index.html 일주일(`604800`)
      ![S3 설정](../image/p11.jpg)
  - CloudFront 에서 나머지 파일(이미지 등 정적 파일) 캐시 설정
    - ex) 1년(31536000)
      ![CloudFront 설정](../image/p12.jpg)

## API 호출 응답값을 클라이언트에서 캐싱

### cache 유틸 함수 생성

- 선 캐시, 후 네트워크

```jsx
// cache.ts
const cacheStorage: Record<string, unknown> = {}

export const cache = (cacheKey: string, fetcher: Function) => {
  if (cacheStorage[cacheKey]) {
    console.log('캐시', cacheStorage[cacheKey])
    return cacheStorage[cacheKey]
  }

  const response = fetcher()
  console.log('네트워크', response)
  cacheStorage[cacheKey] = response

  return response
}
```

```jsx
// gifApiService.ts
import { cache } from '../cache'

const gifs: GifsResult = await cache(`search-${keyword}`, () =>
  gf.search(keyword, searchOptions)
)
```

- caching 결과 캡처
  ![caching 결과 캡처](../image/caching.gif)
