---
title: 백엔드 클론코딩 1 - NestJS 설치 및 GraphQL API 사용  
date: 2023-06-25 04:06:05
category: backend
thumbnail: { thumbnailSrc }
draft: false
---

## 1. Backend(NestJs) Setup

- nest 애플리케이션 생성하기(터미널)

```tsx
nest g application
```

- 프로젝트 설치 및 실행

```tsx
npm install
npm run start:dev
```

- github 저장소 생성 및 연결

<https://github.com/new> 에서 저장소 생성

```tsx
git init
git remote add origin 저장소주소
```

- gitignore 익스텐션(vscode)
  - VS Marketplace 링크: <https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore>
  - cmd + shift + p  → add gitignore 후 작업하는 언어용 gitignore 템플릿 사용 → node

## 2. GraphQL API

### 2.0. Apollo Server Setup

- GraphQL, Apollo, ApolloServer 설치

<https://docs.nestjs.com/graphql/quick-start> 참고

```tsx
# For Express and Apollo (default)
$ npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

- main.ts는 해당 애플리케이션을 실행하기 위한 것이다. app.module은 main.ts로 import되는 유일한 모듈이다.
  - NestFactory가 AppModule로부터 애플리케이션을 생성한다.
  - 즉, 결국 모든 것들은 AppModule로 import된다.

패키지가 설치되면, `GraphQLModule` 을 import하고 `forRoot()` static 메서드로 설정할 수 있다.

```tsx
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
  ],
})
export class AppModule {}
```

`forRoot()` 메서드는 인자에 옵션으로서 객체를 받는다.

### Code First

code first 방법에서는 데코레이터와 타입스크립트 클래스를 GraphQL 스키마를 생성하는 데 사용한다.

```tsx
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
}),
```

`autoShcemeFile` 속성 값은 자동 생성된 스키마가 만들어지는 경로이다. 또는, 스키마를 메모리에서 바로 생성할 수 있는데, 그렇게 하려면 `autoShcemeFile` 속성 값을 true로 설정한다.

```tsx
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
}),
```

기본적으로, 생성된 스키마 내 타입들은 포함된 모듈에서 정의된 순서대로 정렬되어 있다. 스키마를 사전식으로 정렬하려면, `sortScheme` 속성을 true 로 설정한다.

```tsx
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
}),
```

### Scheme first

scheme first 방법을 사용하려면, `typePaths` 속성을 옵션 객체에 추가함으로써 시작한다. `typePaths` 속성은 `GraphQLModule` 이 GraphQL SDL 스키마 정의 파일을 찾아야 하는 위치를 나타낸다. 이 파일들은 메모리에서 결합되며, 이는 스키마를 여러 파일로 쪼개고 이들을 각자의 resolver 가까이에 위치하게 하는 것을 가능하게 한다.

```tsx
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  typePaths: ['./**/*.graphql'],
}),
```

GraphQL SDL 타입에 대응하는 타입스크립트 정의(클래스와 인터페이스)가 필요하다. 해당 타입스크립트 정의를 직접 작성하는 것은 지루하고 군더더기의 일이다. 이 문제르 해결하기 위해, @nestjs/graphql 패키지는 추상구문트리(AST)로부터 자동으로 타입스크립트 정의를 생성한다. 이 기능을 활성화려면, `definitions` 옵션 속성을 추가한다.

```tsx
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  typePaths: ['./**/*.graphql'],
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
  },
}),
```

### 2.1. 첫 resolver(예시)

- 아래의 명령어로 nestjs 모듈을 생성한다.

```tsx
nest g mo restaurants
```

- resolver 파일을 만들어 module의 providers에 연결한다.

```tsx
// src/restaurants/restaurants.module.ts

import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurants.resolver';

@Module({
  providers: [RestaurantsResolver],
})
export class RestaurantsModule {}
```

- resolver는 `@Resolver()` 데코레이터가 달려있는 간단한 class이다.

```tsx
// src/restaurants/restaurants.module.ts

