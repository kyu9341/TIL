# 클래스형 컴포넌트

리액트의 클래스형 컴포넌트에서는 라이프사이클 메서드가 존재하여 이를 사용하고, 함수형 컴포넌트에서는 `Hook`을 사용한다.

<img width="1129" alt="Screen Shot 2021-05-19 at 21 13 03 PM" src="https://user-images.githubusercontent.com/49153756/118824290-b1d52900-b8f4-11eb-8d8b-ba07baf840da.png">

> 이미지 출처 : [https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

### 마운트

컴포넌트의 인스턴스를 생성하여 DOM에 추가될 때 다음 순서로 호출된다.

- **[`constructor()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#constructor)**

  - 일반적으로 `React`에서 생성자는 두 가지 목적으로 사용된다.

  1. `this.state` 에 객체를 할당하여 컴포넌트의 상태를 초기화
  2. 이벤트 핸들러를 인스턴스에 바인딩

  ```tsx
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
  ```

- [`static getDerivedStateFromProps()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#static-getderivedstatefromprops)
  - 초기 마운트나 이후 업데이트 상황에서 render 메서드를 호출하기 직전에 호출된다.
  - 컴포넌트가 props의 변경의 결과로 내부의 상태를 업데이트 하는 경우 사용된다.
- **[`render()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#render)**
  - 클래스형 컴포넌트에서 유일한 필수 메서드인데, 호출될 때마다 동일한 결과를 반환한다.
- **[`componentDidMount()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#componentdidmount)**
  - 컴포넌트가 마운트된 직후 호출된다.
  - DOM에 접근이 필요한 초기화는 이 메서드에서 해야 한다. 또한 서버 등에서 데이터를 로딩해야하는 경우 네트워크 요청을 하기 좋은 위치이다.
  - 이 위치에서 `setState()`를 호출하는 경우도 발생한다. 이로 인해 추가적인 렌더링이 발생하지만, 브라우저가 화면을 갱신하기 전에 이루어진다. 이 때 `render()`가 두 번 호출되나, 사용자는 그 중간과정을 볼 수가 없다. 이후 성능 문제로 이어질 수 있기 때문에 주의가 필요하다.

### 업데이트

업데이트는 `props`나 `state`의 변경으로 인해 발생하고, 컴포넌트가 리렌더링 될 때 다음의 순서로 호출된다.

- [`static getDerivedStateFromProps()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#shouldcomponentupdate)
  - props나 state가 변경되는 경우 컴포넌트 리렌더링 여부를 결정한다.
  - `boolean`값을 반환하고 `default`로는 `true` 값을 반환한다.(메서드를 생성하지 않는 경우)
  - 현재 `props`와 `state`는 `this.props`와 `this.state`로 접근하고, 새로 설정될 `props`와 `state`는 `nextProps`와 `nextState`로 접근할 수 있다.
  - 최적화 할 때 리렌더링을 방지하기 위해서 `false` 값을 반환하도록 한다.
- **[`render()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#render)**
- [`getSnapshotBeforeUpdate()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#getsnapshotbeforeupdate)
  - `render()` 메서드에서 생성된 결과가 DOM에 적용되기 직전에 호출된다.
  - 컴포넌트가 변경되기 이전에 DOM에서 일부 정보(ex: 스크롤 위치 등)를 캡쳐할 수 있다.
  - 이 메서드에서 반환되는 값은 `componentDidUpdate()` 의 `snapshot`이라는 세 번째 파라미터로 전달된다.
- **[`componentDidUpdate(prevProps, prevState, shapshot)`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#componentdidupdate)**

  - 업데이트가 발생한 직후에 호출되며, 초기 렌더링에는 호출되지 않는다.
  - `prevProps` 또는 `prevState`를 통해 이전의 props나 state에 접근이 가능하다. 또한 이전의 props와 비교하여 네트워크 요청을 하기 좋은 위치다.

  ```tsx
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
    }
  }
  ```

  - `getSnapshotBeforeUpdate()` 메서드에서 반환된 값이 `snapshot` 값에 전달될 수 있다.
  - `setState`를 호출할 수도 있지만 조건문을 걸지 않는다면 무한루프에 빠질 수 있으니 주의해야 한다.

### 언마운트

이 메서드는 컴포넌트가 DOM에서 제거될 때 호출된다.

- [`componentWillUnmount()`](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html#componentwillunmount)
  - 타이머 제거, 네트워크 요청 취소 등의 작업들을 수행한다.
  - `hooks`에서 `useEffect`의 반환 값으로 설정 가능한 `cleanup function`과 동일하다.

---

> 참고
>
> [https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/react-component.html)
>
> [https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/state-and-lifecycle.html](https://5c11762d4be4d10008916ab1--reactjs.netlify.app/docs/state-and-lifecycle.html)
