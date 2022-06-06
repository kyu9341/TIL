# Virtual DOM

Virtual DOM은 UI의 표현을 DOM을 추상화한 가상의 객체로서 메모리에 저장하고 DOM과 동기화하는 프로그래밍 개념이다.

### 해결하고자 하는 문제

- **DOM 조작에 의한 렌더링이 비효율적인 문제**
- SPA(Single Page Application)특징으로 **DOM 복잡도 증가에 따른 최적화 및 유지 보수가 더 어려워지는 문제**

**DOM을 반복적으로 직접 조작하면 그 만큼 브라우저가 렌더링을 자주하게 되고, 그 만큼 PC 자원을 많이 소모하게되는 문제**를 해결하기 위한 기술이다.

브라우저 단에서 DOM의 변화가 일어나면 CSS를 다시 연산하고 레이아웃을 구성하고 웹 페이지를 repaint 하는데서 시간이 소요된다.

이러한 HTML마크업을 시각적인 형태로 변환하는 시간이 드는 것은 어쩔 수 없다. 따라서 최소한의 DOM 조작을 통해 작업을 처리하는 방식으로 이를 개선할 수 있는데, 그 중에 DOM 작업을 가상화하여 미리 처리한 다음 한꺼번에 적용하는 방법이다.

하지만 한 번에 렌더링하기 위해서만 Virtual DOM을 쓰는 것은 아니다. DOM fragment를 사용해서 한번에 렌더링을 처리 할 수 있지만, 변화를 계속 추적하고 상태 공유를 감시하면서 그에 따른 동기화 작업해야하는데 Virtual DOM이 이 과정을 자동화하고 추상화하는 것이다.

**실제 DOM에 업데이트 하는 절차**

React에서 데이터가 변하여 브라우저 상의 실제 DOM에 업데이트 하는 과정은 3가지 절차를 밟는다.

1.  데이터가 업데이트 되면, 전체 UI를 Virtual DOM에 리렌더링 한다.

2.  이전 Virtual DOM에 있던 내용과 현재의 내용을 비교한다.

3. 바뀐 부분만 실제 DOM에 적용이 된다.

(컴포넌트가 업데이트 될때 , 레이아웃 계산이 한번만 이뤄짐)

### DOM(Document Object Model)

DOM은 문서 객체 모델이라고 하는데 결국은 브라우저에서 다룰 HTML 문서를 파싱하여 **문서의 구성요소들을 객체로 구조화하여 나타낸 것**

### VDOM을 사용하는 이유

DOM에 변화가 생기면 브라우저는 렌더링(Critical Rendering Path)과정을 거치게 된다.
이러한 변화가 자주 반복적이라면 그만큼 렌더링 과정이 일어나서 성능이 저하된다.
상태가 변화가 일어나면 먼저 VDOM에서 연산을 하고 달라진 부분만 DOM에 전달한다.
모든 변화를 한번에 묶어서 전달하기에 렌더링 규모가 커졌지만 딱 한 번만 렌더링 과정을 거치게 된다.

> 참조
>
> [https://jeong-pro.tistory.com/210](https://jeong-pro.tistory.com/210)
>
> [https://medium.com/@yoeubi28/virtual-dom-가상-돔-20463e213765](https://medium.com/@yoeubi28/virtual-dom-%EA%B0%80%EC%83%81-%EB%8F%94-20463e213765)
>
> [https://jw910911.tistory.com/41](https://jw910911.tistory.com/41)
>
> [https://code-masterjung.tistory.com/33](https://code-masterjung.tistory.com/33)
>
> [https://ryublock.tistory.com/41](https://ryublock.tistory.com/41)
