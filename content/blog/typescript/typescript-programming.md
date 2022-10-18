---
title: 타입스크립트 프로그래밍 - 이론 공부
date: 2022-10-03 23:10:72
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

> 책 [타입스크립트 프로그래밍](저자: 보리스 체르니)으로 공부하면서 기억하고 싶은 내용을 정리했습니다. 정확하고 자세한 내용은 해당 책을 꼭 구매하셔서 읽어보시기 바랍니다.

## 컴파일러

- TSC(TypeScript Compiler) : TSC는 AST로 파싱한 후 자바스크립트 코드로 만들기 전에 타입을 체크(TypeChecker)한다.
- TypeChecker : 코드의 타입 안전성을 검증하는 특별한 프로그램
- TS 컴파일 및 실행 과정
    1. [TSC] `타입스크립트` 소스를 `AST`로 `파싱`
    2. [TSC] `TypeChecker` 가 `AST` 를 `타입체크`  ✨
    3. [TSC] `AST`를 `자바스크립트` 소스로 `컴파일`
- JS 컴파일 및 실행 과정
    1. [컴파일러] `자바스크립트` 소스를 `AST`로 `파싱`
    2. [컴파일러] `AST`를 `바이트코드`로 `컴파일`
    3. [런타임] `런타임`이 `바이트코드`를 `평가`
- 컴파일러 + 런타임 = 엔진
  - 보통 자바스크립트 `컴파일러` 와 `런타임` 은 `엔진` 이라는 하나의 프로그램으로 합쳐진다. 이러한 동작을 통해 자바스크립트가 해석되는(interpreted) 언어의 모습을 갖게 만든다.
- TypeSystem
  - TypeChecker가 프로그램을 타입에 할당하는 데 사용하는 규칙 집합
    1. 어떤 타입을 사용하는지 컴파일러에 명시적으로 알려주는 타입 시스템
        - 어노테이션 사용(value: type)
    2. 자동으로 타입을 추론하는 타입 시스템
        - 타입스크립트가 타입을 추론하도록 두는 것이 코드를 줄일 수 있는 방법이기도 하다.
- 자바스크립트가 제공하는 암묵적 변환 때문에 문제의 원인을 추적하기 어렵다. 따라서 타입을 변환할 때는 명시적으로 해야 한다.
- 에러
  - 런타임
    - 자바스크립트는 런타임에 예외를 던지거나 암묵적 형변환을 수행한다.
  - 컴파일 타임
    - 타입스크립트는 컴파일 타임에 SyntaxError와 TypeError를 모두 검출한다.
      - IDE에서 코딩 시 실시간으로 이런 종류의 에러가 바로 표시된다. 타입스크립트처럼 점진적 컴파일을 지원하는 언어는 코드의 일부만 고쳤을 때에는 전체 프로그램을 다시 컴파일할 필요 없으므로 빨리 재컴파일된다.
    - 타입스크립트가 컴파일 타임에 검출할 수 없는 `런타임` 예외도 많다.
      - 예시 : 스택 오버플로, 네트워크 연결 끊김, 잘못된 사용자 입력 등
  - 결론
    - 바닐라 자바스크립트에서는 런타임 에러로 발생했을 많을 에러를 타입스크립트가 컴파일 타임에 검출할 수 있다.

## 코드 편집기 설정

- TSC
  - TSC 자체도 타입스크립트로 구현된 명령행 도구이다. 이런 이유로 TSC는 자신을 컴파일하는 컴파일러라는 특별한 종류의 컴파일러가 된다.
  - TSC를 실행하려면 NodeJS가 필요하다.
- ts-node
  - ts-node를 설치하면, `ts-node 타입스크립트파일명.ts` 명령어를 통해 타입스크립트를 컴파일하고 실행할 수 있다.

### tsconfig.json

