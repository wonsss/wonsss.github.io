---
title: this, Object, prototype 개념 정리
date: 2022-09-18 01:09:04
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

## this

- this의 유용함과 사용 동기
  - this를 안 쓰고 함수에 콘텍스트 객체를 명시(매개변수)할 수도 있으나, 암시적인 객체 레퍼런스를 함께 넘기는 `this` 체계가 API 설계상 좀 더 깔끔하고 명확하며 재사용하기 쉽다.
  - 여러 함수가 적절한 콘텍스트 객체를 자동 참조하는 `this` 구조가 편리하다.
- this에 대한 오해
  - 함수는 this로 자기 참조를 할 수 없다.
  - this는 함수의 렉시컬 스코프를 참조하지 않는다(연결 통로 따윈 없어).
- this 바인딩
  - 작성 시점이 아닌 `런타임` 시점에 바인딩 된다.
  - 실행 컨텍스트가 생성되는 `함수가 호출` 될 때, this가 함께 결정된다.
    - 어떤 함수를 호출하면 `활성화 레코드`(Activation Record, = 실행 컨텍스트)가 만들어진다.
      - 여기엔 함수가 호출된 근원인 `CallStack` 과 호출 방법, 전달된 인자 등의 정보가 담겨있다.
        - this 레퍼런스는 그중 하나로, 함수가 실행되는 동안 이용할 수 있다.
  - 함수 선언 위치와 상관없다.

---

1. 기본 바인딩

    - 단독 함수 실행에 관한 규칙으로 나머지 규칙에 해당하지 않을 경우 적용되는 this의 기본 규칙이다.
    - non-strict mode인 경우, 전역 객체가 기본 바인딩 대상이다.

        ```jsx
        function foo() {
            console.log(this.a) // this는 전역 객체를 참조한다.
        }

        var a = 2

        foo() // 2
        ```

    - strict mode인 경우, 전역 객체가 기본 바인딩 대상에서 제외된다. undefined로 바인딩된다.

2. 암시적 바인딩

    - 호출부에 콘텍스트 객체가 있는지, 객체의 소유/포함 여부를 확인한다.

        - 호출부는 obj 콘텍스트로 foo()를 참조하므로 obj 객체는 함수 호출 시점에 함수의 레퍼런스를 ‘소유’하거나 ‘포함’한다고 볼 수 있다.

        ```jsx
        function bar() {
            console.log(this.a)
            // foo() 호출 시 this는 obj이니 this.a는 obj.a가  된다.
        }

        const obj = {
            a: 2,
            foo: bar,
        }

        obj.foo() // 호출부에 콘텍스트 객체(obj)가 있다.
        // 결과 : 2
        ```

    - 암시적 소실

        - 암시적으로 바인딩 된 함수(아래에서 `const baz = obj.foo;`)에서 바인딩이 소실되는 경우이다. 엄격 모드 여부에 따라 전역 객체나 undefined 중 한 가지로 기본 바인딩된다.

            ```jsx
            // 비엄격모드인 경우
            function bar() {
                console.log(this.a)
            }

            const obj = {
                a: 2,
                foo: bar,
            }

            // var로 전역 스코프에서 선언하면 변수명과 같은 이름의 전역 객체 프로퍼티가 생성된다.
            // window.a 는 'hello'
            // 참고로 const는 전역 객체 프로퍼티로 생성되지 않음
            var a = 'hello'

            const baz = obj.foo // bar 함수를 참조

            baz() // 전역 스코프에서 함수를 호출하므로 기본 바인딩 적용된다.
            // 결과 : 'hello'
            ```

        - 콜백 함수를 인자로 전달하는 것도 암시적인 할당으로서 바인딩이 소실된다.

            ```jsx
            function bar() {
                console.log(this.a)
            }

            function doFoo(fn) {
                fn() // bar() 호출, 기본 바인딩
            }

            const obj = {
                a: 2,
                foo: bar,
            }

            var a = '전역입니다'

            doFoo(obj.foo) // bar 함수를 인자로 넘김
            // 결과 : '전역입니다'
            ```

