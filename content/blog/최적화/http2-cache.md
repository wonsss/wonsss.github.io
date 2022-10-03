---
title: 프론트엔드 nginx 웹 서버에서 http2 및 캐시 적용 방법
date: 2022-10-03 23:10:01
category: 최적화
thumbnail: { thumbnailSrc }
draft: false
---

- http2 적용 방법
  - nginx의 config에서 `listen 443 ssl;`을 `listen 443 ssl http2;`로 수정

- cache 적용 방법
  - 다음과 같은 코드 추가, js파일인 경우 1년 캐싱하겠다는 의미

```bash
server {
  #1년 캐시
 location ~* \.(?:js)$ {
    root /home/ubuntu/dist;
    expires 1y;
    add_header Cache-Control "public, no-transform";
    try_files $uri $uri/;
 }
}
```

- 수정된 nginx conf는 다음과 같다.

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