- 루트 디렉터리에 tsconfig.json이라는 파일이 존재해야 한다. 이 파일은 타입스크립트 프로젝트에서 어떤 파일을 컴파일하고, 어떤 자바스크립트 버전으로 방출하는지 등을 정의한다.
- `tsc --init` 명령을 이용해 자동 설정할 수 있다.
- 옵션
  - `include` : TSC가 타입스크립트 파일을 찾을 디렉터리
  - `lib` : TSC가 코드 실행 환경에서 이용할 수 있다고 가정하는 API(ex, ES5의 bind, Object.assign, DOM의 document.querySelector),  브라우저용 타입스크립트를 작성하기 위해 “dom”을 lib에 추가한다.
  - `module` TSC가 코드를 컴파일할 대상 모듈 시스템(CommonJS, SystemJS, ES2015 등) 타입스크립트는 esnext 모듈 모드에서만 동적 임포트를 지원한다.
 {”module”: “esnext”}
  - `outDir` 생성된 자바스크립트 코드를 출력할 디렉터리
  - `strict` 유효하지 않은 코드를 확인할 때 가능한 엄격하게 검사
 `noImplicitAny` , `strictBindCallApply`, `strictFunctionTypes`
  - `target` TSC가 코드를 컴파일할 자바스크립트 버전(ES3, ES5, ES2015, ES2016 등)
  - `noImplicitAny` 암묵적인 any가 나타났을 때 예외를 일으킬 수 있다.
  - `strictNullChecks` false로 설정하면, 이 때의 null은 never를 제외한 모든 타입의 하위 타입이다. 즉, 모든 타입은 null이 될 수 있으므로 모든 값이 null인지 아닌지를 먼저 확인해야 타입이 무엇인지 단정할 수 있는데, false로 설정하면 이 과정을 생략하게 된다. 그러나 예상치 않은 상황에서 값이 null이라면 런타임에 치명적인 널 포인터 예외가 발생한다. 컴파일 타임에 가능한 많은 버그를 검출하는 것이 목표라면 타입 시스템에서 null을 확인할 수 있어야 한다.
  - `preserveConstEnums` const enum의 런타임 코드 생성을 활성화하려면 preserveConstEnums 설정을 true로 바꾼다.
  - `strictBindCallApply` call, apply, bind를 안전하게 사용하려면 이 플래그를 활성화해야 한다.
  - `noImplicitThis` 이 플래그를 true로 하면, 함수에서 항상 this 타입을 명시적으로 설정하도록 강제한다.
 단, 클래스와 객체의 함수에는 this 지정을 강제하진 않는다.
  - `strictFunctionTypes` 호환성으로 인해, 타입스크립트 함수의 매개변수와 this 타입은 기본적으로 공변이다. 더 안전한 공변을 사용하려면 이 플래그를 true로 설정해야 한다.
  - `noImplicitReturns` 이 플래그를 활성화하면 함수 코드의 모든 경로에서 값을 반환하는지 확인할 수 있다. 추론되도록 하여 명시적 반환문을 되도록 적게 쓰는 사람도 있고, 타입 안전성을 향상시키고 타입 검사기가 더 많은 버그를 잡을 수 있다는 이유에서 반환문을 추가하는 사람도 있다
  - `keyofStringsOnly` 타입스크립트의 keyof는 기본적으로 number | string | symbol 타입의 값을 반환한다. 올바른 동작이지만, 이 때문에 타입스크립트에게 특정 키가 string이고 number나 symbol이 아니라는 사실을 증명해야 하는 귀찮은 상황에 놓일 수 있다. 따라서 타입스크립트가 string 키만 지원하던 예전처럼 동작하길 원한다면 이 플래그를 활성화한다.
  - `esModuleInterop` 이 옵션을 켜면 **Commonjs**방식으로 내보낸 모듈을 es모듈 방식의 **import**로 가져올 수 있게 해준다.
  - `typeRoots` 기본적으로 node_modules/@types 디렉터리에서 서드 파티 타입 선언을 찾으며, 대부분은 이 동작을 바꿀 필요가 없다. 하지만 이 기본 동작을 오버라이드할 필요가 있다면, `typeRoots`에 타입 선언을 검색할 디렉터리들을 배열로 설정하면 된다.

        ```tsx
        // /node_modules/@types 뿐만 아니라 typings 디렉터리에서도 타입 선언을 찾도록 설정 예시
        "typeRoots" : [
         "./typings",
         "./node_modules/@types"
        ]
        ```

  - `types` : 타입스크립트가 어떤 패키지에서 타입을 검색할지 더 세밀하게 설정할 수 있다.

      ```tsx
      // 리액트를 제외한 모든 서드 파티 타입 선언을 무시하는 설정
      "types": ["react"]
      ```

## 타입의 종류

- type이란, 값과 이 값으로 할 수 있는 일의 집합을 의미한다.
  - ex) string 타입은 모든 문자열과 문자열에 수행할 수 있는 모든 연산, 문자열에 호출할 수 있는 모든 메서드의 집합이다.
- any
  - any는 모든 값의 집합이다. any를 사용하면 값이 자바스크립트처럼 동작하기 시작하면서 Type Checker가 작동하지 않는다. 사용하지 않는 것이 좋다.
  - 설정에서 `noImplicitAny` 플래그나 `strict` 플래그를 활성화하여, 암묵적인 any가 나타났을 때 예외를 일으킬 수 있다.
- unknown
  - 타입을 미리 알 수 없는 어떤 값이 있을 때 any 대신 unknown을 사용한다. unknown의 타입을 검사해 정제하기 전까지는 타입스크립트가 unknown 타입의 값을 사용할 수 없게 강제한다.
- boolean
  - true, false
- type literal
  - 오직 하나의 값을 나타내는 타입
  - 예를 들어 `const c = true` 의 경우, const를 사용했으므로 타입스크립트는 그 변수의 값이 절대 변하지 않으리라는 사실을 알게 되어 해당 변수가 가질 수 있는 가장 좁은 값인 true로 추론한다.  (let, var는 일반적인 타입으로만 추론한다)
  - type literal은 실수를 방지해 안전성을 추가로 확보해주는 강력한 언어 기능이다.
- number
  - 모든 숫자(정수, 소수, 양수, 음수, Infinity, NaN 등)의 집합이다.
  - 2의 53승까지의 정수를 표현할 수 있다.
- bigint
  - bigint는 자바스크립트와 타입스크립트에 새로 추가된 타입이다. 이를 이용하면 라운딩 관련 에러 걱정 없이 큰 정수를 처리할 수 있다.
  - 2의 53승보다 더 큰 수도 표현할 수 있다.

    ```tsx
    let a = 1234n;
    let f:bigint = 100n; // bigint
    ```

- string
- symbol
  - ES2015에서 새로 추가된 기능이며, 실무에서는 심벌을 자주 사용하지 않는 편이다.
  - 객체와 맵에서 문자열 키를 대신하는 용도로 사용한다.
