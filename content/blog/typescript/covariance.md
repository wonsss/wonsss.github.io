---
title: 타입스크립트의 공변성과 함수의 매개변수 타입의 반공변성
date: 2024-02-12 23:02:51
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

## 공변성과 반공변성이란

-   집합 관계로서 공변성, 반공변성, 이변성, 무공변성 요약 - <mark class="hltr-red">공변성(Covariance)</mark>: A ⊂ B일 때 `T<A>` ⊂ `T<B>`인 경우 - <mark class="hltr-green">반공변성(Contravariance)</mark>: A ⊂ B일 때 `T<A>` ⊃ `T<B>` 인 경우 - <mark class="hltr-pink">이변성(Bivariance)</mark>: A ⊂ B일 때 `T<A>` ⊂ `T<B>`도 되고  `T<A>` ⊃ `T<B>`도 되는 경우 - <mark class="hltr-grey">무공변성(Invariance)</mark>: A ⊂ B더라도 `T<A>` ⊂ `T<B>`도 안 되고 `T<A>` ⊃ `T<B>`도 안 되는 경우
-   <mark class="hltr-red">공변성</mark>: A ⊂ B일 때 `T<A>` ⊂ `T<B>`인 경우 - A가 B의 서브타입일 때, `T<A>` 가 `T<B>` 의 서브타입이 된다면, <mark class="hltr-red">T</mark>를 <mark class="hltr-red">공변적</mark>이라고 부른다. - 조금 더 풀어 설명하자면, A타입이 B타입에 포함될 때, A타입이 인자로 전달된 제네릭 타입(`T<A>`)이 B타입이 인자로 전달된 제네릭 타입(`T<B>`)에 포함되는 것을 <mark class="hltr-red">공변성</mark>이라 한다.
-   <mark class="hltr-green">반공변성</mark>: A ⊂ B일 때 `T<A>` ⊃ `T<B>` 인 경우 - 반면, 제네릭 타입이 그 반대의 포함 관계가 되는 것은 <mark class="hltr-green">반공변성</mark>이라 한다.

> 서브타입과 슈퍼타입
>
> -   다른 한 타입을 포함하는 타입을 슈퍼타입(supertype)이라고 하고, 슈퍼타입에 포함되는 타입을 서브타입(subtype)이라고 말한다. 구조적 타입 시스템(structural type system)을 가진 타입스크립트의 경우, 한 타입이 다른 한 타입의 값을 모두 포함하고 있으면 그 타입을 포함한다고 한다.

```tsx
type Supertype = { x: boolean }
type Subtype = { x: boolean; y: number }
```

```tsx
type Supertype = string | number
type Subtype = string
let stringArray: Array<Subtype> = []
let stringOrNumberArray: Array<Supertype> = []

stringOrNumberArray = stringArray // OK
stringArray = stringOrNumberArray // Type Error, Type '(string | number)[]' is not assignable to type 'string[]'.

// 즉, stringArray(:Array<Subtype>) ⊂ stringOrNumberArray(:Array<Supertype>)
```

-   기본적으로 타입스크립트의 모든 복합타입 멤버는 <mark class="hltr-red">공변성</mark> 을 갖고 있다.

## <mark class="hltr-yellow">함수 매개변수 타입</mark>은 기본적으로 <mark class="hltr-pink">이변성</mark>

-   유일하게 <mark class="hltr-yellow">함수 매개변수 타입</mark>만 <mark class="hltr-green">반공변성</mark>도 갖고 있어 <mark class="hltr-red">공변성</mark>과 <mark class="hltr-green">반공변성</mark>이 모두 있는 <mark class="hltr-pink">이변성</mark>이다.

### 함수의 매개변수 타입에 <mark class="hltr-green">반공변성</mark> 특성도 있는 이유

-   슈퍼타입과 서브타입을 함수의 매개변수 타입으로 전달해서 생긴 각각의 <mark class="hltr-orange">함수 호출 시그니처</mark>의 개수는 슈퍼타입이 서브타입보다 많다. 그리고 <mark class="hltr-orange">함수 호출 시그니처</mark>의 개수가 많을수록(오버로드) 그 타입은 더 좁아진다. 오버로드된 <mark class="hltr-orange">함수 호출 시그니처</mark>는 함수 타입들의 intersection이기 때문에 타입이 더 좁아진다.
-   따라서, 함수의 매개변수 타입은 서브타입으로 생긴 함수 호출 시그니처가 슈퍼타입으로 생긴 함수 호출 시그니처를 포함하는 <mark class="hltr-green">반공변성</mark>이 형성된다. - <mark class="hltr-green">반공변성</mark>: A ⊂ B일 때 `T<A>` ⊃ `T<B>` 인 경우

