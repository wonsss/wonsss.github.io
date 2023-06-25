---
title: GraphQL로 영화 API 만들기
date: 2023-06-24 18:06:23
category: backend
thumbnail: { thumbnailSrc }
draft: false
---

## 0. Introduction

- GraphQL
  - API를 위한 쿼리 언어
  - GraphQL은 데이터를 효율적으로 요청하고 응답받을 수 있는 쿼리 언어이다. GraphQL은 타입 시스템을 기반으로 하며, 단일 엔드포인트로 다양한 데이터 소스에 접근할 수 있다. 이를 통해 개발자들은 유연하고 효율적인 API를 개발할 수 있다.
  - <https://graphql.org>
  - <https://github.com/graphql/graphql-spec>
  - GraphQL 쿼리를 작성 예시 실행 가능한 사이트 <https://studio.apollographql.com/public/star-wars-swapi/variant/current/explorer>
- Graphile
  - Graphile은 GraphQL API를 자동으로 생성하기 위한 도구와 라이브러리의 집합이다. Graphile을 사용하면 데이터베이스 스키마로부터 GraphQL API를 생성할 수 있다.
  - Graphile은 데이터베이스 스키마로부터 자동으로 GraphQL API를 생성하는 강력하고 유연한 도구이다. 이를 통해 개발자들은 빠르고 효율적으로 GraphQL 서버를 구축하고 데이터베이스와의 상호작용을 간단하게 관리할 수 있다.
  - <https://www.graphile.org/>
- Hasura
  - Hasura는 기존 데이터베이스에서 즉각적으로 GraphQL API를 무료로 만들어준다.
  - <https://hasura.io/>

## 1. GraphQL이 해결하는 문제점

### Overfetching

Overfetching 필요한 데이터보다 더 많은 데이터를 fetch하는 것을 말한다. 이러면 백엔드나 데이터베이스가 일을 더 많이 해야 해서 데이터 전송이 느려질 수 있다.

GraphQL은 url로 데이터를 즉시 받지 않는다. 대신, 필요한 데이터를 요청한다.

GraphQL을 사용하면 클라이언트에서 API에 GraphQL 쿼리를 보내고 필요한 것만 정확히 얻을 수 있다.

### Underfetching

필요한 데이터보다 적은 데이터가 fetch되는 것을 말한다.

일반적인 REST API는 이러한 경우 여러 URL을 사용하여 필요한 데이터들을 가져와야 하지만, GraphQL API는 앱에 필요한 모든 데이터를 단일 요청으로 가져올 수 있다. 이를 통해, GraphQL을 사용하는 앱은 느린 모바일 네트워크 연결에서도 빠를 수 있다.

## 2. 환경설정

### Apollo Server

Apollo 서버는 Apollo 클라이언트를 포함한 모든 GraphQL 클라이언트와 호환되는 사양을 준수(spec-compliant)하는 오픈 소스 GraphQL 서버이다. 모든 소스의 데이터를 사용할 수 있고, 자체 문서화가 가능하며, 프로덕션에서 사용 가능하다.

<https://www.apollographql.com/docs/apollo-server/>

<https://www.apollographql.com/docs/apollo-server/getting-started/>

- apollo-server와 graphql 설치

```bash
npm install apollo-server graphql
```

### Nodemon

- Nodemon은 Node.js 개발 시 유용한 도구로, 파일 변경 감지를 통해 자동으로 서버를 재시작해주는 도구이다.

```jsx
npm install nodemon -D
```

```jsx
// 스크립트
"dev": "nodemon server.js"
```

### graphQl 구문 하이라이팅 vscode 익스텐션

- <https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql>

- require(CommonJS)대신 import(ES Module) 시스템 사용하려면 package.json에서 `“type”: “module”` 설정을 추가한다.

## 3. GraphQL 스키마 정의

모든 GraphQL 서버(아폴로 서버)는 클라이언트가 쿼리 요청할 수 있는 데이터의 구조를 정의하는 스키마를 사용한다.

### Query 타입

Query 타입은 GET 요청을 만드는 것과 같으며 필수이다.

- 아폴로 서버를 실행하기 위해서는 반드시 최소 1개의 Query가 필요하다. type Query는 가장 기본적인 타입입니다. Query에 넣는 필드들은 request할 수 있는 것들이 된다.

### Mutation 타입

Mutation 타입은 POST, PUT, DELETE 와 같이 서버 측 데이터를 수정할 수 있는 방법이다. 서버 측 데이터를 수정하는 모든 작업은 mutation을 통해 보내야 한다는 규칙을 설정하는 것이 유용하다.

