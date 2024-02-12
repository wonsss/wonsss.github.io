---
title: Next.js 13 서버 컴포넌트와 App 디렉터리에 대한 가이드(번역)
date: 2023-10-02 17:10:18
category: nextjs
thumbnail: { thumbnailSrc }
draft: false
---

원글 출처: <https://makerkit.dev/blog/tutorials/nextjs13>

## Next.js 13 은 어떤 변화를 가져왔을까요?

Next.js 13은 리액트 프레임워크에서 중요한 릴리즈입니다. 앱 라우터라고 불리는 새로운 라우팅 시스템을 가져왔습니다. 여러 면에서, 이 새 라우팅 시스템은 이전 라우팅 시스템을 완전히 재정의했고, 우리가 Next.js 애플리케이션을 만드는 방식을 근본적으로 바꾸었습니다.

새 `app` 디렉터리는 기존의 `pages` 디렉터리에서 많은 개선을 가져왔습니다. 그리고 이는여러 실험 릴리즈 이후에 Next.js 앱을 만드는 새로운 기본 방법입니다.

### 서버 컴포넌트(RSC)

새 앱 라우터에서 가장 큰 변화는 서버 컴포넌트의 도입입니다. 서버 컴포넌트는 서버에서 실행되며 클라이언트에게 전달될 컴파일된 JSX를 반환하는 새로운 유형의 리액트 컴포넌트입니다. 서버 컴포넌트는 페이지의 스켈레톤을 렌더링하는 데 유용하고, 서버에서 병렬적으로 데이터를 가져오고, 이를 “클라이언트 컴포넌트”에 전달합니다.

서버 컴포넌트는 새 `app` 디렉터리에서 기본 컴포넌트 유형입니다.

### Layouts

서버 컴포넌트로 동작하는 레이아웃은 페이지들을 감싸는 기초 컴포넌트입니다. Next.js의 Layout은 페이지 간 공통 UI를 표시하는 경우에 유용할 뿐만 아니라, 페이지 간 로직과 데이터 페칭을 재사용하는 데에도 유용합니다.

레이아웃은 현재 Next.js 라우팅 시스템의 흔한 이슈인 waterfall 문제를 해결합니다. 실제로, 새 앱 라우터 방식을 통해, 데이터를 병렬로 가져올 수 있고, 이를 페이지 컴포넌트에 전달할 수 있습니다. 이는 현재 라우팅 시스템에 대한 커다란 성능 개선입니다.

### 서버 액션

아직 알파 버전인 서버 액션은 API 핸들러에서 함수를 작성하는 대신 서버에서 함수를 실행하는 새로운 방법입니다. 서버 액션은 예를 들어 이메일을 발송하거나 데이터베이스를 업데이트하는 것과 같은 서버 사이드 로직을 실행하는 데 유용합니다. 서버 액션은 양식 제출, 서버 사이드 로직을 실행, 새 페이지로 사용자를 리다이렉트시키는 것과 같은 경우에 유용합니다.

게다가, 서버 액션은 데이터 뮤테이션으로 인한 복잡한 클라이언트 사이드 상태 관리(예를 들어 리덕스 스토어 업데이트)의 필요성을 제거하고, 서버 컴포넌트에서 가져온 데이터의 유효성을 재검사할 수 있는 가능성을 제공합니다.

이 튜토리얼에서는 서버 액션에 대해 소개만 하고, 자세한 내용은 이 튜토리얼 마지막에 링크로 첨부될 별도의 아티클에서 다룰 예정입니다.

### 개선된 라우터

일반적인 파일 이름을 사용함으로써, 우리는 `app` 디렉터리에 다양한 유형의 컴포넌트를 추가할 수 있습니다. 이는 API 핸들러나 등의 페이지를 정의하기 위해서는 특정한 디렉터리 구조를 사용하도록 요구했던 기존의 라우팅 시스템에서 더 나아간 큰 개선점입니다.

이는 무엇을 의미할까요? 이제부터 우리는 `app` 디렉터리에 Next.js와 관련된 특정 파일 이름 컨벤션을 사용하여 다양한 유형의 컴포넌트를 만들 수 있습니다.

