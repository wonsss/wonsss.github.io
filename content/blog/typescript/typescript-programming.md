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
  - `include`
    - TSC가 타입스크립트 파일을 찾을 디렉터리
  - `lib`
    - TSC가 코드 실행 환경에서 이용할 수 있다고 가정하는 API(ex, ES5의 bind, Object.assign, DOM의 document.querySelector)
      - 브라우저용 타입스크립트를 작성하기 위해 “dom”을 lib에 추가한다.
  - `module`
    - TSC가 코드를 컴파일할 대상 모듈 시스템(CommonJS, SystemJS, ES2015 등)
    - 타입스크립트는 esnext 모듈 모드에서만 동적 임포트를 지원한다.
      - {”module”: “esnext”}
  - `outDir`
    - 생성된 자바스크립트 코드를 출력할 디렉터리
  - `strict`
    - 유효하지 않은 코드를 확인할 때 가능한 엄격하게 검사
      - `noImplicitAny` , `strictBindCallApply`, `strictFunctionTypes`
  - `target`
    - TSC가 코드를 컴파일할 자바스크립트 버전(ES3, ES5, ES2015, ES2016 등)
  - `noImplicitAny`
    - 암묵적인 any가 나타났을 때 예외를 일으킬 수 있다.
  - `strictNullChecks`
    - false로 설정하면, 이 때의 null은 never를 제외한 모든 타입의 하위 타입이다. 즉, 모든 타입은 null이 될 수 있으므로 모든 값이 null인지 아닌지를 먼저 확인해야 타입이 무엇인지 단정할 수 있는데, false로 설정하면 이 과정을 생략하게 된다.
      - 그러나 예상치 않은 상황에서 값이 null이라면 런타임에 치명적인 널 포인터 예외가 발생한다. 컴파일 타임에 가능한 많은 버그를 검출하는 것이 목표라면 타입 시스템에서 null을 확인할 수 있어야 한다.
  - `preserveConstEnums`
    - const enum의 런타임 코드 생성을 활성화하려면 preserveConstEnums 설정을 true로 바꾼다.
  - `strictBindCallApply`
    - call, apply, bind를 안전하게 사용하려면 이 플래그를 활성화해야 한다.
  - `noImplicitThis`
    - 이 플래그를 true로 하면, 함수에서 항상 this 타입을 명시적으로 설정하도록 강제한다.
      - 단, 클래스와 객체의 함수에는 this 지정을 강제하진 않는다.
  - `strictFunctionTypes`
    - 호환성으로 인해, 타입스크립트 함수의 매개변수와 this 타입은 기본적으로 공변이다. 더 안전한 공변을 사용하려면 이 플래그를 true로 설정해야 한다.
  - `noImplicitReturns`
    - 이 플래그를 활성화하면 함수 코드의 모든 경로에서 값을 반환하는지 확인할 수 있다. 추론되도록 하여 명시적 반환문을 되도록 적게 쓰는 사람도 있고, 타입 안전성을 향상시키고 타입 검사기가 더 많은 버그를 잡을 수 있다는 이유에서 반환문을 추가하는 사람도 있다
  - `keyofStringsOnly`
    - 타입스크립트의 keyof는 기본적으로 number | string | symbol 타입의 값을 반환한다.
    - 올바른 동작이지만, 이 때문에 타입스크립트에게 특정 키가 string이고 number나 symbol이 아니라는 사실을 증명해야 하는 귀찮은 상황에 놓일 수 있다.
    - 따라서 타입스크립트가 string 키만 지원하던 예전처럼 동작하길 원한다면 이 플래그를 활성화한다.
  - `esModuleInterop`
    - 이 옵션을 켜면 **Commonjs**방식으로 내보낸 모듈을 es모듈 방식의 **import**로 가져올 수 있게 해준다.
  - `typeRoots`
    - 기본적으로 node_modules/@types 디렉터리에서 서드 파티 타입 선언을 찾으며, 대부분은 이 동작을 바꿀 필요가 없다.
    - 하지만 이 기본 동작을 오버라이드할 필요가 있다면, `typeRoots`에 타입 선언을 검색할 디렉터리들을 배열로 설정하면 된다.

        ```tsx
        // /node_modules/@types 뿐만 아니라 typings 디렉터리에서도 타입 선언을 찾도록 설정 예시
        "typeRoots" : [
         "./typings",
         "./node_modules/@types"
        ]
        ```

  - `types`
    - 타입스크립트가 어떤 패키지에서 타입을 검색할지 더 세밀하게 설정할 수 있다.

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
    - Record<Keys, Values>
      - Keys 타입의 키와 Values 타입의 값을 갖는 객체
    - Partial<Object>
      - Object의 모든 필드를 선택형으로 표시
    - Required<Object>
      - Object의 모든 필드를 필수형으로 표시
    - Readonly<Object>
      - Object의 모든 필드를 읽기 전용으로 표시
    - Pick<Object, Keys>
      - 주어진 Keys에 대응하는 Object의 서브타입을 반환

- 컴패니언 객체 패턴
  - 타입과 값(객체)을 쌍으로 묶는 패턴이다.
  - 타입스크립트에서 타입과 값은 서로 별도의 네임스페이스를 갖는다. 따라서 같은 영역에 하나의 이름을 타입과 값 모두에 연결할 수 있다.
  - 이 패턴을 이용하면 타입과 값을 한 번에 import할 수 있다.
  - 타입과 객체가 의미상 관련되어 있고, 이 객체가 타입을 활용하는 메서드를 제공하면 이 패턴을 이용하면 좋다.

