### JS에서 재귀호출로 인한 stack overflow를 막을 수 있는방법은?

- 자바스크립트는 **기본적으로 싱글스레드 기반의 언어**이다. (호출 스택이 하나)

### 스택 오버플로우

![stackOverflow](https://user-images.githubusercontent.com/49153756/104293820-cb5b0400-5501-11eb-8281-b981552964c8.png)

- `stack overflow` 를 발생시키는 간단한 코드

```jsx
const foo = idx => {
  console.log(idx);
  foo(idx + 1);
};

foo(1);
```

![Screen Shot 2021-01-01 at 02 20 23 AM](https://user-images.githubusercontent.com/49153756/104293738-b2eae980-5501-11eb-9d27-2d7ee51fe714.png)

위와 같이 짜고 실행시켜보면, 대략 10000 ~ 12000 번 정도 호출된 이후에 call stack에서 에러가 발생한다.

### Tail Recursion

꼬리 재귀란, 재귀 호출이 끝난 후 현재 함수에서 추가 연산을 요구하지 않도록 구현하는 재귀의 형태다. 이를 이용하면 함수 호출이 반복되어 스택이 깊어지는 문제를 컴파일러가 선형으로 처리 하도록 알고리즘을 바꿔 스택을 재사용할 수 있게 된다.(더이상 값이 변할 여지가 없으므로 스택을 덮어쓸 수 있기 때문) 이러한 꼬리 재귀를 사용하기 위해서는 컴파일러가 이런 최적화 기능을 지원하는지 먼저 확인해야 한다. (visual studio나 gcc는 지원)

**일반적인 재귀함수**

```jsx
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
```

**꼬리 재귀함수**

```jsx
function factorialTail(n, acc) {
  if (n === 1) return acc;
  return factorialTail(n - 1, acc * n);
  //일반 재귀에서의 n * factorial(n - 1)과 달리 반환값에서 추가연산이 필요없음
}
function factorial(n) {
  return factorialTail(n, 1);
}
```

### setTimeout

```jsx
const foo = idx => {
  if (idx < 1) return;
  console.log(idx);

  setTimeout(() => foo(idx - 10), 0);
};

foo(20000);
```

또 다른 방법으로는 `setTimeout` 을 활용하면 되는데, `setTimeout` 을 호출하면 `setTimeout(() => {}, 0)` 과 같이 호출하더라도 바로 호출 스택에 함수가 쌓이지 않고, 백그라운드를 거쳐 태스크 큐로 넘어가게 된다. 호출 스택이 비워져 있어야 태스크 큐에 있는 `setTimeout` 의 콜백이 실행될 것이기 때문에 `stack overflow` 는 우회할 수 있다.

하지만 이 방법으로는 재귀함수에서의 리턴값을 가지고 추가적인 연산을 하는 것은 불가능하다.

- 참조