-   페이지는 `page.tsx` 로 정의됩니다.
-   레이아웃은 `layout.tsx` 로 정의됩니다.
-   템플릿은 `template.tsx` 로 정의됩니다.
-   에러는 `error.tsx` 로 정의됩니다.
-   로딩 상태는 `loadint.tsx` 로 정의됩니다.
-   not found 페이지는 `not-found.tsx` 로 정의됩니다.

### 서버 컴포넌트

서버 컴포넌트는 서버에서 실행되며 클라이언트에 전달될 컴파일된 JSX를 반환하는 새로운 유형의 리액트 컴포넌트입니다. Next.js 13에서 릴리즈된 새 앱 디렉터리를 통해 Next.js는 서버 컴포넌트를 기본 유형의 컴포넌트로 만듦으로써 서버 컴포넌트를 완전히 받아들였습니다.

이는 서버와 클라이언트 양 쪽에서 실행되던 전통적인 리액트 컴포넌트에서 커다란 변화입니다. 실제로, 앞서 설명했듯이, 리액트 서버 컴포넌트는 클라이언트에서는 실행되지 않습니다.

이와 같이, 서버 컴포넌트를 사용하기 위해서 우리가 마음에 새겨야 할 몇 가지 제약사항이 있습니다.

-   서버 컴포넌트는 browser-only API들을 사용할 수 없습니다.
-   서버 컴포넌트는 React hooks를 사용할 수 없습니다.
-   서버 컴포넌트는 Context를 사용할 수 없습니다.

---

그러면, 서버 컴포넌트는 무엇을 위한 것일까요?

리액트 서버 컴포넌트는 소위 “클라이언트 컴포넌트”에 상호작용적인 부분을 남기고 페이지 스켈레톤을 렌더링하는 데 유용합니다.

“클라이언트 컴포넌트”라는 이름에도 불구하고, 이 컴포넌트는 서버에서 렌더링되고, 서버와 클라이언트 양쪽에서 실행될 수 있습니다.

리액트 서버 컴포넌트는 다음과 같은 사항을 가능하게 하므로 유용합니다.

-   페이지를 더 빠르게 렌더링합니다.
-   클라이언트로 전달되어야 할 자바스크립트의 양을 줄입니다.
-   서버에서 렌더링된 페이지의 라우팅 성능을 향상시킵니다.

간략히 말하여, 우리는 서버 컴포넌트를 서버에서 데이터를 가져오고 페이지의 스켈레톤을 렌더링하는 데 사용합니다. 그리고 그 데이터를 “클라이언트 컴포넌트”에 전달합니다.

## 서버 컴포넌트 vs 클라이언트 컴포넌트

앞서 살펴봤듯이, 클라이언트 컴포넌트는 이미 우리가 알고 있는 것과 같고, 서버 컴포넌트는 페이지의 스켈레톤을 렌더링하는 데 유용합니다.

