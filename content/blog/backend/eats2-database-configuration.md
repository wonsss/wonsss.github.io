---
title: 백엔드 클론코딩 2 - Database 설정(TypeORM, PostgreSQL, cross-env, joi)
date: 2023-06-25 18:06:12
category: backend
thumbnail: { thumbnailSrc }
draft: false
---

## 3. Database 설정

### 3.0. TypeORM과 PostgreSQL

- TypeORM을 쓰면 SQL문을 쓰는 대신에 타입스크립트 코드를 써서 데이터베이스와 상호작용을 할 수 있다.
  - <https://typeorm.io/#/>
- 이 강의에서는 PostgreSQL을 사용한다. TypeORM을 설치하기 전에 PostgreSQL을 설치한다.
  - <https://postgresapp.com/>
- MacOS라면 PostgreSQL의 GUI인 Postico도 설치하는 것을 권장한다. Postico 앱을 실행하면 구매 버튼이 있지만, 구매하지 않아도 무료로 평생 사용 가능하니 구입은 선택사항이다.
  - <https://eggerapps.at/postico2/>
- windowOS라면 PostgreSQL의 GUI로서 pgAdmin을 설치한다.
  - <https://www.pgadmin.org/>
- Postico에서 데이터베이스를 새로 만들고, Postgres에서 새로 만든 해당 데이터베이스를 더블 클릭하면 터미널에 연결된다. 터미널에서 `\du;` 을 입력하여 데이터베이스의 모든 사용자를 확인한다.
  - 유저의 패스워드를 변경하려면, `ALTER USER 유저명 WITH PASSWORD 변경할비밀번호`  명령어를 입력한다. 나중에 데이터베이스 연결할 때 필요하므로 유저명과 비밀번호를 기억한다.

### 3.3. TypeORM 설치

- TypeORM
  - <https://github.com/typeorm/typeorm>
  - TypeORM은 TypeScript 및 JavaScript를 위한 객체-관계 매핑(ORM) 라이브러리이다.
  - ORM은 데이터베이스와 상호작용하는 애플리케이션을 개발할 때 개발자들이 SQL 쿼리를 직접 작성하는 대신 객체 지향적인 접근 방식으로 데이터를 다룰 수 있게 도와준다.
  - TypeORM은 다양한 데이터베이스 시스템과 호환되며, 데이터베이스 스키마를 TypeScript 또는 JavaScript 클래스로 정의할 수 있다. 이를 통해 개발자는 데이터베이스 테이블과 관계를 객체로 표현할 수 있고, 이를 사용하여 데이터베이스에 쿼리를 전달하고 결과를 받아올 수 있다.
  - TypeORM은 데이터베이스의 CRUD (Create, Read, Update, Delete) 작업을 지원하며, 트랜잭션, 쿼리 빌더, 마이그레이션 등 다양한 기능을 제공한다. 또한, 강력한 쿼리 언어와 캐싱 기능, 지연 로딩 및 예외 처리 등을 제공하여 개발자들이 효율적이고 안정적인 데이터베이스 애플리케이션을 개발할 수 있도록 도와준다.
  - TypeORM은 사용하기 쉬운 문법과 풍부한 기능 세트를 제공하여 개발자들이 데이터베이스 관련 작업에 집중할 수 있도록 도움을 준다. 또한, 다양한 환경에서 사용할 수 있는 유연성과 확장성을 제공하여 대규모 애플리케이션에서도 효과적으로 사용할 수 있다.

    [data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2738%27%20height=%2738%27/%3e](data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2738%27%20height=%2738%27/%3e)

- NestJS는 데이터베이스에 구애받지 않으므로 모든 SQL 또는 NoSQL 데이터베이스와 쉽게 통합할 수 있다.
  - <https://docs.nestjs.com/techniques/database>
- TypeORM Integration
  - <https://docs.nestjs.com/techniques/database#typeorm-integration>
  - SQL 및 NoSQL 데이터베이스와의 통합을 위해 Nest는 `@nestjs/typeorm` 패키지를 제공한다.
  - Nestjs는 TypeORM 통합환경이 잘 갖추어져 있다. NestJS에서 다른 ORM으로 sequelize를 사용할 수도 있고, monogdb를 쓴다면 mongoose를 써도 된다. 하지만 TypeORM은 타입스크립트 기반이어서 타입스크립트로 작업한다면 더 낫다.
- 설치

```bash
npm install --save @nestjs/typeorm typeorm pg

// pg는 postgres
```

- TypeORM 설정
  - <https://github.com/typeorm/typeorm#creating-a-new-datasource>

```tsx
// app.module.ts 에서 @Module imports 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'marco',
      password: '12345',
      database: 'eats',
      synchronize: true,
      logging: true,
    }),
 ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- `synchronize: true`
  - `synchronize: true` 는 TypeORM이 데이터베이스에 연결할 때, 데이터베이스를 해당 모듈의 현재 상태로 마이그레이션한다는 의미이다.
  - production에서는 `synchronize: true` 로 사용하면 안된다. `synchronize: true` 를 production에서 사용하면 production 데이터가 손실될 수 있기 때문이다.

### PostgreSQL에서 쓰는 네이밍을 snake_case로 자동 변경

PostgreSQL 에서 테이블이나 컬럼 이름은 snake_case 를 많이 쓰는데, TypeScript 에서는 클래스 이름은 PascalCase 를 프로퍼티 이름은 camelCase 를 쓰는데 번거롭지 않게 자동 변환하면 좋다.

`typeorm-naming-strategies` 라는 패키지를 설치하고,

```bash
npm i typeorm-naming-strategies
```

SnakeNamingStrategy 를 import 하여 TypeORM configuration 옵션에 넣어주면, PostgreSQL 에서 쓰는 네이밍을 snake_case 로 알아서 바꿔준다.

```jsx
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

