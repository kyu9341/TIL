## Promise

`Promise`는 비동기 처리를 위한 자바스크립트 객체이다.

```jsx
new Promise(executor);
```

### `Promise`의 상태

- **`pending`** : 프로미스가 만들어져 지정한 연산이 수행중일 때
- **`fulfilled`** : 연산을 성공적으로 마치고 프로미스가 결과 값을 반환해준 상태
- **`rejected`** : 비동기 처리가 실패하거나 오류가 발생한 상태

---

- **`Promise` 생성**

```jsx
const promise = new Promise((resolve, reject) => {
  // doing some heavy work (network, read files)console.log('doing someting...');
  setTimeout(() => {
    resolve('kwon');
    // reject(new Error('no network'));
  }, 2000);
});
```

`promise`에는 `executor` 라는 콜백 함수를 전달해 주어야 하는데, 이 콜백함수에는 또 두 가지 콜백 함수를 인자로 받는다.

- **`resolve`** : 기능을 정상적으로 수행하여 마지막에 최종 데이터를 전달하는 콜백함수
- **`reject`** : 기능을 수행하다가 중간에 문제가 생기면 호출하게 되는 콜백함수 (보통 `Error`객체를 통해 값을 전달한다)
- **새로운 `promise`가 만들어지는 순간 `executor` 라는 콜백함수가 자동적으로 실행된다.**

```jsx
promise
  .then(value => {
    console.log(value);
  })
  .catch(error => {
    console.log(error);
  })
  .finally(() => {
    console.log('finally');
  });

// 출력
// kwon
// finally
```

### 매서드

- **`then`** : `promise`가 정상적으로 수행이 된 경우 `resolve`로부터 값을 받아와서 실행한다.
  - `then`은 또 다시 `promise`를 리턴
  - `p.then(onFulfilled, onRejected);`
    - 두 개의 콜백 함수를 인자로 받음
    - `onFulfilled` : 프로미스가 수행되었을 때 실행, `resolve`된 값을 인자로 받음
    - `onRejected` : 프로미스가 실패했을 때 실행, `reject`된 값을 인자로 받음
- **`catch`** : 에러가 발생했을 때 처리할 콜백 함수를 정의
- **`finally`** : `promise`의 성공, 실패 여부와 관계없이 언제나 실행된다.

---

- **`promise chaining`**

```jsx
const fetchNumber = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000); // 1초 후 1을 전달
});

fetchNumber
  .then(num => num * 2)
  .then(num => num * 3)
  .then(num => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(num - 1), 1000);
    });
  })
  .then(num => console.log(num));
// 출력// 5
```

- `then`에서는 값을 바로 전달해도 되고, 또 다른 비동기인 `promise`를 전달해도 된다.

---

- **`Error Handling`**

```jsx
const getOne = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('one'), 1000);
  });
};
const getTwo = one => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${one} => two`), 1000);
  });
};
const getThree = two => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${two} => three`), 1000);
  });
};
```

- 위와 같이 각각의 함수에서 프로미스를 리턴하도록 해보자.

```jsx
getOne()
  .then(one => getTwo(one))
  .then(two => getThree(two))
  .then(three => console.log(three))
  .catch(three => console.log(three));

// 아래와 같이 변경 가능

getOne().then(getTwo).then(getThree).then(console.log).catch(console.log);
// 출력// one => two => three
```

- 프로미스 체이닝을 통해 문자열을 누적하여 `one => two => three` 의 결과를 출력하게 된다.
- 이 때, 중간에 `getTwo` 함수에서 에러가 발생한다고 가정해보자.

```jsx
const getTwo = one => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(`${one} => two`)), 1000);
  });
};
```

- 에러가 발생하면 가장 아래의 `catch`로 이동하여 에러를 잡게 되며 `Error: one => two` 와 같은 에러 메시지가 출력될 것이다.
- 여기서, 아래와 같이 `.then(one => getTwo(one))` 아래에 `catch`를 넣어서 `'zero'`를 리턴해보자.

```jsx
getOne()
  .then(one => getTwo(one))
  .catch(error => 'zero')
  .then(two => getThree(two))
  .then(three => console.log(three))
  .catch(three => console.log(three));
// 출력 zero => three
```

- 전달된 에러를 받아 처리해 `'zero'`라는 문자열을 리턴하게 되면 다음 `then`에서 `'zero'`를 받아 이어서 처리를 할 수 있게 된다.
- 이렇게 중간에 처리를 해주게 되면 전체적인 프로미스 체인에 문제가 발생하지 않도록 할 수 있다.

### 추가적인 메서드

- **[`Promise.all(iterable)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)**
  - `iterable` \*\*\*\*내의 모든 프로미스가 수행된 후에 실행된다. 그 중 하나라도 `reject`된다면 그 즉시 `Promise.all()`이 `reject`된다.
  - 모두 수행이 완료된다면 해당 `iterable` 내의 모든 `Promise`의 `resolve`된 값이 배열의 형태로 존재한다.
- **[`Promise.race(iterable)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)**
  - `iterable` 내의 프로미스 중 가장 먼저 완료(`resolve or reject`)되는 것을 반환한다.
  - `iterable`에 이미 완료된 프로미스가 있다면 가장 먼저 만나는 완료된 프로미스를 반환한다.
- **[`Promise.allSettled(iterable)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)**
  - `iterable` 내의 프로미스 중에 `reject` 되는 경우가 있더라도 모든 결과를 배열로 담아 반환한다.
  - 배열에 들어가는 각 객체는 `status` 속성에 `fulfilled` 혹은 `rejected` 의 상태를 포함하고, `fulfilled`인 경우 `value` 속성에 `resolve`된 값이, `rejected` 인 경우 `reason` 속성에 `reject`된 이유가 담겨 반환된다.

---

> 참조
>
> <https://www.youtube.com/watch?v=JB_yU6Oe2eE&list=WL&index=13&t=75s>
>
> <https://joshua1988.github.io/web-development/javascript/promise-for-beginners/>
>
> <https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise>