```tsx
type Supertype = string | number
type Subtype = number
type Print<T> = (param: T) => void

let printSuper: Print<Supertype> = param => {
    console.log(param)
}

let printSub: Print<Subtype> = param => {
    console.log(param)
}

printSuper = printSub // TypeError, Type 'Print<number>' is not assignable to type 'Print<string | number>'.
printSub = printSuper // OK

//참고

type printSuper함수호출시그니처 = {
    (param: string): void
    (param: number): void
}

type printSub함수호출시그니처 = {
    (param: number): void
}

// 즉, printSuper함수호출시그니처 ⊂ printSub함수호출시그니처 -> 반공변성
```

### 함수의 매개변수 타입은 왜 <mark class="hltr-pink">이변성</mark>인가?

> 해당 질문에 대한 답은 타입스크립트 FAQ를 번역함. <https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant>

```ts
function trainDog(d: Dog) { ... }
function cloneAnimal(source: Animal, done: (result: Animal) => void): void { ... }
let c = new Cat();

// 런타임에 에러가 발생한다. trainDog의 인자에 Cat을 전달하여 호출했기 때문이다.
cloneAnimal(c, trainDog);
```

위와 같은 코드는 명시적인 <mark class="hltr-red">공변성</mark>/ <mark class="hltr-green">반공변성</mark> 타입 선언의 부재로 인해 발생하는 불건전성을 보여준다. 타입스크립트의 이러한 생략으로 인해, `(x: Dog) => void` 가 `(x: Animal) => void` 에 할당 가능한지 물었을 때 더 허용하게 된다.

왜 이러한지 이해하기 위해, 두 가지 질문을 고민해보자.

-   1. `Dog[]`는 `Animal[]`의 서브타입인가?
-   2. 타입스크립트에서 `Dog[]`은 `Animal[]`의 서브타입이어야 하는가?

두 번째 질문은 분석하기 더 쉽다. 만약 해당 질문에 답변이 거짓이라면 어떠한가?

```ts
function checkIfAnimalsAreAwake(arr: Animal[]) { ... }

let myPets: Dog[] = [spot, fido];

// 에러인가? Dog[]가 Animal[]을 대체할 수 없는가?
checkIfAnimalsAreAwake(myPets);
```

그렇다면 너무 성가실 것이다. 위 코드는 `checkIfAnimalsAreAwake` 함수가 인자인 array를 수정하지 않는다는 전제 하에 100% 정확하다. `Dog[]` 가 `Animal[]` 대신 사용될 수 없다는 이유로 이러한 함수를 거절하는 것은 좋은 이유가 아니다. - 여기서 `Dog`s 그룹은 명백히 `Animal`s 그룹이다.

첫 번째 질문으로 돌아가보자. 타입 시스템이 `Dog[]`가 `Animal[]`의 서브타입인지 아닌지 결정할 때, 다음과 같은 연산을 하게 된다(컴파일러가 최적화에 대한 고려를 하지 않는 전제하에 작성된 예시).

-   `Dog[]`가 `Animal[]`에 할당 가능한가?
-   `Dog[]`의 각각의 멤버가 `Animal[]`에 할당 가능한가?
    -   `Dog[].push` 가 `Animal[].push`에 할당 가능한가?
        -   `(x: Dog) => number` 타입이 `(x: Animal) => number` 타입에 할당 가능한가?
            -   `(x: Dog) => number`의 첫 번째 매개변수 타입과 `(x: Animal) => number`의 첫 번째 매개변수 타입이 서로 할당 가능한가?
                -   `Dog`와 `Animal`이 서로 할당 가능한가?
                    -   Yes

위에서 본 것처럼, 타입 시스템은 "`(x: Dog) => number` 타입이 `(x: Animal) => number` 타입에 할당 가능한가?"를 반드시 물어야 한다. 이는 원래 질문을 위해 타입스크립트가 물어야 하는 질문이다. 만약 타입스크립트가 <mark class="hltr-green">반공변성</mark>만을 <mark class="hltr-yellow">함수 매개변수</mark>에 강제화했다면, `Dog[]`는 `Animal[]` 에 할당할 수 없었을 것이다.