import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class RestaurantsResolver {
  @Query(() => Boolean)
  isPizzaGood(): boolean {
    return true;
  }
}
```

- 위와 같은 resolver 파일의 타입스크립트를 통해 아래와 같은 graphQL 스키마 파일이 자동 생성된다.

```tsx
// src/schema.gql

# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Query {
  isPizzaGood: Boolean!
}
```

- schema.gql 파일이 자동생성되지 않고, 메모리 내에서만 생성되도록 하려면 `autoSchemeFile` 속성을 true 로 설정한다.

```tsx
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    RestaurantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- npm run start:dev 를 통해 서버 실행 후, <http://127.0.0.1:3000/graphql> 접속하면 플레이그라운드가 나온다.

### 2.2.  object type

- GraphQL 스키마의에서 대부분의 정의는 object type이다. object type은 애플리케이션 클라이언트가 상호 작용해야 하는 도메인 객체를 나타낸다.
- 예를 들어, author과 post의 리스트를 가져와야 하는 API가 있다고 했을 때, 이 기능을 지원할 Author 타입과 Post 타입을 정의해야 한다.
- scheme first 방법을 사용하면, SDL로 스키마를 아래와 같이 정의한다.

```tsx
type Author {
  id: Int!
  firstName: String
  lastName: String
  posts: [Post!]!
}
```

- 그리고 code first 방법을 사용하면,TypeScript 클래스와 데코레이터를 사용함으로써 해당 클래스 사용하여 스키마를 정의하고 TypeScript 데코레이터를 사용함으로써 해당 클래스 필드 위에 주석을 단다. 위에서 본 SDL과 동일한 기능을 code first 방식으로 작성하면 아래와 같다.

```tsx
// authors/models/author.model.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post';

@ObjectType()
export class Author {
  @Field(type => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(type => [Post])
  posts: Post[];
}
```

- `@Field()` 데코레이터는 옵셔널 타입 함수 및 선택적으로 옵션 객체를 받는다.
- 타입 함수는 타입스크립트 타입 시스템과 GraphQL 타입 시스템 사이에 잠재적인 모호성이 있을 때 필요한 것이다. 특히, string이나 boolean 같은 타입에 필요하기보다는, number 타입에서 필요하다(number 타입은 GraphQL에서 Int 나 Float 타입으로 매핑되어야 하기 때문). 타입 함수는 단순히 원하는 GraphQL 타입을 반환해야 한다.
- 옵션 객체는 다음과 같은 key/value 쌍을 가질 수 있다.
  - `nullable` : 필드가 nullable인지 여부 명세(SDL에서는 각각의 필드는 기본적으로 non-nullable 이다), boolean
  - `description` : 필드 설명 설정, string
  - `deprecationReason` : 해당 필드가 deprecated 되었음을 표시, string

```tsx
// 예시
@Field({ description: `Book title`, deprecationReason: 'Not useful in v2 schema' })
title: string;
```

- 필드가 배열일 경우, Field() 데코레이터의 타입 함수 내에서 배열 타입을 아래와 같이 직접 명시해야 한다.

```tsx
@Field(type => [Post])
posts: Post[];
```

- 배열의 아이템이 nullable임을 정의하려면, `nullable` 속성에 `items` 를 아래와 같이 설정한다.

```tsx
@Field(type => [Post], { nullable: 'items' })
posts: Post[];
```

- 만약 배열과 아이템 모두 nullable이라면, `nullable` 을 `itemsAndList` 로 설정한다.

- 파일명의 entity는 데이터베이스에 있는 모델 같은 의미를 나타내며, model로 대체해도 의미가 통한다.

```tsx
//src/restaurants/entities/restaurant.entity.ts

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(() => String)
  name: string;

  @Field(() => Boolean, { nullable: true })
  isGood?: boolean;
}
```

```tsx
// src/restaurants/restaurants.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver()
export class RestaurantsResolver {
  @Query(() => Restaurant)
  myRestaurant() {
    return true;
  }
}
```

