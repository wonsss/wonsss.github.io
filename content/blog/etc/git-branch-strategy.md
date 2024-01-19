---
title: Git 브랜치 전략(Git Flow, Github Flow, Trunk-Based Development)
date: 2024-01-20 02:01:33
category: etc
thumbnail: { thumbnailSrc }
draft: false
---

- <mark class="hltr-pink">main 브랜치</mark>는 사용자에게 배포된 코드를 위한 브랜치이다.
- 기능을 개발하는 중에 <mark class="hltr-pink">main 브랜치</mark>만 있다면?
  - 기능이 완성되기 전까지 main 브랜치의 소스코드는 불완전한 상태로 존재한다.
  - 협업 시 여러 기능이 동시에 커밋되어 커밋 히스토리가 복잡하게 섞일 수 있다.
  - 문제가 발생했을 때 원하는 시점으로 롤백하기도 어렵다.
- 브랜치 기능을 사용한다면?
  - 다른 브랜치에 영향을 받지 않는 독립적인 환경에서 기능을 개발하거나 버그를 수정할 수 있다.
  - <mark class="hltr-red">여러 기능</mark>을 <mark class="hltr-cyan">여러 사람</mark>이 <mark class="hltr-green">병렬적</mark> 으로 개발할 수 있게 된다.
- 명확한 기준을 갖고 브랜치를 일관되게 관리해야 한다. "Git 브랜치 전략"!
  - Git Flow, Github Flow, Trunk-based Development 등의 모범사례를 참고한다.

## Git Flow 전략

![git flow](./git-branch-strategy/git%20flow.png)

- Vincent Driessen의 [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)2010년 블로그 글에서 소개
- 브랜치는 크게 <mark class="hltr-red">main</mark>, <mark class="hltr-cyan">develop</mark> 으로 나눈다. 이 둘은 계속 유지된다.
- <mark class="hltr-green">feature</mark>, <mark class="hltr-orange">release</mark>, <mark class="hltr-pink">hotfix</mark> 브랜치는 필요할 때마다 생성되고 역할을 다하면 삭제된다.

- <mark class="hltr-red">main</mark> 브랜치
  - 출시 가능한 프로덕션 코드를 모아두는 브랜치
  - 버전 태그(1.0, 1.1 등)를 달아서 배포한다.
- <mark class="hltr-cyan">develop</mark> 브랜치
  - 다음 버전 개발을 위한 코드를 모아두는 브랜치
  - 개발이 완료되면 Main 브랜치로 병합된다.
- <mark class="hltr-green">feature</mark> 브랜치
  - 하나의 기능을 개발하기 위한 브랜치
  - develop 브랜치에서 생성되고 구현 완료 후 develop 브랜치에 병합한다.
  - 네이밍: feature/{branch-name}
- <mark class="hltr-orange">release</mark> 브랜치
  - 배포 전 QA를 진행하는 브랜치
  - develop 브랜치에서 생성되고 QA에 통과하면 main 브랜치에 병합한다.
  - 수정사항이 있다면 main과 develop 브랜치에 병합한다.
  - 네이밍: release-{version}
- <mark class="hltr-pink">hotfix</mark> 브랜치
  - 배포 후 버그가 확인돼 긴급 수정이 필요할 때 생성하여 사용하는 브랜치
  - main에서 생성하고 수정 후 main과 develop 브랜치에 병합한다.
  - 네이밍: hotfix-{version}

- 장점
  - 배포, 테스트, 개발 기능구현, 버그수정 등을 확실히 분리하여, 큰 프로젝트에서 여러 팀 간의 작업 조정에 적합하다.
  - 명확한 릴리즈 기간과 주기적인 버전이 정해진 프로덕트를 개발하는 환경에 적합하다.
  - 릴리즈 버전 관리를 위한 release 브랜치를 따로 관리하기 때문에 특정 버전에 대한 유지보수 기간이 길고 여러 버전을 동시에 관리해야 할 필요가 있을때 유용하다.
