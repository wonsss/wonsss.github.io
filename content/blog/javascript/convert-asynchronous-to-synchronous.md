---
title: 비동기성을 동기적으로 표현하는 방법(Callback, Promise, async/await)
date: 2022-08-31 04:08:16
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

## Callback

- `콜백`은 자바스크립트에서 `비동기성` 을 표현하는 기본 단위다. 그러나 자바스크립트와 더불어 점점 진화하는 비동기 프로그래밍 환경에서 `콜백` 만으로는 충분치 않다.
  - 첫째, 사람의 두뇌는 순차적, 중단적, 단일-스레드 방식으로 계획하는 데 익숙하지만 `콜백` 은 비동기 흐름을 비선형적, 비순차적인 방향으로 나타내므로 구현된 코드를 제대로 이해하기가 매우 어렵다.
    - 그래서 `비동기성`을 좀 더 `동기적, 순차적, 중단적인 모습으로` , 마치 우리 두뇌가 사고하는 방식과 유사하게 표현할 방법이 필요하다.
  - 둘째, 콜백은 프로그램을 진행하기 위해 제어를 역전, 즉 제어권을 다른 파트에 암시적으로 넘겨줘야 하므로 골치가 아프다. 이러다 보면 나중에 유지보수가 어려운 코드로 변질되고 버그가 나타나기 쉽다.
    - 따라서 `콜백`을 능가하는 더욱 정교하고 역량 있는 `비동기 패턴(비동기->동기)` 이 필요하다.
- Promise와 async/await 가 바로 그러한 기술이다.

## Promise

- `콜백`처럼 프로그램의 진행을 다른 파트에 넘겨주지 않고도, 개발자가 해당 작업이 언제 끝날지 알 수 있고 그다음에 무슨 일을 해야 할지 스스로 결정할 수 있도록 만들어진 체계가 `Promise` 이다.

```jsx
new Promise((resolve, reject) => {
  console.log('1')
  resolve()
}).then(() => {
  console.log('2')

  new Promise((resolve, reject) => {
    console.log('3')
    resolve()
  }).then(() => {
    console.log('4')
  })
})

// 1 -> 2 -> 3 -> 4
```

- Promise를 위와 같이 쓰면 결국 콜백지옥에 빠진다. 이러한 문제를 해결하기 위해 내부에서 실행되는 Promise에 대해 return한다. 그러면 내부에 있던 Promise가 Scope에서 탈출하기 때문에 내부에 있던 Promise의 then을 내부가 아닌 외부에서 호출할 수 있게 된다.

  ```jsx
  new Promise((resolve, reject) => {
    console.log('1')
    resolve()
  })
    .then(() => {
      console.log('2')

      return new Promise((resolve, reject) => {
        console.log('3')
        resolve()
      })
    })
    .then(() => {
      console.log('4')

      return new Promise((resolve, reject) => {
        console.log('5')
        resolve()
      })
    })
    .then(() => {
      console.log('6')
    })
  // 1->2->3->4->5->6
  ```

## async & await?

- Async, Await와 Promise의 차이는?
  - 기존의 비동기 처리 방식인 Callback 함수의 단점을 보완하기 위해 Promise를 사용했지만, 코드가 장황해지는 단점이 있었다.
  - Promise를 더욱 쉽게 사용할 수 있도록 ES2017에서 도입된 비동기 처리 방식이 async & await며, 이를 사용할 경우 코드가 간결해진다.
- 에러처리를 하려면 try catch를 사용한다.
- 비동기 → 동기 코드의 실행 순서를 보장한다.(동기적인 코드 흐름)

```jsx
async function 함수명() {
  await 비동기_처리_메서드_명()
}
```

- 비동기 처리 메서드가 반드시 프로미스 객체를 반환해야 await가 의도한 대로 동작한다.
- 만약 콜백이나 프로미스로 했다면 훨씬 더 코드가 길어졌을 것이고 인데팅뿐만 아니라 가독성도 좋지 않을 것이다.