3. 명시적 바인딩

    ```jsx
    function foo() {
        console.log(this.a)
    }

    const obj = {
        a: 2,
    }

    foo.call(obj) // 2
    ```

    - `call()`과 `apply()` 메서드를 사용하여 명시적 바인딩한다.

        - 두 메서드는 바인딩 할 객체를 `첫 번째 인자`로 받아, 함수 호출 시 이 객체를 this로 지정한다.
        - call 메서드는 함수를 즉시 실행하는 명령이다.
        - apply 메서드는 call 메서드와 기능적으로 완전히 동일하나, 두 번째 인자를 배열로 받는다는 점이 다르다.

    - 그러나 명시적으로 바인딩 해도 this 바인딩이 도중에 소실되거나 프레임워크가 임의로 덮어써 버리는 문제는 해결할 수 없다.
    - 하드 바인딩

        - 함수(bar) 내부에서 명시적 바인딩하는 것을 하드 바인딩이라 한다. 이제 함수(bar) 어떻게 호출하든 이 함수는 항상 obj를 바인딩하여 foo를 실행한다.

        ```jsx
        function foo() {
            console.log(this.a)
        }

        const obj = {
            a: 2,
        }

        const bar = function() {
            foo.call(obj) // 하드 바인딩
        }

        bar()
        ```

        - 이러한 패턴은 ES5 이후 `bind()` 메서드로서 내장되었다.
            - 상위 컨텍스트의 this를 내부함수나 콜백 함수에 전달한다.

        ```jsx
        function foo(something) {
            console.log(this.a, something)
            return this.a + something
        }

        const obj = {
            a: 2,
        }

        const bar = foo.bind(obj) // 하드 바인딩, bind는 호출하지 않고 반환만 한다.

        const b = bar(3) // 2, 3
        console.log(b) // 5
        ```

        ```jsx
        const obj = {
            logThis: function() {
                console.log(this)
            },
            logThisLater1: function() {
                setTimeout(this.logThis, 500) // 콜백 함수의 this는 전역 객체
            },
            logThisLater2: function() {
                setTimeout(this.logThis.bind(this), 500) // 콜백 함수의 this를 상위 컨텍스트인 obj로 하드 바인딩
            },
        }

        obj.logThis() // obj {logThis: ƒ, logThisLater1: ƒ, logThisLater2: ƒ}
        obj.logThisLater1() // Window {window: Window, self: Window, document: document, name: '', location: Location, …}
        obj.logThisLater2() // obj {logThis: ƒ, logThisLater1: ƒ, logThisLater2: ƒ}
        ```

4. new 바인딩
    - ‘생성자’란?
        - 자바스크립트 생성자는 앞에 new 연산자가 있을 때 호출되는 `일반 함수` 에 불과하다.
    - new는 함수 호출 시 this를 새 객체와 바인딩 하는 방법이며, 이것이 ‘new 바인딩’이다.

- this 확정 규칙(우선순위대로 정리)

    1. [new 바인딩] new로 함수를 호출했는가? → 맞으면 새로 생성된 객체가 this다.

        ```jsx
        const bar = new foo() // bar가 foo()의 this다
        ```

    2. [명시적 바인딩] call, apply, bind로 함수를 호출했는가? → 맞으면 명시적으로 지정된 객체가 this다.

        ```jsx
        const bar = foo.call(obj2) // obj2가 foo()의 this다
        ```

    3. [암시적 바인딩] 함수를 콘텍스트(객체를 소유/포함하는 형태)로 호출했는가? → 맞으면 이 콘텍스트 객체가 this다.

        ```jsx
        const bar = obj1.foo() // obj1이 foo()의 this다
        ```

    4. [기본 바인딩] 그 외의 경우에 this는 기본값으로 세팅된다.

        ```jsx
        const bar = foo()
        // strict mode이면, undefined가 foo()의 this다.
        // non-strict mode이면, window가 foo()의 this다.
        ```

