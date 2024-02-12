---
title: WebSocket과 Socket.io 살펴보기
date: 2024-01-27 21:01:20
category: network
thumbnail: { thumbnailSrc }
draft: false
---

## 소켓 통신

-   소켓 통신이란 TCP 혹은 UDP 프로토콜을 사용하는 두 기기 간의 연결이다. 이런 열결을 하기 위해 특정한 IP 주소와 포트 번호를 이용해서 통신 연결을 유지한다.
-   소켓 통신의 커넥션
    -   클라이언트와 서버가 실시간으로 데이터를 주고받기 위해선 특정한 연결이 계속 이어져 있어야 한다.
    -   HTTP 통신과는 다르게 연결을 유지하기 위해선 컴퓨터의 자원을 소모하며 커넥션이 많을수록 부하가 발생한다.
    -   데이터 통신이 자주 일어난다면 양방향 통신인 소켓 통신을 사용하지만, 그렇지 않는다면 단방향 통신인 HTTP 통신이 적합하다.
-   (참고) HTTP를 이용한 양방향 통신 기법
    -   폴링: 클라이언트가 특정 시간을 간격으로 계속 서버에 request를 요청하는 방식이다. 계속 요청해서 응답이 있는지 확인하기 때문에 불필요한 요청과 부하가 발생한다
    -   롱 폴링: 폴링의 무분별한 확인 요청과 서버 부하를 줄이기 위한 방법이다. 폴링처럼 지속적으로 확인하는 것이 아닌 서버에서 이벤트가 발생하면 그때 클라이언트에게 응답을 주는 방식이다.
    -   스트리밍: 롱 폴링처럼 연결을 맺고 끊는 것이 아니라 지속적인 연결 상태로 서버의 데이터를 클라이언트가 받을 수 있다.
    -   위 방식들 모두 구현이 단순하다는 장점이 있지만, HTTP 통신을 기반으로 하기 때문에 큰 헤더 정보는 서버에 부담이 될 수 있다. 또한 폴링 같은 경우는 사실 실시간 통신으로 보기 어렵다.

### 3-way handshake

-   3방향 핸드쉐이크란 신뢰성 있는 연결을 위해 서버와 클라이언트 간의 사전약속이다. 아래와 같은 일련의 3단계의 과정이다. 해당 과정 이후 TCP 통신 혹은 소켓 통신이 이루어질 수 있다.
    -   참고로 UDP 통신은 비신뢰성 연결을 지향하므로 3방향 핸드쉐이크가 없다. 신뢰성을 보장하지 않기 때문에 UDP는 TCP와는 다르게 빠른 성능을 갖고 있다.
-   1. 소켓 통신을 위해 사전에 클라이언트는 <mark class="hltr-cyan">SYN</mark>이라는 패킷을 서버에 전송하고 <mark class="hltr-cyan">SYN</mark>/<mark class="hltr-red">ACK</mark>를 받기 위한 상태로 대기한다. (클라 -- SYN --> 서버)
-   2. <mark class="hltr-cyan">SYN</mark> 패킷을 받은 서버는 클라이언트에서 받은 <mark class="hltr-cyan">SYN</mark> 과 패킷을 잘 받았다는 패킷인 <mark class="hltr-red">ACK</mark> 를 하나로 만들어서 다시 클라이언트에 <mark class="hltr-cyan">SYN</mark>/<mark class="hltr-red">ACK</mark> 전송한다. (클라 <-- SYN/ACK -- 서버)
-   3. <mark class="hltr-red">ACK</mark>를 받은 클라이언트는 다시 서버로 <mark class="hltr-red">ACK</mark> 패킷을 보내며 잘 받았다는 요청을 보내게 된다. (클라 -- ACK --> 서버)

### net 모듈

-   net 모듈은 TCP 스트림 기반의 비동기 네트워크 통신을 제공하는 node.js의 내장 모듈이다.
-   간단히 서버와 클라이언트 통신을 설계할 수 있다(여기서 클라이언트는 브라우저가 아닌 소켓 통신을 요청하는 다른 서버를 의미).
-   하지만 net 모듈은 저수준의 TCP 통신을 제공하기 때문에 브라우저와 서버의 통신은 지원하지 않는다.
-   예제 코드

```js
// client.js
const net = require("net")
// 1 : net.connect() 메서드로 5000번 포트의 서버에 접속합니다.
const socket = net.connect({ port: 5000 })
socket.on("connect", () => {
	console.log("connected to server!")
	// 2: 1초마다 서버로 메시지를 보냅니다.
	setInterval(() => {
		socket.write("Hello~~ I am client.")
	}, 1000)
})
// 3: 서버로부터 데이터를 받으면 발생하는 이벤트입니다.
socket.on("data", chunk => {
	console.log("From Server:" + chunk)
})
// 4: 서버 접속 종료시 발생하는 이벤트입니다.
socket.on("end", () => {
	console.log("disconnected.")
})
socket.on("error", err => {
	console.log(err)
})
// 5: 서버 접속 타임아웃 시 발생하는 이벤트입니다.
socket.on("timeout", () => {
	console.log("connection timeout.")
})
```