### 고급 함수 타입

- 튜플의 타입 추론 개선
  - 튜플에 대해 조금 더 엄격한 타입 추론을 하려고 할 때, `rest 매개변수`를 활용할 수 있다.

    ```tsx
    function tuple<T extends unknown[]>(...ts: T): T {
     return ts
    };
    
    let a = tuple(1,true) // [number, boolean]
    
    // 원래 tuple [1,true] 는 (number | boolena)[] 으로 추론됐음
    ```

- 사용자 정의 타입 안전 장치
  - 타입 정제(typeof, instanceof)는 강력하지만 현재 영역(유효범위)에 속한 변수만을 처리할 수 있는 점이 문제다.
    - 한 영역에서 다른 영역으로 이동(스코프 다를 때)하면 기존의 정제 결과물이 사라진다. 결국 타입스크립트는 타입정제 결과 boolean 같은 타입만 반환한다는 것만 알 뿐인데, 타입 체커에 구체적으로 boolean이 true면 어떤 타입으로 좁혀지고, false면 어떤 다른 타입으로 좁혀지는지 알려야 한다.
    - 이러한 문제를 `사용자 정의 타입 안전 장치` 기법으로 해결한다.
  - `사용자 정의 타입 안전 장치` 는 typeof와 instanceof로 타입을 정제 외에도 `is 연산자` 를 사용함으로써 함수가 제대로 동작함을 보장한다.
  - 잘 활용하면 깨끗하고 재사용할 수 있는 코드를 구현할 수 있다. 이 기법을 쓰지 않으면, typeof나 instanceof 같은 타입 가드를 코드에 일일이 추가해야 해서, 캡슐화 정도 및 가독성이 떨어질 수 있다.

    ```tsx
    function isString(a: unknown): a is string {
     return typeof a === 'string'
    }
    ```

### 조건부 타입

- 조건부 타입은 타입을 사용할 수 있는 거의 모든 곳에 사용 가능(Type Alias, 인터페이스, 클래스, 매개변수 타입, 함수와 메서드의 제네릭 기본값 등)

```tsx
type IsString<T> = T extends string ? true : false
// T의 타입이 string 집합에 포함되면 T는 true 타입이고 그렇지 않으면 false 타입이다.
type A = IsString<string> // true
```

- 분배적 조건부
  - 조건부 타입을 사용하면 타입스크립트는 `유니온 타입` 을 `조건부의 절` 들로 분배한다. 조건부 타입을 가져가다가 유니온의 각 요소로 분배한다.
    - 이를 이용해 다양한 공통 연산을 안전하게 표현할 수 있다.
  - 아래와 같이 조건부 타입(extends)에 `분배 법칙`이 작동함을 기억하고 적용!

    ```tsx
    (string | number) extends T ? A : B
    
    // 위 표현식은 분배 법칙에 따라 다음과 같다
    
    (string extends T ? A : B) | (number extends T ? A : B)
    ```

- infer 키워드
  - infer 키워드는 조건부 타입에서 조건의 일부를 표현하기 위해 `제네릭 타입`을 `인라인`으로 선언하는 문법이다.

    ```tsx
    type SecondArg<F> = F extends ((a: any, b: infer B) => any) ? B : never;
    
    type F = typeof Array["prototype"]["slice"];
    // type F = (start?: number | undefined, end? :number | undefined) => any[]
    
    type A = SecondArg<F>; // number | undefined
    
    // 즉, [].slice의 두 번째 인수는 number | undefined이다.
    ```

- 내장 조건부 타입들
  - Exclude<T, U>
    - T에 속하지만 U에는 없는 타입을 구한다.

        ```tsx
        type A = Exclude<number | string, string> // number
        ```

  - Extract<T, U>
    - T의 타입 중 U에 할당할 수 있는 타입을 구한다.

        ```tsx
        
        type B = Extract<number | string, string> // string
        ```

  - NonNullable<T>
    - T에서 null과 undefined를 제외한 버전을 구한다

        ```tsx
        type C = NonNullable<number | null | undefined> // number
        ```

  - ReturnType<F>
    - 함수의 반환 타입을 구한다

        ```tsx
        
        type E = ReturnType<(a: number) => string> // string
        ```

  - InstanceType<C>
    - 클래스 생성자의 인스턴스 타입을 구한다

        ```tsx
        type F = InstanceType<{new(): {b: number}}> // {b: number}
        ```

### 타이핑의 탈출구

서드 파티 모듈의 타입 정의가 잘못되었거나 안전한 작업임을 타입스크립트에 증명할 시간이 없을 때 다음과 같은 탈출구를 활용한다(오남용 주의)

- 타입 단언
  - 꺾쇠괄호(`<>`)와 `as` 문법이 있다. 이 중에서 꺾쇠괄호(`<>`)는 TSX와 겉보기에 비슷해 혼동을 일으킬 수 있으므로  `as` 문법이 추천된다. (TSLint에서 noangle-bracket-type-assertion 권장)
- Nonnull 단언
  - Nonnull 단언 연산자(`!`)

### 이름 기반 타입 흉내내기