- 상황에 따른 this 분류 재정리
    1. 전역 공간에서의 this
        - 전역 공간에서 this는 전역 객체를 가리킨다.
    2. 메서드로서 호출할 때 그 메서드 내부에서의 this
        - 함수 호출 시 그 함수 이름 앞에 객체가 명시돼 있는 경우 메서드로 호출한 것이고, 나머지는 함수로 호출한 것이다.
        - 메서드 내부에서의 this는 메서드를 호출한 객체(함수명 앞의 객체)이다.
    3. 함수로서 호출할 때 그 함수 내부에서의 this
        - 함수 내부에서의 this
            - 함수로서 호출하는 것은 호출 주체를 명시하지 않은 것이므로, 이렇게 지정되지 않은 경우 this는 전역 객체를 바라본다.
        - 메서드의 내부함수에서의 this
            - 마찬가지로 해당 함수를 호출하는 구문 앞에 점 또는 대괄호 표기가 없으므로 함수로서 호출이며 this는 전역 객체를 가리킨다.
    4. this를 바인딩하지 않는 함수 - 화살표함수
        - 이처럼 함수 내부에서 this가 전역객체를 바라보는 문제를 보완하기 위해, this를 바인딩하지 않는 화살표 함수가 새로 도입됐다.
        - 화살표 함수는 상위 스코프의 this를 그대로 활용한다.
    5. 콜백 함수 호출 시 그 함수 내부에서의 this
        - 콜백 함수의 제어권을 가지는 함수가 콜백 함수에서의 this를 무엇으로 할지를 결정하며, 특별히 정의되지 않으면 기본적으로 함수처럼 전역객체를 바라본다.
            - addEventListener 메서드는 콜백 함수를 호출할 때 자신의 this(메서드명 점 앞 부분)를 상속하도록 정의돼 있다.
    6. 생성자 함수 내부에서의 this
        - 생성자로서 호출된 경우 내부에서의 this는 곧 새로 만들 구체적인 인스턴스 자신이 된다.
- 요소를 순회하면서 콜백 함수를 반복 호출하는 내용의 일부 메서드는 별도의 인자로 this를 받기도 한다.

    ```jsx
    Array.prototype.forEach(callback[, thisArg])
    Array.prototype.map(callback[, thisArg])
    Array.prototype.filter(callback[, thisArg])
    Array.prototype.some(callback[, thisArg])
    Array.prototype.every(callback[, thisArg])
    Array.prototype.find(callback[, thisArg])
    Array.prototype.findIndex(callback[, thisArg])
    Array.prototype.flatMap(callback[, thisArg])
    Array.prototype.from(arrayLike[, callback[, thisArg]])

    Set.prototype.forEach(callback[, thisArg])
    Map.prototype.forEach(callback[, thisArg])
    ```

- this 무시하는 바인딩 예외

  - call, apply, bind 메서드에 첫 번째 인자로 null 또는 undefined를 넘기면 this 바인딩이 무시되고 기본 바인딩 규칙이 적용된다.

            ```jsx
            function foo() {
                console.log(this.a)
            }

            var a = 2

            foo.call(null) // 2
            ```

  - 그런데 왜?
    - 함수 호출 시 인자를 전달(커링)하려고 하는데, 첫 번째 인자로 this 바인딩을 지정해야 해서 형식상 null 정도의 값을 자리 끼우는 용으로 둔다.
  - 더 안전하게

    - this 바인딩을 신경 쓰지 않고 싶으면 내용이 하나도 없으며 전혀 위임되지 않은 객체(`Object.create(null)`)를 만들어 사용한다. 이는 Object.prototype으로 위임하지 않으므로 `{}` 보다 더 텅 빈 객체이다.

    ```jsx
    function foo(a, b) {
        console.log('a:', a, ', b:', b)
    }

    // 빈 객체를 만든다.
    // ø는 option + o 를 통해 입력 가능하다.
    const ø = Object.create(null)

    // 인자들을 배열 형태로 쭉 펼친다
    foo.apply(ø, [2, 3]) // a: 2 , b: 3
    // ES6부터는 spread 연산자를 통해 위 코드처럼 apply를 사용하지 않고도 인자를 배열 형태로 펼칠 수 있다.
    foo(...[2, 3]) // a: 2 , b: 3

    // 'bind()'로 커링한다
    const bar = foo.bind(ø, 2)
    bar(3) // a: 2 , b: 3
    ```

