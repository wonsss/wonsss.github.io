---
title: 노드 백엔드 클론코딩 2 - 사용자 CRUD 및 Authentication
date: 2023-10-22 14:10:71
category: backend
thumbnail: { thumbnailSrc }
draft: false
---

# 5. USER CRUD

## 5.1. User Model

- 먼저 users 모듈을 만든다.

```jsx
nest g mo users
```

- user entity를 만든다.

```jsx
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

type UserRole = 'client' | 'owner' | 'delivery';

@Entity()
export class User extends CoreEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
```

- common 모듈을 만든다. common 모듈에는 앱에서 공유되는 모든 것을 적용한다.

```jsx
nest g mo common
```

- common 모듈 내에 core entity를 만들고, 이를 다른 entity에서 확장하여 쓴다.

```jsx
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### TypeORM special columns

- 추가 기능을 사용할 수 있는 몇 가지 Special column들이 있다.
  - <https://typeorm.io/#/entities/special-columns>
- `@CreateDateColumn`은 엔터티의 삽입 날짜로 자동 설정되는 특수 열이다. 이 열은 설정할 필요가 없고, 자동으로 설정된다.
- `@UpdateDateColumn`은 entity manager 또는 repository의 저장을 호출할 때마다 엔티티의 업데이트 시간으로 자동 설정되는 특수 열이다. 이 열은 설정할 필요가 없고, 자동으로 설정된다.
- `@DeleteDateColumn`은 entity manager 또는 repository의 일시 삭제를 호출할 때마다 엔터티의 삭제 시간으로 자동 설정되는 특수 열이다. 이 열은 설정할 필요가 없고, 자동으로 설정된다. 이 열이 설정되면 기본 범위는 "삭제되지 않음"이 된다.
- `@VersionColumn`은 엔티티의 버전(증분 번호)으로 자동 설정되는 특수한 열이다. entity manager 또는 repository의 save를 호출할 때마다 자동으로 설정된다. 이 열은 설정할 필요가 없고, 자동으로 설정된다.

## 5.2 User Resolver and Service

resolver와 service를 module 옆에 같이 둔다.

```tsx
// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}
}
```

```tsx
// src/users/users.resolver.ts

import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
}
```

```tsx
// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
```

## 5.3. Create Account Mutation

### Enums

<https://docs.nestjs.com/graphql/unions-and-enums#code-first-1>

<https://www.typescriptlang.org/ko/docs/handbook/enums.html>

- enum은 특정 허용 값 집합으로 제한되는 특수한 종류의 스칼라이다.
- 이 유형의 모든 인수가 허용되는 값 중 하나인지 확인
- 필드가 항상 유한한 값 집합 중 하나임을 유형 시스템을 통해 전달
- code first 접근 방식을 사용할 때 TypeScript enum을 생성하여 GraphQL enum type을 정의한다.
- `registerEnumType` 함수를 사용하여 AllowedColor enum을 등록한다.

```tsx
export enum AllowedColor {
 RED,
 GREEN,
 BLUE,
}

registerEnumType(AllowedColor, { name: 'AllowedColor' });
```

### user entity

```tsx
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;
}
```

### create-account dto

```tsx
// src/users/dtos/create-account.dto.ts