- 타입스크립트의 타입 시스템은 `구조`에 기반하지만, `이름 기반 타입`도 때로는 유용하게 사용할 수 있다.
- 타입스크립트는 이름 기반 타입을 제공하진 않지만 `타입 브랜딩` 이라는 기법으로 이를 흉내낼 수 있다.
  - 필요한 이름 기반 타입 각각에 대응하는 임의의 타입 브랜드(unique symbol을 브랜드로 사용)를 만든다. 이 브랜드를 string과 인터섹션하여 주어진 문자열이 정의한 브랜드 타입과 같다고 단언한다.

    ```tsx
    type CompanyId = string & {readonly brand: unique symbol}
    type UserId = string & {readonly brand: unique symbol}
    type ID = CompanyId | UserId
    
    function CompanyId(id: string) {
      return id as CompanyId //난해한 타입을 지정하기 위해 브랜드 타입으로 타입 단언
    }
    
    function UserId(id: string) {
      return id as UserId //난해한 타입을 지정하기 위해 브랜드 타입으로 타입 단언
    }
    
    function queryForUser(id: UserId) {
      //...
    }
    let companyId = CompanyId('woowa');
    let userId = UserId('marco');
    queryForUser(userId); // OK
    queryForUser(companyId);
    // queryForUser(companyId) 에서 다음과 같은 타입 에러 발생
    // Argument of type 'CompanyId' is not assignable to parameter of type 'UserId'.
    //   Type 'CompanyId' is not assignable to type '{ readonly brand: unique symbol; }'.
    //     Types of property 'brand' are incompatible.
    //       Type 'typeof brand' is not assignable to type 'typeof brand'. Two different types with this name exist, but they are unrelated.
    ```

## 타입 선언(Declarations)

> 만약 당신이 타입스크립트 초보자들과 함께 일해야 하다면 그들에게 `globals.d.ts` 파일을 주고 그 안에 전역 이름 공간의 인터페이스 / 타입들을 넣어서 *전체* TypeScript 코드에서 특정 *타입* 들이 *마법처럼* 나타나게 할 수 있습니다.
>
- `import img from 'abc.png'` 문이 ts에서 오류나는 이유?
  - .png 모듈이 타입스크립트가 아니라서.. js가 아니라서.. 모듈형식이 정의되지 않아서..
  - 다음과 같이 png 모듈에 대해 선언해주어야 한다. 이는 `앰비언트 타입`이라고 한다. 인터페이스와 비슷하게 동작한다.

    ```tsx
    declare module "*.png" {
     const image: string
    
     export default image
    }
    ```

- 어떤 라이브러리(ex, axios)는 타입 선언 파일(d.ts)과 함께 제공된다.  따로 타입을 설치할 필요가 없어 간편하다.
  - 라이브러리의 package.json에 types나 typings 필드를 통해 타입스크립트에게 타입 선언 파일의 경로를 알려준다.
