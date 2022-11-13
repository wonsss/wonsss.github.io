---
title: 자바스크립트가 갖고 있는 컴파일러 언어적 특성과 Lexical Scope
date: 2022-11-13 21:11:78
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

누군가는 자바스크립트가 위에서부터 한줄씩 차례로 실행하는 언어이므로 오직 인터프리터 언어일 뿐이라고 말하기도 한다.

그러나 자바스크립트는 컴파일러 언어적 특성도 갖고 있다.

컴파일러 이론에서 컴파일 4단계(1.lexing, 2.tokenization, 3.parsing, 4.code generation)가 존재하는데, 자바스크립트는 코드가 실행되기 전에 컴파일(최소한 parse)된다.

자바스크립트가 인터프리터 언어라고 주장하는 사람들은 그 이유로 “자바스크립트가 나의 개발 머신의 컴파일러에서 컴파일된 것이 아니므로 컴파일 언어가 아니다”를 들곤 한다. 하지만 컴파일 언어인지 판단하는 정확한 관점은 “코드가 실행되기 전에 처리(processed)되냐 안되냐”이다.

> 컴파일러 언어와 인터프리터 언어의 가장 큰 차이점은 pre-processing(컴파일) 유무다.

자바스크립트 소스 코드를 parse하는 parser가 있다. 그 parser는 바이트코드와 그리 다르지 않는 중간적 표현(intermediate representation)을 생성한다. 그리고 이것을 JS엔진 내에 있는 자바스크립트 가상 머신에게 건넨다. 자바스크립트 가상 머신은 그것을 interpret한다.

자바스크립트를 single-pass(execution)가 아닌 two-pass(processing, execution) 체계로 생각해야 한다.

- 1단계. 모든 스코프와 식별자를 알아낸다.(processing)
- 2단계. 그러한 정보를 사용하여 코드를 실행한다.(execution)

> 변수가 필요할 때 JS 엔진은 스코프를 통해 찾는다.
> `스코프`는 식별자명으로 변수를 찾기 위한 규칙의 집합이다.

기억해야 할 핵심은, lexical 스코프 언어인 자바스크립트에서 모든 lexical 스코프 결정이 컴파일 타임에 결정된다는 것이다. 런타임에 결정되지 않는다. 이처럼 모든 식별자를 코드 실행 전에 미리 알 수 있으면 JS엔진이 더 효율적으로 최적화할 수 있기 때문이다.

이외에 스코프를 공부하면서 정리한 내용을 붙인다.

### 컴파일레이션 단계

1. Tokenizing / Lexing
    - 문자열을 나누어 토큰이라 불리는 해당 언어에 의미 있는 조각으로 만드는 과정이다.
    - `var a=2;`는 `var` , `a` , `=` , `2` , `;` 토큰으로 나누어진다.
2. Parsing
    - 토큰 배열을 프로그램의 문법 구조를 반영하여 중첩 원소를 갖는 트리 형태로 바꾸는 과정이다. 파싱의 결과로 만들어진 트리를 AST(Abstract Syntax Tree, 추상 구문 트리)라 부른다.
3. Code-Generation
    - AST를 컴퓨터에서 실행 코드로 바꾸는 과정이다.

### 함수 표현식은 기명으로 하는 것이 좋다

다음과 같은 이유 때문에 익명 함수 표현식보다 기명 함수 표현식을 사용하는 것이 권장된다.

1. 함수의 이름은 함수 내부에서 해당 함수에 대한 신뢰할 수 있는 자기 참조가 된다.
   - 자기 참조를 해야 하는 예로서 한 번 실행하면 해제되는 `이벤트 처리 함수` 가 있는데, 익명 함수인 경우 쉽지 않다.
2. 함수에 이름이 있으면 스택 추적시 이름이 표시되어 디버깅이 용이하다.
3. 가장 중요한 이유로서, 함수에 이름이 있으면 더 자체 문서화된 코드가 되어 코드를 이해하기 쉬워진다.

### 스코프에서 대상을 찾지 못하면 발생하는 ReferenceError