- 어휘적(렉시컬) this(화살표 함수)

  - 일반적 함수는 위 4가지 규칙을 준수하나, ES6부터 도입된 `화살표 함수`는 이 규칙들을 따르지 않고 `렉시컬 스코프`로 this를 바인딩한다.
    - 화살표 함수는 Enclosing Scope(함수 또는 전역)로부터 this 바인딩을 상속한다.
    - 화살표 함수는 호출될 당시 this를 무조건 어휘적으로 포착한다.
  - 화살표 함수의 기본 기능 또는 아이디와 비슷한 패턴으로 `self=this` 가 있었다. 둘 중 한 가지만 선택해서 사용한다.

    ```jsx
    // self=this 버전
    function foo() {
        const self = this; // 호출될 당시에 this를 어휘적으로 포착한다.
        setTimeout(function() {
        console.log(self.a);
        }, 100);
    }

    // 화살표 함수 버전
    function foo() {
        setTimeout(() => {
        // 호출될 당시에 this를 어휘적으로 포착한다.
        console.log(this.a);
        }, 100);
    }

    const obj = {
        a: 2
    };

    foo.call(obj); // 2
    ```

- call/apply 활용

  - 유사배열객체에 배열 메서드를 적용

    ```jsx
    Array.prototype.push.call(obj, 'd') // 객체에 배열 push 메서드를 이용해 요소 추가

    const nodeArr = Array.prototype.slice.call(nodeList) // 유사배열객체를 배열로 전환
    ```

  - 생성자 내부에서 다른 생성자를 호출

    - 생성자 내부에서 다른 생성자와 공통된 내용이 있으면 call/ apply를 사용해 다른 생성자를 호출하여 간단히 반복을 줄일 수 있다.

    ```jsx
    function Person(name) {
        this.name = name
    }

    function Student(name, school) {
        Person.call(this, name)
        this.school = school
    }
    ```

  - 여러 인수를 묶어 하나의 배열로 전달하고 싶을 때 - apply 활용

    ```jsx
    const max = Math.max.apply(null, numbers) // this는 null로 자리만 채움

    const max = Math.max(...numbers) // 참고로 ES6부터는 spread 연산자 활용하여 더 쉽게
    ```

## 객체

- 객체는 키/값의 쌍을 모아 놓은 저장소다.
- 객체는 `선언적(리터럴) 형식` 또는 `생성자 형식`으로 정의한다.

  - 대부분 리터럴 형식으로 객체를 생성한다.

    ```jsx
    // 리터럴 형식
    const myObj = {
        name: 'marco',
        age: 100,
    }

    // 생성자 형식
    const myObj = new Object()
    myObj.name = 'marco'
    myObj.age = 100
    ```

- 자바스크립트의 객체
  - 자바스크립트에는 타입으로 null, undefined, boolean, number, string, object, symbol 7개가 있다.
    - 이 중 null, undefined, boolean, number, string은 `단순 원시 타입`으로서 객체가 아니다.
    - function은 `객체의 하위 타입`으로서 `복합 원시 타입`이다.
      - 자바스크립트 `함수`는 기본적으로는 (호출 가능한 특성이 고정된) 객체이므로 ‘일급’이며, 다른 일반 객체와 똑같이 취급된다.
        - 참고로 자바스크립트 `배열` 도 객체의 일종이다.
  - `내장 객체`
    - String, Number, Boolean, Object, Function, Array, Date, RegExp, Error
    - 이들은 내장 함수이며, 생성자(new가 앞에 붙으면)로 사용되면 주어진 하위 타입의 새 객체를 생성한다.
    - String, Number, Boolean의 경우 생성자 형식보다는 리터럴 형식(불변값)을 사용하는 것이 낫다. 왜냐하면 자바스크립트 엔진은 상황에 맞게 원시 값을 해당 객체로 자동 강제변환하므로 명시적으로 객체를 생성할 필요가 거의 없기 때문이다.
      - 하지만 예외적으로 Date 값은 리터럴 형식이 없어서 반드시 생성자 형식으로 생성해야 한다.
    - Object, Array, Function, RegExp는 형식(리터럴/생성자)과 무관하게 모두 객체다. 그래도 간단한 리터럴 형식을 더 많이 쓴다.