요약하자면, 타입스크립트의 타입 시스템에서, "더 구체적인 타입을 허용하는 함수가 덜 구체적인 타입을 허용하는 함수에 할당할 수 있냐"는 질문은 "더 구체적인 타입의 array가 덜 구체적인 타입의 array에 할당할 수 있는지"에 대한 선결 질문을 통해 답변이 된다. 후자가 참이 아니라면, 대부분의 경우에는 수용할 수 없는 타입 시스템이 되므로, 함수 매개변수의 타입은 특정 경우에서 정확성에 대한 트레이드 오프를 수용해야 한다.

## strictFunctionTypes check

-   타입스크립트에서 [strictFunctionTypes](https://www.typescriptlang.org/tsconfig#strictFunctionTypes) 설정이 꺼져있는 기본 모드에서는 이러한 함수 매개변수의 <mark class="hltr-pink">이변성</mark>을 다음 예제코드에서와 같이 확인할 수 있다.

    [typescript playground example](https://www.typescriptlang.org/play?strict=false&strictFunctionTypes=false#code/GYVwdgxgLglg9mABMMAKAHgLkQZygJxjAHMBKRAbwChFEIEc4AbAUwDom5jUAiACRZNOAGkQ9EAakTo2UOABk4Adxb4AwgEMcLVKVIBuKgF8aVKAE8ADi0QBlAkWIB5fADkQAWwBGqgGLgIRABeRFQwHGw8QhJEAB9EME8ffHIggD5EADc4GAATQ0QqAHoixABVcI1gGy0cGGIwDxYwKEQYHERLfBZM5qgWXKpWVtBIbHto5zckvwDg5DBDKlGIVABGAAYDIA)

```ts
// strictFunctionTypes: off
function fn(x: string) {
    console.log("Hello, " + x.toLowerCase())
}

type StringOrNumberFunc = (ns: string | number) => void

// Unsafe assignment
let func: StringOrNumberFunc = fn
// Unsafe call - will crash
func(10)
```

-   타입스크립트 설정에서 [strictFunctionTypes](https://www.typescriptlang.org/tsconfig#strictFunctionTypes) 설정을 켜면 <mark class="hltr-red">공변성</mark>이 제거되고 <mark class="hltr-green">반공변성</mark>만 남는다. - 그리고 이전 예제처럼 타입선언을 했을 때 이제는 타입에러가 검출되어 불안전한 할당을 방지할 수 있게 된다.

    [typescript playground example](https://www.typescriptlang.org/play?strict=false#code/GYVwdgxgLglg9mABMMAKAHgLkQZygJxjAHMBKRAbwChFEIEc4AbAUwDom5jUAiACRZNOAGkQ9EAakTo2UOABk4Adxb4AwgEMcLVKVIBuKgF8aVKAE8ADi0QBlAkWIB5fADkQAWwBGqgGLgIRABeRFQwHGw8QhJEAB9EME8ffHIggD5EADc4GAATQ0QqAHoixABVcI1gGy0cGGIwDxYwKEQYHERLfBZM5qgWXKpWVtBIbHto5zckvwDg5DBDKlGIVABGAAYDIA)

```ts
// strictFunctionTypes: on
function fn(x: string) {
    console.log("Hello, " + x.toLowerCase())
}

type StringOrNumberFunc = (ns: string | number) => void

// Unsafe assignment is prevented
let func: StringOrNumberFunc = fn // Type '(x: string) => void' is not assignable to type 'StringOrNumberFunc'. Types of parameters 'x' and 'ns' are incompatible. Type 'string | number' is not assignable to type 'string'. Type 'number' is not assignable to type 'string'.
```

-   하지만 `strictFunctionTypes` 설정이 켜져있어도, 함수 타입을 <mark class="hltr-purple">method 구문</mark><mark class="hltr-purple">(ex, get(): void;)</mark>으로 쓰면, 그 함수는 다시 <mark class="hltr-pink">이변성</mark>으로 작동한다.
-   아래 예제에서, 슈퍼타입의 함수 호출 시그니처에 서브타입의 함수 호출 시그니처를 할당한 것은, 논리적으로 따지면 <mark class="hltr-green">반공변성</mark>에 따라 타입에러가 존재해야 한다. 하지만 <mark class="hltr-purple">method 구문 함수</mark>는 strictFunctionTypes 설정을 켜더라도 타입스크립트 설계상 <mark class="hltr-pink">이변성</mark>이라서, 해당 타입에러가 감지되지 않는 문제가 있다.

    [typescript playground example](https://www.typescriptlang.org/play?strict=false#code/C4TwDgpgBAygrpATqSUC8UDOxEEsB2A5lAD5T5wC2ARhIgNwBQK081L6WOBhTz40ALIRgACwD2AE1yZRnAN6MoUAGZx8AYwAUADwBcsBHRYBKAwDdxuSUwC+TKIzWbgucfixxqAMXy6DbKZQisoa7pjiADYQAHSR4oRaAEQAEhCR8QA0UElQANRQOjHA4gAy4gDudADCAIaYEFomJnZKjAD07VAAqpGulLXA6SBQtR7qmLUq0PWYuIT4lBD4wNnUcMDk4puSIhAaQ5KMYfjYUJQGwmJSMnIYIarqGgaYXr7ZnVCAEUOAPsuAAwuAUPHABrjUEAFquADCHABxrgBzZwA7Q4AP2sAE02ADJnAAujUEAOIOAGD7ASCITCESjAD6dUEABquAT6bADqrUEAwTWAAXHsoAMHsArzWAAZ7AIyD6MADK2AF07AC5dUEBqMAN+2AABqoIAXCcANeOAF1XAD6jUEpgBOmmJQQAaq4ABycAM53nEQSSRQQA2tYAObrB4MAKU1QQAu4xyrYAB7sAOh1QGXkwUAkXiwAINRrABgtGqggClRy3GwA4E+LABHjKsY9kYlBizm0AEYAAwtIA)

```ts
type Supertype = string | number
type Subtype = string

type Methodish = {
    func(x: Supertype): void
}

function subFn(x: Subtype) {
    console.log("Hello, " + x.toLowerCase())
}

// Ultimately an unsafe assignment, but not detected
const m: Methodish = {
    func: subFn, // 슈퍼타입의 함수호출시그니처에 서브타입의 함수호출시그니처를 할당했으나 타입에러가 감지되지 않음
}
m.func(10)
```

-   따라서 특별히 이변성이 필요한 경우가 아니라면, 함수 타입을 <mark class="hltr-purple">method 구문</mark>이 아닌 <mark class="hltr-blue">function 구문</mark><mark class="hltr-blue">(ex, get: () ⇒ void;)</mark>으로 써서 <mark class="hltr-green">반공변성</mark>으로 동작하게 하는 것이 적절하다.

### strictFunctionTypes 설정을 켜도 <mark class="hltr-purple">method 구문으로 작성된 함수</mark>의 매개변수 타입이 이변성인 이유

-   타입스크립트에서 `strictFunctionTypes` 기능을 개발할 때, DOM의 일부를 포함하여 본질적으로 안전하지 않은 class 계층 구조를 많이 발견했다고 한다. - 만약, <mark class="hltr-purple">method 구문 함수</mark>에도 엄격한 검사를 적용했다면 상당히 많은 제네릭 타입이 <mark class="hltr-grey">무공변성</mark>이 되는 엄청난 브레이킹 체인지가 발생했을 것이다. 따라서 이처럼 <mark class="hltr-purple">method 구문 함수</mark>에서 <mark class="hltr-grey">무공변성</mark>이 되지 않도록, <mark class="hltr-pink">이변성</mark>이라는 약간의 불건전성을 용인한 것으로 보인다.
-   즉, <mark class="hltr-purple">method 구문 함수</mark>는 제네릭 클래스나 제네릭 인터페이스(예를 들어 `Array<T>`)의 <mark class="hltr-green"> 반공변적</mark>인 관계를 유지하게 하기 위해 strictFunctionTypes 검사 기능에서 의도적으로 배제됐다.
-   이로 인해, strictFunctionTypes 검사 기능은 <mark class="hltr-purple">method 구문</mark> 으로 작성된 함수에는 적용하지 않고 <mark class="hltr-blue">function 구문</mark>으로 작성된 함수에만 적용했다고 한다.

> 참고: [Typescript PR: Strict function types #18654](https://github.com/microsoft/TypeScript/pull/18654)

-   그러나 method 구문 함수를 이변적으로 동작하도록 만들어야 할 일은 거의 없을 것이다. 따라서 <mark class="hltr-green">반공변적</mark>으로 동작할 수 있는 메서드의 타입 정의에도 <mark class="hltr-blue">function 구문 함수</mark> 작성 방식을 사용하는 것이 타입 안전성 측면에서 더 좋다.