TypeOrmModule.forRoot({
 // ...
 namingStrategy: new SnakeNamingStrategy(),
})
```

### 3.4. ConfigService

- 응용 프로그램은 종종 다른 환경에서 실행되는데, 환경에 따라 다른 환경 설정을 사용해야 한다.
- 환경 변수 파일(.env)을 Node.js에서 이용하는 가장 흔한 방법은 `dotenv` 패키지를 사용하는 것이다. 이것을 사용할 수도 있지만, NestJS에서는 NestJS의 설정 방법을 이용해본다.
- NestJS는 ConfigModule을 갖고 있다. NestJS에서 이 기술을 사용하는 좋은 방법은 적절한 .env 파일을 로드하는 ConfigService를 노출하는 ConfigModule을 만드는 것이다. @nestjs/config 패키지를 설치한다.
  - <https://docs.nestjs.com/techniques/configuration>
  - 참고로 `@nestjs/config` 패키지는 내부적으로 `dotenv` 를 사용한다.

```bash
ConfigModule.forRoot({ isGlobal: true }), 
// isGlobal은 이 앱 어디서나 config 모듈에 접근할 수 있다는 설정이다.
```

```bash
npm i --save @nestjs/config 
```

### 3.5. ConfigService 설정(cross-env)

- cross-env
  - <https://www.npmjs.com/package/cross-env>
  - cross-env는 JavaScript 및 Node.js 프로젝트에서 환경 변수를 설정하기 위한 유틸리티이다. Node.js 애플리케이션은 실행되는 환경에 따라 다른 환경 변수 값을 필요로 할 수 있다. cross-env는 이러한 환경 변수를 설정하고 관리하기 위해 사용된다.
  - cross-env를 사용하면 개발자는 각 운영 체제에 맞는 방식으로 환경 변수를 설정할 수 있다. 일반적으로 운영 체제마다 환경 변수를 설정하는 방법이 다르기 때문에 cross-env는 이를 추상화하여 개발자가 명령어를 작성할 때 운영 체제에 관계없이 일관된 방식으로 환경 변수를 설정할 수 있도록 도와준다.
  - 예를 들어, 개발 중에는 데이터베이스 연결 문자열이 개발 서버의 주소를 가리키고, 프로덕션 환경에서는 실제 서버의 주소를 가리킬 수 있다. cross-env를 사용하면 개발 환경과 프로덕션 환경 간의 환경 변수 설정을 간편하게 변경할 수 있다.
  - 간단히 말해, cross-env는 Node.js 프로젝트에서 운영 체제에 독립적인 방식으로 환경 변수를 설정할 수 있게 도와주는 도구이다.

```bash
npm i cross-env
```

```bash
// package.json

"scripts" : {
 "start": "cross-env NODE_ENV=prod nest start",
 "start:dev": "cross-env NODE_ENV=dev nest start --watch",
}
```

```bash
// src/app.module.ts

ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
}),
```

- deploy 하는 production 일 때는 env 파일을 다른 방식으로 얻을 것이라서, configModule의 env 파일을 무시하는 옵션을 추가한다.

```bash
ConfigModule.forRoot({
    ignoreEnvFile: process.env.NODE_ENV === 'prod',
  }),
```

- env로 대체
  - 기본적으로 .env에서 읽어오는 값은 string이다.

    ```bash
    // .env.dev
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=marco
    DB_PASSWORD=블라블라
    DB_DATABASE=eats
    ```

    ```tsx
    // app.module.ts 에서 @Module imports 
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ```

### 3.6. ConfigService 유효성 검사(Joi)

- joi
  - <https://joi.dev>
  - <https://www.npmjs.com/package/joi>
  - Joi는 Node.js 및 JavaScript를 위한 데이터 유효성 검사 라이브러리이다. 데이터 유효성 검사는 입력된 데이터가 원하는 형식과 규칙을 따르는지 확인하는 작업을 말한다. 이를 통해 사용자로부터 올바른 데이터를 수집하고 처리할 수 있습니다.
  - Joi는 강력하고 유연한 검증 기능을 제공합니다. 다양한 데이터 유형(문자열, 숫자, 날짜 등)과 유효성 검사 규칙(최소/최대 길이, 패턴 일치 등)을 정의할 수 있다. 또한, Joi는 사용자 정의 규칙을 생성하여 복잡한 유효성 검사를 수행할 수 있도록 지원한다.

    ```tsx
    npm i joi
    ```

- joi는 자바스크립트로 만들어진 패키지이므로, 이를 import할 때 아래와 같이 한다.

```tsx
import * as Joi from 'joi';
```

- joi를 활용함으로써 환경변수마저 유효성을 검사할 수 있어 더 좋은 보안을 갖출 수 있다.
