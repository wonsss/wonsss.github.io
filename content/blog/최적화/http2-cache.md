---
title: 프론트엔드 Nginx 웹 서버에서 HTTP2 및 캐시 적용 방법
date: 2022-10-03 23:10:01
category: 최적화
thumbnail: { thumbnailSrc }
draft: false
---
## HTTP/2

HTTP/2는 HTTP/1 의 확장으로 기존의 HTTP/1과의 호환성을 유지하며 `성능`에 초점을 맞춘 프로토콜이다. End-user가 느끼는 latency, 네트워크, 서버 리소스 사용량 등과 같은 성능 위주로 개선됐다.

- HTTP/2의 주요 특징은 다음과 같다.
  - [Multiplexed Streams] HTTP/2는 하나의 TCP 연결을 통해 여러 데이터 요청을 병렬로 전송할 수 있다.
  - [Stream Prioritization] HTTP/2는 리소스 간의 의존관계에 따른 우선순위를 설정하여 리소스 로드 문제를 해결한다.
  - [Server Push] 서버는 클라이언트가 요청하지 않은 리소스를 사전에 푸쉬를 통해 전송할 수 있고, 클라이언트의 요청을 최소화할 수 있다.
  - [Header Compression] HTTP/2는 헤더 정보를 압축한다.

- HTTP/2를 웹서버(Nginx)에서 적용하는 방법
  - nginx의 config에서 `listen 443 ssl;`을 `listen 443 ssl http2;`로 수정

## Http 캐시 적용

- cache 적용 방법
  - 다음과 같은 코드 추가, js파일인 경우 1년 캐싱하겠다는 의미

```bash
server {
  #js 파일 1년 캐시
 location ~* \.(?:js)$ {
    root /home/ubuntu/dist;
    expires 1y;
    add_header Cache-Control "public, no-transform";
    try_files $uri $uri/;
 }
}
```

```bash
server {
  #html 파일 캐시 안함
 location / {
    root /home/ubuntu/dist;
    index index.html;
    add_header: Cache-Control "no-cache,no-store, must-revalidate";
    try_files: $uri $uri/;
 }
}
```

index.html 파일에 대한 캐시 적용을 안하기 위해, no-store 외에도 no-cache, must-revalidate를 사용했다. no-store만으로도 캐시가 적용되지 않아야 하는데 다른 것들도 사용한 이유는 HTTP 스펙에서 디테일하게 들어가면 모호한 부분들이 존재하기 때문이라고 한다.
자세한 내용은 [StackOverflow](https://stackoverflow.com/questions/49547/how-do-we-control-web-page-caching-across-all-browsers)를 참고한다.

- HTTP/2 및 HTTP 캐시 헤더가 적용된 nginx conf는 다음과 같다.

```bash
server {
  location / {
    root   /home/ubuntu/dist;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  #1년 캐시
 location ~* \.(?:js)$ {
    root /home/ubuntu/dist;
    expires 1y;
    add_header Cache-Control "public, no-transform";
    try_files $uri $uri/;
 }

    listen 443 ssl http2; # http2 적용
    ssl_certificate /etc/letsencrypt/live/sitename.co.kr/fullchain.pem; 
    ssl_certificate_key /etc/letsencrypt/live/sitename.co.kr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = sitename.co.kr) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    server_name sitename.co.kr;
    listen 80;
    return 404; # managed by Certbot
}
```

참고 [HTTP/1.1과 HTTP/2의 차이점](https://seokbeomkim.github.io/posts/http1-http2/#http2)