- 단점
  - 많은 브랜치 복잡성으로 인해 병합 충돌이 발생할 가능성이 있다.
  - 여러 단계의 프로세스로 인해 개발 및 릴리즈 빈도가 느려질 수 있다.
  - main과 release 브랜치의 경계가 모호하다.
  - 소규모 프로젝트에서는 불필요하게 복잡하다.
  - 전략을 고수하려면, 팀의 합의와 헌신이 필요하다.

## Github Flow 전략

![github flow](./git-branch-strategy/github%20flow.png)

- <mark class="hltr-red">main</mark>과 <mark class="hltr-cyan">feature</mark> 브랜치가 존재한다.
  - 기능 구현, 버그 수정 등 변경 사항은 모두 main 브랜치에 바로 병합된다.
  - release 브래치가 제거되었기 때문에, main 브랜치에 병합하기 전에 PR을 통한 코드리뷰로 꼼꼼히 확인하고 배포 전 라이브 서버에서 테스트를 해야 한다. 병합 후 배포가 자동으로 이루어진다(CI/CD 프로세스 전제).
- 장점
  - 기능 수정과 배포가 빨라진다.
  - Git flow에 비해 간소화되어 이해하기 쉽고 소규모 조직에 적합한 전략이다.
  - 오픈 소스 프로젝트에서 흔히 볼 수 있는 비동기적인 협업과 피드백 루프에서 주로 사용되는 전략이다.

- 단점
  - 프로젝트 규모가 커지면 치명적인 문제가 발생할 수 있다. 따라서 수시로 배포되어야 하는 소규모 프로젝트에 적합하다.
  - 수명이 긴 feature 브랜치로 인해 프로세스가 복잡해지고 병합 충돌이 증가할 수 있다.
  - 여러 릴리스 버전을 동시에 지원하는 것은 어렵다.

## Trunk-Based Development 전략

![trunk-based development](./git-branch-strategy/trunk-based%20development.png)

- <mark class="hltr-red">trunk(=main)</mark>와 <mark class="hltr-cyan">feature</mark> 브랜치가 존재한다.
  - trunk 브랜치는 mainline으로서 github flow 브랜치 전략에서 main 브랜치와 같은 의미이다.
  - feature 브랜치는 수명이 짧아야 한다(short-lived feature branches). 이 덕분에 mainline 으로 변경사항을 바로 추가할 수 있다.
- <mark class="hltr-orange">사전 준비 필요</mark>
  1. 프로덕션에 코드를 빠르게 전달(Quick rhythm to deliver code to production)
  2. 변경 사항은 작게(Small Changes)
  3. 하루에 최소 한 번은 feature 브랜치들을 trunk 브랜치에 병합(Merge branches to the trunk at least once a day)
  4. 지속적인 통합, 자동화된 테스트(Continuous Integration; Automated testing)
  5. 지속적인 배포(Continuous Delivery)
  6. 피쳐 플래그(Feature flags)
- 장점
  - 빠른 릴리즈가 가능하다.
  - 병합 충돌이 줄어든다.
- 단점
  - 정기적 통합을 위해 기능을 적절히 분할할 수 있는 숙련된 팀 필요
  - 안정성을 유지하기 위해 강력한 CI/CD 방식 필요

Git 브랜치 전략에 정답은 없다.
프로젝트 요구사항에 맞는 적절한 전략을 유연하게 사용한다.

> 참고
>
> - <https://medium.com/29cm/trunk-based-development-feature-flag-micro-pr-%EC%99%80-%ED%95%A8%EA%BB%98-%EC%A3%BC-2%ED%9A%8C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-b703d646d945>
> - <https://medium.com/daangn/%EB%A7%A4%EC%9D%BC-%EB%B0%B0%ED%8F%AC%ED%95%98%EB%8A%94-%ED%8C%80%EC%9D%B4-%EB%90%98%EB%8A%94-%EC%97%AC%EC%A0%95-1-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EC%A0%84%EB%9E%B5-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0-1a1df85b2cff>
> - <https://hudi.blog/git-branch-strategy/>
> - <https://anywaydevlog.tistory.com/109>
> - <https://trunkbaseddevelopment.com/>