- object
  - 타입스크립트의 객체 타입은 객체의 형태를 정의한다.
  - 타입스크립트가 객체의 형태를 추론하게 하거나 중괄호 안에서 명시적으로 타입을 묘사할 수 있다.

    ```tsx
    let a: {b: number} = {
     b: 12
    } 
    ```

  - 기본 타입(boolean, number, bigint, string, symbol)과 달리 객체를 const로 선언해도 타입스크립트는 더 좁은 타입으로 추론하지 않는다.
  - 객체 리터럴은 객체가 어떤 필드를 포함할 수 있는지 알고 있거나 객체의 모든 값이 같은 타입을 가질 때 사용한다.
- 인덱스 시그니처
  - `[key: T]: U` 와 같은 문법을 인덱스 시그니처라 부른다.
    - “이 객체에서 모든 T 타입의 키는 U 타입의 값을 갖는다”
    - 키 이름은 원하는 이름으로 바꿔도 된다.
    - 타입스크립트에 어떤 객체가 `여러 키`를 가질  수 있음을 알려준다.

    ```tsx
    let car: {
      [carName: string]: string
    } =  {
      'bmw': 'Marco',
      'benz': 'John',
    ```

- Type Alias(타입 별칭)

    ```tsx
    type Age = number
    type Person = {
     name: string
     age: Age
    }
    ```

  - Type Alias로 타입을 가리킬 수 있다.
  - 타입스크립트는 Type Alias를 추론하지는 않으므로 반드시 Type Alias의 타입을 명시적으로 정의해야 한다.
  - 하나의 Type Alias를 두 번 정의할 수 없다.
  - Type Alias도 블록 Scope에 적용된다.
- 유니온 타입(합집합 |), 인터섹션 타입(교집합 &)
  - 실무에서는 대개 인터섹션보다 유니온을 자주 사용한다.

    ```tsx
    type Cat = {name: string, purs: boolean}
    type Dog = {name: string, barks: boolean, wags: boolean}
    type CatOrDogOrBoth = Cat | Dog
    
    // CatOrDogOrBoth에는 Cat, Dog 또는 둘 다 할당할 수 있다.
    
    type CatAndDog = Cat & Dog
    
    ```

- 배열
  - `T[]` 또는 `Array<T>` 라는 두 가지 배열 문법이 제공된다.
- 튜플
  - 튜플은 배열의 서브타입이다.
    - 튜플은 길이가 고정되었고 각 인덱스의 타입이 알려져있다.

    ```tsx
    let a: [string, string, boolean] = ['marco', 'jang', true];
    let b: [number, boolean, ...string[]] = [1, false, 'a', 'b', 'c'];
    ```

  - 읽기 전용 배열과 튜플
    - readonly, Readonly, ReadonlyArray 유틸리티 중 골라서 사용한다.

        ```tsx
        type A = readonly string[];
        type B = ReadonlyArray<string>
        type C = Readonly<string[]>
        type D = readonly [number, string]
        type E = ReadOnly<[number, string]>
        ```

- null, undefined,
  - null, undefined 값의 타입은 각각 null, undefined이다.
    - null은 값이 없다는 의미다.
    - undefined는 아직 값이 정의되지 않았음을 의미한다.
- void
  - void는 명시적으로 아무것도 반환하지 않는 함수(ex, console.log)의 반환타입을 가리킨다.
    - 즉, return문을 포함하지 않는 함수의 반환타입을 가리킨다.
- never
  - never는 절대 반환하지 않는 함수 타입을 가리킨다.
    - 예를 들어, 예외(`throw`)를 던지거나 영원히 실행(`while(true)`)되는 함수가 절대 반환하지 않은 함수이다.
  - never는 모든 타입의 서브타입이다. 즉 모든 타입에 never를 할당할 수 있다.
- enum(열거형)
  - enum은 해당 타입으로 사용할 수 있는 값을 열거하는 기법이다.
    - 키를 값에 할당한다. 키가 컴파일 타임에 고정된 객체다.
    - 순서가 없는 자료구조다.
    - 타입스크립트는 자동으로 열거형의 각 멤버에 적절한 숫자를 추론하여 할당한다.
    - 또는 개발자가 직접 값을 명시적으로 설정할 수도 있다(이런 습관이 적절)

      ```tsx
      enum Language {  // 이름은 단수명사이며 첫 문자를 대문자로 하는 것이 관례다.
        English,  // 키도 앞 글자를 대문자로 표시한다.
        Spanish, 
        Russian
      }
      
      enum Language {
        English = 0,
        Spanish = 1,
        Russian = 2
      }
      ```

  - const enum은 더 안전한 열거형 타입이며, 역방향 찾기를 지원하지 않는다.
    - const enum 멤버는 문자열 리터럴로만 접근할 수 있다.
    - const enum 기본적으로 아무 자바스크립트 코드도 생성하지 않으며, 대신 필요한 곳에 열거형 멤버의 값을 채워 넣는다.
      - 하지만 const enum을 사용할 때는 채워 넣기 기능을 되도록 피해야 하며, 직접 제어할 수 있는 타입스크립트 프로그램에서만 사용해야 한다. 왜냐하면 다른 사람이 const enum을 갱신하면 같은 열거형이 버번에 따라 다른 값을 갖게 되기 때문이다. npm으로 배포하거나 라이브러리로 제공할 프로그램에서는 const enum을 사용해서는 안 된다.
  - 열거형을 안전하게 사용하는 방법이 까다로우므로 열거형 자체를 사용하지 않는 편이 낫다.
