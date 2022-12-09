---
title: ReactQuery의 select 옵션을 사용하여 클라이언트에서 서버 데이터를 가공하여 받기
date: 2022-12-10 04:12:42
category: react
thumbnail: { thumbnailSrc }
draft: false
---

서버에서 데이터를 원하지 않는 속성의 이름 혹은 원하지 않는 객체 형식(nested object)으로 주는 경우가 있다. 서버와 클라이언트는 분리된 영역으로 간주하여, 클라이언트에서는 해당 데이터를 클라이언트 코드의 입장에 맞추어 가공해서 사용하는 것이 좋다. 이런 경우에 React Query를 이용하여 서버에서 받은 데이터를 가공하여 제공하는 방법을 살펴보자.

## 트랜스포머 레이어

- 서버에서 보내준 데이터(before)

```json
{
    item_no: 1,
    item_name: '아이폰',
    image_url: 'https://image.com/123.jpg',
    item_price: 100000,
    available: false,
},
```

서버에서는 위의 예시처럼 보내줬다 하더라도 클라이언트에서는 아래와 같이 카멜케이스 및 컴포넌트가 요구하는 대로 수정하고 싶을 수 있다.

- 클라이언트에서 사용하기 위해 변형한 데이터(after)

```json
{
    id: 1,
    name: '아이폰',
    imageUrl: 'https://image.com/123.jpg',
    price: 100000,
    isAvailable: false,
},
```

이렇게 변형하기 위한 방법으로는 여러 가지가 있을 수 있다.

가능하다면, API 작성 시 프론트엔드와 벡엔드가 함께 협의할 수 있겠으나, 각자의 사정이 있을 수 있고 이미 만들어져 변경이 어려울 수도 있다.

따라서 서버에 의존적이지 않도록 코드를 작성하는 방법으로서 React Query에서 select 옵션 내부에서 트랜스포머 레이어를 두어 변형하는 방법이 효과적이다.

## Select 옵션

### useQuery

useQuery의 경우, 다음과 같이 select 옵션을 사용함으로써 서버로부터 받은 데이터를 클라이언트에서 받기 전에 변환하는 트랜스포머 레이어를 둘 수 있다.

```tsx
type ProductFromServer = {
    item_no: number;
    item_name: string;
    image_url: string;
    price: number;
    available: boolean;
};

type Product = {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    isAvailable: boolean;
};

function transformProductArray(products: ProductFromServer[]): Product[] {
  const transformProduct = (product: ProductFromServer) => ({
    id: product.item_no,
    name: product.item_name,
    imageUrl: product.image_url,
    price: product.price,
    isAvailable: product.available,
  });

  return products.map((product) => transformProduct(product));
}
```

useQuery의 select 옵션에 위에서 작성한 transformProductArray 함수를 넣는다.

```tsx
const useQueryProducts = () => {
  return useQuery(["products"], getProducts, {
    select: (data) => transformProductArray(data),
  });
};
```

### useInfiniteQuery

useInfiniteQuery의 경우, select 옵션을 사용하여 데이터를 재구성할 때, `data.pages` 와 `data.pageParams` 속성이 계속 담겨져 있어야 한다.

따라서 useInfiniteQuery에서는 다음과 같은 방법으로 transformProductArray 함수를 select 옵션에 넣음으로써 서버 데이터를 가공하여 받을 수 있다.

```tsx
const useInfiniteQueryProducts = () => {
  return useInfiniteQuery(
    ['products'],
    ({ pageParam }) => getProducts({ cursorId: pageParam }),
    {
      select: (data) => ({
        pages: data.pages.map((products) => transformProductArray(products)),
        pageParams: data.pageParams,
      }),
    },
  );
}
```