import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}
```

### user resolver

```tsx
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  }

  @Mutation((of) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const error = await this.usersService.createAccount(createAccountInput);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
```

### User Service

```tsx
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return 'There is a user with that email already';
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      return "Couldn't create account";
    }
  }
}
```

### Mutation - 플레이그라운드

```tsx
mutation {
  createAccount(input: {
    email: "test@dot.com",
    password: "1234",
    role: Client
  }) {
    ok
    error
  }
}
```

## 5.6  에러 핸들링 대안

- 코드를 더 깨끗하고 이해하기 쉽게 만들기 위해 api 응답값으로 array나 object를 리턴하도록 변경한다. api service에서 { ok, error } 와 같은 object를 리턴하면, resolver에서는 조건문을 사용할 필요가 없어서 코드가 더 깔끔해진다. 그러면 이 resolver가 하는 일을 input을 갖고 output을 보내는 것으로만 단순해진다.

```tsx
// api service
async createAccount({
  email,
  password,
  role,
}: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
  try {
    const exists = await this.users.findOne({ where: { email } });
    if (exists) {
      return {
        ok: false,
        error: 'There is a user with that email already',
      };
    }
    await this.users.save(this.users.create({ email, password, role }));
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: "Couldn't create account",
    };
  }
}
```

```tsx
// resolver
const { ok, error } = await this.usersService.createAccount(
  createAccountInput,
);
return { ok, error };
```

## 5.7. 패스워드 hashing

- 데이터베이스에 비밀번호를 그대로 입력하는 것은 보안적으로 매우 위험하다. 따라서 패스워드를 해싱해서 데이터베이스에 저장해야 한다.
- hash를 저장하는 것이다. hash는 단방향(one-way) 함수이다.
  - 해싱이란 예를 들어, a를 b로 만들 수는 있으나, b를 a로 되돌릴 수는 없다.

### Entity Listeners and Subscribers

<https://typeorm.io/listeners-and-subscribers>

listener는 등록한 엔터티에 무슨 일이 생길 때 실행된다.

모든 엔터티는 특정 엔터티 이벤트를 listen하는 커스텀 로직 메서드를 가질 수 있다.  다음과 같은 엔터티 리스너 데코레이터로 마크함으로써 엔터티의 이벤트를 listen할 수 있다.

- [Entity Listeners and Subscribers](https://typeorm.io/listeners-and-subscribers#entity-listeners-and-subscribers)
  - [What is an Entity Listener](https://typeorm.io/listeners-and-subscribers#what-is-an-entity-listener)
    - `[@AfterLoad](https://typeorm.io/listeners-and-subscribers#afterload)`
    - `[@BeforeInsert](https://typeorm.io/listeners-and-subscribers#beforeinsert)`
    - `[@AfterInsert](https://typeorm.io/listeners-and-subscribers#afterinsert)`
    - `[@BeforeUpdate](https://typeorm.io/listeners-and-subscribers#beforeupdate)`
    - `[@AfterUpdate](https://typeorm.io/listeners-and-subscribers#afterupdate)`
    - `[@BeforeRemove](https://typeorm.io/listeners-and-subscribers#beforeremove)`
    - `[@AfterRemove](https://typeorm.io/listeners-and-subscribers#afterremove)`
    - `[@BeforeSoftRemove](https://typeorm.io/listeners-and-subscribers#beforesoftremove)`
    - `[@AfterSoftRemove](https://typeorm.io/listeners-and-subscribers#aftersoftremove)`
    - `[@BeforeRecover](https://typeorm.io/listeners-and-subscribers#beforerecover)`
    - `[@AfterRecover](https://typeorm.io/listeners-and-subscribers#afterrecover)`
  - [What is a Subscriber](https://typeorm.io/listeners-and-subscribers#what-is-a-subscriber)
    - `[Event Object](https://typeorm.io/listeners-and-subscribers#event-object)`

### bcrypt 라이브러리 - 패스워드 해싱

<https://www.npmjs.com/package/bcrypt>

```tsx
npm i bcrypt
npm i @types/bcrypt -D
```

- 주의! `import * as bcrypt from 'bcrypt';`가 아닌 `import bcrypt from 'bcrypt';`로 import하게 되면 bcrypt에 함수가 아닌 undefined가 담겨 hash함수가 제대로 동작하지 않는 문제가 있음

비밀번호를 DB에 저장하기 전에 인스턴스의 비밀번호를 받아서 해싱한다.

```tsx
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
```

## 5.8. 로그인

1. 해당 이메일의 유저를 찾는다.
2. 패스워드가 정확한지 확인하다
3. JWT를 만들어 유저에게 전달한다. (6장에서 계속)

- user entity

```tsx
async checkPassword(aPassword: string): Promise<boolean> {
  try {
    const ok = await bcrypt.compare(aPassword, this.password);
    return ok;
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException();
  }
}
```

- login dto

```tsx
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { MutationOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}
```

- login service

```tsx
async login({
  email,
  password,
}: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
  try {
 // 1. 해당 이메일의 유저를 찾는다.
    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      return { ok: false, error: 'user not found' };
    }
 // 2. 패스워드가 정확한지 확인하다
    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
      return { ok: false, error: 'wrong password' };
    }

    return { ok: true, token: 'lalala' };
  } catch (error) {
    return { ok: false, error };
  }
}
```

- user resolver

```tsx
@Mutation((returns) => LoginOutput)
async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
  try {
    return await this.usersService.login(loginInput);
  } catch (error) {
    return { ok: false, error };
  }
}
```

# 6. USER Authentication

## 6.0. Authentication

인증은 대부분의 애플리케이션에서 필수적인 부분입니다. Passport는 커뮤니티에서 잘 알려져 있고 많은 프로덕션 애플리케이션에서 성공적으로 사용되는 가장 인기 있는 node.js 인증 라이브러리입니다.

@nestjs

/passport 모듈을 사용하여 이 라이브러리를 Nest 애플리케이션과 통합하는 것은 간단합니다.

<https://docs.nestjs.com/security/authentication>

## 6.1. JWT 생성

### json web token

<https://www.npmjs.com/package/jsonwebtoken>

자바스크립트에서 json web token을 구현할 때 쓰는 라이브러리이다.

토큰에는 중요한 정보를 넣기에는 부적절하다. 왜냐하면 누구나 토큰을 볼 수 있기 때문이다. 아이디 정도의 정보를 토큰에 넣는다.

```tsx
npm i jsonwebtoken
npm i @types/jsonwebtoken -D

import * as jwt from 'jsonwebtoken';
jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'});
```

env 정보를 넘기려면 procee.env.SECRET_KEY 보다는 nestjs 방식으로는 `ConfigService` 를 사용하는 것이 적절하다.

```tsx
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService, ConfigService],
})
export class UsersModule {}
```

```tsx
// src/users/users.service.ts
export class UsersService {
 constructor(
   @InjectRepository(User) private readonly users: Repository<User>,
   private readonly config: ConfigService,
 ) {}

 async login({
   email,
   password,
 }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
   try {
     const user = await this.users.findOne({ where: { email } });
     if (!user) {
       return { ok: false, error: 'user not found' };
     }
     const isPasswordCorrect = await user.checkPassword(password);
     if (!isPasswordCorrect) {
       return { ok: false, error: 'wrong password' };
     }
 
     // 로그인 성공시 토큰 발행
     const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
     return { ok: true, token: 'lalala' };
   } catch (error) {
     return { ok: false, error };
   }
 }
}
 
```

- ConfigService.get(path)
  - ConfigService는 .env파일을 로드한다. path를 기반으로 configuration 값(custom configuration 또는 환경 변수)을 가져온다
  - (점 표기법을 사용하여 "database.host"와 같은 중첩 개체를 탐색할 수 있음)

- randomkeygen
  - <https://randomkeygen.com/>
- jwt토큰 확인
  - <https://jwt.io/>

## 6.2. JWT와 모듈

- json web token의 목적은 비밀유지가 아니다. jwt를 디코딩하면 누구나 그 안의 정보를 볼 수 있기 때문이다. 중요한 것은 jwt를 이용해서 사이트 오너만이 유효한 인증을 할 수 있게 하는 것이다. 내부에 담겨진 정보 자체가 아닌, 정보의 진위 여부가 중요하다는 것이다.

### jwt 모듈 만들기

```tsx
nest g mo jwt
```

### dynamic moudle

- NestJS에서의 Modules 개념
  - 모듈은 @Module() 데코레이터로 주석이 달린 클래스이다.
  - @Module() 데코레이터는 Nest가 애플리케이션 구조를 구성하는 데 사용하는 메타데이터를 제공한다.
  - <https://docs.nestjs.com/modules>
- Static Module (정적 모듈)
  - 어떠한 설정도 적용되어 있지 않은 모듈
- Dynamic Module (동적 모듈)
  - 설정이 적용되어 있거나 설정을 적용할 수 있는 모듈
  - Nest 모듈 시스템에는 동적 모듈이라는 강력한 기능이 포함되어 있다. 이 기능을 사용하면 커스터마이징 가능한 모듈을 쉽게 만들 수 있게 다. 커스터마이징 가능한 모듈은 provider를 등록하고 동적으로 구성할 수 있다.
  - 동적인 모듈은 사실 결과적으로 정적인 모듈이 된다. 동적인 모듈은 중간 과정인 것이다.
  - <https://docs.nestjs.com/fundamentals/dynamic-modules#dynamic-modules>
  - <https://docs.nestjs.com/modules#dynamic-modules>

1. @Module 모듈 데코레이터 안에서 exports 를 해주고 있으면 import 받는 곳에서 사용할 provider 를 providers 에 다시 안 넣어줘도 된다. imports 에 모듈만 넣어주면 알아서 처리된다.
2. dynamicModule 에서 exports 된 provider는 import 받는 곳에서 imports 에 모듈 넣어주고, providers 에 provider 까지 넣어줘야 의존성 주입이 된다.
3. DynamicModule 을 사용하던 @Module 데코레이터를 사용하던지 어쨋든 간에 export 하는 곳에서@Global() 하면 import 받는 곳에서 임포트도 필요없고 프로바이더에 뭘 넣어줄 필요도 없음. 단 자주 사용하는 것만(config 같은것) 하는것이 좋다고 한다.

### Global modules

- <https://docs.nestjs.com/modules#global-modules>
- 즉시 사용할 수 있는 모든 제공자 세트(예: 도우미, 데이터베이스 연결 등)를 제공하려면 @Global() 데코레이터를 사용하여 모듈을 전역적으로 만든다. 또는 forRoot안에서 global: true를 통해서도 전역 모듈로 만들 수 있다.

```tsx
return {
 global:true
  module: JwtModule,
 providers: [JwtService],
 exports: [JwtService],
};
```

### standard providers

<https://docs.nestjs.com/fundamentals/custom-providers#standard-providers>

아래 코드는 providers: [CatsService]의 축약형이다.

```tsx
providers: [
 { provide: CatsService, useClass: CatsService },
];
```

- useClass (Class providers)
  - <https://docs.nestjs.com/fundamentals/custom-providers#class-providers-useclass>
  - provider의 타입 (주입되야 할 인스턴스 클래스 이름)
  - useClass 구문을 사용하면 토큰이 리졸브해야 하는 클래스를 동적으로 결정할 수 있다.
  - 예를 들어 추상(또는 기본) ConfigService 클래스가 있다고 가정한다. 현재 환경에 따라 Nest가 구성 서비스의 다른 구현을 제공하기를 바란 경우 다음과 같이 작성할 수 있다.

```tsx
useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService : ProductionConfigService,
```

- useValue (Value providers)
  - <https://docs.nestjs.com/fundamentals/custom-providers#value-providers-usevalue>
  - 주입한 provider의 인스턴스
  - useValue 구문은 상수 값을 주입하거나 외부 라이브러리를 Nest 컨테이너에 넣거나 실제 구현을 모의 객체로 교체하는 데 유용하다.

## 6.6. NestJS의 미들웨어

- implements와 extends는 다르다. implements는 class가 interface처럼 동작해야 한다는 것을 의미한다.

- Middleware
  - <https://docs.nestjs.com/middleware#middleware>
  - 미들웨어는 라우트 핸들러 전에 호출되는 함수이다. 미들웨어 함수는 request 및 response 객체에 접근할 수 있으며 애플리케이션의 request-response 주기에 있는 next() 미들웨어 함수에 접근할 수 있다. next 미들웨어 함수는 일반적으로 next라는 변수로 표시된다.
  - Nest 미들웨어는 기본적으로 익스프레스 미들웨어와 동일하다.
  - 함수 또는 @Injectable() 데코레이터가 있는 클래스에서 사용자 지정 Nest 미들웨어를 구현한다.

```tsx
import { Request, Response, NextFunction } from 'express';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  next();
}
```

- Applying middleware (미들웨어 적용)
  - <https://docs.nestjs.com/middleware#applying-middleware>
  - @Module() 데코레이터에는 미들웨어가 들어갈 자리가 없다. 대신 모듈 클래스의 configure() 메서드를 사용하여 설정한다. 미들웨어를 포함하는 모듈은 NestModule 인터페이스를 implement해야 한다.

- Middleware consumer
  - <https://docs.nestjs.com/middleware#middleware-consumer>
  - Middleware Consumer는 헬퍼 클래스이다. 미들웨어를 관리하는 몇 가지 기본 제공 방법을 제공한다.
  - forRoutes() 메서드는 단일 문자열, 여러 문자열, RouteInfo 객체, 컨트롤러 클래스 및 여러 컨트롤러 클래스를 사용할 수 있다. 대부분의 경우 쉼표로 구분된 컨트롤러 목록을 전달한다.
  - apply()
    - apply() 메서드는 단일 미들웨어를 사용하거나 여러 인수를 사용하여 여러 미들웨어를 지정할 수 있다.
  - exclude()
    - 지정한 경로에서 미들웨어의 실행을 제외한다.
  - forRoutes()
    - 전달된 경로 또는 컨트롤러에서 미들웨어를 실행한다. 클래스를 전달하면 Nest는 이 컨트롤러 내에 정의된 모든 경로에 미들웨어를 실행한다.
- bootstrap
  - main.ts의 bootstrap 함수에서 `app.use(미들웨어)` 호출하면, 애플리케이션 모든 곳에서 해당 미들웨어 실행이 적용된다.

    ```tsx
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ValidationPipe } from '@nestjs/common';
    import { jwtMiddleware } from './jwt/jwt.middleware';
    
    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(new ValidationPipe());
      app.use(jwtMiddleware);
      await app.listen(3000);
    }
    bootstrap();
    ```

## 6.7. JWT 미들웨어

- 클래스 미들웨어로 적용

    ```tsx
    import { Injectable, NestMiddleware } from '@nestjs/common';
    import { Request, Response, NextFunction } from 'express';
    import { JwtService } from './jwt.service';
    import { UserService } from '../users/users.service';
    
    @Injectable()
    export class JwtMiddleware implements NestMiddleware {
      constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
      ) {}
      async use(req: Request, res: Response, next: NextFunction) {
        if ('x-jwt' in req.headers) {
          const token = req.headers['x-jwt'];
          const decoded = this.jwtService.verify(token.toString());
          if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
            try {
              const user = await this.userService.findById(decoded['id']);
              req['user'] = user;
            } catch (e) {}
          }
        }
        next();
      }
    }
    ```

  - 미들웨어를 위처럼 Injectable 데코레이터로 적용하지 않으면, 의존성 주입을 할 수 없다. constructor에서 JwtService를 inject하고 있다.
  - next()를 호출하면 next 핸들러가 request user를 받는다.

    ```tsx
    
    // app.module.ts
    
    import {
      MiddlewareConsumer,
      Module,
      NestModule,
      RequestMethod,
    } from '@nestjs/common';
    import { JwtMiddleware } from './jwt/jwt.middleware';
    export class AppModule implements NestModule {
      configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(JwtMiddleware)
          .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
      }
    }
    
    ```

- jwt.verify(token, secretOrPublicKey, [options, callback])
  - ex) var decoded = jwt.verify(token, 'shhhhh');
  - <https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback>
- jwt.decode(token [, options])
  - 서명이 유효한지 확인하지 않고 디코딩된 페이로드를 반환합니다.
  - 주의! 이것은 서명이 유효한지 여부를 확인하지 않습니다. 신뢰할 수 없는 메시지에는 이것을 사용하지 마십시오. 대신 jwt.verify를 사용하고 싶을 것입니다.
  - <https://www.npmjs.com/package/jsonwebtoken#jwtdecodetoken--options>
- 현재 여기서 JwtMiddleware가 하는 역할
  - 1. request headers안에 token을 가져온다.
  - 2. 가져온 token을 jwt.verify()를 이용해서 토큰을 검증하고 payload를 반환한다.
  - 3. 반환한 payload를 이용해서 유저를 찾는다.
  - 4. 유저를 찾았다면 찾은 유저의 정보를 req에 다시 넣어 다음 미들웨어에 전달한다.

## 6.8. GraphQL Context

- Context
  - 각 request에 대해 request context를 사용할 수 있다. context가 함수로 정의되면 각 request마다 호출되고 req 속성에 request 객체를 받는다.
  - 아래와 같이 context를 정의하면, 모든 resolver에서 user의 값을 graphql resolver의 context를 통해 공유할 수 있다. request에 user/라는 propery가 존재하는 상황이다.

```tsx
// app.module.ts 에서

GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  context: ({ req }) => ({ user: req['user'] }),
}),
```

```tsx
// user resolver

@Query((returns) => User)
me(@Context() context) {
  if (!context.user) {
    return;
  } else {
    return context.user;
  }
}
```

## 6.9 AuthGuard

- authentication은 토큰의 유효성을 확인하는 과정이다. 반면, authorization은 user가 어떤 일을 하기 전에 user role에 따른 permission을 갖고 있는지 확인하는 과정이다.
- Guards
  - <https://docs.nestjs.com/guards>
  - 가드는 `CanActivate` 인터페이스를 구현하는 `@Injectable()` 데코레이터로 주석이 달린 클래스이다.
  - 가드는 다음과 같은 하나의 책임을 가진다. 전달된 요청을 router 핸들러로 처리할지 여부를 런타임에 존재하는 특정 조건(허가, 역할, ACLs 등) 에 따라 결정한다. 이것을 흔히 authorization 이라고 한다.
  - authorization 은 일반적으로 기존 Express 애플리케이션의 미들웨어에 의해 처리되었다. 미들웨어는 토큰 유효성 검사나 요청에 담긴 속성들이 특정 route context(그리고 그것의 metadata) 와 강하게 결합되어 있지 않기 때문에, authentication에는 적절한 선택이다. 하지만 미들웨어는 본질적으로 멍청하다. 미들웨어는 `next()` 함수를 호출한 후 어떤 핸들러가 실행될지 모른다.
  - 반면에, 가드는  `ExecutionContext` 인스턴스에 접근할 수 있으므로. 다음에 실행될 항목을 정확히 알고 있다. 가드는 예외 필터, 파이프, 인터셉터와 매우 유사하게  요청/응답 주기의 정확한 지점에 처리 로직을 끼어넣을 수 있고, 이러한 작업을 선언적으로 할 수 있게 디자인되었다. 이러한 특성은 코드를 DRY하고 선언적으로 유지할 수 있게 도와준다.
  - 가드들은 모든 미들웨어 다음에 실행되고,인터셉터나 파이프 이전에 실행된다.
  -
- @UseGuard() (Binding guards)
  - <https://docs.nestjs.com/guards#binding-guards>
  - 파이프 및 예외 필터와 마찬가지로 가드는 컨트롤러 범위, 메서드 범위 또는 전역 범위일 수 있다.  `@UseGuards()` 데코레이터를 사용하여 컨트롤러 범위 가드를 설정한다. 이 데코레이터는 하나의 인자를 받거나, 콤바로 구분된 인자 목록을 받을 수도 있다. 이것은 적절한 가드들을 하나의 선언만으로 쉽게 적용할 수 있게 한다.

    ```tsx
    import { UseGuards } from '@nestjs/common';
    
    @Controller('cats')
    @UseGuards(RolesGuard)
    export class CatsController {}
    ```

- GqlExecutionContext (Execution context)
  - <https://docs.nestjs.com/graphql/other-features#execution-context>
  - GraphQL은 들어오는 요청에서 다른 유형의 데이터를 수신할 수 있기 때문에, 가드와 인터셉터 모두에서 수신하는 실행 컨텍스트가 GraphQL과 REST에서 다소 다르다.
  - GraphQL resolver에는 `root`, `args`, `context`,  `info`와 같은 고유한 인자 집합이 있다. 따라서 가드와 인터셉터는 일반 `ExecutionContext`를 `GqlExecutionContext`로 변환해야 한다.

    ```tsx
    import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
    import { GqlExecutionContext } from '@nestjs/graphql';
    
    @Injectable()
    export class AuthGuard implements CanActivate {
      canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        return true;
      }
    }
    ```

  - `GqlExecutionContext.create()` 에서 반환된 GraphQl Context 객체는 각각의 GraphQl resolver 인자에 대해 get 메서드(`getArgs()`, `getContext()` 등등) 를 노출한다.

    ```tsx
    const gqlContext = GqlExecutionContext.create(context).getContext();
    ```

## 6.10. AuthUser 데코레이터

- Custom decorators
  - <https://docs.nestjs.com/custom-decorators>
  - 나만의 커스텀 데코레이터를 만들 수 있다. node.js 세계에서는 request 객체에 속성을 첨부하는 것이 일반적이다.
  - 코드를 더 읽기 쉽고 투명하게 만들기 위해 @User() 데코레이터를 만들고 모든 컨트롤러에서 재사용할 수 있다.
  - Nest is built around a language feature called **decorators**. Decorators are a well-known concept in a lot of commonly used programming languages, but in the JavaScript world, they're still relatively new. In order to better understand how decorators work, we recommend reading **[this article](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)**. Here's a simple definition:
  - Nest는 **데코레이터**라는 언어 기능을 중심으로 구축되었다. 데코레이터는 많은 프로그래밍 언어에서 잘 알려진 개념이지만, JavaScript 에서는 상대적으로 새로운 개념이다. 데코레이터가 어떻게 작동하는지 더 잘 이해하기 위해,  [이 글](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)을 읽으시는 것을 추천한다. 여기 간단한 정의가 있다.
  - ES2016 데코레이터는 함수를 반환하고, 대상, 이름, 속성 descriptor를 인자로  받을 수 있는 표현식이다. 데코레이터에 `@` 를 접두사로 붙이고 데코레이팅하려는 부분의 맨 위에 배치하여 적용한다. 데코레이터는 클래스, 메서드, 속성을 위해 정의될 수 있다.
- Param decorators
  - Nest는 유용한 param 데코레이터 집합을 제공하고, 이들을 HTTP rotue 핸들러에서 사용할 수 있다. 아래는 제공된 데코레이터와 이들이 나타내는 일반 Express(또는 Fastify) 객체 목록이다.

        | @Request(), @Req() | req |
        | --- | --- |
        | @Response(), @Res() | res |
        | @Next() | next |
        | @Session() | req.session |
        | @Param(param?: string) | req.params / req.params[param] |
        | @Body(param?: string) | req.body / req.body[param] |
        | @Query(param?: string) | req.query / req.query[param] |
        | @Headers(param?: string) | req.headers / req.headers[param] |
        | @Ip() | req.ip |
        | @HostParam() | req.hosts |
- Custom Decorator
  - 커스텀 데코레이터를 직접 만들 수 있다. node.js 세계에서 requset 객체에 속성을 붙이는 것은 흔한 방법이다. 그러면 각각의 rotue handler에서 이들을 다음과 같은 코드처럼 직접 추출해야 한다.

    ```tsx
    const user = req.user;
    ```

  - 더 가독성 있는 투명한 코드를 만들기 위해서는, `@User()` 데코레이터를 만들고 모든 컨트롤러에서 재사용할 수 있다.

    ```tsx
    import { createParamDecorator, ExecutionContext } from '@nestjs/common';
    
    export const User = createParamDecorator(
      (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
      },
    );
    ```

  - 그러면 요구사항에 맞는 어느 곳에서나 이를 쉽게 사용할 수 있다.

    ```tsx
    @Get()
    async findOne(@User() user: UserEntity) {
      console.log(user);
    }
    ```

## 6.12. userProfile 뮤테이션

- user-profile.dto.ts

```tsx
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileInput {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
```

- users.resolver.ts

```tsx
@UseGuards(AuthGuard)
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.userService.findById(userProfileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        error: 'User Not Found',
        ok: false,
      };
    }
```

- graphQL 쿼리문

```tsx
{ 
 userProfile(userId: 2) {
    ok
    error
    user { id }
  }
}
```

## 6.13. updateProfile

update()

엔티티를 부분적으로 업데이트합니다. 엔티티는 주어진 조건으로 찾을 수 있습니다. save 메소드와 달리 캐스케이드, 관계 및 기타 작업이 포함되지 않은 기본 작업을 실행합니다. 빠르고 효율적인 UPDATE 쿼리를 실행합니다. 데이터베이스에 엔터티가 있는지 확인하지 않습니다.

ex) this.usersRepository.update(id, { email, password })