- ReferenceError는 스코프에서 대상을 찾았는지와 관계있다

LHS, RHS라는 이 두 가지의 검색 방식은 변수가 아직 선언되지 않았을 때 서로 다르게 동작한다.

#### RHS(Right Hand Side)

- RHS 검색이 변수를 찾지 못하면 ReferenceError가 발생한다.

```jsx
function foo(a) {
    console.log(a+b); // b에 대한 RHS 검색 결과, 찾지 못함
    b=a;
}

foo(2); // Uncaught ReferenceError: b is not defined
```

#### LHS(Left Hand Side)

- LHS 검색이 변수를 찾지 못하고 최상위 층인 글로벌 스코프에 도착하면, 글로벌 스코프는 엔진이 검색하는 이름을 가진 새로운 변수를 생성하여 엔진에게 넘겨준다. 하지만 이는 끔찍하다. 또한, 컴파일 타임에 선언하는 것과 런타임에 동적으로 만드는 것은 성능적 차이가 있다. 절대로 이렇게 전역에 변수를 동적으로 생성해서는 안 된다.
- strict mode인 경우, LHS도 RHS의 경우와 비슷하게 ReferenceError를 발생시킨다.

```jsx
function foo(a) {
    b=a; // b에 대한 LHS 검색 결과, 찾지 못하여 전역에 새 변수 생성
    console.log(a+b); 
}

window.b; // 값은 2
foo(2); // 4
```

- 참고로 TypeError는 스코프 검색은 성공했으나 결괏값을 가지고 적합하지 않거나 불가능한 시도를 한 에러이다. 예를 들어, TypeError는 함수가 아닌 값을 함수처럼 실행하거나 null이나 undefined 값을 참조할 때 발생한다.

## 스코프의 두 가지 작동 방식

### 1. 동적 스코프

- Bash Scripting이나 Perl의 일부 모드와 같은 몇몇 언어에서 사용하는 방식, 스코프가 런타임에 동적으로 결정된다.

### 2. 렉시컬 스코프(자바스크립트)

- 다른 방식보다 훨씬 일반적이고 자바스크립트를 포함한 다수의 프로그래밍 언어에서 사용하는 방식이다. 개발자가 작성할 때 결정되며, 런타임에 결정되지 않는다.
- 렉시컬 스코프는 렉싱 단계에 정의되는 스코프다. 즉, 렉시컬 스코프는 개발자가 코드를 짤 때 `함수`를 어디에 선언하는가에 따라 정의되는 스코프다. 함수가 스코프 버블을 만든다.
- 컴파일레이션의 렉싱 단계에서, 모든 식별자가 어디서 어떻게 선언됐는지 파악하여 실행 단계에서 어떻게 식별자를 검색할지 예상할 수 있도록 도와준다.

#### 렉시컬 스코프 속이기

- 런타임에 스코프를 수정하거나 새로운 렉시컬 스코프를 만드는 방법으로 eval() 과 with 모두 원래 작성된 렉시컬 스코프를 속일 수 있다. 하지만 이는 성능상 적절하지 않으므로 렉시컬 스코프 속이기는 하지  않는 것이 좋다.
- 왜냐하면 자바스크립트 엔진은 컴파일레이션 단계에서 상당수의 최적화 작업을 진행한다. 이 최적화의 일부분이 하는 핵심 작업은 렉싱된 코드를 분석하여 모든 변수와 함수 선언문이 어디에 있는지 파악하고 실행 과정에서 식별자 검색을 더 빠르게 하는 것이다.
- 그런데 eval()이나 with가 코드에 있다면 엔진에 미리 확인해둔 확인자의 위치가 틀릴 수 있게 되어, 대다수 최적화가 의미 없어진다.

## 함수 스코프

- 자바스크립트는 `함수` 기반 스코프를 사용한다.
- 함수 스코프는 해당 스코프 내부에 있는 모든 식별자(심지어 중첩된 스코프 내부)에 접근할 수 있다. 이런 방식은 유용하지만, 스코프 전체에서 변수가 살아있다는 점이 예상치 못한 문제를 일으킬 수 있다.