- Template Literal Type
  - [https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

## 함수

- 선택적 매개변수
  - 선택적 매개변수는 필수 매개변수 보다 뒤에 추가되어야 한다.

    ```tsx
    function log(message: string, userId?: string) {...}
    ```

- 기본 매개변수
  - 매개변수를 선택적으로 만드는 것과 같다.
  - 기본 매개변수는 어느 위치에나 추가할 수 있다.

    ```tsx
    function log(message: string, userId = 'Not signed In') {...}
    ```

- rest 매개변수
  - 인수를 여러 개 받는 함수라면 그 목록을 배열 형태로 건넬 수도 있다.

    ```tsx
    function sum(...numbers: number[]) {///}
    ```

- call, apply, bind

    ```tsx
    function add(a:number, b:number): number {
     return a + b
    }
    
    add(10, 20)
    add.apply(null, [10, 20])
    add.call(null, 10, 20)
    add.bind(null, 10, 20)()
    ```

- this
  - 함수에서 this를 사용할 때는 기대하는 this 타입을 함수의 첫 번째 매개변수로 선언해야 한다.
    - 그러면 함수 안에 등장하는 모든 this가 의도한 this가 됨을 타입스크립트가 보장해준다.(함수 시그니처에서 사용한 this는 예약어이므로, 다른 매개변수와 완전히 다른 방식으로 처리된다)

    ```tsx
    // 런타임 에러 발생(bad)
    function getNextYear() {
     return this.getFullYear() + 1
    }
    
    getNextYear.call(new Date) // 2023
    
    getNextYear(); // 런타임 에러 Uncaught TypeError: this.getFullYear is not a function
    ```

  - 타입스크립트에 정보를 제공한 덕분에, 런타임 에러 대신 컴파일 타임에 경고한다. (noImplicitThis 추천)

    ```tsx
    // 컴파일 타임 때 미리 에러 잡음(good)
    function getNextYear(this: Date) { //첫 번째 매개변수에 this 타입 선언
     return this.getFullYear() + 1
    }
    
    getNextYear.call(new Date) // 2023
    
    getNextYear(); // 컴파일타임 에러 Uncaught SyntaxError: Unexpected token 'this'
    ```

### 함수 호출 시그니처

- 함수 호출 시그니처(Call 시그니처, Type 시그니처)는 타입스크립트의 함수 타입 문법이다.
  - 값이 아닌 타입 정보(타입 수준 코드)만 포함한다. 따라서 기본값은 표현할 수 없다.
  - 반환 타입을 명시해야 한다.

    ```tsx
    type Fn = (a: number, b: number) => number
    // 두 개의 number를 인수로 받아 한 개의 number를 반환하는 함수를 표현했다.
    ```

- 단축형 호출 시그니처

    ```tsx
    type Log = (message: string, userId?: string) => void
    ```

- 전체 호출 시그니처

    ```tsx
    type Log = {(message: string, userId?: string) : void}
    ```

  - 기능적으로 단축형과 동일하나 조금 더 복잡한 문법이므로, 오버로드된 함수와 같이 꼭 필요할 때만 전체 호출 시그니처를 사용한다.
- 오버로드된 함수
  - 오버로드된 함수란, 호출 시그니처가 여러 개인 함수를 의미한다.
  - 자바스크립트는 동적 언어이므로 어떤 함수를 호출하는 방법이 여러 가지다.  또한, 인수 입력 타입에 따라 반환 타입이 달라지기도 한다.
    - 타입스크립트는 이러한 동적 특징을 오버로드된 함수 선언으로 제공하고, 입력 타입에 따라 달라지는 함수의 출력 타입은 정적 타입 시스템으로 각각 제공한다.
  - 오버로드된 함수 시그니처를 이용하면 표현력 높은 API를 설계할 수 있다.

    ```tsx
    type Reserve = {
     (from: Date, to: Date, destination: string): Reservation
     (from: Date, destination: string): Reservation
    }
    
    let reserve: Reserve = (
     from: Date,
     toOrDestination: Date | string,
     destination?: string
    ) => {
     if( toOrDestination instanceof Date && destination !== undefined) {
      // toOrDestination이 to임
      // 왕복 여행 예약
     } else if (typeof toOrDestination === 'string') {
      // toOrDestination이 destination임
      // 편도 여행 예약
     }
    }
    ```

  - 오버로드 시그니처는 구체적(타입을 좁게)으로 유지하면, 함수를 구현하는 데 도움을 준다.
  - 오버로드는 브라우저 DOM API에서 유용하게 활용된다.

    ```tsx
    type CreateElement = {
     (tag: 'a'): HTMLAnchorElement
     (tag: 'canvas'): HTMLCanvasElement
     (tag: string): HTMLElement
    }
    
    let createElement: CreateElement = (tag: string): HTMLElement => {}
    ```

  - 함수의 프로퍼티를 만드는 데도 사용할 수 있다.
    - 아래의 warnUser는 호출할 수 있는 함수인 동시에 boolean 속성인 wasCalled도 가지고 있다.

    ```tsx
    type WarnUser = {
     (warning: string): void
     wasCalled: boolean
    }
    
    const warnUser : WarnUser = (warning) => {
     if(warnUser.wasCalled) {
      return
     }
     warnUser.wasCalled = true
     alert(warning)
    }
    
    warnUser.wasCalled = false
    
    warnUser('hi'); // alert창으로 hi 찍힘
    console.log(warnUser.wasCalled); // true
    ```

### 다형성

- 기대하는 타입을 정확하게 알고 있고, 실제 이 타입이 전달되었는지 확인할 때는 `구체 타입(concrete type)` 이 유용하다.
- 하지만 때로는 어떤 타입을 사용할지 미리 알 수 없는 상황이 있는데 이런 상황에서는 함수를 특정 타입으로 제한하기 어렵다.

    ```tsx
    type Filter = {
     (array: number[], f: (item: number) => boolean): number[]
     (array: object[], f: (item: object) => boolean): object[]
    } // 위 타입은 object가 객체의 실제 형태에 어떤 정보도 알려주지 않아 에러 발생
    ```

  - 이러한 경우에는 `제네릭 타입(generic type)` 을 사용한다.

### `제네릭 타입 매개변수`  ( = 제네릭 타입)

- 여러 장소에 타입 수준의 제한을 적용할 때 사용하며, `플레이스홀더 타입` 또는 `다형성 타입 매개변수`라고 부른다.
- 타입스크립트는 전달된 인자의 타입을 보고 T의 타입을 추론한다.
- 꺾쇠괄호(<>)로 제네릭 타입 매개변수임을 선언한다.
- T는 단지 타입 이름이다. T 대신 어떤 것도 사용할 수 있으나, 일반적으로 T, U, V, W 순으로 필요한 만큼 사용한다.
- 제네릭은 함수의 기능을 구체 타입을 사용할 때보다 더 일반화하여 설명할 수 있는 강력한 도구다.
  - 가능하면 제네릭을 사용하자. 제네릭은 코드를 일반화하고, 재사용성을 높이고, 간결하게 유지하는 데 도움을 준다.
- 언제 제네릭 타입이 한정되는가?
  - 제네릭 타입의 선언 위치에 따라 `타입의 범위` 와 제네릭 타입을 언제 `구체 타입` 으로 한정하는지도 결정된다.

    ```tsx
    type Filter = {
     <T>(array: T[], f: (item: T) => boolean): T[]
    };
    
    const filter: Filter = (array, f) => array.filter(f);
    
    const names = [{firstName: 'marco'}, {firstName: 'john'}, {firstName: 'mary'}]
    
    // [런타임] 함수 호출 시 T가 {firstName: string)으로 한정됨
    console.log(filter(names, item => item.firstName.startsWith('m')));
    // [{"firstName": "marco"}, {"firstName": "mary"}]
    ```

  - 위 예에서는 <T>를 호출 시그니처의 일부로 선언했으므로 타입스크립트는 Filter 타입의 `함수를 호출할 때` 구체 타입을 T로 한정한다.

    ```tsx
    type Filter<T> = {
     (array: T[], f: (item: T) => boolean): T[]
    };
    // [컴파일 타임] Filter 타입의 함수를 선언할 때 T가 {firstName: string)으로 한정됨
    const filter: Filter<{firstName: string}> = (array, f) => array.filter(f);
    
    const names = [{firstName: 'marco'}, {firstName: 'john'}, {firstName: 'mary'}]
    
    console.log(filter(names, item => item.firstName.startsWith('m')));
    // [{"firstName": "marco"}, {"firstName": "mary"}]
    ```

  - 위 예에서는 Filter `Type Alias를 사용할 때` 타입을 명시적으로 한정함으로써 T의 범위를 Filter의 `Type Alias`로 한정한다.
  - 제네릭을 사용할 때란, 케이스마다 다음과 같은 시점을 의미한다.
    - 함수에서는 함수를 호출할 때
    - 클래스라면 클래스를 인스턴스화 할 때
    - TypeAlias와 인터페이스에서는 이들을 사용하거나 구현할 때
- 제네릭 선언 위치(재정리)
  - 함수를 호출할 때 T를 구체 타입으로 한정하는 경우

    ```tsx
    // 전체 호출 시그니처
    type Filter = {
     <T>(array: T[], f: (item: T) => boolean): T[]
    };
    
    // 단축 호출 시그니처
    type Filter = <T>(array: T[], f: (item: T) => boolean): T[] 
    
    // 함수 선언
    let filter: Filter = // ...
    ```

    ```tsx
    // 각 함수 호출은 자신만의 T 한정 값을 갖게 되는 경우
    function filter<T>(array: T[], f: (item: T) => boolean): T[] {
     //...
    }
    ```

  - 함수를 선언할 때 T를 구체 타입으로 한정하는 경우

    ```tsx
    // 전체 호출 시그니처
    type Filter<T> = {
     (array: T[], f: (item: T) => boolean): T[]
    };
    
    // 단축 호출 시그니처 버전
    type Filter<T> = (array: T[], f: (item: T) => boolean): T[]
    
    // 함수 선언
    let filter: Filter<number> = // ...
    ```

- 타입스크립트는 `제네릭 함수의 인수`에만 의지하여 제네릭 타입을 추론한다. 따라서 다음과 같은 경우 Promise의 제네릭 타입 인수를 명시하여, result의 타입을 정확히 추론하도록 한다.

    ```tsx
    const promise = new Promise(resolve => resolve(45));
    
    promise.then(result => console.log(result * 4)) // Object is of type 'unknown'.
    ```

    ```tsx
    const promise = new Promise<number>(resolve => resolve(45));
    
    promise.then(result => console.log(result * 4)); // 180
    ```

- 특정 요소의 타입을 알 수 없는 때를 대비해 제네릭 타입에 기본값을 추가할 수 있다.
  - 기본 타입을 갖는 제네릭은 기본 타입을 갖지 않는 제네릭 뒤에 위치해야 한다.

    ```tsx
    type MyEvent<T = HTMLElement> = {
     target: T;
     type: string;
    }
    ```

    ```tsx
    // T가 HTML 요소에 한정되도록 T에 경계 추가하고, 기본값도 추가
    type MyEvent<T extends HTMLElement = HTMLElement> = {
     target: T;
     type: string;
    }
    ```

### 타입 주도 개발

- type-driven development
  - 타입 시그니처(함수 호출 시그니처)를 먼저 정하고 값을 나중에 채우는 프로그래밍 방식

    ```tsx
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
    ```

  - 위와 같은 map 함수의 타입 시그니처를 통해, map이 어떤 동작을 하는지 감을 잡을 수 있다.

- [Quiz] 타입스크립트는 함수 타입 시그니처에서 어떤 부분을 추론하는가? 매개변수 타입, 반환 타입, 또는 두 가지 모두?
  - 함수 타입 시그니처(=함수 호출 시그니처)는 함수의 전체 타입을 표현하는 방법이다.
  - 함수 타입 시그니처는 타입 수준 코드만 포함하지만, 구현 코드와 거의 같다. 이는 언어 설계상 의도한 결정이다. 이렇게 함으로써 함수 타입 시그니처를 쉽게 추론할 수 있다.
- [Quiz] 자바스크립트의 arguments 객체는 타입 안전성을 제공하는가? 그렇지 않다면 무엇으로 대체할 수 있을까?
  - 가변인자가 필요할 경우 arguments 객체를 사용할 수 있으나, arguments 객체는 안전하지 않다.
    - arguments로 받은 인자는 any 타입으로 추론된다.
    - 또한 함수에서 매개변수를 받지 않도록 선언했으므로, arguments 객체를 사용한 함수를 호출하면 타입스크립트 입장에서는 인자를 받을 수 없다면서 TypeError를 발생시킨다.
  - 따라서 arguments 객체 대신 `rest parameters` 를 사용하는 것이 좋다. 왜냐하면  `rest parameters` 를 사용하면 가변 인자를 받으면 타입 안전성을 갖춘 함수가 되기 때문이다.

    ```tsx
    function sum(...numbers: number[]): number {
        return Array.from(numbers).reduce((total, n) => total + n, 0);
    }
    
    console.log(sum(1,2,3))
    ```

- [Quiz] reserve 함수에 명시적 시작 날짜 없이 목적지만 인수로 받는 세 번째 호출 시그니처를 추가한다.

    ```tsx
    type Reserve = {
     (from: Date, to: Date, destination: string): Reservation;
     (from: Date, destination: string): Reservation;
     (from: string): Reservation;
    }
    
    const reserve: Reserve = (
     fromOrDestination: Date | string,
     toOrDestination?: Date | string,
     destination?: string
    ) => {
     if( toOrDestination instanceof Date && destination !== undefined) {
      // 첫 번째 호출 시그니처를 지원함
      // 왕복 여행 예약
     } else if (typeof toOrDestination === 'string') {
      // 두 번째 호출 시그니처를 지원함
      // 편도 여행 예약
     } else if (typeof fromOrDestination === 'string') {
      // 세 번째 호출 시그니처를 지원함
      // 목적지만 보고 편도 여행 예약
     } 
    }
    ```

- [Quiz] call 함수에서 두 번째 인수가 string인 함수여야 정상 동작하도록 구현을 바꿔보자. 이를 제외한 모든 함수는 컴파일 타임에 에러를 발생시켜야 한다.

    ```tsx
    // before
    function fill(length: number, value: string): string[] {
        return Array.from({length}, () => value);
    }
    
    function call<T extends unknown[], R>(
        f: (...args: T) => R,
        ...args: T  // T는 [length, value]
    ): R {
        return f(...args);
    };
    
    let a = call(fill, 10, 'a'); // (f, length, value)
    
    console.log(a); //  ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a"]
    ```

    ```tsx
    // after
    function fill(value: string, length: number): string[] {
        return Array.from({length}, () => value);
    }
    
    function call<T extends [string, number], R>(
        f: (...args: T) => R,
        ...args: T  // T는 [length, value]
    ): R {
        return f(...args);
    };
    
    let a = call(fill, 'a',  10); // (f, length, value)
    
    console.log(a); // ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a"]
    ```

## 클래스와 인터페이스

- 타입스크립트의 클래스 기능 대부분은 `C#`에서 빌려왔다.
- 타입스크립트 클래스를 컴파일하면 일반 자바스크립트 클래스가 된다.
  - 프로퍼티 초기자와 데코레이터 같은 기능 일부는 자바스크립트에서도 지원되므로 실제 런타임 코드를 생성한다.
  - 반면, 가시성 접근자, 인터페이스, 제레닉 등은 타입스크립트 고유 기능이므로 컴파일 타임에만 존재한다.

### 인터페이스

- 인터페이스도 Type Alias처럼 타입에 이름을 지어주는 수단이다.
- 인터페이스와 Type Alias의 공통점
  - 둘 다 `형태`를 정의하며 두 형태 정의는 서로 할당할 수 있다.
  - Type Alias의 `인터섹션(&)`이 인터페이스의 `extends`와 기능적으로 유사하다.

    ```tsx
    type Food = {
        calories: number;
        tasty: boolean;
    }
    
    type Cake = Food & {
        sweet: boolean;
    }
    ```

    ```tsx
    interface Food {
        calories: number;
        tasty: boolean;
    }
    
    interface Cake extends Food {
        sweet: boolean;
    }
    ```

    ```tsx
    interface Food {
        calories: number;
        tasty: boolean;
    }
    type Cake = Food & {
        sweet: boolean;
    }
    ```

    ```tsx
    type Food = {
        calories: number;
        tasty: boolean;
    }
    
    interface Cake extends Food {
        sweet: boolean;
    }
    ```

- 인터페이스와 Type Alias의 차이점 세 가지
    1. Type Alias 우측에는 타입 표현식을 포함한 모든 타입이 등장할 수 있다(Type Alias가 더 일반적임).
        - 반면 인터페이스의 우측에는 반드시 형태로 작성되어야 한다.

        ```tsx
        type A = number;
        type B = A | string; // 타입 표현식
        ```

    2. 인터페이스를 상속(extends)할 때 상속받는 인터페이스의 타입에 상위 인터페이스를 할당할 수 없으면 컴파일 타임 에러를 발생시킨다.
        - 반면, Type Alias와  인터섹션(&)으로 바꾸면 확장하는 타입을 최대한 조합하는 방향으로 동작하여, 컴파일 타임 에러가 발생하지 않는다.

        ```tsx
        interface A {
            good(x: number): string;
            bad(x: number): string;
        }
        
        interface B extends A {  
            good(x: string | number): string;
            bad(x: string): string; // Interface 'B' incorrectly extends interface 'A'.
        }
        ```

        ```tsx
        interface A {
            good(x: number): string;
            bad(x: number): string;
        }
        
        type B = A  & {
            good(x: string | number): string;
            bad(x: string): string;
        }
        // 컴파일 타임 에러 나지 않음
        ```

    3. 이름과 범위가 같은 인터페이스가 여러 개 있으면 이들이 자동으로 합쳐진다(선언병합).
        - 반면 Type Alias에 대해 선언 병합을 시도하면 컴파일 타임 에러가 발생한다.

## 고급 타입

- 타입스크립트의 기본 타입 문법만으로 다양한 데이터의 타입을 표현하기 어려워졌다. 타입에 관한 타입인 `메타 타입`( 고급 타입) 이 필요해졌다. 즉, 메타 타입은 추상화된 타입이다.

### 타입 간의 관계

- 서브타입
  - B가 A의 서브타입이면, A가 필요한 곳에는 어디든 B를 안전하게 사용할 수 있다.(B가 A에 포함된다)
    - ex) 배열은 객체의 서브타입이다.
  - `A >: B` 는 B는 A와 같거나 A의 서브타입이라는 의미다.(공식 문법은 아님)