[Next.js docs에서 이에 대한 비교](https://nextjs.org/docs/app/building-your-application/rendering#when-to-use-server-vs-client-components)는 둘의 차이를 이해하는 데 좋은 방법입니다.

### 서버 컴포넌트 정의

서버 컴포넌트는 정의되기 위하여 별도의 표기법 같은 것이 필요하지 않습니다. 서버 컴포넌트는 app 디렉터리에서 렌더링될 때 기본 컴포넌트방식 입니다.

서버 컴포넌트에서는 React hook, Context, browser-only API를 사용할 수 없습니다. 하지만, `headers`, `cookies` 와 같은 서버 컴포넌트에서만 사용 가능한 API들을 사용할 수 있습니다.

서버 컴포넌트는 클라이언트 컴포넌트를 import 할 수 있습니다.

아래 코드에서 `ServerComponent` 는 클라이언트 컴포넌트의 자식이 아님을 전제합니다. 해당 서버 컴포넌트는 컴파일된 JSX로서 서버에서 렌더링되고 클라이언트로 전달됩니다.

```tsx
export default function ServerComponent() {
	return <div>Server Component</div>
}
```

### 클라이언트 컴포넌트 정의

반면, 클라이언트 컴포넌트를 정의하려면 Next.js의 App 디렉터리에서 파일의 최상단에 `use client` 라는 pragma(전처리 지시문)을 명시해야 합니다.

```tsx
"use client"

export default function ClientComponent() {
	return <div>Client Component</div>
}
```

클라이언트 컴포넌트를 사용할 때, React hook, Context, browser-only API들을 사용할 수 있습니다. 하지만, `headers`, `cookies` 등과 같은 서버 컴포넌트에서만 사용 가능한 API들은 사용할 수 없습니다.

주의: 클라이언트 컴포넌트는 서버 컴포넌트를 import 할 수 없습니다. 그러나 서버 컴포넌트를 클라이언트 컴포넌트의 child나 prop으로서 전달할 수는 있습니다.

## App 디렉터리

Next.js 13에서 릴리즈된 새 “app” 디렉터리는 Next.js 앱을 만드는 새 방식입니다. 이 방식은 `pages` 디렉터리와 공존할 수 있고, 기존 프로젝트를 새 디렉터리 구조로 점진적으로 마이그레이션하기 위해 사용할 수 있습니다.

이 새 디렉터리 구조는 그저 앱을 만들기 위한 새 방식이 아닙니다. 기존 방식에 비해 훨씬 더 강력한 완전히 새로운 라우팅 시스템입니다.

### Next.js 13 폴더 구조

Next.js 파일 구조는 어떻게 생겼을까요? 이번 튜토리얼에서 사용할 예제 앱을 살펴봅시다.

새 `app` 디렉터리를 사용한 Next.js 13 앱의 예시는 아래와 같습니다.

```tsx
;-app -
	layout.tsx -
	site -
	page.tsx -
	layout.tsx -
	app -
	dashboard -
	page.tsx -
	layout.tsx
```

보시다시피, 파일의 이름이 컴포넌트의 유형 자체를 반영합니다. 예를 들어, `layout.tsx` 는 레이아웃 컴포넌트이고, `page.tsx` 는 페이지 컴포넌트인 식입니다.

걱정 마세요, 다음 섹션에서 모든 컴포넌트의 유형에 대해 살펴볼 예정입니다.

### Next.js 라우팅 구조에서 co-locating

새 `app` 디렉터리에서 중요한 부수 효과는 파일들을 같은 곳에 둘 수 있게(co-locate) 되었다는 점입니다. 파일 이름들이 컨벤션을 따르므로, 이들을 페이지 컴포넌트로 만들지 않고서도 `app` 디렉터리에서 어떤 파일이든 정의하라 수 있습니다. 기존의 `pages` 라우터와 달리, `app` 디렉터리에서 어떤 유형의 컴포넌트든 정의할 수 있습니다.

예를 들어, 특정한 페이지를 위한 컴포넌트들을 해당 페이지가 정의된 그 폴더에 정확히 둘 수 있습니다.

```tsx
;-app -
	site -
	components -
	Dashboard.tsx -
	hooks -
	use -
	fetch -
	data -
	hook.ts -
	page.tsx
```

참고: `(site)` 는 왜 소괄호일까요? 소괄호를 사용함으로써, 이 `site` 디렉터리를 “경로 없음”으로 만들 수 있습니다. 이는 라우팅에 새 path segement를 추가하지 않고도 `site` 디렉터리 내에 새 레이아웃, 로딩 파일, 페이지들을 만들 수 있음을 의미합니다.

`(site)` 하위의 페이지들은 root 경로(`/`)에서 접근 가능합니다. 예를 들어, 페이지 `app/(site)/page.tsx` 는 `/` 에서 접근됩니다.

## Next.js 13 폴더 구조 베스트 프랙티스

새 `app` 디렉터리와 관련해서, 우리의 코드베이스를 더 지속가능하고, 새 디렉터리 구조로 마이그레이션하기 쉽게 만들기 위해 따라야 할 베스트 프랙티스가 몇 가지 있습니다.

### 파일을 그들이 사용되는 곳 가까이에 위치시킵니다

Next.js 13에서는 컴포넌트들을 어디에 둘까요? 답은 상황에 따라서입니다.

`app` 디렉터리에서 파일들을 colocate 할 수 있기 때문에, 파일들을 그들이 사용되는 곳 가까이에 위치시킬 수 있습니다. 예를 들어, 컴포넌트를 자신을 사용하는 페이지와 같은 디렉터리 내에 둘 수 있습니다.

```tsx
;-app - site - page.tsx - components - PageComponent.tsx
```

위에서 볼 수 있듯이, `PageComponent` 를 그것을 사용하는 페이지와 같은 디렉터리 내에 둘 수 있습니다. 이는 별도의 디렉터리에 컴포넌트를 위치해야 했던 기존의 `pages` 디렉터리에 비해 큰 개선입니다.

하지만 이게 전부가 아닙니다. 실제로, 여러 페이지에서 컴포넌트를 재사용하길 원한다면 별도의 디렉터리에 컴포넌트를 둘 수도 있습니다. 이에 관련된 내용을 계속해서 읽어보세요.

### Next.js 13에서 컴포넌트와 파일들을 colocate 해서는 안되는 경우

많은 경우, 당신의 컴포넌트나 라이브러리가 여러 페이지에서 사용되며 전역적일 수 있습니다. 이러한 경우, 이들을 `app` 디렉터리나 `app/components` , `app/lib` 등과 같은 별도의 디렉터리에 둘 수 있습니다.

이 파일들이 다양한 곳에서 사용될 필요가 있기 때문에 앱 전체에서 공유될 수 있는 별도의 디렉터리에 두는 것이 합리적으로 보입니다.

이것이 우리가 `SaaS` 스타터 킷의 구조를 잡은 방법과 같습니다.

예를 들어, 앱 전체에서 사용되는 모든 컴포넌트들을 포함하는 `components` 디렉터리와 앱 전체에서 사용되는 라이브러리들을 포함하는 `lib` 디렉터리를 갖고 있습니다.

```tsx
;-src -
	app -
	layout.tsx -
	site -
	page.tsx -
	layout.tsx -
	components -
	HomePage.tsx -
	HomePageNewsletterInput.tsx -
	components -
	Button.tsx -
	Input.tsx -
	lib -
	api.ts -
	auth.ts -
	storage.ts
```

### route group을 언제 사용할까요

Route group은 공통 path segement 나 공통 레이아웃, 또는 레이아웃에서 분리된 페이지 하위에서 URL 결과에 영향을 미치지 않고 페이지를 그룹화하는 방법입니다. 예를 들어, `/dashboard` 경로 하위에 모든 페이지를 묶고 싶다면, route group을 사용할 수 있습니다.

```tsx
;-app -
	dashboard -
	page.tsx -
	layout.tsx -
	analytics -
	page.tsx -
	billing -
	page.tsx
```

위 케이스에서, `/dashboard` 하위의 페이지들은 root `/` 경로로 하위에서 접근 가능합니다. 예를 들어, `app/(dashboard)/analytics/page.tsx` 페이지는 `/analytics` 에서 접근 가능합니다.

즉, 이 페이지들은 `app/(dashboard)/layout.tsx` 에서 정의된 레이아웃을 함께 공유합니다. `(dashboard)` route group 하위의 모든 페이지들을 위한 공통 레이아웃을 정의하거나 모든 페이지에서 필요한 데이터를 불러올 수 있습니다.

## 레이아웃

Next.js 레이아웃은 새 App 라우터로 인해 가능해진 가장 큰 새 기능 중 하나입니다. Next.js 레이아웃은 page들을 감싸는 기초 컴포넌트입니다. 페이지 간 공통 UI를 표시하는 데 유용할뿐만 아니라, data-fetching과 로직 재사용에도 유용합니다.

Next.js는 root layout 컴포넌트가 필요합니다.

```tsx
export const metadata = {
	title: "Next.js Tutorial",
	description: "A Next.js tutorial using the App Router",
}

async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang={"en"}>
			<body>{children}</body>
		</html>
	)
}

export default RootLayout
```

레이아웃은 `app` 디렉터리 내에서 `layout.tsx` 컨벤션을 사용함으로써 정의됩니다. Next.js는 레이아웃이 정의된 폴더 내에서 모든 페이지들을 자동으로 감쌉니다.

예를 들어, `app/(site)/layout.tsx` 에 레이아웃을 정의했다면, Next.js는 `app/(site)` 디렉터리 내에 있는 모든 페이지들을 이 레이아웃으로 감쌀 수 있습니다.

```tsx
export default async function SiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div>
			<main>{children}</main>
		</div>
	)
}
```

그 결과, `app/(site)` 디렉터리 내 모든 페이지들은 `SiteLayout` 컴포넌트로 감싸집니다.

## 레이아웃 컴포넌트에서 데이터 로딩하기

레이아웃 컴포넌트는 디렉터리의 모든 페이지에서 필요한 데이터를 로드할 필요가 있을 때 아주 유용할 수 있습니다. 예를 들어, 레이아웃 컴포넌트에서 사용자의 프로필을 로드할 수 있고, 이를 페이지 컴포넌트에 전달할 수 있습니다.

Next.js의 레이아웃 컴포넌트에서 데이터를 fetch하면, `use` 라는 새로운 훅을 사용할 수 있습니다. 이는 서버에서 데이터를 fetch하기 위해서 `Suspense` 를 사용하는 실험적인 리액트의 훅입니다.

```tsx
import { use } from "react"

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const data = use(getData())

	return (
		<div>
			<header>{data.user ? <ProfileDropown /> : null}</header>

			<main>{children}</main>
		</div>
	)
}

function getData() {
	return fetch("/api/data").then(res => res.json())
}
```

위 예시를 살펴보면,

1. `use` 훅을 사용함으로써 레이아웃 컴포넌트에서 데이터를 fetch하고 있습니다.
2. data.user 프로퍼티의 유무에 따라 `ProfileDropdown` 컴포넌트를 조건부 렌더링하고 있습니다.

참고: 데이터를 fetch하기 위해 `use` 훅을 동기적인 방식으로 사용하였습니다. `use` hook은 기저에서 비동기적인 코드를 동기적인 방식으로 사용 가능하게 하는 `Suspense` 를 사용하기 때문입니다.

### 서버 컴포넌트에서 Async/Await 사용하기

대안으로는 컴포넌트를 `async` 컴포넌트로 만들고, `getData` 에서 데이터를 fetch하기 위해서 `async/await` 를 사용하는 것입니다.

```tsx
export default async function SiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const data = await getData()

	return (
		<div>
			<header>{data.user ? <ProfileDropown /> : null}</header>

			<main>{children}</main>
		</div>
	)
}

function getData() {
	return fetch("/api/data").then(res => res.json())
}
```

### 쿠키와 헤더 읽기

서버 컴포넌트를 사용한다면, `next/headers` 패키지를 통해 쿠키와 헤더를 읽을 수 있습니다.

주의: 이 글의 작성 시점에는, 이 함수들을 오직 값을 읽는 경우에만 사용할 수 있고 값을 설정하거나 제거하는 데는 사용할 수 없습니다.

```tsx
import { cookies } from "next/headers"

export function Layout({ children }: { children: React.ReactNode }) {
	const lang = cookies.get("lang")

	return (
		<html lang={lang}>
			<body>{children}</body>
		</html>
	)
}
```

만약 무언가 잊은 것 같은 느낌이 든다면, 걱정 마세요, 당신만 그런 생각이 드는 것이 아닙니다. 실제로, `getServerSideProps` 와 달리, `request` 객체에 접근할 수가 없습니다. 이 때문에 Next.js 가 request 에서 데이터를 읽을 수 있도록 이러한 유틸들을 선보인 것입니다.

### 레이아웃에서 리다이렉트하기

레이아웃에서는, 사용자를 다른 페이지로 리다이렉트시킬 수 있습니다.

예를 들어, 사용자가 인증되지 않았다면, 로그인 페이지로 리다이렉트시키고 싶을 수 있고 이를 레이아웃 컴포넌트에서 할 수 있습니다.

```tsx
import { use } from "react"
import { redirect } from "next/navigation"

function AuthLayout(props: React.PropsWithChildren) {
	const session = use(getSession())

	if (session) {
		return redirect("/dashboard")
	}

	return <div className={"auth"}>{props.children}</div>
}

function getSession() {
	return fetch("/api/session").then(res => res.json())
}
```

이제, 레이아웃 컴포넌트에서 `loadSession` 같은 함수를 사용할 수 있습니다.

```tsx
import { use } from "react"

function AuthLayout(props: React.PropsWithChildren) {
	const response = use(loadSession())
	const data = response.data

	// do something with data

	return <div className={"auth"}>{props.children}</div>
}
```

### Next.js에서 리다이렉트 부수 효과 사용하기

새 Next.js 함수 `redirect` 는 에러를 던질 수 있습니다. 실제로, 그 반환 타입은 `never` 입니다. 에러를 캐치한다면, 주의를 기울여 에러에서 발생한 리다이렉트를 따라야 합니다.

그렇게 하기 위해, Next.js 패키지에서 export된 몇 가지 유틸리티를 사용할 수 있습니다(isRedirectError, getURLFromRedirectError).

```tsx
import { use } from "react"

import {
	isRedirectError,
	getURLFromRedirectError,
} from "next/dist/client/components/redirect"

import { redirect } from "next/navigation"

async function loadData() {
	try {
		const data = await getData()

		if (!data) {
			return redirect("/login")
		}

		const user = data.user

		console.log(`User ${user.name} logged in`)

		return user
	} catch (e) {
		if (isRedirectError(e)) {
			return redirect(getURLFromRedirectError(e))
		}

		throw e
	}
}

function Layout(props: React.PropsWithChildren) {
	const data = use(loadData())

	// do something with data

	return <div>{props.children}</div>
}
```

## 페이지

새 app 디렉터리에서 페이지들을 정의하기 위해서, `page.tsx` 라는 특별한 컨벤션을 사용합니다. 이는 `app` 디렉터리에서 페이지를 정의하고 싶다면, 그 파일 이름을 `page.tsx` 로 지어야 한다는 것을 의미합니다.

예를 들어, 당신의 웹사이트의 홈페이지를 정의하고 싶다면, 그 페이지를 `app/(site)` 디렉터리 내에 두고 그 파일 이름을 `page.tsx` 로 명명해야 합니다.

```tsx
function SitePage() {
	return <div>Site Page</div>
}

export default SitePage
```

### 페이지의 메타데이터와 SEO

페이지의 메타데이터를 지정하려면, `page.tsx` 파일 내에 `metadata` 속성 상수를 export 할 수 있습니다.:

```tsx
export const metadata = {
	title: "Site Page",
	description: "This is the site page",
}
```

동적인 데이터에 접근하고자 한다면, `generateMetadata` \*\*\*\* 함수를 사용할 수 있습니다.:

```tsx
export async function generateMetadata({ params, searchParams }) {
	return { title: "..." }
}
```

[지원되는 메타데이터 속성들의 전체 목록을 Next.js 문서](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)에서 확인해보세요.

### 정적인 페이지 생성하기

동적인 파라미터와 함께 사용되는 정적인 페이지 목록을 만들기 위해서, `generateStaticParams` 함수를 사용할 수 있습니다.

```tsx
// 경로: app/blog/[slug]/page.js

export async function generateStaticParams() {
	const posts = await getPosts()

	return posts.map(post => ({
		slug: post.slug,
	}))
}
```

[정적인 경로를 생성하는 것에 대한 전체 문서](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)를 확인해보세요.

## 로딩 인디게이터

페이지 사이를 이동할 때, 로딩 인디게이터를 표시하고 싶을지도 모릅니다. 그렇게 하기 위해서, 각 디렉터리에 `loading.tsx` 파일을 정의함으로써 사용할 수 있습니다.

```tsx
// 경로: app/loading.tsx

export default function Loading() {
	return <div>Loading...</div>
}
```

여기에 페이지가 로딩될 때 표시하고 싶은 컴포넌트를 추가할 수 있습니다. 예를 들면, top bar loader나 로딩 스피너 또는 둘 다

## 에러 핸들링

`not-found.tsx` 컨벤션을 사용하여 "찾을 수 없는" 페이지를 정의할 수 있습니다.

```tsx
export default function NotFound() {
	return (
		<>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
		</>
	)
}
```

이 파일은 `notFound` 함수를 사용할 때만 표시됩니다. 그래서 이 때문에 여전히 기존의 `pages` 디렉터리에서 커스텀 400, 500 페이지를 사용하는 것이 권장됩니다.

## 폰트

`next/font` 패키지를 폰트 로드 시 사용할 수 있습니다.

그러려면, 폰트에 대한 클라이언트 컴포넌트를 정의하고, 이를 root 레이아웃인 `app/layout.tsx` 파일에서 import해야 합니다.

```tsx
// 경로: app/Fonts.tsx
"use client"

import { Inter } from "next/font/google"
import { useServerInsertedHTML } from "next/navigation"

const heading = Inter({
	subsets: ["latin"],
	variable: "--font-family-heading",
	fallback: ["--font-family-sans"],
	weight: ["400", "500"],
	display: "swap",
})

export default function Fonts() {
	useServerInsertedHTML(() => {
		return (
			<style
				dangerouslySetInnerHTML={{
					__html: `
          :root {
            --font-family-sans: '-apple-system', 'BlinkMacSystemFont',
              ${sans.style.fontFamily}, 'system-ui', 'Segoe UI', 'Roboto',
              'Ubuntu', 'sans-serif';
 
            --font-family-heading: ${heading.style.fontFamily};
          }
        `,
				}}
			/>
		)
	})

	return null
}
```

위와 같은 `Fonts` 컴포넌트를 root 레이아웃에서 import 할 수 있습니다.

```tsx
// 경로: app/layout.tsx

import Fonts from "~/components/Fonts"

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html>
			<Fonts />

			<body>{children}</body>
		</html>
	)
}
```

## API Routes

새 앱 디렉터리는 또한 API Routes를 지원합니다. API Route를 정의하기 위한 컨벤션은 `app` 디렉터리 내에 `route.tsx` 라는 이름의 파일을 만드는 것입니다.

API 라우트는 `req` 나 `res` 객체와 같은 `express` 대신에 표준 `Request` 객체를 사용합니다.

API route를 정의할 때, 지원하고 싶은 메서드들에 대한 핸들러를 export할 수 있습니다. 예를 들어, `GET` 과 `POST` 메서드들을 지원하고 싶다면, `GET` 과 `POST` 함수들을 export할 수 있습니다.

```tsx
// 경로: app/api/route.tsx

import { NextResponse } from "next/server"

export async function GET() {
	return NextResponse.json({ hello: "world" })
}

export async function POST(request: Request) {
	const body = await request.json()
	const data = await getData(body)

	return NextResponse.json(data)
}
```

쿠키를 설정하는 것과 같이 응답을 조작하기 원한다면, `NextResponse` 객체를 사용할 수 있습니다.

```tsx
// 경로: app/api/route.tsx

export async function POST(request: Request) {
	const organizationId = getOrganizationId()
	const response = NextResponse.json({ organizationId })

	response.cookies.set("organizationId", organizationId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
	})

	return response
}
```

대안으로서, API route나 서버 액션에서 쿠키를 설정하기 위해 `cookies().set` 함수도 사용할 수 있습니다.

```tsx
// 경로: app/api/route.tsx

import { cookies } from "next/headers"

export async function POST(request: Request) {
	const organizationId = getOrganizationId()

	cookies().set("organizationId", organizationId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
	})

	return NextResponse.json({ organizationId })
}
```

주의: 서버 컴포넌트에서는 쿠키를 설정할 수 없습니다. 서버 컴포넌트에서 아래와 같이 쿠키를 설정한다면 에러가 발생할 것입니다.

```tsx
import { cookies } from "next/headers"

export default function ServerComponent() {
	cookies().set("organizationId", organizationId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
	})

	return <div>Server Component</div>
}
```

### API Route에서 리다이렉트하기

API Route에서도, 서버 컴포넌트에서처럼, `next/navigation` 으로부터 import된 `redirect` 함수를 사용함으로써 사용자를 리다이렉트시킬 수 있습니다.

```tsx
// 경로: app/api/route.tsx

import { redirect } from "next/navigation"

export async function GET(request: Request) {
	return redirect("/login")
}
```

### Webhook 핸들링

웹훅 핸들링은 API route에 대한 일반적인 사용 방법이고, 이제 raw body request를 얻는 것이 더 쉬워졌습니다. 기존의 Page 라우팅 시스템에 비해 App 라우터에서 요청 객체로부터 raw body를 얻기 위해 Next.js에서 웹훅을 처리하는 것이 더 쉬워졌습니다.

실제로, `request.text()` 메서드를 사용함으로써 raw body request를 얻을 수 있습니다.

```tsx
// 경로: app/api/webhooks.tsx

export async function POST(request: Request) {
	const rawBody = await request.text()

	// handle webhook here
}
```

## 서버 액션

서버 액션은 Next.js 13에서 도입된 새 개념입니다. 이것은 클라이언트로부터 호출될 수 있는 서버 사이드 액션을 정의하는 방법입니다. 함수를 정의하고 이를 `use server` 키워드를 상단에 사용하므로써 정의하는 것이 전부입니다.

예를 들어, 아래는 서버 액션을 사용하는 유효한 방법입니다.

```tsx
async function myActionFunction() {
	"use server"

	// do something
}
```

클라이언트 컴포넌트로부터 서버 액션을 정의한다면, 해당 액션은 별개의 파일에서 export하여, 클라이언트 컴포넌트 내에 import되어야 합니다. 그 파일은 상단에 `use server` 키워드가 필요합니다.

```tsx
"use server"

async function myActionFunction() {
	// do something
}
```

클라이언트에서 서버 액션을 호출하기 위해서, 여러 방법을 사용할 수 있습니다.

1. `form` 컴포넌트의 `action` 프로퍼티로서 액션을 정의합니다.
2. `formAction` 을 사용함으로써 `button` 컴포넌트로부터 액션을 호출합니다.
3. `useTransition` 훅을 사용하여 액션을 호출합니다.(만약 데이터를 뮤테이트한다면)
4. 일반 함수처럼 액션을 단순하게 호출합니다.(만약 데이터를 뮤테이트하지 않는다면)

### 서버 액션에 대해 더 배우기

서버 액션에 대해 더 알고싶다면, [Next.js 서버 액션 아티클](https://makerkit.dev/blog/tutorials/nextjs-server-actions)을 살펴보세요.

## 서버 컴포넌트에서 `cache` 기능 사용하여 연산 재사용하기

리액트는 서버 컴포넌트에서 연산을 재사용할 수 있게 하는 `cache` 라는 이름의 새 유틸리티를 제공합니다.

서버 컴포넌트는 서버에서 병렬로 렌더링될 수 있기 때문에, 여러 컴포넌트에서 연산을 재활용하기 위해 `cache` 유틸리티를 사용할 수 있습니다.

예를 들어, 서버에서 현재 사용자를 fetch하려는 2개의 레이아웃을 갖고 있다고 가정한다면, `cache` 유틸리티를 사용하여 연산을 재사용할 수 있습니다.

```tsx
import { cache } from "react"

export const getUser = cache((userId: string) => {
	return client.auth.getUserById(userId)
})
```

물론, `client.auth.getUserById` 를 서버에서 사용자를 fetch하기 위한 당신만의 함수로 대체할 수도 있습니다. 이는 당신이 사용중인 인증 프로바이더에 따라 다를 수 있습니다.

그러나 중요한 점은 `cache` 유틸리티는 함수의 결과를 캐싱하고, `userId` 를 캐시 키로서 사용하여 컴포넌트 간에 재사용할 수 있다는 점입니다. 만약 다른 키가 전달되면, 함수는 재호출될 것입니다.

캐시 수명은 어떻게 될까요? 캐시 수명 주기는 request 주기와 같습니다. 리액트는 request이 완료되면 캐시를 제거합니다. 따라서 오래된 데이터를 걱정할 필요가 없습니다.