- 함수 표현식을 객체 리터럴의 한 부분으로 선언해도 이 함수가 저절로 객체에 달라붙는 건 아니며 해당 함수 객체를 참조하는 레퍼런스가 하나 더 생기는 것 뿐이다.
- 프로퍼티 서술자(property descriptor)

  - ES5부터 모든 프로퍼티는 프로퍼티 서술자로 표현된다.
  - `Object.getOwnPropertyDescriptor()`

    ```jsx
    const myObject = {
        a: 1
    }

    Object.getOwnPropertyDescriptor(myObject, "a");

    // {value: 1, writable: true, enumerable: true, configurable: true}
    ```

  - `Object.defineProperty()`

    ```jsx
    Object.defineProperty(myObject, "b", {value: 2, writable: false, enumerable: true, configurable: true})
    // {a: 1, b: 1}
    ```

  - 속성
    - writable
      - false인 값을 수정하려고 하면 조용히 실패하며 엄격 모드에선 에러가 난다.
    - configurable
      - true면 defineProperty()로 프로퍼티 서술자를 변경할 수 있다.
      - 한번 false가 되면 다시 true로 돌아올 수 없으며, 기존 프로퍼티 삭제도 금지된다.
    - enumerable
      - 객체 루프 프로퍼티를 열거하는 구문에서 해당 프로퍼티의 표출 여부를 나타낸다.
      - false로 지정된 프로퍼티는 루프 구문에서 감춰진다(접근할 수는 있다).
      - true로 바꾸면 다시 루프 구문에서 모습을 드러낸다. 기본값이 true이다.

- 불변성
  - 객체 상수
    - `writable: false` 와 `configurable: false` 를 같이 쓰면 객체 프로퍼티를 상수처럼 쓸 수 있다.
  - `Object.preventExtensions()`
    - 프로퍼티 추가를 금지한다.
  - `Object.seal()`
    - 프로퍼티 추가, 재설정, 삭제를 금지한다
  - `Object.freeze()`
    - 프로퍼티 추가, 재설정, 삭제, 값 수정을 금지한다.
    - 가장 높은 단계의 불변성을 적용하며, 객체와 직속 프로퍼티에 어떤 변경도 원천봉쇄하는 것이다.
      - 하지만 이 객체가 참조하는 다른 객체의 내용까지 봉쇄하는 것은 아니다(얕은 불변성).
        - 만약 강한 불변성을 적용하려고 한다면, 객체에 대해 Object.freeze()를 호출하여 다음 해당 객체가 참조하는 모든 객체를 재귀적으로 반복하면서 Object.freeze()를 호출하여 객체를 완전히 동결할 수 있다.
- 접근 서술자(Access Descriptor)

  - 프로퍼티가 게터나 세터일 수 있게 정의한 것을 접근 서술자라 한다.
  - 접근 서술자에서 프로퍼티의 value와 writable 속성은 무시되며, 대신 configurable, enumerable, get, set 속성이 중요하다.
  - 게터와 세터를 한쪽만 선언하면 예상외의 결과가 나올 수 있으므로 항상 둘 다 선언하는 것이 좋다.

    ```jsx
    const myObject = {
        get a() {
            return 2
        },
    }
    myObject.a // 2

    Object.defineProperty(myObject, 'b', {
        get: function() {
            return this.a * 2
        },
        enumerable: true,
    })
    myObject.b // 4
    ```

- 존재 확인
  - `in 연산자`는 어떤 프로퍼티가 해당 객체에 존재하는지 아니면 이 객체의 [[Prototype]] 연쇄를 따라갔을 때 상위 단계에 존재하는지 확인한다.
  - `hasOwnProperty()` 는 단지 프로퍼티가 객체에 있는지만 확인하고 [[Prototype]] 연쇄는 찾지 않는다.
  - `propertyIsNumberable()` 은 어떤 프로퍼티가 해당 객체의 직속 프로퍼티인 동시에 enumerable: true 인지 검사한다.
  - `Object.keys()` 는 열거 가능한 프로퍼티를 배열 형태로 반환한다.
  - `Object.getOwnPropertyNames()` 는 열거 가능 여부와 상관없이 객체 있는 열거 가능한 모든 프로퍼티를 배열 형태로 반환한다.