### 함수 스코프에 숨기

- 왜 스코프를 이용해 숨기는 방식을 이용해야 하는가?
  - ‘최소 권한(또는 노출)의 원칙’에 따라, 모듈/객체의 API와 같은 소프트웨어 설계 시 필요한 것만 최소한으로 남기고 나머지는 숨기는 것이 좋다.
  - 같은 이름을 가졌지만 다른 용도를 가진 두 식별자가 충돌하는 것을 피하기 위해서다.
- 따라서 감추고 싶은 변수나 함수 선언문을 `함수`로 감싸 바깥 스코프로부터 `함수`의 스코프 안에 숨길 수 있다.
- 스코프 역할을 하는 함수(IIFE) 사용
  - 둘러싼 스코프를 오염시키지 않기 위해, 함수를 이름 없이 선언하고 자동으로 실행하게 한다면, 더 이상적일 것이다.

> IIFE란?
> 함수를 `()` 로  감싸면 함수를 `표현식`으로 바꾼다. 마지막에 또 다른 `()` 를 붙이면 함수를 `실행`할 수 있다.
> 이런 패턴을 `즉시 호출 함수 표현식(IIFE, Immediately Invoked Function Expression)` 이라 한다. 익명 IIFE가 흔하긴 하지만, 위에서 설명한 이유처럼 기명 IIFE를 사용하는 것이 더 좋은 습관이다.

```jsx
const a = 2;

// 참고로 ‘function’이 구문의 시작 위치에 있으면 함수 선언문이고, 그렇지 않으면 함수 표현식이다.
(function foo() {  // function으로 시작하지 않으므로 함수표현식
    const a = 3;
    console.log(a); // 3
    console.log(foo);
})();

console.log(a); // 2 
foo(); // Uncaught ReferenceError: foo is not defined
```

- 위 코드처럼 함수 이름 foo는 함수를 둘러싼 스코프에 묶이는 대신 함수 자신의 내부 스코프에 묶였다. 즉, 해당 함수 표현식에서 식별자 foo는 오직 foo 함수 내부 스코프에서만 접근 가능하고 외부 스코프에서는 접근할 수 없다. 이처럼 함수 이름 foo를 자기 내부에 숨기면 함수를 둘러싼 스코프를 불필요하게 오염시키지 않는다.

## 블록 스코프

- 함수만 스코프 버블을 생성하는 것이 아니라 일부 블록 스코프도 존재한다.
- 블록 스코프는 변수를 최대한 작은 유효 범위를 갖도록 선언하여, 변수가 혼란스럽고 유지 보수하기 어려운 방식으로 재사용되지 않도록 막는 것이 목적이다.
- 블록 스코프가 유용한 또 다른 이유는 메모리를 회수하기 위한 가비지 콜렉션과 관련 있다.

```jsx
function process(data) {
    console.log('processing', data);
}
const someReallyBigData = {hi: 1};
process(someReallyBigData); // processing {hi: 1}
// someReallyBigData에 대한 작업 끝남

// 그러나 scroll 함수가 someReallyBigData가 포함된 이 스코프 전체의 클로저를 쥐고 있다.
window.addEventListener("scroll", function click(evt) { 
    console.log("scrolled", someReallyBigData); // 스크롤할 때마다 scrolled {hi: 1}
})
```

- 명시적으로 블록을 선언하여 변수의 영역을 한정함으로써, 블록 스코프는 엔진에게 사용하지 않는 변수에 대해 더 명료하게 알려주어 효율적으로 가비지 콜렉팅이 진행되게 한다.

```jsx
function process(data) {
    console.log('processing', data);
}
// 명시적 블록 스코프으로 가두기
{
    const someReallyBigData = {hi: 1};
    process(someReallyBigData); // processing {hi: 1}
    // someReallyBigData에 대한 작업 끝남
}

window.addEventListener("scroll", function click(evt) { 
    console.log("scrolled", someReallyBigData); // Uncaught ReferenceError: someReallyBigData is not defined
})
```

- 자바스크립트에는 다음과 같은 `블록 스코프` 방법이 있다.