- 슈퍼 타입
  - B가 A의 슈퍼타입이면, B가 필요한 곳에는 어디든 A를 안전하게 사용할 수 있다.(A가 B에 포함된다)
    - ex) 객체는 배열의 슈퍼타입이다.
  - `A <: B` 는 B는 A와 같거나 A의 슈퍼타입이라는 의미다.(공식 문법은 아님)
- 타입스크립트는 어떤 형태를 요구할 때 건넬 수 있는 타입은, 요구되는 타입에 포함된 프로퍼티 각각에 대해 `<: 기대하는 타입` 인 프로퍼티들을 가지고 있어야 한다.
  - 타입과 관련해 타입스크립트 `형태`는 그들의 `프로퍼티 타입`에 `공변` 한다고 말한다.
- 공변의 가변성 네 종류
    1. 불변(invariance)
        - 정확히 T를 원함
    2. 공변(covariance)
        - `<:T` 를 원함 (나보다 더 큰 집합(슈퍼 타입)인 T를 원한다)
            - 타입스크립트에서 모든 복합타입의 멤버(객체, 클래스, 배열, 함수, 반환 타입)는 공변이다.
    3. 반변(contravariance)
        - `>:T` 를 원함 (나보다 더 작은 집합(서브 타입)인 T를 원한다)
            - 함수 매개변수 타입만 예외적으로 반변이다.
    4. 양변(bivariance)
        - `<:T` 또는 `>:T` 를 원함