update()메서드 반환값: UpdateResult

UpdateQueryBuilder 실행에 의해 반환된 결과 객체입니다.

+editProfile에서 이메일을 수정할 때, 이미 존재하는 지는 체크 필요

## 6.14.  updateProfile part Two

- `@BeforeUpdate()`
  - `save()` 메서드를 사용하여 업데이트되기 전에 실행되는 데코레이터이다.
  - 엔티티에 메소드를 정의하고 `@BeforeUpdate()` 데코레이터를 사용하면 TypeORM이 기존 엔티티를 repository/manager `save`을 사용하여 업데이트되기 전에 이를 호출합니다.
  - 그러나 모델에서 정보가 변경된 경우에만 `@BeforeUpdate()` 데코레이터가 실행한다는 점에 유의하십시오. 모델에서 아무 것도 수정하지 않고 저장을 실행하면 `@BeforeUpdate` 및 `@AfterUpdate` 가 실행되지 않습니다. (즉, `update` 메서드를 사용할 때는 실행하지 않음)
  - <https://github.com/typeorm/typeorm/blob/master/docs/listeners-and-subscribers.md#beforeupdate>

## 실행 RECAP

npm run start:dev 실행 후

<http://127.0.0.1:3000/graphql> 접속

- 계정 만들기

```jsx
mutation {
  createAccount(input: { email: "a@a.com", password: "123", role: Owner }) {
    ok
    error
  }
}
```

- 로그인

```json
mutation {
  login(
    input: {
      email: "a@a.com"
      password: "123"
    }
  ) {
    ok
    error
    token
  }
}
```

- 프로필 수정하기

위에서 로그인 후 반환된 token을 HTTP-HEADERS에 아래 예시와 같이 입력하고

```json
{
 "X-JWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk3OTUyNDI3fQ.GuVcBdMZ23Y844sZoq1MoQOdk_hv1mJPfuzy_yXI12U"
}
```

로그인된 계정의 이메일 <a@a.com>을 <b@b.com>으로 변경하기

```json
mutation {
  editProfile(input: { email: "b@a.com" }) {
    ok
    error
  }
}
```

```json
mutation {
  editProfile(input: { password: "0000" }) {
    ok
    error
  }
}
```

- DB에 저장된 프로필 확인하기

Postico 앱을 열고, 해당 Database에 연결한 후 user table에서 확인