### `try/catch`

- catch 부분에 선언된 변수는 catch 블록 스코프에 속한다. 변수 err은 오직 catch 문 안에만 존재하므로 이 외에서 참조하면 오류가 발생한다.

```jsx
try {
    undefined();
} catch(err) {
    console.log('err', err);
}

console.log(err); // Uncaught ReferenceError: err is not defined
```

### `let`, `const`

- 키워드 let과 const는 선언된 변수를 둘러싼 아무 블록의 스코프에 붙인다. 명시적이진 않지만 let은 선언한 변수를 위해 해당 블록 스코프를 이용한다고 볼 수 있다.
- let은 for 반복문에서 var 대신 사용하면 좋다.

```jsx
var foo = true;
if (foo) {
    let bar = foo * 2; // const도 마찬가지
    console.log(bar); // 2
}
console.log(bar); // Uncaught ReferenceError: bar is not defined
```

- 더 명시적으로 표현하기 위해, 명시적 블록 스코프 스타일로 한번 더 묶어주는 것도 좋다. 이렇게 하면 나중에 리팩토링하면서 if 문의 위치나 의미를 변화시키지 않고도 전체 블록을 옮기기가 쉬워진다.

```jsx
var foo = true;
if (foo) {
    {
        let bar = foo * 2;
        console.log(bar);
    }
}
console.log(bar);
```

## 호이스팅

- 호이스팅을 생각하면 변수나 함수 선언문이 자바스크립트 코드 최상단으로 끌어올려지는 것을 상상할 수도 있겠으나, 사실 이러한 호이스팅 동작은 실제로 존재하는 것이 아니다. 호이스팅은 lexical 스코프의 개념을 설명하기 위해 지어낸 비유적 용어일 뿐이며, 이러한 처리 과정은 사실 ‘parsing’에 해당한다.
- 자바스크립트 엔진은 코드를 `인터프리팅` 하기 전에 `컴파일` 한다.
- `컴파일레이션` 단계 중에는 모든 선언문을 찾아 적절한 스코프에 연결해주는 과정(렉싱)이 있다.
  - `var a = 2;` 에 대해 엔진은 두 개의 구문으로 본다. `var a;` 선언문은 컴파일레이션 단계에서 처리하고, `a = 2;` 대입문은 실행 단계에 처리한다.

### 호이스팅은 스코프별로 작동한다

- 함수 선언문
  - 함수 선언문은 끌어올려진다.

```jsx
foo(); // undefined

function foo() {

}
```

- 함수 표현식
  - 함수 표현식의 변수 식별자는 끌어올려지나, 함수 표현식의 이름은 해당 스코프에서 찾을 수 없다. 함수 표현식이 할당된 변수 식별자가 호이스팅된 스코프에는 해당 함수 표현식이 호이스팅 되지 않는다. 왜냐하면 할당은 런타임에 발생하는 일인데, 호이스팅이 이루어지는 컴파일타임에서는 함수 표현식이 아직 할당되지 않았기 때문이다.

```jsx
foo(); // Uncaught TypeError: foo is not a function
bar(); // Uncaught ReferenceError: bar is not defined

var foo = function bar() {
}
```

### 왜 let과 const는 호이스팅 되지 않는가?

- let과 const도 호이스팅은 되나 호이스팅하는 방식이 달라 TDZ Error 발생한다.
  - 첫번째 이유는, let과 const는 블록 스코프에만 호이스팅한다는 사실이다. 반면, var가 함수 스코프에 호이스팅했던 것과 다르다. 두번째 이유는 let과 const는 호이스팅하면서 초기화가 되지 않으나(uninitialized), var는 호이스팅되면서 undefined로 초기화가 된다는 것이다.
- TDZ는 let이 아니라 const 때문에 존재한다. 만약 const가 var처럼 TDZ가 없다면, 선언되기 전 호출 시 undefined가 나와 원래 의도한 const 개념과 달리 여러 곳에서 다른 값을 가지게 될 수 있다. TDZ를  const에 적용하는 김에 let에도 함께 적용한 것이다.
