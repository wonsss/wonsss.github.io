---
title: JavaScript의 역사
date: 2022-09-04 23:09:12
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

> - Auth0에서 Sebastian Peyrott의 `A brief history of Javascript` 아티클(2017.1.16. 게시)을 읽고 흥미가 생겨 학습 목적으로 번역해보았습니다.
> - 원글: [https://auth0.com/blog/a-brief-history-of-javascript](https://auth0.com/blog/a-brief-history-of-javascript)

JavaScript는 오늘날 가장 중요한 언어 중 하나이다. 웹의 등장은 JavaScript가 전혀 생각지도 못했던 곳으로 옮겨갔다.

## 모든 것은 90년대에 시작되었다

JavaScript는 1995년 5월부터 12월까지 6개월 만에 개발되었다. Netscape는 초기 웹에서 강한 영향력을 가지고 있었다. Netscape는 90년대 초에 Mosaic 개발에 참여했던 사람들에 의해 설립되었고, 웹을 더 확장할 수 있는 다양한 방법을 찾는 데 필요한 자유를 얻었다. 이러한 과정에서 JavaScript가 탄생되었다.

Netscape의 창립자이자 이전에 Mosaic 팀의 일원이었던 Marc Andreessen은 웹이 보다 역동적으로 변할 수 있는 방법이 필요하다는 비전을 갖고 있었다. 애니메이션, 상호작용 및 기타 형태의 소규모 자동화는 미래 웹의 일부가 되어야 한다고 생각했다. 따라서 웹에서는 DOM과 상호작용할 수 있는 작은 스크립트 언어가 필요했다. 그러나 이러한 스크립트 언어는 그 당시 중요한 전략이었기 때문에 숙력된 개발자만을 타겟팅해서는 안 되었다. Java 역시 증가세를 보였고 Java 애플릿 또한 현실이 될 것이었다. 따라서 웹용 스크립트 언어는 다른 유형의 사용자(ex, 디자이너)에게 맞춰야 했다. 실제로 웹은 정적이었다. 초기 HTML은 개발자가 아닌 사람들도 습득할 수 있을 만큼 간단했다. 따라서 웹을 보다 역동적으로 만들기 위해 브라우저의 일부가 되는 것은 프로그래머가 아닌 사람도 접근할 수 있어야 했다. 그래서 `Mocha`의 아이디어가 탄생했다. `Mocha`는 웹의 스크립트 언어가 될 예정이었다. 단순하고 역동적이며 개발자가 아닌 사람도 쉽게 접근할 수 있는 언어 말이다.

JavaScript를 만든 `Brendan Eich`이 등장하였다. `Eich`은 Netscape와 계약하여 “브라우저를 위한 `Scheme`”을 개발했다. `Scheme`은 `Lisp` 방언이기 때문에 통사적 무게가 거의 없고, 본질적으로 역동적이며 강력하고 기능적이다. 웹에는 다음과 같은 특성을 지닌 기능이 필요했다. 1. 구문적으로 이해하기 쉽다. 2. 장황함을 줄이며 개발 속도를 빠르게 하기 위해 역동성을 지닌다. 3. 강력하다.

`Eich`는 자신이 좋아하는 일을 할 수 있는 기회를 포착하고 함께 하였다.

그 당시에는 가능한 한 빨리 시제품을 제작해야 한다는 압박감이 컸다. 당시 Java 언어인 ‘오크'가 인기를 끌기 시작했다. Sun Microsystems는 이를 강력히 추진하고 있었고, Netscape는 Java를 브라우저에서 사용할 수 있게 하기 위해 Sun Microsystems와 거래를 체결하려고 했다. 그런데 결국 Netscape는 Java라는 대안이 있는데 왜 완전히 새로운 언어인 `Mocha`(JavaScript의 초기 이름)를 만들었을까? 당시에는 Java가 `Mocha`의 타겟 사용자(스크립터, 아마추어, 디자이너)에게 적합하지 않다고 생각했다. Java는 필요한 기능에 비해 너무 컸다. 그래서 Java를 크고 전문적인 컴포넌트 작성 역할에 사용하도록 하는 것이 아이디어였다. 반면 `Mocha`는 작은 스크립트 작업에 사용되었다. 즉, `Mocha`는 Windows 플랫폼의 C/C++와 Visual Basic의 관계와 유사한 방식으로 Java의 스크립트 도우미 역할을 했다.

이러한 과정에서, Netscape의 엔지니어들은 Java에 대해 자세히 연구하기 시작했다. 이들은 자체 Java 가상 머신 개발에 착수하였다. 그러나 이 가상머신은 Sun과 버그 호환성을 완벽하게 달성할 수 없다는 이유로 빠르게 중단되었다.

가능한 빨리 새 언어를 선택해야 한다는 내부 압력이 컸다. Python, Tcl, `Scheme` 자체는 모두 가능한 후보였다. `Eich`는 빠르게 움직여야 했다. 그는 대안들에 비해 두 가지 이점을 갖고 있었다. 바로 적절한 기능 세트를 선택할 수 있는 자유와 결정을 내린 사람들과 직접 연결될 수 있는 것 말이다. 안타깝게도, 그는 시간이 없었다. 많은 중요한 결정들이 내려져야 했고 그러한 결정을 내릴 수 있는 시간이 매우 적었다. JavaScript(전 `Mocha`)는 이런 맥락에서 태어났다. 몇 주만에 작동하는 시제품을 사용할 수 있었고, Netscape에 통합되었다.

브라우저의 `Scheme`이 되기로 했던 것이, 전혀 다른 것으로 변경됐다. Sun과의 거래를 성사시켜야 하고 `Mocha`를 Java의 스크립트 파트너로 만들어야 한다는 압박이 `Eich`을 움직였다. Java와 같은 구문이 필요했고, 익숙한 공통 숙어의 의미론도 채택되었다. 그래서 `Mocha`는 `Scheme`과 전혀 같지 않았다. 역동적인 Java처럼 보였지만, 그 밑에는 전혀 다른 야수가 있었다. Java 외모를 가진 `Scheme`와 `Self`의 미숙아였다.

모카의 원형은 1995년 5월에 Netscape에 통합되었다. 얼마 지나지 않아 `LiveScript`로 이름이 변경되었다. 그 당시 `Live` 라는 말은 마케팅 관점에서 편리했다. 1995년 12월 Netscape와 Sun은 계약을 체결했다. `LiveScript`(전 `Mocha`)는 JavaScript로 이름이 바뀌어 브라우저의 작은 클라이언트 측 업무를 담당하는 언어로 표시되었다. 반면 Java는 풍부한 웹 컴포넌트를 개발하기 위한 더 크고 전문적인 도구로 승격됐다.

이러한 JavaScript의 첫 번째 버전은 오늘날 이 언어가 가지고 있는 많은 특징을 가지고 있었다. 특히 이 첫 번째 버전에는 object-model과 function 기능이 이미 포함되어 있었다.

## 다른 구현

Sun과 Netscape가 `LiveScript`(전 `Mocha`)의 이름을 JavaScript로 변경하는 계약을 체결했을 때, 큰 의문이 제기되었다. 대체 어떻게 구현하는가? 사실 Netscape는 당시에 빠르게 인기를 얻고 있는 브라우저였지만, 인터넷 익스플로어 또한 마이크로소프트에 의해 개발되고 있었다. 처음부터 JavaScript는 사용자 경험에서 상당한 차이를 만들었고, 경쟁 브라우저들은 JavaScript를 따라갈 수밖에 없었다. 그 시점에는(그리고 오랫동안) 웹 표준이 강하지 않았다. 그래서 마이크로소프트는 `JScript`라고 불리는 자체 버전의 JavaScript를 구현했다. “Java”를 이름에 붙이지 않도록 함으로써 상표권 문제를 피했다. 그러나 `JScript`는 이름뿐만이 아니었다. 특히 구현 상 약간의 차이(특정 DOM 기능에 관한)는 향후에도 여전히 느낄 수 있는 파장을 일으켰다. JavaScript 전쟁은 단순히 이름을 넘어 많은 부분에서 벌어졌고, 많은 기이한 점들은 이러한 전쟁의 상처이다. `JScript`의 첫 번째 버전은 1996년 8월에 출시된 인터넷 익스플로어 3.0에 포함되었다.

Netscape의 JavaScript 구현체도 이름을 받았다. Netscape Navigator 2.0과 함께 출시된 버전은 `Mocha`로 알려져 있다. 1996년 가을, `Eich`는 급하게 만들면서 발생한 기술적 부채를 갚기 위해 `Mocha`를 더 깔끔한 버전으로 구현하였다. Netscape의 JavaScript 엔진의 이 새로운 버전은 `SpiderMonkey`라고 불렸다. `SpiderMonkey`는 Netscape Navigator의 후손인 Firefox에 여전히 내장된 JavaScript 엔진의 이름이다.

수년간 `JScript`와 `SpiderMonkey`는 최고의 JavaScript 엔진이었다. 양쪽에서 구현되는 기능(항상 호환성이 있는 것은 아니지만)은 향후 웹의 장래를 정의하게 된다.

## 주요 설계 특징

JavaScript는 서둘러 탄생했지만, 처음부터 몇 가지 강력한 기능들이 포함되어 있었다. 이러한 기능을 통해 JavaScript는 언어로서 정의되며, 특이한 점에도 불구하고 벽으로 둘러싸인 정원을 벗어날 수 있었다.

### Java와 같은 구문

Java와 비슷한 구문을 유지하는 것이 JavaScript의 고유 아이디어는 아니었지만, 마케팅 세력이 이를 바꿨다. 돌이켜보자면, 비록 특정 기능에 다른 문법이 더 편리할 수도 있지만, 친숙한 문법이 JavaScript가 쉽게 인기를 얻게 해주는 데 도움을 주었다는 것은 부정할 수 없다.

Java의 예시

```java
public class Sample {
  public static void main(String[] args) {
    System.out.println("Hello world!");
    try {
      final MissileSilo silo = new MissileSilo("silo.weapons.mil");
      silo.launchMissile(args[0]);
    } catch(Exception e) {
      System.out.println("Unexpected exception: " + e);
    }
  }
}
```

(modern) JavaScript의 예시

```jsx
console.log('Hello world')
try {
  const silo = new MissileSilo('silo.weapons.mil')
  silo.launchMissile(process.argv[0])
} catch (e) {
  console.log('Unexpected exception' + e)
}
```

## 일급 객체인 Function

JavaScript에서 함수는 단순히 객체 타입 이상인 것이다. 함수는 다른 요소처럼 전달될 수 있다. 또한, 변수에 바인딩될 수도 있고, 이후 버전의 JavaScript에서는, 함수가 예외로 던져질 수도 있다. 이러한 기능은 `Scheme`이 JavaScript 개발에 미친 강력한 영향의 결과일 수 있다.

```jsx
var myFunction = function() {
  console.log('hello')
}
otherFunction(myFunction)
myFunction.property = '1'
```

함수를 일급 객체로 만들면 특정 함수형 프로그래밍 패턴이 가능하다. 예를 들어 이후 버전의 JavaScript는 특정 기능 패턴을 사용한다.

```jsx
var a = [1, 2, 3]
a.forEach(function(e) {
  console.log(e)
})
```

이러한 패턴은 underscore 및 immutable.js와 같은 많은 라이브러리에서 큰 성공을 거두었다.

## Prototype 기반 객체 모델

`Prototype` 기반 객체 모델은 JavaScript에 의해 대중화되었지만, 처음 도입한 것은 `Self` 언어이다. `Eich`는 이 모델에 대한 강한 선호도가 있었다. Prototype 기반 객체 모델은 Java 또는 C++와 같은 `Simula` 기반 언어에 대한 전통적 접근방식을 모델링할 수 있을 만큼 강력한다. 사실, JavaScript의 최신 버전에서 구현된 `Class`는 `Prototype` 시스템 위에 있는 문법적 설탕에 불과하다.

JavaScript의 `Prototype`에 영감을 준 언어인 `Self`의 디자인 목표 중 하나는 `Simula` 스타일의 객체들이 지닌 문제를 피하는 것이었다. 특히, `Class`와 인스턴스 사이의 이분법은 `Simula`의 접근법에 내재된 많은 문제의 원인으로 간주되었다. `Class`가 객체의 인스턴스에 원형(archetype)을 제공하는데, 코드가 진화하고 커짐에 따라 이러한 기본 `Class`를 예기치 않은 새로운 요구사항에 조화하도록 하는 것이 점점 더 어려워진다는 주장이 제기되었다. 인스턴스를 새로운 객체를 구성할 수 있는 원형으로 만들면 이러한 한계가 사라질 수 있다. 따라서 `Prototype`의 개념은 자체 행동을 제공함으로써 새 인스턴스의 간격을 채우는 것이었다. `Prototype`이 새로운 객체에 부적합하다고 간주될 경우, 그것은 다른 모든 하위 인스턴스에 영향을 주지 않고 간단히 복제 및 수정될 수 있다. 이것은 `Class` 기반 접근(i.e. base Class 수정)에서는 불가하다.

```jsx
function Vehicle(maxSpeed) {
  this.maxSpeed = maxSpeed
}

Vehicle.prototype.maxSpeed = function() {
  return this.maxSpeed
}

function Car(maxSpeed) {
  Vehicle.call(this, maxSpeed)
}

Car.prototype = new Vehicle()
```

`Prototype`의 힘은 JavaScript를 매우 유연하게 만들었고, 자체 `Prototype` 기반 객체 모델을 사용하여 많은 라이브러리의 개발의 꽃을 피우게 했다. 인기있는 라이브러리인 `Stampit`은 객체를 확장하고 조작하기 위해 전통적인 `Class` 기반 접근법으로는 불가능한 방식인 `Prototype` 시스템을 많이 사용한다.

`Prototype`은 JavaScript를 믿을 수 없을 정도로 단순하게 보기에 만들어, 라이브러리 개발자들에게 큰 힘을 실어주었다.

### 큰 문제: 원시값 vs 객체

아마도 JavaScript 개발을 서두름으로써 발생한 가장 큰 실수 중 하나는 JavaScript가 비슷하게 동작하는 특정 객체에 다른 타입을 갖게 한 것이다. 예를 들어 string literal(`”Hello World"`)의 타입은 String 객체(`new String(’Hello World’)`)의 타입과 같지 않다. 이로 인해 불필요하고 혼란스러운 type check가 종종 강제된다.

```jsx
> typeof "hello world"
< "string"

> typeof new String('hello world')
< "object"
```

그러나 이것은 JavaScript 역사의 시작에 불과했다. 성급하게 빨랐던 개발은 몇 가지 설계 실수를 초래했다. 하지만 동적 웹을 위한 언어를 갖는 것의 이점은 미룰 수 없었고, 역사가 되었다.

## Memory Lane: Netscape Navigator 2.0 및 3.0의 개요

JavaScript의 첫 번째 공개 릴리스는 1995년 출시된 Netscape Navigator 2.0에 통합되었다. virtualization과 abandonware 웹사이트들의 경이로운 기능 덕분에, 오늘날 이러한 순간이 부흥할 수 있었다.

불행히도 JavaScript의 많은 기본 기능들은 그 당시에 작동하지 않았다. 익명 기능과 `Prototype` 체인, 두 개의 가장 강력한 기능들은 당시에는 오늘날처럼 작동하진 않았다. 여전히, 이러한 기능들은 이미 언어 설계의 일부였으며, 이후 몇 년 동안 올바르게 구현될 것이었다. 이 릴리스의 JavaScript 인터프리터는 알파 버전 상태로 간주되었다는 점을 주목해야 한다.

다행히도 1년 후, 1996년에 출시된 Netscape Navigator 3.0은 큰 변화를 가져오고 있었다.

<video style="width: 100%;" controls=""><source type="video/mp4" src="https://cdn.auth0.com/blog/js-history/netscape3.mp4"/></video>

```jsx
alert('Hello world!')

function says() {
  alert('hello')
}

function hello() {}

// 에러 해결 위해 추가한 코드
// 지금은 없어도 작동한다.
// hello.prototype = new Object();
hello.prototype.say = says

function test() {
  this.value = 1
}

test.prototype = new hello()

var a = new test()
alert(a.value)
a.say()

// alert 창이 "Hello World!" "1" "hello" 순으로 표시
```

<video style="width: 100%;" controls=""><source type="video/mp4" src="https://cdn.auth0.com/blog/js-history/netscape3.mp4"></video>

이 에러(는 당시 어떤 문제가 있었는지 알려준다. 인터프리터가 `Prototype` 프로퍼티를 특별한 방법으로 다루고 있음을 추측할 수 있다. 그래서 그 객체를 기본 `Object` 로 대체한다.

```jsx
hello.prototype = new Object()
```

이렇게 하면 아무튼 적어도 작동하게 된다. `test` 함수 내부의 할당은 아무 것도 하지 않은 것 같다. 분명히 개선되어야 할 것이 많다. 그럼에도 불구하고, 알파 버전의 JavaScript는 많은 작업에 사용할 수 있었고 그 인기는 계속 증가했다.

정규 표현식, JSON 및 예외와 같은 기능은 여전히 사용할 수 없었다. JavaScript는 그 후 몇 년 동안 엄청나게 발전했다.

## ECMA Script: 표준으로서의 JavaScript

공개 이후 JavaScript의 첫 번째 변화는 ECMA 표준화의 형태로 이루어졌다. `ECMA`는 정보 및 통신 시스템의 표준화만을 목적으로 1961년에 결성된 산업 협회이다.

JavaScript의 표준 작업은 1996년 11월에 시작되었다. 이 표준의 식별자는 `ECMA-262`였고, 담당 위원회는 `TC-39`였다. 당시, JavaScript는 이미 많은 웹 페이지에서 인기있었다. 1996년 보도자료에 따르면, JavaScript의 페이지 수가 30만 페이지였다.

표준화는 신생 언어에게 중요한 단계였지만, 그럼에도 불구하고 커다란 요구이기도 했다. 이는 JavaScript를 더 많은 사용자에게 개방했으며, 이 언어의 진화 속에서 다른 잠재적 구현자들에게 발언권을 제공했다. 그것은 또한 다른 구현체를 견제하는 목적도 있었다. 그 당시에는, 마이크로소프트나 다른 기업들이 기본 구현으로부터 너무 멀리 떨어져 분화를 일으킬 우려가 있었다.

상표상의 이유로, ECMA 위원회는 JavaScript를 이름으로 사용할 수 없었다. 제시된 대안 역시 많은 사람들이 좋아하지 않았기 때문에, 약간의 논의 끝에 표준에서 기술된 언어를 `ECMAScript라고 부르기로 결정했다. 현재 JavaScript는`ECMAScript의 상업적 이름일 뿐이다.

## ECMAScript 1 & 2: 표준화로 가는 길

첫 번째 `ECMAScript 표준은 Netscape Navigator 4와 함께 출시된 JavaScript 버전을 기반으로 하며, 중요한 기능(정규 표현, JSON, 예외 및 내장 객체에 대한 중요한 메서드 등과 같은)을 여전히 놓치고 있었다. 하지만 브라우저에서는 훨씬 더 잘 작동하고 있었다. JavaScript는 점점 더 좋아지고 있었다. 버전 1은 1997년 6월에 출시되었다.

<video style="width: 100%;" controls=""><source type="video/mp4" src="https://cdn.auth0.com/blog/js-history/netscape4.mp4"></video>

위 동영상에서 `Prototype` 및 기능에 대한 간단한 테스트가 올바르게 작동하는지 확인할 수 있다. Netscape 4에서는 많은 직업이 진행되었고, JavaScript는 이로부터 많은 이점을 얻었다. 위 예시에서 보다시피 현재 브라우저와 동일하게 작동한다. 이것은 표준으로서 첫 번째 릴리즈의 훌륭한 상태이다.

ECMA와 JavaScript용 ISO 표준(ISO/IEC 16262) 간의 불일치를 수정하기 위해, 두 번재 버전의 표준 `ECMAScript 2`가 출시되었다. 따라서 언어에 대한 변경은 없었다. 그것은 1998년 6월에 릴리즈되었다.

이 버전의 JavaScript에서 흥미로운 점은 컴파일 시 검출되지 않은 오류는 인터프리터의 변덕에 맡겨진다는 것이다. 이는 예외가 아직 언어의 일부가 아니었기 때문이다.

## ECMAScript 3: 첫 번째 큰 변화

`ECMAScript 2` 이후에도 작업이 계속되었고 언어의 첫 번째 큰 변화가 빛을 보게 되었다. 이 버전에는 다음 기능이 포함되었다.

- 정규 표현
- do-while
- 예외 및 try/catch
- string과 array를 위한 내장 함수
- 숫자 출력 형식
- `in` 과 `instanceof` 연산자
- 훨씬 뛰어난 에러 핸들린

`ECMAScript 3`은 1999년 12월에 출시되었다.

이 버전의 `ECMAScript는 널리 퍼져 있다. 당시 모든 주요 브라우저에서 지원되었으며 수년 후에도 계속 지원되었다. 오늘날에도 일부 트랜스파일러는 결과물을 만들 때 이 버전의`ECMAScript를 타겟으로 할 수 있다. 그 결과 `ECMAScript 3` 는 많은 라이브러리의 기준선 타겟이 되었고, 심지어 표준의 후기 버전에서도 마찬가지였다.

JavaScript는 그 어느 때보다 많이 사용되었지만, 여전히 주로 클라이언트 측 언어였다. 많은 새로운 기능들은 클라이언트 철창에서 탈출하는 시점을 앞당기고 있었다.

Netscape Navigator 6은 2000년 11월에 출시되었으며 이전 버전에서 크게 변경되었다. `ECMAScript 3`을 지원했다. 거의 1년 반 후에, Netscape Navigator의 코드 베이스에 근거하는 군더더기 없는 브라우저인 Firefox가 출시되었고, 역시 `ECMAScript 3`를 잘 지원했다. 이러한 브라우저는 Internet Explorer와 함께 JavaScript의 성장을 계속 추진했다.

### AJAX의 탄생

AJAX(Asynchronous JavaScript and XML)는 `ECMAScript 3`에서 탄생한 기술이다. 표준에는 포함되지 않았지만, 마이크로소프트는 인터넷 익스플로어 5 브라우저용 JavaScript에 대한 특정 확장을 구현했다. 그 중 하나가 `XMLHttpRequest` 기능(XMLHTTP ActiveX control 형식)이다. 이 기능을 통해 브라우저는 서버에 대해 비동기 HTTP 요청을 수행할 수 있으며, 따라서 페이지를 즉시 업데이트 할 수 있었다. AJAX라는 용어는 몇 년이 지나서야 작명되어 붙여졌지만, 기술은 그 당시부터 있었다.

`XMLHttpRequest` 는 성공을 거두었고 수년 후 별도의 표준(WHATWG 및 W3C 그룹)으로 통합되었다.

언어에 흥미로운 것을 가져와서 브라우저에 구현하는 이러한 기능의 진화는 여전히 JavaScript와 HTML 및 CSS와 같은 관련 웹 표준이 계속 밪런한느 방식이다. 그러나 그 당시에는 이해관계자들 간의 의사소통이 훨씬 적었고, 이로 인해 지연과 분열이 초래됐다. 오늘날 JavaScript 개발은 이해관계자들이 제안서를 제출하는 절차와 함께 훨씬 조직화되었다.

### Netscape Navigator 6

이 릴리스는 exception을 지원한다. 이전 버전에서는 구글 웹 사이트에 접근하려고 할 때 어려움을 겪었다. 이 버전에서는 구글에 접속하려고 하면, 오늘날에도 볼 수 있는 페이지가 나타난다. 반대로 우리는 Netscape Navigator 4를 사용하여 구글에 접속하려고 했지만, exception의 부족, 불완전한 렌더링, 잘못된 레이아웃으로 인해 충돌이 발생했다. 그 당시에도 웹은 빠르게 움직이고 있었다.

### Internet Explorer 5

`Internet Explorer 5`는 구글의 현재 버전도 렌더링할 수 있었다. 그러나 Internet Explorer 5와 다른 브라우저 간에 특정 기능의 구현에서 많은 차이가 있었다. 이러한 차이점들은 수년간 웹을 괴롭혔고, 인터넷 익스플로어 사용자들을 위해 특별한 케이스를 구현해야 했던 웹 개발자들에게 오랫동안 좌절의 원인이 되었다.

실제로 Internet Explorer 5와 6에서 `XMLHttpRequest` 객체는 ActiveX에 의존했다. 다른 브라우저에서는 native(기본) 객체로 구현했던 것과는 다르게 말이다.

```jsx
var xhr = new ActiveXObject('Microsoft.XMLHTTP')
```

틀림없이, 그 아이디어를 먼저 내놓은 것은 `Internet Explorer 5` 였다. 버전 7이 되어서야 마이크로소프트는 표준과 합의를 보다 면밀히 따르기 시작했다. 일부 오래된 기업 사이트에서는 `Internet Explorer` 가 올바르게 실행되기 위해 이전 버전이 여전히 필요하다.

## `ECMAScript 3.1 및 4: 고군분투의 해

불행히도, 그 다음 해는 JavaScript 개발에 좋지 않았다. `ECMAScript 4`에 대한 작업이 시작되자마자 위원회에서 큰 차이가 나타나기 시작했다. 대규모 애플리케이션 개발을 위한 강력한 언어가 되기 위해서는 JavaScript에 기능이 필요하다고 생각하는 사람들이 있었다. 이 그룹은 범위와 변경 사항이 큰 많은 기능을 제안했다. 다른 이들은 이것이 JavaScript에 적합한 과정이 아니라고 생각하기도 했다. 합의가 결여되었고 일부 제안된 기능의 복잡성으로 인해 `ECMAScript 4`의 출시는 점점 더 멀어졌다.

`ECMAScript 4`에 대한 작업은 1999년에 버전 3이 출시되자마자 시작되었다. Netscape에서는 많은 흥미로운 기능들이 내부적으로 논의되었다. 그러나 이러한 구현에 대한 관심이 감소하여 2003년에 `ECMAScript`의 새 버전에 대한 작업이 중단되었다. 중간 보고서가 발표되었으며, Adobe(`ActionScript`) 및 마이크로스프트(`JScript.NET`) 와 같은 일부 구현자는 그것을 그들의 엔진의 기반으로 사용했다. 2005년에는 AJAX와 XMLHttpRequest의 파급력이 새 JavaScript 버전에 대한 흥미를 일으켰고, `TC-39`는 작업을 재개했다. 세월이 흐르면서 기능들은 점점 더 커졌다. 개발이 한창일 때 `ECMAScript 4`에는 다음과 같은 기능이 있었다.

- Classes
- Interfaces
- Namespaces
- Packages
- Optional type annotations
- Optional static type checking
- Structural types
- Type definitions
- Multi methods
- Parameterized types
- Proper tail calls
- Iterators
- Generators
- Introspection
- Type discriminating exception handlers
- Constant bindings
- Proper block scoping
- Destructuring
- Succinct function expressions
- Array comprehensions

`ECMAScript 4` 초안에는 이 새로운 버전이 대규모 프로그래밍을 목적으로 기술되었다. `ECMAScript 6(2015)`에 이미 익숙하다면, `ECMAScript 4`의 많은 기능이 `ECMAScript 6`에 다시 도입된 것임을 알 수 있다.

> ES3의 추상화 기능은 유연하고 형식적으로 강력하지만 실제로 대규모 소프트웨어 시스템 개발에 적합하지 않은 경우가 많다. ECMAScript 프로그램은 웹에서 AJAX 프로그래밍을 채택하고 ECMAScript를 응용 프로그램에서 확장 및 스크립팅 언어로 광범위하게 사용함에 따라 점점 더 커지고 복잡해지고 있다. 대형 프로그램의 개발은 static type checking, name hiding, early binding, 다른 최적화 훅, 그리고 객체 지향 프로그래밍에 대한 직접적 지원과 같은 기능으로부터 큰 이점을 얻을 수 있다. 그러나 이러한 기능들은 ES3에 아직 부재하다. - ECMAScript 4 초안

`ECMAScript 4`를 개발하던 위원회는 Adobe, Mozilla, Opera(비공식 자격) 및 Microsoft로 구성되었다. Yahoo는 대부분의 표준과 기능이 이미 결정되었기 때문에 게임에 참여했다. 영향력 있는 JavaScript 개발자인 `Douglas Crockford`는 이를 위해 Yahoo에 의해 위원회로 파견되었다. 그는 `ECMAScript 4`에 대해 제안된 많은 변경에 대해 강한 반대 입장을 표명했다. 그는 마이크로소프트 대표로부터 강력한 지지를 받았다. `Crockford` 본인의 말을 빌리면,

> “그러나 MS의 멤버도 비슷한 우려를 가지고 있는 것으로 밝혀졌다. 그는 MS의 언어가 너무 커져서 통제 불능이라고 생각했다. 그는 제가 그룹에 가입하기 전에는 아무 말도 하지 않았다. MS가 이 일을 방해하려고 하면 반경쟁적인 행동으로 비난받을까봐 걱정했기 때문이다. MS의 과거 행정에 근거해보면, 그들이 이것에 대해 염려할 만한 몇 가지 타당한 근거가 있을지도 모른다. 그리고 그러한 우려는 충분히 근거가 있는 것으로 판명되었다. 왜냐하면 그 일이 일어났기 때문이다. 하지만 저는 MS가 옳은 일을 해야 한다고 설득했고, 그는 그렇게 하기로 결심했고, MS도 그렇게 해야 한다고 설득할 수 있었다. 그래서 MS는 ES4에 대한 입장을 바꿨다. - `Douglas Crockford` - The State and Future of JavaScript

처음에는 의심으로 시작되었지만, 곧 JavaScript에 대한 강경하나 입장이 되었다. 마이크로소프트는 `ECMAScript 4`의 어떤 부분도 받아들이지 않았으며, 표준이 승인되지 않도록 하기 위해 필요한 모든 조치를 취할 준비(심지어 법적 조치까지)가 되어 있었다. 다행히, 위원회의 사람들이 법적 투쟁을 가까스로 막아낼 수 있었다. 그러나 합의의 부재는 `ECMAScript 4`의 발전을 막았다.

`Crockford`는 새로운 표준에 대해 보다 단순하고 축소된 기능 세트의 아이디어를 추진했다. 모두가 동의할 만한 것이었다. 새로운 구문은 없고, 해당 언어 사용 경험에서 비롯된 실용적인 개선뿐이었다. 이 제안은 `ECMAScript 3.1`로 알려지게 되었다.

한 동안 두 기준이 공존했고, 두 개의 비공식 위원회가 설치되었다. 그러나 `ECMAScript 4`는 불일치에 직면하여 완료하기에는 너무 복잡했다. `ECMAScript 3.1`은 훨씬 더 단순했고 ECMA의 어려움에도 불구하고 완성되었다.

`ECMAScript 4`의 종료는 2008년에 이루어졌다. 그 때, `Eich`는 `ECMAScript`와 버전 3.1 및 4의 미래에 대해 자세히 설명하는 Oslo 회의의 요약이 포함된 이메일을 보냈다.

그 회의의 결론은 다음과 같다.

1. 모든 당사자의 완전한 협업을 통해 ES3.1에 초점을 맞추고 내년 초까지 상호 운용 가능한 두 가지 구현을 목표로 한다.
2. ES3.1 이후의 다음 단계에 대해 공동 작업을 한다. ES3.1은 구문 확장을 포함하지만 ES4보다 의미적 및 구문적 혁신 모두에서 더 현대적일 것이다.
3. 몇 ES4 제안(packages, namespaces, early binding)은 웹에 불건전하다고 간주되며, 영원히 논의되지 않고 있다. 이 결론은 Harmony의 핵심이다.
4. ES4의 다른 목표와 아이디어는 위원회의 합의를 유지하기 위해 대체되고 있다. 이들 개념에는 제안된 ES3.1 확장과 결합된 기존 ES3 개념에 기초한 `Class` 개념이 포함된다.

`ECMAScript 4`는 모두 8년 가까이 개발되어 최종적으로 폐기되었다. 관련된 사람들에게 힘든 교훈이 되었다.

위의 결론에 “Harmony”라는 단어가 나타난다. 이것은 프로젝트가 향후 JavaScript 확장을 위해 받은 이름이다. `Harmony`는 모두가 동의할만한 대안이 될 것이다. `ECMAScript 3.1`(아래에서 보듯이 버전 5의 형태로)이 출시된 후 `ECMAScript Harmony`는 JavaScript에 대한 새로운 아이디어가 모두 논의되는 장소가 되었다.

### ActionScript

`ActionScript`는 `ECMAScript 4`의 초기 초안을 기반으로 한 프로그래밍 언어이다. Adobe는 Flash suite 애플리케이션의 부분으로서 `ActionScript`를 구현하였고, `ActionScript`는 Adobe에 의해서만 유일하게 지원되었다. 이는 Adobe가 `ECMAScript 4`의 도입을 가속화하 하기 위해 오픈 소스(Tamarin)로서 엔진을 공개하는 것까지, `ECMAScript 4`의 도입을 강하게 지지하게 되었다. 이러한 문제에 대한 흥미로운 견해가 Adobe 직원이었던 Mike Chambers에 의해 공개되었다.

`ActionScript` 개발자들은 `ActionScript`에서의 혁신이 `ECMAScript`의 기능에 영향을 줄 것을 희망했다. 불행히도 이는 결코 사실이 되지 않았고, `ECMAScript 2015`에 이르러서는 `ActionScript`가 많은 면에서 호환되지 않았다.

일부는 이 움직임을 마이크로소프트가 언어와 구현을 계속 통제하기 위한 시도로 보았다. 당시 `ECMAScript 4`에 대한 유일한 엔진은 Tamarin 뿐이었기 때문에, 브라우저 시장 점유율의 80% 가량을 차지했던 마이크로소프트는 경쟁사의 대체 엔진으로 전환하거나 사내에서 모든 것을 구현하는 데 시간을 들이지 않고도 자체 엔진을 계속 사용할 수 있었다. 다른 사람들은 단순히 마이크로소프트이 반대는 야후의 반대처럼 단지 기술적인 것에 불과했다고 말한다. 이 시점에 마이크로소프트의 엔진인 `JScript`는 다른 구현체와 달리 많은 차이점이 있었다. 어떤 사람들은 이것을 은밀한게 언어를 통제하기 위한 방법으로 봐왔다.

`ActionScript`는 HTML5의 등장으로 서서히 인기가 시들해진 플래시의 언어로서 오늘날에도 남아 있다.

`ActionScript`는 만약 `ECMAScript 4`가 인기 있는 JavaScript 엔진으로서 구현됐다면 남아 있을 형태와 가장 가까운 모습으로 남아 있다.

```java
package {
    import flash.display.Sprite;
    public class MyRectangle_v3 extends Sprite {
        private var _outlineWeight:Number;
        private var _color:uint;
        private var _xLocation:int;
        private var _yLocation:int;
        private var _rectangleWidth:int;
        private var _rectangleHeight:int;

        public function MyRectangle_v3(outlineWeight:Number, color:uint,
                                       xLocation:int, yLocation:int,
                                       rectangleWidth:int, rectangleHeight:int) {
            _outlineWeight = outlineWeight;
            _color = color;
            _xLocation = xLocation;
            _yLocation = yLocation;
            _rectangleWidth = rectangleWidth;
            _rectangleHeight = rectangleHeight;
        }

        public function draw():void{
            graphics.lineStyle(_outlineWeight);
            graphics.beginFill(_color);
            graphics.drawRect(_xLocation, _yLocation, _rectangleWidth, _rectangleHeight);
            graphics.endFill();
        }
    }
}
```

### E4X? E4X가 무엇인가?

E4X는 `ECMAScript`의 extension의 이름이다. `ECMAScript 4` 개발(2004년) 기간 중에 출시되었기 때문에 E4X라는 별칭이 붙여졌다. 공식 명칭은 `ECMAScript for XML` 이며 `ECMA-357`로 표준화되었다. E4X는 `ECMAScript`를 확장하여 XML 콘텐츠의 네이티브 처리 및 구문 분석을 지원한다. XML은 E4X에서 네이티브 데이터 유형으로 취급된다. `SpiderMonkey` 등 주요 JavaScript 엔진에서 초기 채택되는 것처럼 보였으나 사용 부족으로 인해 나중에 폐기되었다. Firefox 버전 21에서 삭제되었다.

E4X는 이름에 “4”라는 숫자가 붙여진 것을 제외하고는 `ECMAScript 4`와 거의 관련이 없다.

E4X가 테이블을 가져오는 데 사용한 샘플

```java
var sales = <sales vendor="John">
    <item type="peas" price="4" quantity="6"/>
    <item type="carrot" price="3" quantity="10"/>
    <item type="chips" price="5" quantity="3"/>
  </sales>;

alert( sales.item.(@type == "carrot").@quantity );
alert( sales.@vendor );
for each( var price in sales..@price ) {
  alert( price );
}
delete sales.item[0];
sales.item += <item type="oranges" price="4"/>;
sales.item.(@type == "oranges").@quantity = 4;
```

다른 데이터 형식(ex, JSON)이 JavaScript 커뮤니티에서 더 폭넓게 수용되고 있으므로 자연스레 사라졌다.

## ECMAScript 5: JavaScript의 부활

`ECMAScript 4`에서의 오랜 어려움 끝에, 2008년부터 커뮤니티는 `ECMAScript 3.1`에 초점을 맞췄고 `ECMAScript 4`는 폐기되었다. 2009년에 `ECMAScript 3.1`이 완성되어 모든 이해관계자에 의해 승인되었다. `ECMAScript 4`는 `ECMAScript`의 특정 변형으로 이미 인식되었기 때문에, 위원회는 혼란을 피하기 위해 `ECMAScript 3.1`을 `ECMAScript 5`로 개명하기로 결정했다.

`ECMAScript 5`는 JavaScript의 가장 지원되는 버전 중 하나가 되었고 많은 트랜스파일러들의 컴파일 대상이 되었다. `ECMAScript 5는 Firefox 4(2011), Chrome 19(2012), Safari(2012), Opera 12.10(2012) 및 Internet Explorer 10(2012)에서 완전히 지원되었다.

`ECMAScript 5`는 `ECMAScript 3에 대한 다소 가벼운 엡딩트로서 다음과 같은 내용을 포함하고 있다.

- Getter/setters
- 배열과 객체 리터럴에서 Trailing commas
- 프로퍼티 이름으로서 예약어
- 신규 `Object` 메서드 (`create`, `defineProperty`, `keys`, `seal`, `freeze`, `getOwnPropertyNames`, etc.)
- 신규 `Array` 메서드 (`isArray`, `indexOf`, `every`, `some`, `map`, `filter`, `reduce`, etc.)
- `String.prototype.trim` 과 프로퍼티 접근자
- 신규 `Date` 메서드 (`toISOString`, `now`, `toJSON`)
- `bind` 함수
- JSON
- 불변 전역 객체 (`undefined`, `NaN`, `Infinity`)
- Strict mode
- 다른 사소한 변화(`parseInt`  관련 등)

구문적으로 변경이 필요한 변화는 없었다. Getters와 Setters는 당시 다양한 브라우저에서 이미 비공식적으로 지원되고 있었다. 새로운 `Object` 메서드는 프로그래머에게 특정 불변성을 확실히 적용할 수 있는 더 많은 도구(`Object.seal`,`Object.freeze`,`Object.create`)를 제공함으로써 “대규모 프로그래밍”을 개선하였다. Strict mode도 오류 발생원인을 많이 방지하여 이 영역에서 강력한 도구가 되었다. `Array` 의 추가 메서드들은 특정 함수적 패턴(map, reduce, filter, every, some) 을 개선했다. 또다른 큰 변화는 `JSON` 이다. JSON은 JavaScript에서 영감을 받은 데이터 포맷으로서 현재 `JSON.stringify` 그리고 `JSON.parse` 를 통해 기본적으로 지원되고 있다. 다른 변경사항은 실제 경험을 바탕으로 몇 가지 부분에서 약간의 개선된 것이다. `ECMAScript 5`는 소규모 스크립트 및 대규모 프로젝트 모두에서 JavaScript가 보다 사용하기에 좋은 언어가 되도록 돕는 약간의 개선사항이다. 그래도, 폐기된 `ECMAScript 4`에는 좋은 아이디어가 많았으므로, `ECMAScript Harmony` 제안을 통해 돌아올 것이다.

`ECMAScript 5`는 2011년에 `ECMAScript 5.1`의 형태로 또 다른 반복을 보았다. 이 릴리스에서는 표준에서 애매한 점을 명확히 했지만 새로운 기능은 제공하지 않았다. 새로운 기능은 모두 `ECMAScript`의 다음 큰 릴리스로 예정되어 있다.

## `ECMAScript 6 (2015) & 7 (2016) : 범용 언어

`ECMAScript Harmony` 제안은 향후 JavaScript의 개선을 위한 중심 허브가 되었다. `ECMAScript 4`의 많은 아이디어들이 영원히 사라지긴 했지만, 몇 아이디어들은 새로운 마인드셋과 함께 다시 나타났다. `ECMAScript 6`는 나중에 `ECMAScript 2015`로 이름이 변경되며 큰 변화를 가져올 예정이었다. 구문 변경이 필요한 거의 대부분의 모든 변경은 이 버전으로 되돌려졌다. 그러나 이번에 위원회는 통합을 이루며 2015년에 `ECMAScript 6`가 마침내 출시되었따. 많은 브라우저 벤더들이 이미 그 기능을 구현하기 위해 노력하고 있었지만, 큰 변경으로 인해 시간이 걸렸다. 오늘날에도, 모든 브라우저가 `ECMAScript 2015`를 완전히 커버하고 있는 것은 아니다(하지만 거의 다 커버해 가고 있다).

`ECMAScript 2015`의 출시로 인해 `Babel`이나 `Traceur`과 같은 트랜스파일러의 사용이 크게 증가했다. 출시 전부터, 이러한 트랜스파일러들이 기술 위원회의 진행상황을 추적하면서 사람들은 이미 `ECMAScript 2015`의 많은 이점을 경험하고 있었다.

`ECMAScript 4`의 주요 기능 중 일부는 이 버전의 `ECMAScript`에서 구현되었다. 그러나 그것들은 다른 마인드셋으로 구현되었다. 예를 들어, `ECMAScript 2015`의 `Class`는 `Prototype` 위에 문법적 설탕을 얹은 것에 지나지 않다. 이러한 마인드셋은 새로운 기능의 변천과 개발을 용이하게 한다.

ECMAScript 2015의 신기능에 대한 자세한 내용은 [JavaScript 2015의 기능에 대한 개요](https://auth0.com/blog/a-rundown-of-es6-features/) 아티클에서 다루었다. 또한 [ECMAScript 호환성 표](http://kangax.github.io/compat-table/es6/)를 참조하여 현재 구현 사앹에 대해 파악할 수 있다.

새 기능에 대한 간략한 요약은 다음과 같다.

- Let (lexical) 과 const (unrebindable) 바인딩
- 화살표 함수 (짧은 익명 함수), lexical this (enclosing scope this)
- Classes (Prototype 위에 있는 문법적 설탕)
- Object literal 개선사항(computed keys, shorter method definitions, etc.)
- Template strings
- Promises
- Generators, iterables, iterators, for..of
- 함수의 기본값 매개변수, 나머지 연산자
- Spread 구문
- Destructuring
- Module syntax
- New collections (Set, Map, WeakSet, WeakMap)
- Proxies, Reflection
- Symbols
- Typed arrays
- subclassing built-ins에 대한 지원
- Guaranteed tail-call optimization
- 단순화된 Unicode 지원
- 2진 literal과 8진 literal

Class, let, const, promise, generator, iterator, module 등 이러한 기능은 모두 JavaScript를 더 많은 개발자에게 제공하고 대규모 프로그래밍을 지원하기 위한 것이다.

`ECMAScript 4`가 실패했을 때 많은 기능이 표준화 프로세스를 통과할 수 있었다는 것이 놀라운 일이다. 그런 의미에서, `ECMAScript 4`의 가장 잘 스며든 기능들의 대부분(namespace, optional typing)은 재고되지 않은 반면, 다른 것들은 이전의 반대를 통과할 수 있는 방식으로 다시 고려되었다(`Class`를 `Prototype` 위에 문법적 설탕으로 만들기). 그러나 `ECMAScript 2015`는 어려운 일이었고 완성되기까지 거의 6년이 걸렸다(완전 구현까지는 더 많은 시간이 소요됐다). 그러나 `ECMAScript 기술 위원회에 의해 이러한 힘든 작업도 완료될 수 있었다는 사실은 앞으로 일어날 일에 대한 좋은 신호로 여겨졌다.

2016년에 `ECMAScript`의 소규모 개정판이 발표되었다. 이 소규모 개정판은 `TC-39`에 의해 구현된 새로운 릴리스 과정의 결과였다. 모든 새로운 제안들은 4단계 과정을 거쳐야 한다. 스테이지 4에 도달하는 모든 제안은 `ECMAScript`의 다음 버전에 포함될 가능성이 높다(다만, 위원회가 그 포함을 보류하는 것을 선택할 수도 있다). 이러한 방식으로 제안은 거의 자체적으로 개발된다(다른 제안과의 상호작용을 고려해야 하지만). 제안은 `ECMAScript`의 개발을 멈추지 않는다. 제안서를 포함할 준비가 되어 있고 충분한 제안서가 스테이지 4에 도달한 경우, 새로운 `ECMAScript` 버전이 출시될 수 있다.

2016년에 출시된 버전은 다소 작았으나, 다음과 같은 내용을 포함한다.

- **거듭제곱 연산자 (**)\*\*
- `Array.prototype.includes`
- 몇 가지 사소한 수정사항(generator는 new와 함께 사용될 수 없다 등)

## 미래와 그 너머: ECMAScript 2017 이후

아마도 현재 진행 중인 스테이지 4 제안 중 가장 중요한 것은 `async/await` 이다. `async/await` 는 JavaScript에 대한 구문 확장으로서, `Promise` 에 대한 작업을 훨씬 더 쉽게 수행할 수 있게 도운다. 다음과 같은 `ECMAScript 2015` 코드를 예로 들 수 있다.

```jsx
function apiDoSomethingMoreComplex(withThis) {
  const urlA = '...'
  const urlB = '...'

  httpLib
    .request(urlA, withThis)
    .then(result => {
      const parsed = parseResult(result)
      return new Promise((resolve, reject) => {
        database.update(updateStatement, parsed).then(
          () => {
            resolve(parsed)
          },
          error => {
            reject(error)
          }
        )
      })
    })
    .then(result => {
      return httpLib.request(urlB, result)
    })
    .then(result => {
      return worker.processData(result)
    })
    .then(
      result => {
        logger.info(`apiDoSomethingMoreComplex success (${result})`)
      },
      error => {
        logger.error(error)
      }
    )
}
```

그리고 `async/await` 가 활성화된 다음 코드와 비교해보자

```jsx
async function apiDoSomethingMoreComplex(withThis) {
  const urlA = '...'
  const urlB = '...'

  try {
    let result = await httpLib.request(urlA, withThis)
    const parsed = parseResult(result)
    await database.update(updateStatement, parsed)
    result = await httpLib.request(urlB, parsed)
    result = await worker.processData(result)
    logger.info(`apiDoSomethingMoreComplex success (${result})`)
  } catch (e) {
    logger.error(e)
  }
}
```

다른 스테이지 4 제안의 범위는 작다.

- `Object.values` , `Object.entries`
- String padding
- `Object.getOwnPropertyDescriptors`
- Trailing commas if function parameters

이 제안들은 모두 2017년에 발표될 예정이지만, 위원회는 재량으로 이들을 뒤로 미루는 선택을 할 수도 있다. 하지만, `async/await` 만으로도 흥미로운 변화가 될 것이다.

하지만 미래는 거기서 끝나지 않는다! 우리는 앞으로 무엇이 더 있을지 알기 위해 다른 제안들을 살펴볼 수 있다. 몇 가지 흥미로운 점들은 다음과 같다.

- SIMD APIs
- 비동기 반복(async/await + iteration)
- Generator 화살표 함수
- 64-bit 정수 연산
- Realms (state separation/isolation)
- Shared memory와 atomics

JavaScript는 점점 범용 언어 같은 모습이 되어가고 있다. 하지만 JavaScript의 미래에는 큰 변화를 가져올 것이 하나 더 있다.

### WebAssembly

`WebAssembly`에 대해 들어본 적이 없다면, 이 [아티클](https://auth0.com/blog/7-things-you-should-know-about-web-assembly/)을 읽어보기 바란다. `ECMAScript 5 출시 이후 촉발된 라이브러리, 프레임워크 및 일반 개발의 폭발적 증가로 인해 JavaScript는 다른 언어의 흥미로운 타겟이 되었다. 큰 코드베이스의 경우 상호 운영성이 핵심이다. 게임을 예로 들어보자. 게임 개발용 공용어는 여전히 C++이며, 그것은 많은 아키텍처에서 호환된다. Windows 또는 콘솔 게임을 브라우저로 옮기는 것은 매우 어려운 작업으로 여겨졌다. 그러나 현재 JIT JavaScript 가상 머신의 놀라운 성능이 이를 가능하게 했다. 이렇게 하여, LLVM-to-JavaScript 컴파일러인 Emscripten이 탄생했다.

Mozila는 이를 보고 JavaScript를 컴파일러에 적합한 대상으로 만들기 시작했다. `Asm.js`가 탄생했다. `Asm.js`는 컴파일러의 타깃으로 이상적인 JavaScript의 엄격한 subset이다. JavaScript 가상 머신은 이러한 subset을 인지하고 현재 일반적인 JavaScript 코드에서 가능한 것보다 더 나은 코드를 만들기 위해 최적화될 수 있다. 브라우저는 서서히 앱을 컴파일하기 위한 완전히 새로운 것이 되고 있으며, 그 중심에는 JavaScript가 있다.

하지만, `Asm.js`에서도 해결할 수 없는 제약이 있다. 목적과 무관하게 JavaScript를 변경해야 한다. 웹을 다른 언어의 적절한 대상으로 만들기 위해서는 무언가 다른 것이 필요하다. 이것이 바로 `WebAssembly`이다. `WebAssembly`는 웹의 바이트 코드이다. 적합한 컴파일러가 있는 어떤 프로그램이든 `WebAssembly`로 컴파일될 수 있으며, 적합한 가상 머신에서 실행할 수 있다(JavaScript 가상 머신은 필요한 semantics을 제공할 수 있다). 실제로 `WebAssembly`의 첫 번째 버전은 `Asm.js` 사양과의 일대일 호환성을 목표로 하고 있다. `WebAssembly`는 로드 시간이 빠를 뿐만 아니라(바이트코드가 텍스트보다 더 빨리 구문 분석될 수 있음), 현재 `Asm.js`에서는 불가능한 최적화가 가능하다. JavaScript와 당신의 기존 코드가 완벽히 상호 운용되는 웹을 상상해 보라.

언뜻 보기에는, 이는 JavaScript의 성장을 저해하는 것처럼 보이지만, 사실은 정반대이다. 다른 언어 및 프레임워크가 JavaScript와 쉽게 상호 운용할 수 있도록 함으로써 JavaScript는 범용 언어로서의 성장을 계속할 수 있다. `WebAssembly`는 이를 위한 필수 도구이다.

현재 개발 버전인 Chrome, Firefox, Microsoft Edge는 `WebAssembly` 사양 초안을 지원하며 데모 앱을 실행할 수 있다.

[`WebAssembly`](https://webassembly.org/)

## 결론

JavaScript의 역사는 길고 험난했다. 그것은 “웹을 위한 `Scheme`”으로 제안되었다. 초기에는 Java와 같은 구문을 장착했다. 그것의 첫 시제품은 몇 주만에 개발되었다. 마케팅의 위기를 겪었고 2년도 되지 않아 세 개의 이름(`Mocha`, `LiveScript`, JavaScript)을 얻었다. 그리고 나서 그것은 표준화되었고 피부병처럼 들리는 이름(`ECMAScript`)을 얻었다. 세 번의 성공적인 릴리즈 이후, 네 번째 릴리즈는 거의 8년 동안 개발의 지옥을 헤매었다. 그 후, AJAX라는 단일 기능의 성공에 의해서, 해당 커뮤니티는 활동을 다시 하며 개발을 재개했다. 버전 4는 폐기되고 버전 3.1로 알려진 소규모 개정판은 버전 5로 이름이 변경됐다. 버전 6은 여러 해동안 개발되었고, 이번에는 성공했음에도 불구하고 위원회는 이름을 2015로 변경하기로 결정했다. 이 개정안은 규모가 컸고 시행에도 많은 시간이 걸렸다. 그러나 마침내 JavaScript에는 새로운 활력이 불러넣어졌다. 여전히 커뮤니티가 활발하다. Node.js, V8, 다른 프로젝트들은 JavaScript를 이전에 생각하지 못했던 곳으로 데려가고 있다. `Asm.js`, `WebAssembly`는 그것을 더 앞으로 데려 가려고 한다. 다른 스테이지의 활성화된 제안들은 모두 JavaScript의 미래를 더욱 발게 만들고 있다. 길고 장애물이 많은 여정이었으나, JavaScript는 여전히 가장 성공적인 언어 중 하나이다. 이는 그 자체로 입증된다. 언제나 JavaScript에 베팅하자.

> - 원글 작성자 : **Sebastian Peyrott**
> - 원글 링크 : [https://auth0.com/blog/a-brief-history-of-javascript](https://auth0.com/blog/a-brief-history-of-javascript)
> - 원글 게시일 : 2017년 1월 16일