- 순회

  - `forEach()`는 배열 전체 값을 순회하지만 콜백 함수의 반환 값은 무시한다.
  - `every()` 는 배열 끝까지 또는 콜백 함수가 false를 반환할 때까지 순회한다.
  - `some()` 은 배열 끝까지 또는 콜백 함수가 truthy 를 반환할 때까지 순회한다.
  - `for..in 루프` 는 실제로 열거 가능한 프로퍼티만 순회하고 그 값을 얻으려면 일일이 프로퍼티에 접근해야 하므로 일찌감치 순회를 끝내는 데 쓰인다.
  - `for..of 루프` 는 순회할 원소의 iterator object(명세상 @@iterator라는 기본 내부 함수 존재)가 있어야 한다. 순회당 한 번씩 이 iterator object의 next() 메서드를 호출하여 연속적으로 반환 값을 순회한다.

    ```jsx
    const arr = [1, 2, 3]

    // Symbol.iterator 심볼로 객체 내부 프로퍼티인 @@iterator에 접근할 수 있다
    const it = arr[Symbol.iterator]() // iterator object를 반환한다
    it.next() // {value: 1, done: false}
    it.next() // {value: 1, done: false}
    it.next() // {value: 1, done: false}
    it.next() // {value: 1, done: false}
    ```

## 클래스와 객체의 혼합

- 클래스 이론
  - 객체(또는 클래스) 지향 프로그래밍에서 데이터는 자신을 기반으로 실행되는 작동과 연관되므로 데이터와 작동을 함께 잘 감싸는 것(캡슐화)이 올바른 설계라고 강조한다.
  - 클래스는 특정 자료 구조를 분류(Classify)하는 용도로 쓴다.
  - 다형성(Polymorphism)은 클래스의 핵심 개념으로 부모 클래스에 뭉뚱그려 정의된 작동을 자식 클래스에서 좀 더 구체화하여 오버라이드(재정의)하는 것을 뜻한다.
  - 클래스 역시 디자인 패턴의 일종이다.
  - 자바 등 몇몇 언어는 선택의 여지 없이 만물이 다 클래스다.
- 자바스크립트의 클래스는 Syntactic Sugar이다.
  - 자바스크립트에도 클래스 같은 구문이 있어 보이나, 개발자들이 클래스 디자인 패턴으로 코딩할 수 있도록 자바스크립트 체계를 억지로 고친 것에 불과하다.
- (상대적) 다형성
  - 상대적이란 관점에서 메서드가 상위 수준 체계에서 다른 메서드를 참조할 수 있게 해주는 아이디어다.
  - 클래스를 상속하면 자식 클래스에서는 자신의 부모 클래스를 가리키는 상대적 레퍼런스가 주어지는데, 바로 이 레퍼런스를 보통 super라고 한다.
  - 자식이 부모에게 상속받은 메서드를 오버라이드하면 원본 메서드와 오바라이드된 메서드는 각자의 길을 걷게 되며 양쪽 다 개별적으로 접근할 수 있다.
- 자바스크립트엔 인스턴스로 만들 ‘클래스’란 개념 자체가 없고 오직 `객체`만 있다.
  - 자바스크립트에서 객체는 다른 객체에 ‘복사’되는 게 아니라 서로 `연결` 된다.
    - 반면, 다른 언어에서 클래스는 복사를 의미한다.(인스턴스화: 클래스→인스턴스로 복사, 상속: 부모→자식으로 복사)
- 믹스인
  - 믹스인은 자바스크립트에선 누락된 클래스 `복사` 기능을 흉내낸 것(하지만 클래스의 복사 기능과 같진 않다)으로, 명시적 믹스인과 암시적 믹스인 두 타입이 있다.
    - 그러나 믹스인은 대부분 명시적 의사다형성처럼 보기 싫고 취약한 구문이 되어 가독성이 점점 더 떨어지고 유지 보수도 어려운 코드가 되기 쉽다. 일반적으로 자바스크립트에서 클래스를 모방하는 건 당장 닥친 문제를 해결할 순 있어도 앞으로 터질 시한폭탄을 심는 것과 다름없다.

## 프로토타입