- 어떤 라이브러리(ex, Lodash)는 타입 선언 파일을 자체적으로 가지고 있지 않다.
  - lodash만 설치하고 ts파일에서 lodash를 import하면 `Could not find a declaration file for module 'lodash'` 라는 에러가 발생한다.
    - lodash 라이브러리의 package.json에는 타입 선언 파일의 경로를 알려주는 types나 typings 필드가 없다.
  - 따라서 타입 선언을 다른 곳에서 찾아서 npm을 통해 추가 설치해야 한다.

    ```tsx
    npm i --save-dev @types/lodash
    ```

  - @types 는 `DefinitelyTyped` 라는 프로젝트를 참조하고 있으며, 이 프로젝트는 약 7,000가지 타입 선언을 보유하고 있다. 많이 쓰이는 라이브러리라면 이 중에 있을 것이다.
    - 아래 링크에서 찾으면 편리하다.

        [Search for typed packages](https://www.typescriptlang.org/dt/search?search=)

- 타입 선언은 d.ts 확장자를 가진 파일이다.
- 타입 선언은 타입이 없는 자바스크립트 코드에 타입스크립트 타입을 부여할 수 있는 수단이다.
- 타입 선언 문법
  - 타입만 포함할 수 있고 값은 포함할 수 없다.
  - declare라는 키워드를 사용해 자바스크립트의 다른 어딘가에 값이 있다는 사실을 선언할 수 있다.
  - 소비자가 볼 수 있는 대상에만 타입을 선언할 수 있다. 노출되지 않은 타입이나 함수 안에 선언된 지역 변수의 타입은 포함할 수 없다.
- TSC로 컴파일
  - declarations 플래그를 활성화하고 TSC로 컴파일(tsc -d 타입스크립트파일명)하면 d.ts 파일이 생성된다.
- NPM에 패키지를 올릴 때 선택지
    1. 소스 타입스크립트 파일(TS 사용자용)과 컴파일된 자바스크립트 파일(JS 사용자용)을 둘 다 패키지한다
    2. 컴파일된 자바스크립트 파일에 타입스크립트 사용자가 사용할 수 있는 타입 선언(d.ts)을 포함해 패키지한다.
        - 이 방법을 이용하면 파일 크기가 줄어들고, 무엇을 임포트해야 하는지 더 명확해지며, TSC의 컴파일 시간을 줄일 수 있다.
- 타입 선언 파일 활용 과정
    1. TSC 인스턴스는 자바스크립트 파일에 대응하는 .d.ts 파일을 검색한다. 그 결과 타입스크립트가 해당 프로젝트에 사용된 타입을 알 수 있다.
    2. VSCode는 이 .d.ts 파일들을 읽어 해석한 다음 코드 작성 시 유용한 타입 힌트를 제공한다.
    3. 타입스크립 코드의 불필요한 재컴파일을 막아주어 컴파일 시간을 크게 줄여준다.
- 타입 선언은 값을 포함하는 일반적인 선언과 구별하기 위해 ambient(주위의) 라는 표현을 쓰기도 한다.
  - `앰비언트 변수 선언`
    - 한 프로젝트의 모든 .ts나 .d.ts 파일에서 임포트 없이 사용할 수 있는 전역 변수의 존재를 타입스크립트에 알리는 수단이다.

        ```tsx
        // polyfill.ts
        declare let process: {
         env: {
          NODE_ENV: 'development' | 'production'
        }
        
        process = {
         env: {
          NODE_ENV: 'production' 
         }
        }
        ```

  - `앰비언트 타입 선언`
    - 프로젝트 어디에서나 전역으로 이용할 수 있는 타입을 정의하여 임포트 없이 바로 사용하고자 할 때

        ```tsx
        // 최상위 수준의 type.ts(스크립트 모드) 파일에 정의
        // 타입 선언 파일에 선언된 최상위 수준 값 에는 declare 키워드를 사용(declare let, declare function, declare class)해야 하지만, 
        // 최상위 수준 타입 alias와 인터페이스 에는 사용하지 않아도 된다. 
        type ToArray<T> = T extends unknown[] ? T : T[]
        ```

  - `앰비언트 모듈 선언`
    - 자바스립트 모듈을 사용하면서 그 모듈에서 사용할 일부 타입을 빠르게 선언하고 안전하게 사용할 때 사용한다.
    - 평범한 타입 선언을 declare module 이라는 문법으로 감싼다.

        ```tsx
        declare module 'module-name' {
         export type MyDefaultType = {a:string}
         let myDefaultExport: MyDefaultType
         export default myDefaultExport
        }
        ```

        ```tsx
        import ModuleName from 'module-name'
        ModuleName.a // string
        ```

    - 모듈 선언은 와일드카드 임포트를 지원하므로 ‘주어진 패턴과 일치하는 모든 import 경로’를 특정한 타입으로 해석하도록 할 수 있다.

        ```tsx
        declare module 'json!*' {
         let value: object
         export default value
        }
        
        declare module '*.css' {
         let css: CSSRuleList
         export default css
        }
        ```

        ```tsx
        import a from 'json!myFile'
        a // 객체
        
        import b from './widget.css'
        b // CSSRuleList
        ```

- 타입 선언은 `스크립트 모드의 .ts` 나 `d.ts` 파일 안에 위치해야 한다.
  - 관례상, 대응하는 `.js` 파일이 있으면, `.d.ts` 확장자를 사용한다.
  - 그렇지 않으면 `.ts` 를 사용한다.
- 타입 선언 파일에 선언된 최상위 수준 `값` 에는 declare 키워드를 사용(declare let, declare function, declare class)해야 하지만, 최상위 수준 `타입 alias`와 `인터페이스` 에는 사용하지 않아도 된다.

## 모듈

- 자바스크립트 모듈의 역사
  - 처음 1995년에 모듈 시스템이 전혀 지원되지 않았다. 모듈이 없어서 모든 것을 전역 네임스페이스에 정의했고, 이 때문에 변수명이 금세 고갈되고 충돌되어 프로그램을 확장하기 어려웠다.
  - 이 문제를 해결하기 위해, 객체를 이용하거나 즉시 실행 함수를 전역 window에 할당하여 응용 프로그램의 다른 모듈에서 사용하는 식으로 모듈을 흉내냈다. 그러나 이처럼 자바스크립트를 로딩하고 실행하는 동안 브라우저의 UI는 블록되어 점점 느려졌다.
  - 이 문제를 해결하기 위해, 첫 출시 후 거의 10년이 지나서, 자바스크립트 모듈을 게으르고(lazy) 비동기적으로 로딩하는 방식이 고안됐다. 다음과 같은 세 가지 의미를 지닌다.
    - 모듈은 잘 캡슐화되어야 한다. 그렇지 않으면 의존성을 확보하는 과정에서 페이지가 망가진다.
    - 모듈 간의 의존성은 명시적이어야 한다. 그렇지 않으면 한 모듈에 어떤 모듈이 필요하며 어떤 순서로 로딩해야 하는지 알 수 없기 때문이다.
    - 모든 모듈은 앱 내에서 고유 식별자를 가져야 한다. 그렇지 않으면 어떤 모듈을 로딩해야 하는지 안전적으로 지정할 수 없다.
  - NodeJS(2009)는 CommonJS라는 모듈 시스템을 플랫폼 자체에 추가하였다.
  - Browserify(2011)가 출시되며 프론트엔드 엔지니어도 CommonJS를 사용할 수 있게 되었고, 사실상 CommonJS가 모듈 번들링, 임포트, 익스포트 문법의 표준으로 자리 잡았다.
  - CommonJS의 문제점
    - require 호출은 반드시 동기 방식이어야 한다.
    - CommonJS 모듈 해석 알고리즘이 웹에 적합하지 않다.
    - 이를 사용하늨 코드는 상황에 따라 정적 분석이 불가능하다.
  - 위와 같은 문제는 ES2015에 이르러 깔끔한 문법과 정적 분석이 가능한 새로운 표준 import/export가 소개되며 해결됐다.
  - 타입스크립트는 모듈의 코드를 소비하고 익스포트하는 여러 방식을 제공한다. TSC의 빌드 시스템 덕분에 전역, ES2015, CommonJS, AMD, SystemJS, UMS(CommonJS, AMD, 전역 중 소비자 환경에서 이용할 수 있는 환경을 혼합) 등 다양한 환경에 맞게 모듈을 컴파일할 수 있게 되었다.
- 타입스크립트는 파일 간 코드를 공유할 수 있는 모듈을 지원한다.

### import, export

- 타입스크립트 코드에서는 commonJS, 전역, namespaces로 구분한 모듈보다는 ES2015의 import와 export를 사용하는 것이 바람직하다.
- 타입 alias와 인터페이스도 익스포트할 수 있다.
  - 타입과 값은 별개의 네임스페이스에 존재한다. 따라서 두 가지를 하나의 이름으로 익스포트할 수 있다.
- 동적 임포트
  - 타입스크립트는 esnext 모듈 모드에서만 동적 임포트를 지원한다.
- CommonJS나 AMD 코드 사용
  - CommonJS나 AMD 코드 모듈을 이용할 때는 ES2015 모듈을 사용할 때처럼 단순히 이름으로 임포트할 수 있다.
  - 디폴트 익스포트가 필요하면 와일드카드 임포트를 사용해야 한다.

        ```tsx
        import * as fs from 'fs
        ```

  - `esModuleInterop` 플래그를 true로 설정하면 와일드카드 없이 다음처럼 더 자연스럽게 연동할 수 있다.

        ```tsx
        import fs from 'fs'
        ```

### 모듈 모드 vs 스크립트 모드

- 타입스크립트는 파일에 import나 export가 포함되어 있으면 모듈 모드로, 그렇지 않으면 스크립트 모드로 동작한다.
- 스크립트 모드에서는 최상위 수준으로 선언한 모든 변수는 명시적으로 임포트하지 않아도 같은 프로젝트의 다른 파일들에서 사용할 수 있으며, 서드 파티 UMD 모듈의 전역 익스포트도 먼저 명시적으로 임포트할 필요 없이 바로 사용할 수 있다.

### namespaces

- 네임스페이스는 파일시스템에서 파일이 어떻게 구성되었는지 같은 자질구레한 세부사항을 추상화한다.
- 기본 규칙
  - 네임스페이스에는 반드시 이름이 있어야 하며 함수, 변수, 타입, 인터페이스, 다른 네임스페이스를 익스포트할 수 있다.
  - 네임스페이스 블록 안의 모든 코드는 명시적으로 익스포트하지 않는 한 외부에서 볼 수 없다.
  - 네임스페이스가 네임스페이스를 익스포트할 수 있으므로 중첩된 구조도 가능하다.
  - 타입스크립트는 이름이 같은 네임스페이스를 알아서 재귀적으로 합쳐준다.
- 충돌
  - 같은 이름을 익스포트하면 충돌이 생긴다.
  - 단, 함수 타입을 정제할 때 사용하는 오버로드된 앰비언트 함수 선언에는 이름 충돌 금지 규칙이 적용되지 않는다.
- 컴파일된 출력
  - 네임스페이스는 항상 전역 변수로 컴파일된다.
- 타입스크립트의 `namespaces` 는 ES 모듈보다 먼저 나온 타입스크립트만의 모듈 포맷이다. namespaces보다 표준을 명시적 의존성을 위해 자바스크립트에서 사용되는 ES모듈(import,export) 사용이 권장된다.
  - 명시적 의존성은 가독성, 모듈 분리(네임스페이스는 자동으로 합쳐지지만 모듈을 그렇지 않으므로), 정적 분석 면에서 유리하다. 그래서 코드를 제거하고 컴파일된 코드를 여러 파일로 나눠 성능을 높여야 하는 대규모 프론트엔드 프로젝트에 아주 유용하다.

> TypeScript namespaces
>
>
> TypeScript has its own module format called `namespaces` which pre-dates the ES Modules standard. This syntax has a lot of useful features for creating complex definition files, and still sees active use [in DefinitelyTyped](https://www.typescriptlang.org/dt). While not deprecated, the majority of the features in namespaces exist in ES Modules and we recommend you use that to align with JavaScript’s direction. You can learn more about namespaces in [the namespaces reference page](https://www.typescriptlang.org/docs/handbook/namespaces.html).
>
> - 출처 : 타입스크립트 공식문서 -
>
- 그러나 `DefinitelyTyped` 의 타입 선언 파일에서는 namespaces가 여전히 활발히 사용된다.
- non-modules
  - `export` 나 최상위 `await` 가 없으면 타입스크립트는 그 파일을 모듈이 아니라 스크립트로 간주한다. 스크립트 파일 내에서는 변수와 타입은 공유된 전역 스코프에 있는 것으로 선언된다.
    - 이렇게 모듈이 아니면, 식별자명 정의 시 헷갈리고 알맞은 순서로 파일을 추가해야 하는 것도 힘들다.
  - 모듈로 처리하려면 아무것도 내보내지 않는 모듈로 변경하는 다음 행을 추가해야 한다.

    ```tsx
    export {};
    ```

- export와 import를 사용한 후 tsc 컴파일을 하게 되면

    ```tsx
    // util.ts
    export const a = (data: string) => {
     console.log(data);
    };
    ```

    ```tsx
    // index.ts
    import { a } from "./util";
    a("hi");
    ```

  - 컴파일된 파일

    ```tsx
    // utils.js
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.a = void 0;
    const a = (data) => {
        console.log(data);
    };
    exports.a = a;
    ```

    ```tsx
    // index.js
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const util_1 = require("./util");
    (0, util_1.a)("hi");
    ```

## 자바스크립트의 타입 검색

- 타입스크립트 파일에서 자바스크립트 파일을 임포트할 때 타입스크립트는 다음 알고리즘을 토대로 자바스크립트 코드에 필요한 타입 선언을 검색한다.
    1. `.js` 파일과 이름이 같은 형제 `.d.ts` 파일을 찾는다. 이 파일이 존재하면 `.js` 파일의 타입 선언으로 사용한다.
    2. 적절한 `.d.ts` 파일이 없고, 만약 allowJs와 checkJs 플래그가 true이면 `.js` 파일의 타입을 추론한다.
    3. 2에도 해당하지 않으면 전체 모듈을 any로 처리한다.
- npm 패키지를 임포트할 때는 조금 다른 알고리즘을 사용한다.
    1. 모듈의 지역 타입 선언(.d.ts, 모듈명이 같아야 함)이 존재하면 그 선언을 사용한다.

        ```tsx
        // node_modules/foo 패키지 설치됨
        
        // types.d.ts
        declare module 'foo' {
         let bar: {}
         export default bar
        }
        
        // index.ts
        import bar from 'foo'
        ```

    2. 지역 타입 선언이 존재하지 않으면 모듈의 package.json을 확인한다. `types` 나 `typings` 라는 필드가 정의되어 있으면 해당 필드가 가리키는 `.d.ts` 파일의 모듈 타입 선언 소스로 사용한다.
    3. 아니면 한 번에 한 단계씩 상위 디렉터리로 이동하면서 모듈의 타입 선언을 담고 있을 `node_modules/@types` 디렉터리를 찾고, 모듈명과 같은 파일명의 디렉터리에서 타입 선언 소스로 사용한다.
    4. 그래도 타입 선언을 찾지 못하면, 앞서 설명한 지역 타입 찾기 알고리즘을 수행한다.

### 서드 파티 자바스크립트 사용

- Definitely Typed에서 타입 선언을 제공하지 않는 자바스크립트
  - 타입을 사용하지 않는 임포트 윗줄에 // @ts-ignore 지시어를 추가하여 해당 임포트를 화이트리스트 처리한다. 해당 모듈과 그 안의 모든 콘텐츠 타입은 any가 된다.
  - 빈 타입 선언 파일을 하나 만들어서 화이트리스트를 처리할 모듈을 적어놓는다. 새로운 타입 선언을 만들고 여기에 앰비언트 타입 선언을 추가한다.
    - 하지만 타입 선언을 채우지 않으면, 여전히 익스포트의 타입은 any이므로 안전성 면에서는 차이가 없다.
    - 또는 안전성을 위해 타입 선언을 채우면, 타입스크립트는 정확한 타입을 알 수 있다.
- dts-gen
  - 타입을 사용하지 않은 자바스크립트에서 타입 선언을 자동으로 생성하는 연구가 활발히 진행되는 중이다. 타입 선언을 자동으로 생성하는 도구인 dts-gen을 참고한다.
  - [https://www.npmjs.com/package/dts-gen](https://www.npmjs.com/package/dts-gen)

## 에러 처리

- 타입스크립트는 `런타임`에 발생할 수 있는 예외를 `컴파일 타임`에 잡을 수 있도록 최선을 다한다.
  - 그러나 네트워크 장애, 파일시스템 장애, 사용자 입력 파싱 에러, 스택 오버플로, 메모리 부족 에러까지 모두 막을 수는 없고, 결국 런타임 에러가 발생할 수 있다.
- 타입스크립트에서 에러를 표현하고 처리하는 가장 일반적인 패턴 네 가지
  - null 반환
    - 어떤 작업이 실패했음을 단순하게 알리기
    - 단순히 에러가 발생했을 때 처리
  - 에러 던지기
    - 에러 처리 관련 코드를 더 적게 구현
    - 실패한 이유와 관련된 정보를 제공
  - 예외 반환
    - 가능한 모든 예외를 사용자가 명시적으로 처리하도록 강제
    - 실패한 이유와 관련된 정보를 제공
    - 단순히 에러가 발생했을 때 처리
  - Option 타입
    - 어떤 작업이 실패했음을 단순하게 알리기
    - 에러를 만드는 방법이 필요

### null 반환

- 타입 안전성을 유지하면서 에러를 처리하는 가장 간단한 방법은 null을 반환하는 것이다
- 하지만 에러를 이 방식으로 처리하면 문제가 생긴 원인을 알 수 없다.
- 또한, null을 반환하면 조합이 어려워진다는 점도 문제다.

### 예외 던지기

- 문제가 발생하면 null 반환 대신 에러를 던지자. 그러면 어떤 문제냐에 따라 대처가 가능할 수 있고, 디버깅에 도움되는 메타데이터도 얻을 수 있다.
- 다른 에러가 발생했을 때 무시하지 않도록, 처리하지 않은 에러는 다시 던지는 것이 좋다.
- 에러를 서브클래싱하여 더 구체적으로 표현하면 에러를 구분할 수 있다.
- 타입스크립트는 예외를 함수의 시그니처로 취급하지 않는다. 개발자가 특정 타입의 에러가 던져지는 사실을 알고 잡으려면, 함수 이름에 명시하거나 문서화 주석에 정보를 추가해야 한다.

```tsx
// 에러를 서브클래싱하여 더 구체적으로 표현하면 에러를 구분할 수 있다.
class InvalidDateFormatError extends RageError { }
class DateIsInTheFutureError extends RageError { }

/**
 * @throws {InvalidDateFormatError} 사용자가 생일을 잘못 입력함
 * @throws {DateIsInTheFutureError} 사용자가 생일을 미래 날 짜로 입력함
 */
function parse(birthday: string): Date {
 let date = new Date(birthday)
 if (!isValid(date) {
  throw new InvalidDateFormatError('Enter a date in the form YYYY/MM/DD')
 }
 if (date.getTime() > Date.now()) {
  throw new DateIsInTheFutureError('Are you a timelord?')
 }
 return date
}

try {
 let date = parse(ask())
 console.info('Date is', date.toISOString())
} catch (e) {
 if (e instanceof InvalidDateFormatError) {
  console.error(e.message)
 } else if (e instanceof DateIsInTheFutureError) {
  console.info(e.message)
 } else {
  // 다른 에러가 발생했을 때 무시하지 않도록, 처리하지 않은 에러는 다시 던지는 것이 좋다.
  throw e
 }
}
```

### 예외 반환

- 타입스크립트는 유니온 타입을 이용하여 예외를 `반환`할 수 있다.
  - 이제 이 메서드 사용자는 모든 세 가지의 상황을 처리해야 하며 그렇지 않으면 `컴파일 타임`에 TypeError가 발생한다.

```tsx
function parse(birthday: string): Date | InvalidDateFormatError | DateIsInTheFutureError {
 let date = new Date(birthday)
 if (!isValid(date) {
  return new InvalidDateFormatError('Enter a date in the form YYYY/MM/DD')
 }
 if (date.getTime() > Date.now()) {
  return new DateIsInTheFutureError('Are you a timelord?')
 }
 return date
}

let result = parse(ask())
if (result instanceof InvalidDateFormatError) {
 console.error(e.message)
} else if (result instanceof DateIsInTheFutureError) {
 console.info(e.message)
} else {
 console.info('Date is', result.toISOString())
}
```

### 에러 모니터링

- 타입스크립트는 컴파일 타임의 에러만 경고하므로 사용자가 런타임에 겪을 수 있는 에러를 컴파일 타임에 방지할 수 있는 방법을 찾아야 한다. `Sentry` 나 `Bugsnag` 같은 에러 모니터링 도구를 이용하면 런타임 예외를 보고하고 분석해준다.

## 빌드 및 실행

- 프로젝트 레이아웃
  - 소스 코드를 최상위 src/ 디렉터리에 저장하고, 컴파일 결과 역시 최상위 dist/ 디렉터리에 저장하는 것이 권장된다.
- TSC 컴파일 시, 다음과 같은 부산물이 생성된다.
  - .js
    - `{"emitDeclarationOnly": false}`
    - 변환된 자바스크립트는 NodeJS나 크롬 같은 자바스크립트 플랫폼에서 실행할 수 있다.
  - .js.map
    - `{”sourceMap”: true}`
    - 생성된 자바스크립트 코드를 원래 타입스크립트 파일의 행과 열로 연결하여 디버깅하는 데 필요한 특별 파일이다.
  - .d.ts
    - `{"declaration": true}`
    - 생성된 타입을 타입스크립트 프로젝트에서 이용할 수 있도록 해준다.
  - .d.ts.map
    - `{"declarationMap": true}`
    - 타입스크립트 프로젝트의 컴파일 시간을 단축하는 데 사용된다.
- 최신 버전의 자바스크립트로 작성해도 구 버전 플랫폼에서 동작하게 하는 방법
    1. 트랜스파일(자동 변환  등)
        - 최신 버전의 자바스크립트를 대상 플랫폼에서 지원하는 가장 낮은 자바스크립트 버전으로 변환한다.
        - TSC는 트랜스파일 기능은 기본으로 지원한다.
    2. 폴리필
        - 실행하려는 자바스크립트 런타임이 포함하지 않는 최신 기능을 폴리필로 제공한다.
        - 자바스크립트 표준 라이브러리에서 제공하는 기능(Promise, Map, Set)과 프로토타입 메서드(includes, bind)를 제공할 때 사용한다.
        - TSC는 폴리필을 자동으로 해주진 않는다.
            - 폴리필은 `core-js` 같은 유명한 폴리필 라이브러리에서 필요한 기능을 설치하거나, `@babel/polyfill` 을 설치한 후 바벨을 이용해 컴파일하면 타입스크립트가 타입을 확인하면서 필요한 폴리필을 자동으로 설치해준다.
            - 자바스크립트 번들의 크기가 너무 커지지 않도록 `[Polyfill.io](http://Polyfill.io)` 같은 서비스를 이용하여 사용자의 브라우저에서 필요하나 기능만 로드되게 하는 것이 좋다.
- TSC에서 대상 환경 정보 설정 옵션
  - `module`
    - 대상 모듈 시스템 설정
      - module은 NodeJS냐 브라우저냐에 따라 달라진다.
  - `target`
    - 트랜스파일하려는 자바스크립트 버전 설정(응용 프로그램이 실행될 환경의 자바스크립트의 버전)
    - TSC의 내장 트랜스파일러는 대부분 JS 기능을 예전 JS 버전으로 변환 가능하다.
  - `lib`
    - 타입스크립트에게 대상 환경에서 어떤 자바스크립트 기능을 지원하는지 알려준다. 실제로 기능을 구현하는 것은 아니지만(따라서 폴리필 필요) 적어도 이런 기능들을 이용할 수 있다는 사실을 타입스크립트에 알려준다(네이티브 또는 폴리필 이용).
    - 폴리필을 코드에 추가했으면 lib 필드를 수정하여 해당 기능이 반드시 지원됨을 TSC에 알린다.

        ```tsx
        // ES2015 모든 기능과 ES2016의 Array.prototype.includes 기능의 폴리필 제공 설정
        // 또한 window, document 등 브라우저에서 실행 시 필요한 API 사용 위한 DOM 타입 선언 활성화
        "lib": ["es2015", "es2016.array.includes", "dom"]
        ```

  - 환경 정보를 알 수 없을 때, `target`과 `lib`을 둘 다 es5로 설정하면 대개 안전하다.

### 세 슬래시 지시어

- 이 지시어는 특별한 포맷의 타입스크립트 주석으로, TSC에 명령을 하달한다.
- types 지시어
  - 전체 모듈 임포트를 사용하고 싶고 자바스크립트가 import나 require 호출 구문을 생성하는 건 원치 않으면 types 세 슬래시 지시어를 사용한다.
  - 모듈이 의존하는 타입 선언 파일을 선언

    ```tsx
    /// <reference types="./common.d.ts" />
    ```

## 기타

### 비동기 프로그래밍, 동시성과 병렬성

- 자바스크립트는 비동기 작업을 처리할 때 위력을 발휘한다.
  - V8, 스파이더몽키 같은 유명한 자바스크립트 엔진은 태스크 멀티플렉싱 기법을 영리하게 이용하여, 여러 스레드를 이용하던 기존 방식과 달리 스레드 하나로 비동기 작업을 처리한다.
  - 스레드 하나로 비동기 작업을 처리하는 이벤트 루프가 바로 자바스크립트 엔진의 표준 모델이다.
  - 자바스크립트는 이벤트 루프 기반의 `동시성` 모델을 이용해 멀티스레드 기반 프로그래밍에서 공통적으로 나타나는 문제점을 해결한다.
    - 공유 메모리는 스레드 간에 메시지를 보내거나 데이터를 직렬화해서 보낼 때 활용하는 일반적인 패턴이지만, 자바스크립트를 여러 스레드에서 실행하더라도 공유 메모리는 거의 사용하지 않으며 이를 통해 자바스크립트 멀티스레드 프로그래밍을 안전하게 해준다.

### 프론트엔드 프레임워크

- 타입스크립트는 응용 프로그램에 안전성과 멋진 구조를 선사하고, 빠르게 변화하는 프론트엔드 개발 환경에 적합한 정확하면서도 유지보수하기 쉬운 코드를 쉽게 작성할 수 있도록 도와준다.
- 모든 내장 DOM API는 타입 안전한다. 이 API를 사용하려면 tsconfig.json에 다음과 같이 필요한 타입 선언을 추가하면 된다. 이 설정은 타입스크립트가 코드에서 타입을 검사할 때 `lib.dom.d.ts`(브라우저와 DOM 타입 내장 선언) 파일에 선언된 타입들을 포함하도록 한다.

```tsx
{
 "compilerOptions": {
  "lib": ["dom", "es2015"]
 }
}
```

### 리액트

- JSX
  - HTML 코드처럼 보이는 문법이며 뷰를 정의하고 자바스크립트 코드에 바로 사입하는 것이 JSX(JavaScript XML)이다. 이를 JSX 컴파일러(바벨의 transform-react-jsx 플러그인)로 컴파일하면 일반 자바스크립트 함수 호출로 변환된다.
- TSX
  - TSX  = JSX + 타입스크립트
  - TSX를 지원하도록 하려면 tsconfig.json에 다음 내용을 추가한다. 다음 세 가지 모드를 지원한다.
    - react
      - JSX 지시문에 따라 JSX를 .js 파일로 컴파일한다.
    - react-native
      - 컴파일하지 않고 JSX를 보존하며 .js 확장자의 파일을 생성한다
    - preserve
      - JSX의 타입을 검사하지만 컴파일하지는 않으며 .jsx 확장자의 파일을 생성한다.

```tsx
{
 "compilerOptions": {
  "jsx": "react"
 }
}
```

- 리액트는 DOM 이벤트들을 위한 고유의 래퍼 타입 집합(ex, MouseEvent)을 제공한다. 리액트 이벤트를 사용할 때 일반 DOM 이벤트 타입 대신 리액트의 이벤트 타입을 사용해야 한다.
