# IntersectionObserver

`Intersection Observer`는 타겟 엘리먼트와 상위 엘리먼트 혹은 `viewport`가 교차하는 부분의 변화를 비동기적으로 관찰하는 `API`이다.

이전에는 `getBoundingClientRect()` 로 실제 엘리먼트의 `offset`등을 측정하는 방식으로 이루어졌는데, 가장 큰 문제점은 이러한 작업이 메인 쓰레드에서 이루어지는 점이다. 들어오는 엘리먼트마다 체크해주는 작업이 필요한데, 이를 모두 메인 쓰레드에서 진행한다. 이는 성능상의 문제를 가져올 수 있다.

`Intersection Observer` 는 이러한 문제를 비동기로 해결한다. 메인쓰레드에서 계속 인터섹션을 확인하는 대신, 인터섹션이 일어날 때 인자로 넘겨준 `callback`을 실행시킨다. `callback`과 함께 `options`을 넘겨줄 수 있다.

- 특정 지점을 관찰하기 위해서는 `getBoundingClientRect()`함수를 사용해야 하는데, 이 함수는 리플로우(`reflow`)가 발생한다는 단점이 있다.
- `IntersectionObserverEntry`의 속성을 활용하면 `getBoundingClientRect()`를 호출한 것과 같은 결과를 알 수 있기 때문에 따로 `getBoundingClientRect()` 함수를 호출할 필요가 없어 리플로우를 방지할 수 있다.

### 사용 예시

- 페이지 스크롤 시 이미지나 `Component`를 `Lazy-loading`할 때
- `Infinite scrolling`(무한 스크롤)을 통해 스크롤할 때 새로운 콘텐츠를 불러올 때
- 광고의 수익을 계산하기 위해 광고의 가시성을 참고할 때
- 사용자가 결과를 볼 것인지에 따라 애니메이션 동작 여부를 결정할 때

### 사용법

```tsx
const options = {
  root: document.querySelector('#target'),
  rootMargin: '0px',
  threshold: 1.0,
};

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // ...
  });
};

const observer = new IntersectionObserver(callback, options);
```

### `Parameters`

**`callback`**

- `callback`: 타겟 엘리먼트가 교차되었을 때 실행할 함수
  - `entries`: [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)객체의 리스트. 배열 형식으로 반환하기 때문에 `forEach`를 사용해서 처리를 하거나, 단일 타겟인 경우 배열임을 고려해야 한다.
  - `observer`: 콜백함수가 호출되는 `IntersectionObserver`

**`options`**

- **`root`**
  - `default` : 브라우저의 `viewport` (`null` 이거나 값을 설정하지 않는 경우)
  - 교차 영역의 기준이 될 `root` 엘리먼트. `observe`의 대상으로 등록할 엘리먼트는 반드시 `root`의 하위 엘리먼트여야 한다.
- **`rootMargin`**
  - `default`: `'0px 0px 0px 0px'`
  - `root` 엘리먼트의 `margin`값. `css`에서 `margin`을 사용하는 방법으로 선언할 수 있고, 축약도 가능하다. `px`과 `%`로 표현할 수 있으며, `rootMargin` 값에 따라 교차 영역이 확장 또는 축소된다.
- **`threshold`**
  - `default` : `0`
  - `0.0`부터 `1.0` 사이의 숫자 혹은 이 숫자들로 이루어진 배열로, 타겟 엘리먼트에 대한 교차 영역 비율을 의미한다. `0.0`이면 타겟 엘리먼트가 교차영역에 진입했을 시점에 `observer`를 실행하고, `1.0`이면 타켓 엘리먼트 전체가 교차영역에 들어왔을 때 `observer`를 실행한다
  - 만약 하나의 타겟 엘리먼트의 특정 비율만큼 교차 영역에 들어올 때마다 콜백을 실행하고 싶다면 `[0, 0.25, 0.5, 0.75, 1]` 과 같이 배열로 설정할 수 있다. 이와 같이 설정하면 `25%` 단위로 엘리먼트가 들어올 때마다 콜백이 실행된다.

### `Methods`

**[`IntersectionObserver.observe(targetElement)`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe)**

- 타겟 엘리먼트에 대한 `IntersectionObserver`를 등록(관찰을 시작)한다.

**[`IntersectionObserver.unobserve(targetElement)`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve)**