- 자바스크립트 객체는 내부 프로퍼티인 [[Prototype]]이 있고, 이는 다른 객체를 참조하는 단순 레퍼런스로 사용된다.

  - 객체 프로퍼티 참조 시 [[Get]] 이 호출되는데, [[Get]]은 기본적으로 객체 자체에 해당 프로퍼티가 존재하는지 찾아보고 존재하면 그 프로퍼티를 사용한다. 하지만 [[Get]]은 주어진 프로퍼티를 객체에서 찾지 못하면 곧바로 [[Prototype]] 링크를 따라가서 찾는다. 일치하는 프로퍼티명이 나올 때까지 아니면 [[Prototype]] 연쇄가 끝날 때까지 같은 과정이 계속된다. 연쇄 끝(Object.prototype)에 이르러서도 프로퍼티가 발견되지 않으면 [[Get]]은 결괏값으로 undefined를 반환한다.

    ```jsx
    const obj1 = {
        a: 2,
    }

    const obj2 = Object.create(obj1)

    obj2.a // 2
    ```

- 자바스크립트는 클래스라는 추상화된 패턴이나 설계가 전혀 없이, 객체만 있다. 즉, 클래스 없이 곧바로 객체를 생성할 수 있다. 객체는 자신의 작동을 손수 정의한다.
- 자바스크립트는 클래스의 상속과 달리 복사 과정이 없고, 그저 공용 객체에서 [[Prototype]] 으로 연결된 객체가 생성됨으로써 객체들이 서로 끈끈하게 연결되어 있다.
- constructor(생성자)

  - 이 프로퍼티는 인스턴스가 자신의 생성자 함수가 무엇인지를 알고자 할 때 필요한 수단이다.

    ```jsx
    function Foo() {}

    Foo.prototype.constructor === Foo // true

    const a = new Foo()

    a.__proto__ === Foo.prototype // true

    // a에는 constructor 프로퍼티가 없으므로 프로토타입 연쇄를 따라 올라간다.
    a.constructor === a.__proto__.constructor // true
    a.__proto__.constructor === Foo.prototype.constructor // true

    // FFoo.prototype 객체에는 기본적으로 공용 프로퍼티인 constructor가 세팅되는데,
    // 이는 객체 생성과 관련된 함수(Foo)를 다시 참조하기 위한 레퍼런스다.
    Foo.prototype.constructor === Foo // true
    ```

  - Foo.prototype 객체에는 기본적으로 공용 프로퍼티인 constructor가 세팅되는데, 이는 객체 생성과 관련된 함수(Foo)를 다시 참조하기 위한 레퍼런스다.
    - 또한, 생성자 호출(new Foo())로 생성한 객체(a)도 constructor 프로퍼티를 통해 ‘자신을 생성한 함수(Foo)’를 ‘임의로’ 가리킬 수 있다.
      - 하지만 Foo에 의해 생성된 객체(a)에 constructor라는 프로퍼티가 실재하진 않는다. 실은 constructor 역시 Foo.prototype에 위임된 레퍼런스이다. 편리해 보이지만 보안측면에서는 바람직하지 않다.
        - 만약 Foo.prototype이 변경되면 Foo.prototype.constructor가 없어지며 a.constructor는 결국 Object.prototype 객체의 constructor 프로퍼티에 다다르며 내장 Object() 함수를 가리키게 된다. 이처럼 생성자와 프로토타입의 용어 및 관계는 느슨하여 나중에는 부합하지 않을 수 있다.
        - 즉, “생성자”는 “생성됨”을 의미하지 않는다. 임의의 객체 프로퍼티 constructor는 매우 불안정하고 신뢰할 수 없는 레퍼런스이므로 코드에서 직접 사용하지 않는 것이 좋다.
  - Foo는 ‘생성자’가 아닌 그냥 일반함수이며, 앞에 new를 붙여 호출하는 순간 이 함수는 ‘생성자 호출’을 하는 것이다. (new 키워드는 함수 호출의 원래 수행 작업 외에 객체 생성 작업을 추가하는 지시자다)
  - `__proto__` 는 생략 가능한 프로퍼티이다. 따라서 생성자 함수의 prototype에 어떤 메서드나 프로퍼티가 있다면 인스턴스에서도 마치 자신의 것처러 해당 메서드나 프로퍼티에 접근할 수 있다.

