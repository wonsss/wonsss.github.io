---
title: React에서 Compound Component 패턴
date: 2022-12-09 02:12:27
category: react
thumbnail: { thumbnailSrc }
draft: false
---

## 컴파운드 컴포넌트 패턴

compound란 화합물 또는 복합체라는 뜻이다. 컴파운드 컴포넌트 패턴이란 컴포넌트들을 합성하여 하나의 복합체로 만드는 패턴을 의미한다.

컴파운드 컴포넌트는 컴포넌트들이 백그라운드에서 상호작용하도록 암시적인 상태를 공유하기 위해 컴포넌트들을 함께 사용하는 패턴이다.

컴파운드 컴포넌트는 기능 구현을 위해 함께 작동하는 자식 컴포넌트들의 집합으로 구성된다.

> 컴파운드 컴포넌트를 HTML의 `<select>` 와 `<option>` 요소처럼 생각해보자. 이 요소들은 떨어져서는 할 수 있는 것이 많지 않지만, 함께라면 완전한 경험을 만들 수 있다. - Kent C.Dodds
>

## 컴파운드 컴포넌트의 이점

재사용 가능한 컴포넌트를 만들려면, 해당 컴포넌트들을 사용할 다른 개발자들을 염두해야 한다. 이 패턴은 컴포넌트의 사용자에게 유연함을 제공한다. 이 패턴은 재사용 가능한 컴포넌트 뒤의 로직이 그것의 사용자를 염려하지 않게 하도록 컴포넌트의 내부 작동을 추상화할 수 있게 한다. 해당 컴포넌트의 사용자에게 오직 결합된 요소들의 배치에 대해서만 고민하도록 하며 전체적인 경험을 할 수 있게 하는 사용자 친화적인 인터페이스를 제공한다.

- 동작 구현에 필요한 상태를 내부적으로 갖고 있다. 따라서 이를 사용하는 곳에서 해당 상태가 드러나지 않아서 걱정 없이 사용할 수 있다.
- 자식 컴포넌트들을 일일이 import 할 필요가 없다.
- 유연한 마크업 구조가 가능하여 컴포넌트 자유도가 높다.
- 관심사의 분리 : 대부분의 로직이 프로바이더 컴포넌트에 있으며, 여기서 Context API를 통해 states와 handlers를 자식 컴포넌트들 간에 공유한다.

## Context API (Flexible Compound Component)

```tsx
const FlyOutContext = createContext()

function FlyOut(props) {
  const [open, toggle] = useState(false)

  return (
    <FlyOutContext.Provider value={{ open, toggle }}>
      {props.children}
    </FlyOutContext.Provider>
  )
}

function Toggle() {
  const { open, toggle } = useContext(FlyOutContext)

  return (
    <div onClick={() => toggle(!open)}>
      <Icon />
    </div>
  )
}

function List({ children }) {
  const { open } = useContext(FlyOutContext)
  return open && <ul>{children}</ul>
}

function Item({ children }) {
  return <li>{children}</li>
}

FlyOut.Toggle = Toggle
FlyOut.List = List
FlyOut.Item = Item
```

```tsx
import React from 'react'
import { FlyOut } from './FlyOut'

export default function FlyoutMenu() {
  return (
    <FlyOut> // context provider
      <FlyOut.Toggle />
      <FlyOut.List>
        <FlyOut.Item>Edit</FlyOut.Item>
        <FlyOut.Item>Delete</FlyOut.Item>
      </FlyOut.List>
    </FlyOut>
  )
}
```

- 기타 예제코드
  - [https://codesandbox.io/s/functional-flexible-compound-components-w-hooks-radio-image-form-2u3sf](https://codesandbox.io/s/functional-flexible-compound-components-w-hooks-radio-image-form-2u3sf)
  - [https://codesandbox.io/s/my-compound-components-example-qjp5z?from-embed=&file=/src/assets/index.js](https://codesandbox.io/s/my-compound-components-example-qjp5z?from-embed=&file=/src/assets/index.js)

## React.Children.map (Compound Component)

자식 컴포넌트들을 순회 처리하는 것도 컴파운드 패턴에 해당된다.

React.cloneElement를 사용하여 자식 [컴포넌트를 복제](https://www.notion.so/3244369eb03a4823ab67eb5584b2430e)하여 각각에게 open과 toggle 메서드를 넘길 수 있다.

```tsx
export function FlyOut(props) {
  const [open, toggle] = React.useState(false)

  return (
    <div>
      {React.Children.map(props.children, child =>
        React.cloneElement(child, { open, toggle })
      )}
    </div>
  )
}
```

- 단점
  - 내부에서 [React.Children.map](http://React.Children.map) 을 사용하고 있어서 사용하는 곳에서 자식 컴포넌트를 약속된 형태로만 넘겨야 하는 제약이 있다. 컴포넌트 사용자가 레이아웃을 재배치하기 어려워 유연성이 떨어진다. context API를 사용하는 Flexible Compound Component 패턴을 사용하면 해결된다.
  - 엘리먼트를 복제하면, 복제 대상 컴포넌트가 기존에 갖고 있는 prop의 이름과 충돌할 수 있다. 이 경우, [React.cloneElement](https://ko.reactjs.org/docs/react-api.html#cloneelement)를 사용할 때 넘어간 값으로 해당 prop이 덮어씌워진다.
- 기타 예제코드 : [https://codesandbox.io/s/functional-compound-components-w-hooks-radio-image-form-2zbhs](https://codesandbox.io/s/functional-compound-components-w-hooks-radio-image-form-2zbhs)

## 정리

> 5 Advanced React Patterns에서 Alexis Regnaud의 의견

- 제어의역전(IoC): 1/4
  - 해당 컴포넌트 사용자에게 주어지는 유연성(flexibility)와 제어(control)의 정도
- 구현의 복잡도: 1/4
  - 해당 컴포넌트 패턴을 사용하는 난이도

### 이 패턴을 사용하는 라이브러리

- [React Bootstrap](https://react-bootstrap.github.io/components/dropdowns/)
- [Reach UI](https://reach.tech/accordion/)

## Reference

- [5 Advanced React Patterns - Alexis Regnaud]([https://javascript.plainenglish.io/5-advanced-react-patterns-a6b7624267a6](https://javascript.plainenglish.io/5-advanced-react-patterns-a6b7624267a6))
- [React Component Patterns - dev.to]([https://dev.to/alexi_be3/react-component-patterns-49ho#compound-components](https://dev.to/alexi_be3/react-component-patterns-49ho#compound-components))
- [Compound 패턴 - patterns.dev]([https://patterns-dev-kr.github.io/design-patterns/compound-pattern/](https://patterns-dev-kr.github.io/design-patterns/compound-pattern/))
