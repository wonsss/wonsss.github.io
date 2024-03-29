---
title: Semantic Versioning(caret, tilde)
date: 2023-02-03 19:02:43
category: etc
thumbnail: { thumbnailSrc }
draft: false
---

## 버전 관리가 왜 필요한가 - 의존성 지옥

소프트웨어 관리에서는 시스템 규모가 커지고 더 많은 패키지를 쓸수록 “의존성 지옥”이라는 늪에 빠지기 쉽다.

-   의존성 명세를 너무 엄격하게 관리하면 버전에 갇히게 될 위험이 있다.
-   의존성을 너무 느슨하게 관리하면, 버전이 엉켜서 괴롭게 될 것이다.

이 문제의 해결책으로 버전 번호를 어떻게 정하고 올려야 하는지를 명시하는 규칙과 요구사항이 Semantic Versioning(줄여서 Semver)이다.

## Semantic Versioning(Semver)

버전을 major.minor.patch 로 관리한다.

1. 기존 버전과 호환되지 않게 API가 바뀌면 major 버전을 올린다
2. 기존 버전과 호환되면서 새로운 기능을 추가할 때는 minor 버전을 올린다
3. 기존 버전과 호환되면서 버그를 수정한 것이라면 patch 버전을 올린다.

-   메이저 버전 0(0.y.z)는 초기 개발을 위해서 사용한다. 즉, 신속한 개발을 위한 것으로서 아무 때나 마음대로 변경될 수 있으므로, 안정된 버전으로 간주하지 않는 것이 좋다. 최초 개발 배포는 0.1.0으로 하고, 이후 배포마다 마이너 버전을 올리면서 버전 관리를 한다.
-   1.0.0 버전은 공개 API를 정의한다. 이후의 버전 번호는 이때 배포한 공개 API에서 어떻게 바뀌는지에 따라 올린다. 소프트웨어가 실 서비스에 쓰이기 시작하며 사용자들이 믿고 쓸 수 있는 안정한 API라면 1.0.0이라고 여길 수 있다.

### 버전은 소수가 아니다

각 버전의 숫자는 소수가 아니다. major나 minor 버전의 경우 한 자리로 표기되면 2자리로 변경해서 이해해야 한다.

예를 들어, 1.1은 1.01과 같고 1.10과 다르다. 1.1보다 1.10이 더 높은 버전이다.

## caret(^)

npm에서 기본 설치시 모든 버전은 캐럿(caret)을 붙인 상태가 기본이다.

캐럿이란 `^1.2.3` 와 같이 Semver 앞에 붙은 `^` 특수문자를 가리킨다.

캐럿이 붙은 라이브러리는 버전 업데이트를 했을 때, 최신 minor 버전까지만 업데이트되고 해당 major 버전을 초과하여 업데이트되진 않도록 한다. 즉, 하위 호환성을 유지한다.

-   `^1.2.3` : 1.2.3보다 크거나 같고 2.0.0보다 작은 버전까지만 업데이트한다.

캐럿은 해당 라이브러리가 SemVer의 규약을 따른다는 가정하에 동작하므로, 하위 호환성이 보장된다고 생각하여 최신 minor 버전까지 업데이트를 할 수 있는 것이다.

그러나 정식 릴리즈 버전이 아닌 경우는 예외이다.

캐럿은 정식 버전 미만인 `0.y.z` 버전의 경우에는 패치 버전만 업데이트한다. 즉, `^0.1.2` 의 경우 0.1.2부터 0.2.0 미만 까지의 범위내에서 업데이트된다. 0.2를 사용하면 0.1과 달리 API가 모두 달라졌을 수도 있기 때문이다.

## tilde(~)

틸드(tilde)는 `~` 특수문자를 의미하며, 이를 버저닝에서 사용하면 현재 지정한 버전의 마지막 자리 내의 범위에서만 자동으로 업데이트한다.

-   `~0.0.1` : `>=0.0.1 <0.1.0`
-   `~0.1.1` : `>=0.1.1 <0.2.0`
-   `~0.1` : `>=0.1.0 <0.2.0`
-   `~0` : `>=0.0 <1.0`

## Referecne

[https://semver.org/lang/ko/](https://semver.org/lang/ko/)

[https://blog.outsider.ne.kr/1041](https://blog.outsider.ne.kr/1041)

[https://docs.npmjs.com/about-semantic-versioning](https://docs.npmjs.com/about-semantic-versioning)