- `Object.setPrototypeOf()`

    ```jsx
    // 기존 Bar.prototype을 수정한다
    Object.setPrototypeOf(Bar.prototype, Foo.prototype)
    ```

- `instanceof`

  - instanceof 연산자는 a의 [[Prototype]] 연쇄를 순회하면서 Foo.prototype이 가리키는 객체가 있는지 조사한다.

    - 이는 함수에 대해 주어진 객체의 계통만 확인할 수 있다.
    - 2개의 객체 간의 연결 관계는 확인할 수 없다.
    - 괜스레 클래스와 뭔가 관련이 있는 것 같은 착각을 줄 수 있어 사용하지 않는 편이다.

    ```jsx
    일반객체 instanceof 함수
    a instanceof Foo // true
    ```

- `isPrototypeOf()`

    ```jsx
    // a의 전체 [[Prototype]] 연쇄에서 Foo.prototype이 있는지 확인한다.
    Foo.prototype.isPrototypeOf(a);

    // c의 전체 [[Prototype]] 연쇄에서 b가 있는지 확인한다.
    b isPrototypeOf(c);
    ```

- `Object.getPrototypeOf()`

  - 객체 [[Prototype]]을 조회

    ```jsx
    Object.getPrototypeOf(a) // a.__proto__ 및 Foo.prototype과 같다
    ```

- `__proto__`
  - 던더 프로토라고 불리며, 객체의 [[Prototype]] 링크이다. 프로퍼티처럼 불리지만 객체에 실재하는 프로퍼티가 아니고 게터/세터에 가깝다. (하지만 읽기 전용으로 다루는 것이 최선이다)
- `Object.create()`

  - Object.create()를 통해 새로운 객체(bar)를 생성하고, 주어진 객체(foo)를 새로 생성한 객체(bar)에 연결할 수 있다. 이처럼 이것만으로도 복잡하게 하지 않고도 객체를 연결할 수 있다. 두 객체를 연결하는 데 클래스가 필수인 게 아니다. 객체의 위임 연결만 신경 쓰면 되는데, Object.create()가 클래스 뭉치 없이도 처리할 수 있다.

    ```jsx
    const bar = Object.create(foo)
    ```

- 프로토타입처럼, 어떤 객체를 다른 객체와 연결하면 어떤 이점이 있는가? 왜 이러한 연결망을 구축하려고 한 걸까?
  - 프로토타입 체계는 한 객체가 다른 객체를 참조하기 위한 내부 링크다. 자바스크립트의 무한한 가능성을 이끌어 낼 가장 중요한 핵심 기능이자 실제적인 체계는 전적으로 ‘객체를 다른 객체와 연결하는 것’에서 비롯된다.
- 프로토타입 체인
  - 어떤 데이터의 `__proto__` 프로퍼티 내부에서 다시 `__proto__` 프로퍼티가 연쇄적으로 이어진 것을 프로토타입 체인이라 하고, 이 체인을 따라가며 검색하는 것을 프로토타입 체이닝이라 한다.
  - 모든 생성자 함수는 함수이기 때문에 Function 생성자 함수의 prototype에 연결된다. 즉, 생성자 함수의 최상위 [[Prototype]] 연쇄는 Function.prototype이다.
  - 모든 prototype은 객체이기 때문에 궁극적으로 Object 생성자 함수의 prototype에 연결된다. 즉, 객체의 최상위 [[Prototype]] 연쇄는 Object.prototype이다.
    - 객체 전용 메서드들은 Object.prototype이 아닌 Object에 스태틱 메서드로 부여됐다. 왜냐하면 객체에서만 사용할 메서드를 Object.prototype 내부에 정의하면, 모든 데이터의 최상위 존재이므로 다른 데이터 타입도 해당 메서드를 사용할 수 있게 되기 때문이다.
    - 반대로 toString, hasOwnProperty, valueOf, isPrototypeOf 등은 모든 데이터가 마치 자신의 메서드인 것처럼 호출함 수 있는 범용성이 있어 Object.prototype에 정의됐다.

> 참고자료
>
> - You don't know JS - this와 객체 프로토타입(카일심슨)
> - 코어 자바스크립트(정재남)