- 타겟 엘리먼트에 대한 관찰을 멈춘다. 만약 `Lazy-loading`을 하는 경우 한 번 처리를 한 후에는 관찰을 멈춰도 된다. 이런 경우 처리를 한 후 해당 엘리먼트에 대해 `unobserve(targetElement)`을 실행하여 해당 엘리먼트에 대한 관찰만 종료한다.

**[`IntersectionObserver.disconnect()`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect)**

- 다수의 엘리먼트를 관찰하고 있을 때, 모든 관찰을 종료한다.

**[`IntersectionObserver.takerecords()`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/takeRecords)**

- `IntersectionObserverEntry` 객체의 배열을 리턴한다.

### **`IntersectionObserverEntry` 객체**

`IntersectionObserver`의 `callback`은 `IntersectionObserverEntry` 객체의 배열(위에서 `entries`)을 반환하는데, 이 객체의 정보는 유용하게 사용할 수 있다.

### **`Properties`**

- `target`: `Target Element`
- `time`: 교차된 시간
- `isIntersecting`: 교차되었는지 여부
  - 타겟 엘리먼트가 교차 영역에 있다면 `true`를 반환, 아니라면 `false`를 반환
- `intersectionRatio`: 교차된 비율 → `0.0 ~ 1.0`
  - `options`의 `threshold`와 유사하다. 교차 영역에 타겟 엘리먼트가 얼마나 교차되어 있는지(비율)에 대한 정보를 반환.
- `intersectionRect`: 교차된 영역의 정보를 반환
- `boundingClientRect`: `TargetElement.getBoundingClientRect()` 값
- `rootBounds`: `rootElement`의 정보를 반환. `root`를 선언하지 않은 경우 `null`을 반환

![https://raw.githubusercontent.com/hyeyoon/blog/master/public/img/4/intersectionobserverentry.png](https://raw.githubusercontent.com/hyeyoon/blog/master/public/img/4/intersectionobserverentry.png)

> 이미지 출처 : [http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/)

### 예제 코드

- `Vanilla JS`

```tsx
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.children[0].classList.add('show');

    observer.unobserve(entry.target);
  });
};

const observer = new IntersectionObserver(callback, options);
const targetList = document.querySelectorAll('.target');

targetList.forEach(target => observer.observe(target));
```

`target` 이라는 클래스를 가지는 `wrapper div`가 교차되면 하위에 있는 엘리먼트가 보이도록 `show` 클래스를 추가하는 예제이다.

---

- `React` - `Custom hook` → `useObserver`

```tsx
import { useEffect, useState, useRef } from 'react';

const useObserver = (
  options: Object
): [boolean, React.MutableRefObject<HTMLDivElement>] => {
  const [isShow, setIsShow] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const callback = (
    [entry]: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    if (!entry.isIntersecting) return;

    setIsShow(true);
    observer.unobserve(entry.target);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, []);

  return [isShow, targetRef];
};

export default useObserver;
```

단일 타겟을 기준으로 해당 타겟이 교차되면 `isShow` 를 `true`로 변경해주는 용도의 커스텀 훅이다.

---

> 참고
>
> [https://developer.mozilla.org/ko/docs/Web/API/IntersectionObserver/IntersectionObserver](https://developer.mozilla.org/ko/docs/Web/API/IntersectionObserver/IntersectionObserver)
>
> [https://godsenal.com/posts/React-Intersection-Observer를-사용하여-인피니트-스크롤-구현하기/](https://godsenal.com/posts/React-Intersection-Observer%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EC%9D%B8%ED%94%BC%EB%8B%88%ED%8A%B8-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0/)
>
> [https://velog.io/@syj9484/React-Intersection-Observer-API를-이용한-lazy-loading](https://velog.io/@syj9484/React-Intersection-Observer-API%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-lazy-loading)
>
> [http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/)
>
> [https://tech.lezhin.com/2017/07/13/intersectionobserver-overview](https://tech.lezhin.com/2017/07/13/intersectionobserver-overview)
>
> [https://heropy.blog/2019/10/27/intersection-observer/](https://heropy.blog/2019/10/27/intersection-observer/)
>
> [https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)
>
> 폴리필 : [https://github.com/w3c/IntersectionObserver/tree/main/polyfill](https://github.com/w3c/IntersectionObserver/tree/main/polyfill)