```jsx
import { ApolloServer, gql } from "apollo-server";

// GET /api/tweets
// GET /api/tweets/:id
// POST /api/tweets

const typeDefs = gql`
 type User {
  id: ID
  username: String
 }
 type Tweet {
  id: ID
  text: String
  author: User
 }
 type Query {
  allTweets: [Tweet]
  tweet(id: ID): Tweet
 }
 type Mutation {
  postTweet(text: String, userId: ID): Tweet
 }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
 console.log(`Running on ${url}`);
});
```

```jsx
// 쿼리 요청 시 mutation 을 앞에 붙여야 한다
mutation {
  postTweet(text: "HELLO", userId: "2") {
    text
  }
}
```

## 4. 타입

- graphQL 쿼리 요청할 수 있는 샌드박스
  - <https://studio.apollographql.com/sandbox/explorer>
  - nodemon으로 <http://localhost:4000/> 서버 켜고 위 사이트에서 접속하여 쿼리 요청 테스트 가능

### Scalar

Scalar 타입은 GraphQL 스키마에서 사용되는 기본 데이터 타입이다. Scalar 타입은 단일 값으로 표현되는 데이터를 나타내며, GraphQL에는 다양한 내장 Scalar 타입이 있다.

내장 Scalar 타입은 다음과 같다.

1. Int: 32비트 정수로 표현되는 숫자
2. Float: 부동 소수점 숫자로 표현되는 실수
3. String: 유니코드 문자열
4. Boolean: true 또는 false 값을 가지는 논리 타입
5. ID: 고유한 식별자로 사용되는 문자열이며, 주로 데이터베이스의 기본 키와 매핑됨

### Non-Nullable

타입에 !를 붙이면 Non-Nullable이다.

Non-Nullalbe은 서버가 항상 이 필드에 대해 null이 아닌 값을 반환할 것으로 기대한다.  즉,  !가 붙지 않은 필드는 nullable field(null값을 가질 수 있는 필드)이다.

<https://graphql.org/learn/schema/#lists-and-non-null>

## 5. Resolvers

resolver 함수는 데이터베이스에 액세스한 다음 데이터를 반환한

resolver 함수는 field가 요청했을 때 실제로 호출될 함수이다.

```jsx
// args는 GraphQL 쿼리의 필드에 제공된 인수
const resolvers = {
 Query: {
  allTweets() {
   console.log("트윗을 가져옵니다");
   return tweets;
  },
  tweet(root, args) {
   return tweets.find(tweet => tweet.id === args.id);
  },
 },
};
```

<https://graphql.org/learn/execution/#root-fields-resolvers>

### Resolver arguments

Resolver 함수에는 parent(root or source), args, context, info 의 네 가지 인수가 순서대로 전달된다.

| ARGUMENT | DESCRIPTION |
| --- | --- |
| parent | The return value of the resolver for this field's parent (i.e., the previous resolver in the <https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-chains>).
For resolvers of top-level fields with no parent (such as fields of Query), this value is obtained from the rootValue function passed to <https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructor>. |
| args | An object that contains all GraphQL arguments provided for this field.
For example, when executing query{ user(id: "4") }, the args object passed to the user resolver is { "id": "4" }. |
| contextValue | An object shared across all resolvers that are executing for a particular operation. Use this to share per-operation state, including authentication information, dataloader instances, and anything else to track across resolvers.
See <https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-contextvalue-argumenthttps://www.apollographql.com/docs/apollo-server/data/resolvers/#the-contextvalue-argumenthttps://www.apollographql.com/docs/apollo-server/data/resolvers/#the-contextvalue-argument> for more information. |
| info | Contains information about the operation's execution state, including the field name, the path to the field from the root, and more.
Its core fields are listed in the <https://github.com/graphql/graphql-js/blob/f851eba93167b04d6be1373ff27927b16352e202/src/type/definition.ts#L891-L902>. Apollo Server extends it with a <https://www.apollographql.com/docs/apollo-server/performance/caching/#in-your-resolvers-dynamichttps://www.apollographql.com/docs/apollo-server/performance/caching/#in-your-resolvers-dynamic>. |

<https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments>

### Type Resolvers

type User의 fullName에 대한 resolver를 만들 수 있다

```tsx
const typeDefs = gql`
 type User {
  id: ID
  firstName: String!
  lastName: String!
  fullName: String
 }
`;

const resolvers = {
 User: {
  fullName({ firstName, lastName }) {  // type User의 fullName에 대한 resolver
   return `${firstName} ${lastName}`;
  },
 },
};
```

## 6. 문서화

<https://www.apollographql.com/docs/resources/graphql-glossary/#docstring>

타입, 필드 또는 인자에 대한 설명을 제공한다. Docstring은 Apollo Studio Explorer를 비롯한 많은 일반적인 GraphQL 클라이언트 도구에서 자동으로 문서화되어 표시된다.

```tsx
"""
Description for the User
"""
type User {
  """
  Description for first Name
  """
  firstName: String!

  age(
    """
    Must be an integer
    """
    arg: Int
  )
}
```

### 7. Subscription Type

Subscription을 사용하면 클라이언트는 서버로부터 실시간으로 변경되는 데이터를 받을 수 있으므로, 애플리케이션의 실시간 업데이트나 상호 작용성을 구현하는 데 유용하다.
