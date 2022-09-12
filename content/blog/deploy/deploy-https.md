---
title: 배포 및 HTTPS 설정(EC2, Nginx, certbot)
date: 2022-09-12 17:09:89
category: deploy
thumbnail: { thumbnailSrc }
draft: false
---

## 1. [배포] EC2 인스턴스 접속

- 해당 pem key 가 위치한 디렉토리로 이동한다.
- pem key의 권한을 “나에게만 읽기 권한 있음”으로 변경한다.

  ```bash
  chmod 400 {pem파일명.pem}
  ```

  > `chmod`란 change mode의 축약어로서, 유닉스 등의 환경에서 쓰이는 셸 명령어이다. 이 명령어는 파일들이나 디렉터리의 파일 시스템 모드를 바꾼다. chmod 뒤에 숫자 세개가 나오는데 차례대로 **나/그룹/전체**에 대한 권한을 의미한다. 자세한 사용법은 [https://ko.wikipedia.org/wiki/Chmod](https://ko.wikipedia.org/wiki/Chmod) 참고한다.

### 1-1. 인스턴스 서버에 접속한다

```bash
ssh -i {pem파일명.pem} ubuntu@${ec2퍼블릭IP}
```

> `SSH`는 Secure Shell의 줄임말로, 원격 호스트에 접속하기 위해 사용되는 보안 프로토콜이다. AWS와 같은 클라우드 서비스는 인스턴스 서버에 접속하여 해당 머신에 명령을 내리기 위해서 SSH을 통한 접속을 해야한다.

## 2. [배포] NodeJS 및 Yarn 설치

### 2-1. nodejs을 설치하고 버전을 관리할 수 있는 nvm을 설치한다

```bash
curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh) | bash
```

> `nvm` 은 node js 버전 매니저로 시스템에 여러 개의 nodejs 를 설치하고 사용할 버전을 쉽게 전환할 수록 도와주는 shell script이다. 위의 설치 주소는 버전 업데이트에 따라 변할 수 있으므로 공식 레포인 [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) 에서 정확히 확인한다.

### 2-2. nvm을 통해 nodejs를 설치한다

(npm도 자동으로 함께 설치된다.)

```bash
nvm install node
```

> `Node.js`는 확장성 있는 네트워크 애플리케이션 개발에 사용되는 소프트웨어 플랫폼이다. 작성 언어로 자바스크립트를 활용하며 논블로킹 I/O와 단일 스레드 이벤트 루프를 통한 높은 처리 성능을 가지고 있다.

### 2-3. nodejs와 npm이 잘 설치되었는지 버전을 확인한다

```bash
node -v
```

```bash
npm -v
```

### 2-4. yarn을 설치한다

```bash
npm -g install yarn
```

> `Yarn`은 프로젝트의 의존성을 관리하는 JavaScript의 패키지 매니저이다. Java의 gradle이나 Python의 pip과 비슷한 역할을 수행한다. JavaScript의 패키지 매니저로 npm이 있으나, 페이스북에서 보안, 성능 등의 문제를 해결하기 위해 npm을 대체할 새로운 패키지 매니저로 yarn을 만들었다고 한다.

## 3. [배포] Nginx 설치

> Nginx 웹서버가 해당 인스턴스(가상 컴퓨팅 환경)에 이미 설치되어 있을 경우 skip

> **Nginx란?**
> Nginx(엔진 x라 읽는다)는 웹 서버 소프트웨어로, 가벼움과 높은 성능을 목표로 한다. 웹 서버, 리버스 프록시 및 메일 프록시 기능을 가진다. 스모디 팀 프로젝트에서는 Nginx를 통해 클라이언트로부터 요청을 받아 요청에 맞는 정적 파일을 응답해주는 `HTTP Web Server` 로 활용할 뿐만 아니라, 이번 글에서 설명할 `SSL` 기능을 지원한다.

- 인스턴스에 접속되어 있다면, 이제 Nginx를 설치하고 실행해보자

### 3-1. ubuntu 폴더에 대한 권한 변경

```bash
chmod 711 /home/ubuntu
```

> ubuntu 폴더에 대해서 사용자에게 읽기, 쓰기, 실행 권한을 부여하고, 그룹과 다른 사용자는 실행 권한만 부여한다.

### 3-2. 패키지 인덱스 정보를 업데이트한다

```bash
sudo apt-get update
```

> `apt-get` 은 Advanced Pacakaging Tool의 약자로서, 우분투를 포함한 데비안 계열의 리눅스에서 쓰이는 패키지 관리 명령어 도구이다.

> `sudo` 명칭은 “superuser do”의 약어로서 슈퍼유저의 권한으로 실행할 때 사용한다.

### 3-3. Nginx 패키지를 설치한다

```bash
sudo apt install nginx
```

### 3-4. 기본 Nginx 설정 파일(`sites-available`)과 링크(`sites-enabled`)를 제거한다

```bash
sudo rm /etc/nginx/sites-available/default
```

```bash
sudo rm /etc/nginx/sites-enabled/default
```

> `sites-available`: 가상 서버 환경들에 대한 설정 파일들이 위치하는 부분. 사용하지 않는 설정 파일도 있을 수 있다.
> `sites-enabled`: site-available에 있는 가상 서버 파일들 중에서 활성화 하는 파일을 symlink로 연결해두는 폴더이다. 이곳에 있는 파일들을 읽어서 서버를 세팅한다. 즉, `sites-enabled` 디렉터리는 site-available 디렉터리에 있는 설정 파일 중에서 활성화하고 싶은 것을 `링크`로 관리하는 디렉터리이다.

- site-available/default 의 기본 내용은 다음과 같으므로, 향후 참고하여 작성한다

```bash
server {
 listen 80 default_server;
 listen [::]:80 default_server;
 root /var/www/html;
 index index.html index.htm index.nginx-debian.html;

 server_name _;

 location / {
      try_files $uri $uri/ =404;
 }
}
```

### 3-5. 설정 파일을 생성하고 입력한다

```bash
sudo vi /etc/nginx/sites-available/{파일명}.conf
```

### 3-6. 설정파일을 symlink 연결하여 활성화

- 방금 `sites-available` 에 작성한 파일을 `sites-enabled` 에 symlink를 생성해주어 Nginx에서 활성화한다.

```bash
sudo ln -s /etc/nginx/sites-available/smody.conf /etc/nginx/sites-enabled/smody.conf
```

> `ln` 은 symbolic link 가상위치를 만들어내는 리눅스 명령어이다.

### 3-7. Nginx 웹서버를 시작한다

```bash
sudo systemctl start nginx
```

### 3-8. 웹 서버 동작 상태를 확인할 수 있다

```bash
sudo systemctl status nginx
```

- 참고 자료

  [Nginx로 React를 배포하는 방법](https://codechacha.com/ko/deploy-react-with-nginx/)

  [Nginx로 React 배포하기 (우분투 환경)](https://tobegood.tistory.com/entry/Nginx%EB%A1%9C-React%EB%A5%BC-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-%EC%9A%B0%EB%B6%84%ED%88%AC-%ED%99%98%EA%B2%BD)

  [[NGINX] EC2에 nginx 설치 및 세팅](https://libertegrace.tistory.com/entry/NGINX-1)

## 4. [Https] snapd 활성화 및 core 설치

> snapd는 우분투에서 제공하는 일원화된 패키지 관리 툴이다.
> 공식문서 참고 [https://snapcraft.io/install/core/debian](https://snapcraft.io/install/core/debian)

### 4-1. snapd 활성화

```bash
sudo apt update
sudo apt install snapd
```

### 4-2. core 설치

```bash
sudo snap install core
```

## 5. [Https] certbot 설치

> `Let’s Encrypt`([https://letsencrypt.org/](https://letsencrypt.org/)) 라는 비영리 기관을 통해 SSL/TLS 인증서를 무료로 발급받을 수 있다. 인증서 발급을 위해 `certbot` ([https://certbot.eff.org/pages/about](https://certbot.eff.org/pages/about)) 을 사용한다. `certbot`은 `Let's Encrypt` 인증서를 자동으로 사용하여 HTTPS를 활성화하는 무료 오픈 소스 소프트웨어이다.

### 5-1. snap을 통해 certbot을 설치한다

```bash
sudo snap install --classic certbot
```

### 5-2. certbot에 대한 심볼릭 링크를 만든다

```bash
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## 6. [Https] 인증서 발급

### 6-1. certbot을 이용해 Let’s Encrypt로부터 SSL 인증서를 발급받는다(도메인명 입력)

```bash
sudo certbot certonly --manual --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -m 2022smody@gmail.com -d *.smody.co.kr
```

> - manual : 수동으로 과정 진행
> - preferred-challenges : DNS 이용 인증서 발급방식 옵션(http방식 혹은 dns방식 중 하나를 골라야 하기 때문)
> - dns-01 : DNS 이용 옵션 (http 방식의 경우는 http-01)
> - server : Let's Encrypt의 ACME(자동화된 인증서 관리 환경) 서버 주소 입력
> - agree-tos : ACME 서버의 가입자 동의서에 동의하겠다는 의사표시
> - d : SSL 발급할 도메인명 입력
> - m : 이메일 입력

> **DNS 방식**
>
> - 도메인이 연결된 DNS의 TXT레코드를 이용해 인증받는 방식으로 많은 장점을 가진 방법이지만 갱신 시 마다 DNS 정보 중 TXT 레코드를 새로 생성해야 하므로 이를 지원하는 DNS API가 없는 경우 자동 갱신이 어렵다는 단점이 있습니다.
> - 와일드 카드 방식으로 인증서를 발급 가능.당연하게도 서버 관리자가 도메인 DNS를 관리/수정할 수 있어야 하며 인증서 갱신 시마다 DNS에서 TXT값을 변경해야 하므로 외부에서 TXT 레코드를 입력할 수 있도록 DNS가 API를 제공하는 경우만 갱신 과정을 자동으로 처리
> - 이 방법은 위에서 소개한 방법 중에서 가장 까다로운 방법으로 에러 가능성이 높아 여러번 시도하다보면 최대 허용 시도를 초과해 당분간(1주일 정도) 인증이 불가능해지는 불상사가 종종 발생하더군요.
> - 출처 : [최신 Let’s Encrypt SSL 인증서 발급 방법 4가지 정리](https://happist.com/573990/%EC%B5%9C%EC%8B%A0-lets-encrypt-ssl-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%B0%9C%EA%B8%89-%EB%B0%A9%EB%B2%95-3%EA%B0%80%EC%A7%80-%EC%A0%95%EB%A6%AC#4_DNS_iyonghae_balgeub_badgi)

> Webroot 방식
>
> - standalone 방식과 다르게 이미 로컬 서버가 가동중인 경우, 서버의 정지 없이 인증서를 발급받는 방식. 이 때 인증서를 받을 위치를 직접 지정해야 함에 유의
> - (ex. `--webroot-path /var/www/html` or `--webroot-path /usr/share/nginx/html` )
> - 그런데 해당 도메인이 본인의 도메인인지 확인해야 하므로 certbot에서 도메인 인증 단계가 필요하다. 따라서 certbot 서버는 도메인의 `${webroot-path}/.well-known/acme-challenge` 로 http 통신을 하여 결과를 확인한다. 그런데 가끔 `${webroot-path}/.well-known/acme-challenge` 자체가 접근 권한이 주어지지 않았거나 숨김 디렉토리로 되어있는 경우, 통신이 불가하므로 가능하면 /.well-known 이하의 경로에 접근 권한을 주는 것이 좋다
> - 출처 : [https://eff-certbot.readthedocs.io/en/stable/using.html#webroot](https://eff-certbot.readthedocs.io/en/stable/using.html#webroot)

### 6-2. DNS TXT 레코드와 값을 DNS 서버에 추가

- 위 명령어 입력 후, 아래와 같은 DNS TXT 레코드(\_acme-challenge.도메인명)와 값(블록)을 DNS 서버에 추가한다. 브라우저로 가서 사용중인 도메인 서버 사이트에서 해당 TXT레코드와 값을 추가한 후, 다시 터미널로 돌아와서 Enter를 누른다.

- Enter를 누르면, 인증서가 성공적으로 발급되었고, 인증서와 key가 pem 파일로 저장되었음을 확인할 수 있다.

## 7. [Https] Nginx에 SSL 인증 적용

### 7-1. (설치가 되지 않은 경우) Nginx 설치 및 설정

> Nginx 웹서버가 해당 인스턴스(가상 컴퓨팅 환경)에 이미 설치되어 있을 경우 skip

> **Nginx란?**
>
> - Nginx(엔진 x라 읽는다)는 웹 서버 소프트웨어로, 가벼움과 높은 성능을 목표로 한다. 웹 서버, 리버스 프록시 및 메일 프록시 기능을 가진다. 스모디 팀 프로젝트에서는 Nginx를 통해 클라이언트로부터 요청을 받아 요청에 맞는 정적 파일을 응답해주는 `HTTP Web Server` 로 활용할 뿐만 아니라, 이번 글에서 설명할 `SSL` 기능을 지원한다.

- 인스턴스에 접속되어 있다면, 이제 Nginx를 설치하고 실행해보자

### 7-2. ubuntu 폴더에 대한 권한 변경

```bash
chmod 711 /home/ubuntu
```

> ubuntu 폴더에 대해서 사용자에게 읽기, 쓰기, 실행 권한을 부여하고, 그룹과 다른 사용자는 실행 권한만 부여한다.

### 7-3. 패키지 인덱스 정보를 업데이트한다

```bash
sudo apt-get update
```

> `apt-get` 은 Advanced Pacakaging Tool의 약자로서, 우분투를 포함한 데비안 계열의 리눅스에서 쓰이는 패키지 관리 명령어 도구이다.

> `sudo` 명칭은 “superuser do”의 약어로서 슈퍼유저의 권한으로 실행할 때 사용한다.

### 7-4. Nginx 패키지를 설치한다

```bash
sudo apt install nginx
```

### 7-5. 기본 Nginx 설정 파일(`sites-available`)과 링크(`sites-enabled`)를 제거한다

```bash
sudo rm /etc/nginx/sites-available/default
```

```bash
sudo rm /etc/nginx/sites-enabled/default
```

> `sites-available`: 가상 서버 환경들에 대한 설정 파일들이 위치하는 부분. 사용하지 않는 설정 파일도 있을 수 있다.
> `sites-enabled`: site-available에 있는 가상 서버 파일들 중에서 활성화 하는 파일을 symlink로 연결해두는 폴더이다. 이곳에 있는 파일들을 읽어서 서버를 세팅한다. 즉, `sites-enabled` 디렉터리는 site-available 디렉터리에 있는 설정 파일 중에서 활성화하고 싶은 것을 `링크`로 관리하는 디렉터리이다.

- site-available/default 의 기본 내용은 다음과 같으므로, 향후 참고하여 작성한다

```bash
server {
 listen 80 default_server;
 listen [::]:80 default_server;
 root /var/www/html;
 index index.html index.htm index.nginx-debian.html;

 server_name _;

 location / {
      try_files $uri $uri/ =404;
 }
}
```

---

설치 완료 후

### 7-6. 설정 파일을 생성하고 입력한다

```bash
sudo vi /etc/nginx/sites-available/smody.conf
```

INSERT를 위해 `i` 입력 후 다음과 같은 설정 코드를 붙여넣기, 저장은 esc누른 후 `wq!` 입력하고 엔터

```bash
server {
  listen 443 ssl;
  server_name smody.co.kr; #변경, 도메인

  # ssl 인증서 적용하기
  ssl_certificate /etc/letsencrypt/live/smody.co.kr/fullchain.pem; #변경, 경로
  ssl_certificate_key /etc/letsencrypt/live/smody.co.kr/privkey.pem; #변경, 경로
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

  location / {
    proxy_pass http://123.456.78.9:8080; #변경, Public IP, port도 명시
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

server {
    if ($host = smody.co.kr) { #변경, 도메인
        return 301 https://$host$request_uri;
    }

  listen 80;
  server_name smody.co.kr; #변경, 도메인
    return 404;
}
```

### 7-7. 설정파일을 symlink 연결하여 활성화

- 방금 `sites-available` 에 작성한 파일을 `sites-enabled` 에 symlink를 생성해주어 Nginx에서 활성화한다.

```bash
sudo ln -s /etc/nginx/sites-available/smody.conf /etc/nginx/sites-enabled/smody.conf
```

> `ln` 은 symbolic link 가상위치를 만들어내는 리눅스 명령어이다.

### 7-8. Nginx 웹서버를 시작한다

```bash
sudo systemctl start nginx
```

### 7-9. 웹 서버 동작 상태를 확인할 수 있다

```bash
sudo systemctl status nginx
```

- 참고 자료

  [Nginx로 React를 배포하는 방법](https://codechacha.com/ko/deploy-react-with-nginx/)

  [Nginx로 React 배포하기 (우분투 환경)](https://tobegood.tistory.com/entry/Nginx%EB%A1%9C-React%EB%A5%BC-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-%EC%9A%B0%EB%B6%84%ED%88%AC-%ED%99%98%EA%B2%BD)

  [[NGINX] EC2에 nginx 설치 및 세팅](https://libertegrace.tistory.com/entry/NGINX-1)

### 7-10. 설정 파일을 생성하고 입력한다

```bash
sudo vi /etc/nginx/sites-available/{파일명}.conf
```

INSERT를 위해 `i` 입력 후 다음과 같은 설정 코드를 붙여넣기, 저장은 esc누른 후 `wq!` 입력하고 엔터

```bash
server {
  listen 443 ssl;
  server_name smody.co.kr; #변경, 도메인

  # ssl 인증서 적용하기
  ssl_certificate /etc/letsencrypt/live/smody.co.kr/fullchain.pem; #변경, 경로
  ssl_certificate_key /etc/letsencrypt/live/smody.co.kr/privkey.pem; #변경, 경로
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

  location / {
    proxy_pass http://123.456.78.9:8080; #변경, Public IP, port도 명시
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

server {
    if ($host = smody.co.kr) { #변경, 도메인
        return 301 https://$host$request_uri;
    }

  listen 80;
  server_name smody.co.kr; #변경, 도메인
    return 404;
}
```

### 7-11. 설정파일을 symlink 연결하여 활성화

- 방금 `sites-available` 에 작성한 파일을 `sites-enabled` 에 symlink를 생성해주어 Nginx에서 활성화한다.

```bash
sudo certbot certonly --webroot -w /var/www/html --agree-tos -m 2022smody@gmail.com -d admin.smody.co.kr
```

```bash
sudo ln -s /etc/nginx/sites-available/smody.conf /etc/nginx/sites-enabled/smody.conf
```

> `ln` 은 symbolic link 가상위치를 만들어내는 리눅스 명령어이다.

### 7-12. Nginx 웹서버를 시작한다

```bash
sudo systemctl start nginx
```

### 7-13. 웹 서버 동작 상태를 확인할 수 있다

```bash
sudo systemctl status nginx
```

- 참고 자료

### 7-14. 심볼릭 링크 연결 및 활성화(연결안한 경우)

- 방금 수정한 파일을 심볼릭 링크 연결하여 활성화한다

  ```bash
  sudo ln -s /etc/nginx/sites-available/smody.conf /etc/nginx/sites-enabled/smody.conf
  ```

### 7-15. 만약 options-ssl-nginx.conf 파일이 없다면, 공식 레포에 있는 코드를 복사하여 입력한다

```bash
sudo vi /etc/letsencrypt/options-ssl-nginx.conf
```

- certbot 레포의 해당 코드 파일: [https://github.com/certbot/certbot/blob/master/certbot-nginx/certbot_nginx/\_internal/tls_configs/options-ssl-nginx.conf](https://github.com/certbot/certbot/blob/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf)

  ```bash
  # This file contains important security parameters. If you modify this file
  # manually, Certbot will be unable to automatically provide future security
  # updates. Instead, Certbot will print and log an error message with a path to
  # the up-to-date file that you will need to refer to when manually updating
  # this file. Contents are based on https://ssl-config.mozilla.org

  ssl_session_cache shared:le_nginx_SSL:10m;
  ssl_session_timeout 1440m;
  ssl_session_tickets off;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers off;

  ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
  ```

### 7-16. 안전한 키 길이를 가진 Diffie Hellman 알고리즘 키 생성

- dhparam은 [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)의 SSL 인증서 설정 시 권장되는 사항 중 하나로 암호화 복잡도를 높혀 보안을 강화할 수 있음
- 2048이 기본, 4096의 경우 보안성은 더 강화되나, 생성 시 시간이 오래걸림
  - https에서는 대칭키 방식이 사용되는데, 암호화 설정이 끝난 두 대의 컴퓨터가 공통으로 복호화에 사용하는 키를 의미한다. 따라서 공격자는 대칭키만 알면 모든 내역을 알 수 있으므로 대칭키에 대한 보안이 중요하다
  - 알파와 마르코가 대칭키를 생성하려고 하고, 공격자인 우연이 대칭키를 알려고 하는 상황을 가정하자
    1. 알파는 소수 p와 1부터 p-1까지의 수 중 임의의 정수 g를 선택한다. 이후 각각의 p와 g를 마르코와 공유한다. 당연히 공격자인 우연도 알 수 있다
    2. 알파는 임의의 정수 a를 고른다. 이 수는 본인만 알고 있으므로 마르코도, 우연도 절대 알 수 없다
    3. 이 때 알파는 $A = g^a \ mod \ p$ (g의 a승을 p로 나눈 나머지 값)을 계산한다
    4. 역시 마르코 또한 임의의 정수 b를 골라 $B = g^b \ mod \ p$ (g의 b승을 p로 나눈 나머지 값)을 계산한다
    5. 알파와 마르코는 A, B를 주고 받는다. 이 때는 공격자 우연도 A와 B를 볼 수 있다
    6. 알파는 이제 받은 B를 가지고 $B^a \ mod \ p$ (B의 a승을 p로 나눈 나머지 값)을 계산한다
    7. 마르코는 이제 받은 A를 가지고 $A^b \ mod \ p$(A의 b승을 p로 나눈 나머지 값)을 계산한다
    8. 알파가 계산한 값은 $B^a \ mod \ p  = (g^b) ^ a \ mod \ p = g ^ {ab} \ mod \ p$ 이고 마르코가 계산한 값은 $A^b \ mod \ p  = (g^a) ^ b \ mod \ p = g ^ {ab} \ mod \ p$이므로 둘은 같은 대칭키를 가지게 된다
  - 이 때 공격자는 a와 b를 모르므로 대칭키를 알 수 없다. 여기서 p가 충분히 클 경우, 외부에서 비밀 키를 알아내기 위해 공격자는 $g^a$나 $g^b$를 통해 대칭키를 알아낼 수 없는 것으로 알려져 있다.
  - 그러나 p나 a, b가 너무 작을 경우, 도청자는 가능한 모든 조합을 다 계산해보는 방식으로 대칭키
    를 계산해낼 수 있다. 따라서 실제 비밀 통신에는 충분히 큰 소수를 사용해야 한다. 만약 p
    가 최소 300자리의 소수(prime number)이고, a와 b가 각각 100자리 이상의 정수일 경우, 현재 인류가 보유한 모든 컴퓨터를 동원해도 공개된 정보로부터 비밀 키를 알아낼 수 없는 것으로 알려져 있다.
  - 디피-헬먼 키 교환은 통신을 하는 대상과 비밀 정보를 공유할 수 있지만, 상대방에 대한 인증은 보장되지 않으며 중간자 공격이 가능하다. 즉, 알파와 마르코가 상대방에 대한 인증을 하지 못할 경우, 공격자는 중간에서 통신을 가로채 알파와와 공격자 우연, 그리고 공격자 우연과 마르코 사이에 각각 두 개의 디피 헬먼 키 교환을 생성하고, 알파와 마르코가 각각 서로와 통신을 하는 것처럼 위장할 수 있다. 이와 같은 종류의 중간자 공격을 막기 위한 여러가지 다른 알고리즘이 개발되어 있다.
  - 출처 : [https://ko.wikipedia.org/wiki/디피-헬먼*키*교환](https://ko.wikipedia.org/wiki/%EB%94%94%ED%94%BC-%ED%97%AC%EB%A8%BC_%ED%82%A4_%EA%B5%90%ED%99%98)

```bash
sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
```

### 7-17. 인증서 반영 후 Nginx 실행

- Nginx 설정파일을 변경하였으므로 재시작 전 문법이 제대로 되어있는지 확인한다

  ```bash
  sudo nginx -t
  ```

- Nginx을 재시작한다

  ```bash
  sudo nginx -s reload
  ```

  > 참고로 `sudo service nginx restart` 도 비슷한 역할을 하는 명령어이다. 그러나 reload와 restart의 차이는 다음과 같다. 먼저 restart의 경우 서버를 중단하고 다시 시작한다. 하지만 reload의 경우 서버는 중단되지 않고 설정 파일을 다시 적용한다.

  > -s 플래그는 signal을 준말로서 Nginx 서버에 신호를 보내어 특정 액션을 야기한다. 설정 가능한 액션으로는 위에서 적은 reload 외에 quit(서버 shutdown), stop(서버 즉시 중단), reopen(로그 파일 열기) 등이 있다.

- 이제 기존의 http 도메인으로 접속해도 https로 접속된다.
- 서버 상태를 확인할 수 있다. 끝

  ```bash
  sudo service nginx status
  ```

> 참고자료
>
> - [hufspnp.com 웹 배포 -1 (nginx & react & https & certbot)](https://heo-seongil.tistory.com/139)
> - [Let's Encrypt 인증서 발급 및 갱신](https://csupreme19.github.io/system/security/2021/02/25/letsencrypt-renew.html)
> - [[리눅스] apt, apt-get의 사용법 비교](https://coding-groot.tistory.com/90)
> - [Let's Encrypt 와일드카드 인증서 발급하기](https://dinist.tistory.com/20)
> - [Ubuntu의 apt-get 명령어 정리](https://blog.outsider.ne.kr/346)
> - [[Nginx] Nginx 이해하기](https://icarus8050.tistory.com/57)
> - [최신 Let's Encrypt SSL 인증서 발급 방법 4가지 정리 | 꿈꾸는섬](https://happist.com/573990/%EC%B5%9C%EC%8B%A0-lets-encrypt-ssl-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%B0%9C%EA%B8%89-%EB%B0%A9%EB%B2%95-3%EA%B0%80%EC%A7%80-%EC%A0%95%EB%A6%AC#4_DNS_iyonghae_balgeub_badgi)
> - [HTTPS 적용하기 (NGINX + Lets Encrypt)](https://yelimkim98.tistory.com/37)
> - [도메인을 IP 주소에 연결하는 방법과 nslookup](https://medium.com/@bdv111/%EB%8F%84%EB%A9%94%EC%9D%B8%EC%9D%84-ip-%EC%A3%BC%EC%86%8C%EC%97%90-%EC%97%B0%EA%B2%B0%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95%EA%B3%BC-nslookup-9e70a32eec57)