- 함수 가변성
  - 함수 A가 함수 B와 같거나, 적은 수의 매개변수를 가지며 다음을 만족하면, `A는 B의 서브타입`이다.
        1. A의 this 타입을 따로 지정하지 않으면 ‘A의 this 타입 `>:` B의 this 타입’이다.
        2. ‘A의 각 매개변수 `>:` B의 대응 매개변수’이다.
            - 함수의 매개변수 타입은 `반변` 이다. 즉, 함수를 다른 함수에 할당하려면 ‘this를 포함한 매개변수 타입 `>:` 할당하려는 함수의 대응 매개변수 타입’ 조건을 만족해야 한다.
        3. ‘A의 반환 타입 `<:` B의 반환 타입’이다.
            - 함수의 반환 타입은 `공변` 이다. 즉, 함수가 다른 함수의 서브타입이라면 ‘서브타입 함수의 반환 타입 `<:` 다른 함수의 반환 타입’을 만족해야 한다.
  - 안전한 공변을 사용하려면 `strictFunctionTypes` 플래그를 설정해야 한다.

### const 타입으로 좁히기

- 변수 선언 키워드
  - let, var로 선언한 변수는 그 변수의 타입이 기본 타입으로 넓혀진다.
  - const로 선언하면 그 변수의 타입이 리터럴 값으로 좁혀진다
