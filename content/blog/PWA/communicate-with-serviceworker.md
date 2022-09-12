---
title: 서비스워커와 클라이언트 간 통신 방법
date: 2022-08-28 21:08:54
category: pwa
thumbnail: { thumbnailSrc }
draft: false
---

-   서비스워커는 브라우저의 메인 스레드가 아닌 분리된 별도의 스레드에서 작동하므로, 일반적인 방식으로는 웹 페이지와 직접적으로 상호작용할 수 없다.
-   그러나 서비스워커와 클라이언트가 서로 통신해야 할 일이 많을 수 있다. 따라서 서비스 워커와 클라이언트가 서로 메시지를 주고 받는 방식에 대해 살펴보자.
-   서비스워커와 클라이언트 간 통신 방법에는 다음과 같이 세 가지가 있으며, 케이스에 맞게 적합한 방법을 선택하면 될 것 같다.
    -   **Broadcast Channel API**
    -   **MessageChannel Interface**
    -   **Clients** Interface

## 1. **Broadcast Channel API**

-   [https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
-   서비스 워커에게 Port를 전달할 필요가 없어서 비교적 간단한 방식이다.
-   서비스워커와 클라이언트 양 채널에 동일한 채널 이름을 설정하기면 하면 된다.

```jsx
// 클라이언트 파일(ex, app.js)

// 채널이름 설정
const broadcast = new BroadcastChannel('my-channel')

// 메시지 수신
broadcast.onmessage = event => {
    console.log(event.data.payload) // "Hello, Client. I am Service-worker"
}

// 메시지 발송
broadcast.postMessage({ type: 'PRINT' })
```

```jsx
// service-worker.js

// 클라이언트에서 설정한 채널 이름과 동일하게 설정
const broadcast = new BroadcastChannel('my-channel')

// 메시지 수신
broadcast.onmessage = event => {
    if (event.data && event.data.type === 'PRINT');
    {
        // 메시지 발송
        broadcast.postMessage({ payload: 'Hello, Client. I am Service-worker' })
    }
}
```

-   채널 연결 끊기
    -   close()를 통해 채널 연결이 끊기며 가비지 콜렉팅된다.

```jsx
broadcast.close()
```

## 2. **MessageChannel Interface**

-   [https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
-   Channel Messaging API의 인터페이스이며, 새 메시지 채널을 만들어 이를 통해 양방향으로 메시지를 주고 받을 수 있다.
-   MessageChannel 클래스를 통해 생성된 객체에는 2개의 포트가 존재하는데, 각각 port1과 port2 속성을 참조할 수 있다.
    -   클라이언트가 1번 포트에서 전달한 데이터는 서비스워커가 2번 포트를 통해 받을 수 있고, 반대도 마찬가지다.
-   과정
    -   ‘message’ 이벤트에 대하여 이벤트 리스너를 양 쪽에 설정한다
    -   클라이언트에서 서비스 워커에 Port를 전송하고, 서비스 워커는 Port를 저장하여 메시지 채널을 설정한다.
    -   이후 서비스 워커는 저장된 Port를 통해 클라이언트에게 응답한다.
    -   채널 연결을 끊으려면 `port.close()`를 호출한다.

```jsx
// 클라이언트 파일(ex, app.js)

// 새로운 메시지 채널 생성
const messageChannel = new MessageChannel()

// 우선 채널 설정 위해 서비스워커에 port2를 전달한다
navigator.serviceWorker.controller.postMessage(
    {
        type: 'INIT_PORT',
    },
    [messageChannel.port2]
)

// 메시지 수신 - 클라이언트는 port1을 사용하고 있다
// 상대 포트인 port2(서비스워커)에서 전달되는 메시지 수신한다
messageChannel.port1.onmessage = event => {
    console.log(event.data.payload) // "Hello, Client. I am Service-worker"
}

// 메시지 발송
navigator.serviceWorker.controller.postMessage({
    type: 'PRINT',
})
```

```jsx
// service-worker.js

let getVersionPort;
let count = 0;

// 메시지 수신
self.addEventListener("message", event => {
  if (event.data && event.data.type === 'INIT_PORT') {
  // Port 설정
  // 하나의 포트만 전달됐으므로 첫 번째 요소를 가져온다
    getVersionPort = event.ports[0];
  }

  if (event.data && event.data.type === 'PRINT') {
  // 메시지 발송
    getVersionPort.postMessage({ payload: "Hello, Client. I am Service-worker"});
  }
}
```

## 3. **Clients** Interface

-   서비스 워커에게 채널에 대한 정보를 전달하지 않아도 된다. 서비스 워커에서 Clients 인터페이스를 통해 클라이언트에게 접근할 수 있다.
-   Clients 인터페이스는 `Clients.matchAll()` 이나 `Clients.get()` 메서드를 통해 Client 객체로 접근 방법을 제공한다. Clients 인터페이스는 서비스 워커 내에서 `self.clients` 를 통해 접근할 수 있다.
    -   [https://developer.mozilla.org/en-US/docs/Web/API/Clients](https://developer.mozilla.org/en-US/docs/Web/API/Clients)
-   Client 인터페이스에는 클라이언트에게 메시지를 보낼 수 있는 `Client.ostMessage()` 메서드가 있으므로 이를 사용한다.
    -   [https://developer.mozilla.org/en-US/docs/Web/API/Client](https://developer.mozilla.org/en-US/docs/Web/API/Client)