- 타입함수에서 type이나 returns 같이 의미 없는 인자를 사용하고 싶을 때, 이들을 결국 사용하지 않았다고 타입스크립트가 경고가 띄우는 것을 무시하려면, eslint rule을 다음과 같이 변경한다.

```tsx
'@typescript-eslint/no-unused-vars': 'off'
```

### 2.3. Arguments

Args 데코레이터 옵션

- 요청으로부터 사용하려는 인자를 추출하려면 메서드 핸들러에서  `@Args()` 데코레이터를 사용한다.

```tsx
@Args('id') id: string
```

- 만약 number 타입을 사용한다면, 조금 더 신경을 써야 한다. 타입스크립트의 number 타입은 GraphQL에게 해당 타입이 결국 Int와 Float 중 무엇인지에 대해 충분한 정보를 주지 못한다. 그래서 명시적으로 타입을 넘겨야 한다. 이렇게 하기 위해, `Args()` 데코레이터에 인자 옵션이 담긴 두 번째 인자를 넘긴다.

```tsx
@Args('id', { type: () => Int }) id: number
```

- 옵션 객체에는 다음과 같은 key/value 쌍이 올 수 있다.
  - `type` : GraphQL 타입을 반환하는 함수
  - `defaultValue` : 기본 값, `any`
  - `description`:  설명 metadata; `string`
  - `deprecationReason`: 필드를 deprecate시키고 이유에 대한 메타 데이터를 제공; `string`
  - `nullable`: 필드가 nullable 인지 여부

```tsx
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
}
```

### 2.4. ****InputTypes and ArgumentTypes****

- `@InputType`은 graphQL에 argument로 전달할 수 있는 특수한 유형의 객체이다. Mutation이 객체를 argument로 받고 싶은 경우 사용한다. InputType을 사용하면 다음과 같이 요청해야 한다.

```tsx
// src/restaurants/dtos/create-restaurant.dto.ts

import { InputType, Field } from '@nestjs/graphql';

@InputType()  // 여기만 차이
export class CreateRestaurantDto {
  @Field((type) => String)
  name: string;

  @Field((type) => Boolean, { nullable: true })
  isGood?: boolean;

  @Field((type) => String)
  address: string;

  @Field((type) => String)
  ownerName: string;
}
```

```tsx
@Mutation((returns) => Boolean)
  createRestaurant(
    @Args('createResaurantDto') createRestaurantDto: CreateRestaurantDto,
  ): boolean {
    return true;
  }
```

```tsx
// 클라이언트에서 뮤테이션 요청

mutation {
 createStore(newStoreInfo : {
  name: "",
  isVegan : true,
  address: "",
  ownerName:""
})
```

- `@ArgsType`을 사용하면, 다음과 같이 작성하고 클라이언트에서 요청하면 된다.

```tsx
// src/restaurants/dtos/create-restaurant.dto.ts

import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()  // 여기만 차이
export class CreateRestaurantDto {
  @Field((type) => String)
  name: string;

  @Field((type) => Boolean, { nullable: true })
  isGood?: boolean;

  @Field((type) => String)
  address: string;

  @Field((type) => String)
  ownerName: string;
}
```

```tsx
@Mutation((returns) => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    return true;
}
```

```tsx
// 클라이언트에서 뮤테이션 요청

mutation {
 createStore(name: "name", isVegan: true, ownerName : "with", address:"안양")
}
```

### 2.5. ArgsType 유효성 검사

- class-validator , class-transformer 설치

```bash
npm i class-validator class-transformer
```

- dto 클래스에서 유효성 검사 데코레이터 추가

```tsx
// src/restaurants/dtos/create-restaurant.dto.ts

import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((type) => Boolean, { nullable: true })
  @IsBoolean()
  isGood?: boolean;

  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => String)
  @IsString()
  ownerName: string;
}
```

- validation pipe 추가

```tsx
// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

- 플레이그라운드에서 뮤테이션 요청
  - 위에서 name 길이를 5글자 이상 10글자 이하로 유효성 검사를 걸었으므로, 아래와 같이 요청하면 400 에러 발생 확인