- const 타입
  - TS에서 타입이 넓혀지지 않도록 하는 `const`라는 특별 타입이 제공된다. 이를 Type assertion으로 활용한다. 멤버들까지 자동으로 readonly가 되며, 중첩된 자료구조에도 재귀적으로 적용된다.

    ```tsx
    let c = [1, { x: 2 }] as const; // readonly [1, {readonly x: 2}]
    ```

### 정제

- discriminated union type
  - 유니온의 멤버가 서로 중복될 수 있으므로 타입스크립트는 유니온의 어떤 타입에 해당하는지를 조금 더 안정적으로 파악할 수 있어야 한다.
    - 리터럴 타입을 이용해 유니온 타입이 만들어낼 수 있는 각각의 경우를 tag하는 방식으로 이 문제를 해결할 수 있다.
  - 좋은 tag의 조건
    - 리터럴 타입이다.
    - 제네릭이 아니다(태그는 제네릭 타입 인수를 받지 않아야 함).
    - 상호 배타적이다(유니온 타입 내에서 고유함).
  - 유니온 타입의 다양한 경우를 처리하는 함수(플럭스, 리덕스 리듀서, 리액트의 useReducer)를 구현해야 하는 경우 태그된 유니온을 사용하는 것이 좋다.

    ```tsx
    type UserTextEvent = {
     type: 'TextEvent',
     target: HTMLInputElement,
    }
    
    type UserMouseEvent = {
     type: 'MouseEvent',
     target: HTMLElement,
    }
    
    type UserEvent = UserTextEvent | UserMouseEvent
    
    function handle(event: UserEvent) {
     if(event.type === 'TextEvent') {
      // UserTextEvent
      return
     }
     // UserMouseEvent
    }
    
    ```