```js
// server.js
// 1: net 모듈을 불러옵니다.
const net = require("net")

//2 createServer() 메서드를 통해 서버를 생성합니다.
const server = net.createServer(socket => {
	// 3: 클라이언트로부터 데이터를 받으면 발생하는 이벤트입니다.
	socket.on("data", data => {
		console.log("From client:", data.toString())
	})
	// 4: 클라이언트가 소켓 접속을 종료할 때 발생하는 이벤트입니다.
	socket.on("close", () => {
		console.log("client disconnected.")
	})
	// 5: write() 메서드로 클라이언트로 메시지를 보냅니다.
	setInterval(() => {
		socket.write("Hi, I am server")
	}, 2000)
})

server.on("error", err => {
	console.log("err" + err)
})

// 6 : listen() 메서드로 5000번 포트에서 대기합니다.
server.listen(5000, () => {
	console.log("listening on 5000")
})
```

### 웹 소켓

-   HTTP5에서 웹 소켓이 등장했다.
-   [RFC 6455 - Websocket Protocol 표준 문서](https://datatracker.ietf.org/doc/html/rfc6455)
    -   참고로 RFC란 Request For Comments 의 줄임말로서, 국제 인터넷 표준화 기구인 IETF에서 관리하는 표준화 문서를 말한다.

#### 클라이언트

-   브라우저에서 웹 소켓은 네이티브 기능이기 때문에 프론트 개발 시 별도의 모듈을 추가할 필요 없이 `new WebSocket()`처럼 바로 호출하여 사용 가능하다.
-   연결할 소켓 주소는 웹소켓을 의미하는 `ws://[호스트 주소]:[포트 번호]`여야 한다. 참고로 wws는 ws를 보안적으로 업그레이드한 프로토콜이고, 실제 웹 서비스에서는 wws 사용이 추천된다.
-   new WebSocket()을 이용해서 웹 소켓 객체를 초기화하고, 지정 포트의 웹 소켓 서버에 연결한다. 웹 소켓 객체의 메서드는 다음과 같다
    -   onopen은 웹 소켓이 연결되었을 때 호출되는 메서드이다.
    -   onmessage는 서버에서 온 메세지를 받는 메서드이다.
    -   onclose는 웹 소켓이 닫혔을 때 호출되는 메서드이다.
    -   send는 서버로 메시지를 전송할 때 사용되는 메서드이다.

#### 서버

-   `ws` 라이브러리를 사용하여 nodejs 소켓 구현을 한다.(npm i ws)

-   웹소켓 통신 상태를 개발자도구에서 확인
    -   요청 헤더에 담긴 <mark class="hltr-red">Connection: Upgrade</mark> 와 <mark class="hltr-cyan">Upgrade: websocket</mark> 은 클라이언트가 서버에게 <mark class="hltr-green">"소켓 통신이 가능하다면 웹 소켓 프로토콜로 업그레이드 해줘"</mark>라고 요청하는 것과 같다. 이에 대해 서버가 응답으로 <mark class="hltr-orange">101 상태코드</mark> 를 전달하면, 그때부터 HTTP 프로토콜이 아닌 웹 소켓 프로토콜로 통신하게 된다.
    -   ![[Pasted image 20240127194729.png]]

## socket.io

-   socket.io는 웹서비스를 위한 라이브러리이다. <https://socket.io/>

### 특징

-   socket.io는 서버, 클라이언트, 하위 브라우저까지 지원한다.
    -   (ws 모듈은 서버레벨만 담당했던 것과 달리..)
    -   하위 브라우저일 경우, 웹 소켓이 아닌 롱 폴링 방식으로 전환하여 실시간 통신을 한다.
-   다양한 서버 사이드 언어를 지원한다.
-   연결에 문제가 발생할 경우, 자동 재연결 기능이 지원된다.
-   API 추상화를 통해 복잡한 로직을 숨기고 간편하게 데이터 전송할 수 있는 함수를 제공한다.
-   손쉽게 채널 및 방 단위를 설계할 수 있다.(private, broadcast, public 같은 채널..)
-   socket.io 라이브러리는 웹 소켓의 구현체가 아니다. 웹 소켓은 이 라이브러리를 구성하는 여러 API 중 하나일 뿐이다.
    -   따라서, 클라이언트 혹은 서버, 둘 중 하나가 socket.io로 제작되었다면 반대쪽도 socket.io로 제작되어야 한다.
-   socket.io의 주요 이벤트 함수
    -   connection: 클라이언트 연결 시 동작
    -   disconnect: 클라이언트 연결 해제 시 동작
    -   on(): 소켓 이벤트를 연결
    -   emit(): 소켓 이벤트가 생성
    -   socket.join(): 클라이언트에게 방을 할당
    -   sockets.in() / sockets.to(): 특정 방에 속해 있는 클라이언트를 선택

### 통신 종류(채널 설정)

-   socket.io가 지원하는 통신 종류는 private, public, broadcast로 총 3가지이다.
-   private: 1:1 통신을 의미한다.
    -   `io.sockets.to(사용자 id).emit()`
-   public: 전송자를 포함한 모두에게 메시지를 전송한다.
    -   `io.sockets.emit()`
-   broadcast: 전송자를 제외한 모든 사용자에게 메시지를 전송한다.
    -   `socket.broadcast.emit()`
-   (broadcast 응용) 특정 방의 사용자에게 메시지를 전송할 수 있다.
    -   `socket.join(roomNumber)` 메서드는 접속한 사용자를 특정 방에 배정한다.
    -   `socket.rooms` 프로퍼티는 해당 접속자가 어떤 방에 속해있는지를 나타낸다.
    -   `Set (2) { 'iCSa-asdfklwajfl', '1' }`
    -   이 프로퍼티의 값은 set이라는 자료구조이고, 첫 번째 값에는 모두에게 기본적으로 존재하는 개인의 방의 socket.id (ex, "iCSa-asdfklwajfl")가 있다. 두 번째 값부터 배정된 방 번호(ex, "1") 가 있다. set 데이터에 쉽게 접근하려면 Array.from() 메서드를 사용하여 유사배열을 배열로 변경한다.
    -   `socket.broadcast.in(roomNumber).emit()` : 지정된 방에만 메시지 전송한다. in 메서드를 점 표기법으로 연쇄적으로 붙여서 여러 방에 메시지를 전송할 수도 있다.
    -   `socket.leave(roomNumber)` 를 이용해서 방을 떠날 수 있다.

### 네임스페이스

-   네임스페이스는 서비스를 내부적으로 구분할 수 있는 공간을 의미한다.
-   네임스페이스는 룸의 상위 레이어로 생각할 수 있다.
-   동일한 메인 도메인의 하위 경로를 추가해서 네임스페이스를 만들었다. 이런 경우 네임스페이스를 여러 개 연결하더라도 소켓이 여러 번 연결되는 것이 아닌 하나의 웹 소켓 연결만을 생성한다. 그리고 패킷을 알맞은 목적지에 전송하도록 분산 처리된다. 하지만 메인 도메인 주소가 다르다면 웹 소켓 연결은 그에 따라 추가된다.
-   `io.of(nameSpace).on("connection", (socket) => {})`

    ```js
    // 서버사이드 네임스페이스 설정 코드
    const { Server } = require("socket.io")

    const io = new Server("5000", {
    	cors: {
    		origin: "http://localhost:3000",
    	},
    })
    // 1
    io.of("/goods").on("connection", socket => {
    	console.log("goods connected")
    	socket.on("shoes", res => {})
    	socket.on("pants", res => {})
    })
    // 2
    io.of("/user").on("connection", socket => {
    	console.log("user connected")
    	socket.on("admin", res => {})
    })
    ```

## \* CORS

-   CORS는 Cross-Origin Resource Sharing의 줄임말로, 웹 앱이 다른 출처의 도메인에서 자유롭게 데이터를 주고받을 수 있도록 허용하는 정책이다.
-   이는 SOP(Same Origin Policy)라는 보안 정책에 의해 만들어진 정책으로, 같은 출처(Origin)에서만 데이터를 교환할 수 있도록 제한한다.
    -   SOP는 제3자 공격인 CSRF(Cross-Site Request Forgery) 와 같은 보안 위협으로부터 서버의 리소스를 보호하는 데 중요한 역할을 한다.
-   출처는 <mark class="hltr-red">프로토콜</mark>(HTTP, HTTPS, WS 등), <mark class="hltr-cyan">도메인</mark>, <mark class="hltr-green">포트 번호</mark>로 구성된다. 이 세 가지 요소가 모두 동일한 경우에만 출처가 같다고 판단된다.
    -   서버는 HTTP 응답 헤더를 사용하여 CORS 정책을 설정하며, 허가된 도메인은 클라이언트의 웹 브라우저에 의해 검사된다. 허가된 도메인에 대해서는 웹 앱에서 제한 없이 서버와 통신할 수 있게 된다.

## 참고자료

-   [책] 리액트로 배우는 소켓 프로그래밍 - hee
-   <https://developer.mozilla.org/ko/docs/Web/API/WebSockets_API>
