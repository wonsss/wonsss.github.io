---
title: React component의 prop 이름을 짓는 규칙[번역]
date: 2022-12-09 00:12:27
category: react
thumbnail: { thumbnailSrc }
draft: false
---

> 프로젝트를 하면서 prop 이름을 임의로 지어 혼란스럽다는 느낌을 받았습니다. 팀마다 컨벤션이 있겠으나, 일단 나름의 원칙을 세워보기 위해 검색 결과 다음 글을 찾았습니다. 다음은 원문 [How to name props for React components - David's Blog](https://dlinau.wordpress.com/2016/02/22/how-to-name-props-for-react-components/)을 번역한 내용입니다. 역주를 붙였음을 참고 바랍니다.

## 리액트 컴포넌트의 props의 이름을 짓는 방법

> 컴퓨터 과학에서 어려운 일이란 단 두가지 뿐이다: `캐시 무효화` 그리고 `이름 짓기` - Phil Karlton

리액트에서 가장 어려운 일들 중 하나에 대해서 이야기하고자 한다. 리액트 컴포넌트의 props에 이름을 짓는 것 말이다.

일반적으로, prop의 이름들은 변수 이름을 짓는 방법과 몇 가지 공통 규칙을 공유해야 한다. 예를 들어, 카멜케이스(e.g. isActive)를 사용하고 이름을 짧게(50글자 미만) 만드는 것이다. 하지만, 리액트 컴포넌트 props을 위한 구체적인 몇 가지 베스트 프랙티스가 존재한다.

## prop types

-   Array
    -   복수 명사를 사용한다. (e.g. items)
-   Number
    -   접두사로 `num`이나 접미사로 `count` 또는 `index`를 사용한다. (e.g. numItmes, itemCount, itemIndex)
-   Bool
    -   접두사 `is` , `can` , `has` 를 사용한다.
    -   `is`: 시각적/행동적 변화 (isVisible, isEnable, isActive)
    -   `can`: 행동적 변화와 조건적 시각적 변화 (e.g. canToggle, canExpand, canHaveCancelButton)
    -   `has` : UI 요소 토글링 (e.g. hasCancelButton, hasHeader)
-   Object
    -   명사를 사용한다 (e.g. item)
-   Node
    -   접미사 `node` 를 사용한다. (e.g. containerNode)
-   Element
    -   접미사 `element` 를 사용한다. (e.g. hoverElement)

## 컴포넌트 그 자체를 설명하기 붙여진 이름

props는 컴포넌트 그 자체를 설명하기 위해 이름이 붙여져야 한다. props의 이름은 컴포넌트가 무엇(what)을 하는지에 대해 설명하지, 왜(why) 그것을 하는지에 대해 설명하지 않는다. 일반적인 실수는 props를 이름 지을 때 현재 사용자나 현재 환경을 따서 짓는다는 것이다. 예를 들어 다음과 같다.

-   `hasSubmitPermission` 은 사용자의 permission과 reason for variation을 나타내나, 컴포넌트(여기서 MyForm) 그 자체에 대해서는 설명하진 않는다. 이런 경우, 해당 props에 더 나은 이름은 `hasSubmitButton`이다.

    ```tsx
    <MyForm hasSubmitButton={user.canSubmit} />
    ```

-   `isMobileScreen` 은 브라우저의 윈도우 사이즈와 reason for variation을 나타내나, 컴포넌트(여기서 MyForm) 그 자체에 대해서는 설명하지 않는다. 이런 경우, 해당 props에 더 나은 이름은 `isCompactLayout` 이다.

    ```tsx
    <MyForm isCompactLayout={browser.isMobileScreen} />
    ```

또다른 일반적 실수는 해당 컴포넌트가 아니라 자식 컴포넌트를 묘사하는 이름을 사용하는 것이다.

-   `<MyList onItemClick={...} />` 이 `<MyList onClick={...} />` 보다 더 적절하다.
    > [역주] MyList 컴포넌트의 입장에서 자식 컴포넌트인 Item이 클릭되는 것을 묘사하는 props이름은 onClick보다 onItemClick이 더 적절하기 때문이다
-   `areCommentsLoading` 보다는 `isLoadingComments` 가 더 적절하다.
    > [역주] 컴포넌트 입장에서 props 이름을 짓기 때문에, `isLoadingComments` 의 주어는 해당 컴포넌트인 단수로 간주해야 한다
-   `hasIcon` 은 자식 컴포넌트의 존재를 설명한다. 만약 icon을 토글링하는 것보다 icon을 위한 더 많은 공간을 만들고 싶다면, `isSpacious` 라는 이름을 사용하는 것을 고려한다. `hasIcon` 은 why에 대한 답이지, what에 대한 답은 아니다.

## 이벤트 핸들러 props

1. prop의 이름에 접두사 `on` 를 사용한다. (e.g. onSelect, onClick)
2. 핸들러 함수의 이름에 `handle` 접두사를 사용한다. (e.g. <MyComp onClick={this.handleClick} />)
3. 내장된 이벤트 핸들러의 prop 이름을 커스텀 이벤트의 prop 이름에서 중복 사용하는 것을 피한다. 예를 들어, 만약 네이티브 focus/click 이벤트 사용이 관심사가 아니라면 prop이름으로 onFocus나 onClick 대신에 onSelect 같은 이름을 사용한다.

## Reference

원문 [How to name props for React components - David's Blog](https://dlinau.wordpress.com/2016/02/22/how-to-name-props-for-react-components/)