### 고급 객체 타입

- keyin 연산자
  - 대괄호 표기법을 사용하는 keyin으로 프로퍼티 타입을 찾아 편하게 타입을 추출할 수 있다.

    ```tsx
    type FriendList = APIResponse['user']['friendList']; // 친구 목록 객체 타입 얻기
    
    type FriendList = FriendList['friends'][number]; // 친구 한 명의 타입 얻기
    ```

- keyof 연산자
  - keyof을 이용하여 객체의 모든 키를 문자열 리터럴 타입 유니온으로 얻을 수 있다.

    ```tsx
    type FriendList = keyof APIResponse['user']['friendList']; // 'count' | 'friends'
    ```

- Record 타입
  - Record 타입을 이용하면 무언가를 매핑하는 용도로 객체를 활용할 수 있다.

    ```tsx
    type Weekday = "MON" | "TUE" | "WED" | "THU" | "FRI";
    type Day = Weekday | "SAT" | "SUN";
    
    // Record를 이용하면 nextDay의 키와 값에 제한을 추가할 수 있다.
    let nextDay: Record<Weekday, Day> = {
      MON: "TUE",
      TUE: "WED",
      WED: "THU",
      THU: "FRI",
      FRI: "SAT",
      SUN: "MON", // Object literal may only specify known properties, and 'SUN' does not exist in type 'Record<Weekday, Day>'
    };
    ```

- mapped type
  - mapped type은 타입스크립트의 고유한 언어 기능이며, 고유 문법이 있다.

    ```tsx
    type MyMappedType = {
        [key in UnionType]: ValueType
    };
    ```

  - Record 타입을 구현하는데 , mapped type이 사용됐다.

    ```tsx
    type Record<K extends keyof any, T> = {
        [P in K]: T
    }
    ```

    ```tsx
    type Weekday = "MON" | "TUE" | "WED" | "THU" | "FRI";
    type Day = Weekday | "SAT" | "SUN";
    
    let nextDay: { [K in Weekday]: Day } = {
      MON: "TUE",
      TUE: "WED",
      WED: "THU",
      THU: "FRI",
      FRI: "SAT",
      SUN: "MON", // Object literal may only specify known properties, and 'SUN' does not exist in type '{ MON: Day; TUE: Day; WED: Day; THU: Day; FRI: Day; }'
    };
    ```

  - mapped Type을 활용한 타입스크립트의 내장 타입
    - `Record<Keys, Values>`
      - Keys 타입의 키와 Values 타입의 값을 갖는 객체
    - `Partial<Object>`
      - Object의 모든 필드를 선택형으로 표시
    - `Required<Object>`
      - Object의 모든 필드를 필수형으로 표시
    - `Readonly<Object>`
      - Object의 모든 필드를 읽기 전용으로 표시
    - `Pick<Object, Keys>`
      - 주어진 Keys에 대응하는 Object의 서브타입을 반환

- 컴패니언 객체 패턴
  - 타입과 값(객체)을 쌍으로 묶는 패턴이다.
  - 타입스크립트에서 타입과 값은 서로 별도의 네임스페이스를 갖는다. 따라서 같은 영역에 하나의 이름을 타입과 값 모두에 연결할 수 있다.
  - 이 패턴을 이용하면 타입과 값을 한 번에 import할 수 있다.
  - 타입과 객체가 의미상 관련되어 있고, 이 객체가 타입을 활용하는 메서드를 제공하면 이 패턴을 이용하면 좋다.
