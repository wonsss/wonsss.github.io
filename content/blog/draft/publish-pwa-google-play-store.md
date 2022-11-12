---
title: PWA를 구글 플레이 스토어에 출시하기
date: 2022-11-10 10:11:54
category: pwa
thumbnail: { thumbnailSrc }
draft: true
---

## 참고

[[Ask] How to use Google Play App Signing in Debug #47](https://github.com/GoogleChromeLabs/svgomg-twa/issues/47)

feat: 앱을 웹사이트 도메인과 연결하기 위해 assetlinks 업데이트

Android App Links를 사용하여 모바일 웹 사용자를 안드로이드 앱으로 보내려면 디지털 애셋 링크 JSON 파일이 필요합니다.

기존에 올린 PWABuilder가 생성한 thumbprint 외에 추가로 Android의 thumbprint를 삽입한다.

이를 통해 안드로이드 앱에서 브라우저 주소 바를 제거하여 풀스크린이 될 수 있습니다.

참고
<https://github.com/pwa-builder/CloudAPK/blob/master/Asset-links.md>

<https://marshallku.com/web/tips/pwa%EB%A5%BC-%EC%8A%A4%ED%86%A0%EC%96%B4%EC%97%90-%EC%B6%9C%EC%8B%9C%ED%95%98%EA%B8%B0>

<<https://github.com/pwa-builder/PWABuilder/issues/9>
<https://godnr149.tistory.com/127>

<https://twitter.com/.well-known/assetlinks.json>
