---
title: 리액트 앱 도커라이즈하기
date: 2024-01-31 22:01:78
category: deploy
thumbnail: { thumbnailSrc }
draft: false
---

## 도커?

- 도커(Docker)는 리눅스의 응용 프로그램들을 프로세스 격리 기술들을 사용해 컨테이너로 실행하고 관리하는 오픈 소스 프로젝트이다.
- <mark class="hltr-cyan">도커</mark>는 개발자가 모던 앱을 구축, 공유, 실행하는 것을 도와줄 수 있도록 서비스 운영에 필요한 앱을 격리해 컨테이너로 만드는 소프트웨어이다. 도커는 지루한 설정 과정을 대신해 주므로, 이를 통해 개발자는 코드를 작성하는 일에만 집중할 수 있다.

## 도커 용어

- <mark class="hltr-green">이미지</mark>
  - 도커에서 이미지란 컨테이너를 만드는 데 사용되는 <mark class="hltr-green">템플릿</mark>을 의미한다.
  - 이 이미지를 만들기 위해서는 Dockerfile이 필요하며, 이 파일을 빌드하면 이미지를 만들 수 있다.
- <mark class="hltr-red">컨테이너</mark>
  - 도커의 이미지를 <mark class="hltr-red">실행한 상태</mark>를 컨테이너라 한다.
- <mark class="hltr-grey">Dockerfile</mark>
  - 이 파일을 빌드하면 이미지를 만들 수 있다.
  - 흔히 도커 이미지화한다(dockerize)라고 할 때 가장 먼저 하는 것이 바로 이 Dockerfile을 만드는 것이다.
- <mark class="hltr-orange">태그</mark>
  - 이미지를 식별할 수 있는 레이블 값을 의미한다.
  - 예를 들어, ubuntu:latest는 ubuntu 이미지의 latest 태그 버전을 의미한다.
- <mark class="hltr-purple">리포지터리</mark>
  - 이미지를 모아두는 저장소이다.
- <mark class="hltr-yellow">레지스트리</mark>
  - 리포지터리에 접근할 수 있게 해주는 서비스를 의미한다. 레지스트리에는 다양한 리포지터리가 있다.
  - 대표적으로 <mark class="hltr-yellow">도커 허브</mark> 가 있다.
- 요약
  - <mark class="hltr-yellow">레지스트리</mark> > <mark class="hltr-purple">리포지터리</mark> > <mark class="hltr-green">이미지</mark>
  - <mark class="hltr-grey">Dockerfile</mark>을 빌드하면 => <mark class="hltr-green">이미지</mark>  : `docker build`
  - <mark class="hltr-green">이미지</mark>를 실행하면 => <mark class="hltr-red">컨테이너</mark> : `docker run`

## 도커 cli 명령어

- `docker build`
  - 도커파일을 이미지로 빌드
  - 태그를 붙이려면, `docker build -t foo:bar` 처럼 옵션을 붙일 수 있다.
- `docker push <사용자계정>/<IMAGE:TAG>`
  - 이미지나 리포지터리를 레지스트리에 업로드
  - `docker push marco/foo:bar` 는 marco라는 사용자 계정(별도 설정 안했다면 기본적으로 도커 허브의)에 foo:bar 이미지를 푸시하는 것을 의미한다.
- `docker tag <SOURCE_IMAGE:TAG> <TARGET_IMAGE:TAG>`
  - 기존 이미지에 새로운 태그를 붙인다.
- `docker inspect`
  - 이미지나 컨테이너의 세부 정보를 출력한다.
- `docker run`
  - 이미지를 기반으로 새로운 컨테이너 생성
- `docker ps`
  - 현재 가동 중인 컨테이너 목록을 확인할 수 있다.
- `docker rm <CONTAINER>`
  - 컨테이어를 삭제한다.
  - 실행 중인 컨테이너를 삭제하려면 `docker stop <CONTAINER>` 으로 먼저 중지시켜야 한다.

## react dockerlize 실습

- Dockerfile 만들기
  - 프로젝트 루트에 `Dockerfile` 이름으로 파일을 만들고 아래와 같은 코드를 작성한다.

```
# Node 기본 이미지를 기반으로 설정 시작
FROM node:18-alpine

# /app 디렉토리를 메인 응용 프로그램 디렉토리로 지정
WORKDIR /app

# 앱의 package 및 package-lock.json 파일을 복사
COPY package*.json ./

# 로컬 디렉토리를 현재 Docker 이미지의 로컬 디렉토리 (/app)로 복사
COPY ./src ./src
COPY ./public ./public

# Node 패키지 설치, serve 설치, 앱 빌드, 종속성 제거
RUN npm install \
    && npm install -g serve \
    && npm run build \
    && rm -fr node_modules

# 3000번 포트 노출
EXPOSE 3000

# serve 명령을 사용하여 앱 시작
CMD < "serve", "-s", "build" >
```

- Dockerfile 빌드
  - 빌드 후 이미지 생성 확인

 ```
 docker build . -t <IMAGE:TAG>
 ```

- 애플의 실리콘 아키텍처(M1)를 탑재한 노트북에서 빌드한 이미지를 배포하려고 하면 배포에 실패한다. 이는 빌드한 이미지의 플랫폼(CPU 아키텍처)이 달라서인데, 해당 이미지가 어떤 플랫폼인지 확인하려면 다음 명령어를 실행하면 된다.

 ```
 docker inspect <IMAGE:TAG>
 ```

- 아키텍처가 amd64 외에 다른 것으로 돼 있다면 해당 이미지는 Cloud Run 환경에서 실행할 수 없고, 멀티플랫폼 빌드를 위해 다음과 같은 명령어를 사용해야 한다.
  - 참고: <https://docs.docker.com/build/building/multi-platform/>

 ```
 docker buildx build --platform linux/amd64 -t <IMAGE:TAG> .
 ```

- 3000번 port로 이미지 열기
  - `docker run -p <host port number>:<container port number> <IMAGE:TAG>` : 호스트 시스템 지정한 포트로 유입되는 트래픽을 도커 컨테이너 지정 포트로 전달

 ```
  docker run -p 3000:3000 <IMAGE:TAG>
 ```

- 도커 이미지를 Google Cloud Platform(GCP)에 푸시하기
  - Google Cloud Platform(<https://cloud.google.com/>)을 예시로 사용한다(첫 가입 3개월 무료).
  - GCP에서 프로젝트 생성 후 프로젝트의 Artifact Registry에서 Docker용 저장소를 만든다.
- gcloud 인증

 ```
 gcloud auth configure-docker <GCP artifact registry 주소>
 ```

- 해당 GCP 저장소 주소로 도커 푸시

 ```
 docker tag <IMAGE:TAG> <GCP artifact registry의 Docker 저장소 주소>/<IMAGE:TAG>
 ```

 ```
 docker push <GCP artifact registry의 Docker 저장소 주소>/<IMAGE:TAG>

 ```

- GCP에서 cloud run으로 이미지 실행하여 배포
  - <https://console.cloud.google.com/run> 접속 > 서비스 만들기
    - 컨테이너 이미지 URL 선택
    - 컨테이너 포트: 3000 설정
  - GCP에서 배포되면 서비스 url이 <https://xxx-xxx-xx.a.run.app> 형식으로 생성되고, 접속 가능함을 확인할 수 있다.

## 참고

- 책 - 모던 리액트 딥다이브
- <https://docs.docker.com/samples/react/>
- <https://github.com/docker/welcome-to-docker>
