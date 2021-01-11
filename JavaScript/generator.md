# 제너레이터와 이터레이터, 심볼

## Symbol

심볼(`symbol`)은 `ES6`에서 새롭게 추가된 `7번째 타입`으로 변경 불가능한 원시 타입의 값이다. 심볼은 주로 **이름의 충돌 위험이 없는 유일한 객체의 프로퍼티 키(property key)를 만들기 위해 사용**한다.

원래 객체의 속성 이름은 문자열로 표현했다. 그러나 새로 추가한 라이브러리가 `Array` 같이 범용적으로 쓰이는 타입을 확장했다고 했을 때,

1. 내가 확장한 것과 같은 이름으로 확장했다면?
2. 내가 `Array`의 속성의 갯수를 세고 있는 코드가 있었다면?

라이브러리를 추가한 것만으로도 기존의 코드가 정상적으로 작동하지 않는 상황이 충분히 벌어질 수 있다. 그러나 만약 심볼을 사용한다면,

1. 심볼은 unique하기 때문에, description이 같아도 충돌하지 않는다.
2. 심볼은 객체의 속성을 순회하기 위한 `for ... in`, `Object.keys(obj)`,

`Object.getOwnPropertyNames(obj)`에 걸리지 않는다.

**참고**

`Object.getOwnPropertySymbols()` 메서드는 심볼의 배열을 반환하여 주어진 객체의 심볼 속성을 찾을 수 있게 해줌. (심볼 속성을 설정하기 전까지는 빈 배열을 반환)

`Symbol()` 함수에는 문자열을 인자로 전달할 수 있다. 이 문자열은 `Symbol` 생성에 어떠한 영향을 주지 않고, 생성된 `Symbol`에 대한 설명(description)으로 디버깅 용도로만 사용된다.

```jsx
const mySymbol1 = Symbol('mySymbol');
const mySymbol2 = Symbol('mySymbol');
console.log(mySymbol1 === mySymbol2); // false

const symbolProp = Symbol('symbolProp');
const obj = {
  prop1: 1,
  [symbolProp]: 2,
};

for (const key in obj) console.log(key); // prop1
console.log(obj[symbolProp]); // 2 -> []로만 접근 가능
```

### Symbol.for / Symbol.keyFor

[**`Symbol.for(key)`**](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)

`Symbol.for()` 메소드는 인자로 전달받은 문자열을 키로 사용하여 `Symbol` 값들이 저장되어 있는 전역 `Symbol` 레지스트리에서 해당 키와 일치하는 저장된 `Symbol` 값을 검색한다. 이때 검색에 성공하면 검색된 `Symbol` 값을 반환하고, 검색에 실패하면 새로운 `Symbol` 값을 생성하여 해당 키로 전역 `Symbol` 레지스트리에 저장한 후, `Symbol` 값을 반환한다.

```jsx
// 전역 Symbol 레지스트리에 kwon라는 키로 저장된 Symbol이 없으면 새로운 Symbol 생성
const s1 = Symbol.for('kwon');
// 전역 Symbol 레지스트리에 kwon라는 키로 저장된 Symbol이 있으면 해당 Symbol을 반환
const s2 = Symbol.for('kwon');

console.log(s1 === s2); // true
```

`Symbol` 함수는 매번 다른 `Symbol` 값을 생성하는 것에 반해, `Symbol.for()` 메소드는 하나의 `Symbol`을 생성하여 여러 모듈이 키를 통해 같은 `Symbol`을 공유할 수 있다.

[**`Symbol.keyFor(sym)`**](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor)

전역 심볼 레지스트리로부터 주어진 심볼에 대한 공유 심볼 키(`shared symbol key`)를 추출한다.

```jsx
const sharedSymbol = Symbol.for('myKey');
const key1 = Symbol.keyFor(sharedSymbol);
console.log(key1); // myKey

const unsharedSymbol = Symbol('myKey');
const key2 = Symbol.keyFor(unsharedSymbol);
console.log(key2); // undefined
```

`Symbol.for()` 메소드를 통해 생성된 `Symbol` 값은 반드시 키를 갖는다. 이에 반해 `Symbol` 함수를 통해 생성된 `Symbol` 값은 키가 없다.

### 이터러블 / 이터레이터 프로토콜

- 이터러블 : 이터레이터 객체를 반환하는 `[Symbol.iterator]()` 라는 메소드를 가진 객체
- 이터레이터 : `{ value, done }` 객체를 반환하는 `next()` 라는 메소드를 가진 객체
- 이터러블 / 이터레이터 프로토콜 : 이터러블을 `for ... of` , `spread operator` 등과 함께 동작하도록 한 규약
- `Symbol.iterator` 메서드를 가지고 있는 내장형 타입
  - `Array, String, Map, Set, TypedArray(Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), DOM data structure(NodeList, HTMLCollection), Arguments`

**iterator 예시**

```jsx
const range = (start, end) =>
  start <= end
    ? Array.from({ length: end - start + 1 }, (_, idx) => idx + start)
    : [];

const arr = range(1, 10);
const iter = arr[Symbol.iterator]();

let beFinish = false;

while (!beFinish) {
  const cur = iter.next();
  beFinish = cur.done;
  console.log(cur);
}
```

```jsx
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: 4, done: false }
{ value: 5, done: false }
{ value: 6, done: false }
{ value: 7, done: false }
{ value: 8, done: false }
{ value: 9, done: false }
{ value: 10, done: false }
{ value: undefined, done: true }
```

일반 객체는 이터러블이 아니다. 일반 객체는 `Symbol.iterator` 메소드를 소유하지 않는다. 즉, 일반 객체는 이터러블 프로토콜을 준수하지 않으므로 `for … of` 문으로 순회할 수 없다.

커스텀 **iterable 객체 구현 예시**

```jsx
const iterable = {
  length: 5,
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        return i === iterable.length
          ? { done: true }
          : { value: i++, done: false };
      },
      [Symbol.iterator]() {
        // [Symbol.iterator]() 자기 자신을 리턴
        return this;
      },
    };
  },
};

const iterator = iterable[Symbol.iterator]();
console.log(iterator === iterator[Symbol.iterator]()); // true
console.log(iterator.next()); // { value: 0, done: false }

for (const i of iterator) {
  console.log(i); // 1 2 3 4
}
```

`iterable` 객체는 메소드로 `[Symbol.iterator]()` 가 구현되어 있으므로 `for ... of` 를 통해 순회가 가능하다. 즉, 내부적으로는 `iterator.next()` 를 통해 `value` 를 하나 씩 `i` 에 담아주는 것이다. 즉, `next()` 만 있으면 순회는 가능하다. 하지만 자기 자신을 리턴하는 메소드가 정의되어 있지 않으면 비정형 이터레이터(`non-well-formed-iterator`)라고 하며 `const iterator = iterable[Symbol.iterator]();` 와 같은 형태로는 사용할 수 없다.

또한 같은 `iterator` 를 통해 `next()` 후에 `for ... of` 로 순회하면 진행되던 상태를 기억하게 된다.

이터레이터를 이용하면 다양한 타입의 객체를 하나의 프로토콜로 순회하며 다룰 수 있고, 큰 크기의 데이터도 메모리의 부담 없이 `Lazy-Evaluation`이 가능하다는 성능상의 이점도 있다.

이터러블을 순회할 때 내부에서 이터레이터의 `next()` 메소드를 호출하는데 바로 이때 데이터가 생성된다. `next()` 메소드가 호출되기 이전까지는 데이터를 생성하지 않는다. 즉, 데이터가 필요할 때까지 데이터의 생성을 지연하다가 데이터가 필요한 순간 데이터를 생성한다.

**참고**

이터레이터 객체는 필요에 따라서 `return()` 메소드나 `throw()` 메소드를 구현할 필요도 있다.

- `return()`: `for of` 루프가 `break`, `return` 문 때문에 정상 상황(`done`이 `true`인 상황)보다 먼저 루프를 빠져 나갈때 호출된다. 주로 이터레이터 객체에 정리할 자원이 있을 경우 상용된다.
- `throw()`: `for of` 루프에서 발생한 예외를 이터레이터 안으로 전달하고 싶을 경우 사용한다.

## 제너레이터

- 제너레이터 : 이터레이터이자 이터러블을 생성하는 함수. 이터러블을 직접 생성하는 방식보다 간편하게 이터러블을 구현할 수 있음. 또한 비동기 처리에 용이

**동작 방식**

제너레이터 함수는 처음 실행하면 아무 일도 일어나지 않고, 제너레이터 객체가 리턴된다. 제네레이터 객체는 `next()` 메소드를 실행할 때마다 다음 `yield` 문까지 실행되고 정지하고, 다시 `next()` 를 하면 다음 `yield` 까지 진행하고 정지한다. 이 과정이 반복되다가 더 이상 `yield` 가 없으면 종료된다.

```jsx
// 직접 이터러블 객체 구현
const rangeIterator = function (start, end) {
  let i = start;

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return i <= end ? { value: i++, done: false } : { done: true };
    },
  };
};

// 제너레이터를 사용하여 구현
for (const i of rangeIterator(1, 10)) console.log(i);

function* rangeGenerator(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}
for (const i of rangeGenerator(1, 10)) console.log(i);
```

제네레이터 객체는 이터레이터 객체이고(`next()` 메소드를 구현했음) 제네레이터 함수는 이터러블 객체이다(이터레이터를 반환).

따라서 위의 예제에서, `yield i`의 반환 값은 실제로 이터레이터 프로토콜에 따라 `{ done: false, value: 1 }`이 된다. `for loop`을 다 순회하면 `return undefined`를 만나게 되므로, `{ done: true, value: undefined }`을 반환하고 종료한다.

위와 같이 제너레이터를 사용하면, 이터레이터를 적은 코드로 가독성 좋게 짤 수 있다.

```jsx
function* gen(init) {
  const x = yield init;
  console.log(x); // 10

  const y = yield x + 1;
  console.log(y); // 20

  const z = yield y + 2;
  console.log(z); // 30

  return x + y + z;
}

const myIter = gen(2);
console.log(myIter.next()); // { value: 2, done: false }
console.log(myIter.next(10)); // { value: 11, done: false }
console.log(myIter.next(20)); // { value: 22, done: false }
console.log(myIter.next(30)); // { value: 60, done: true }
```

이터레이터의 `next()` 메소드와 다르게 제너레이터 객체의 `next()` 메소드에는 인수를 전달할 수도 있다. 이를 통해 제너레이터 객체에 데이터를 전달할 수 있다.

`next()` 메소드가 리턴하는 값은 제네레이터가 실행을 정지할 때 `yield` 문이 반환하는 값(`yield`문의 오른쪽)이고, `next()` 메소드의 파라미터는 제네레이터가 실행을 재개할 때 `yield` 문이 반환하는 값(`yield` 문의 왼쪽)이 된다.

### 제너레이터를 사용하는 이유

- Lazy-Evaluation이 가능하다는 성능상(메모리 효율)의 이점
- 비동기 특성을 동기적 코드방식으로 관리 해준다.
- 이터레이터와 이터러블을 쉽게 사용 할 수 있다.
- 동시성 프로그래밍을 가능하게 해준다.

### **코루틴**

일반적인 함수(서브루틴: subroutine)가 콜 스택 위에서 어떻게 동작하는지는 다들 알고 있듯이, 실행될 때 콜 스택으로 올라오고 리턴하면 콜 스택에서 사라진다. 이 함수의 진입점은 항상 같은 곳(함수의 시작 부분)이고, 한번 콜 스택에서 사라진 함수를 다시 불러올 수 있는 방법은 없다.

그러나 제네레이터는, 제너레이터 객체가 `yield` 문에 도착하면, 제네레이터의 스택 프레임(각종 컨텍스트들)을 복사해놓고 콜 스택에서 일단 제거한다. 그러다가 `next()` 메소드가 호출되면 저장해 놓았던 스택 프레임을 다시 복원하고 실행한다. 즉 진입점을 개발자가 원하는 대로 설정할 수 있고 한번 올라온 컨텍스트를 원하는 만큼 유지시킬 수 있다. 이런 개념을 코루틴이라고 한다.

### **동시성**

이 코루틴 형태를 잘 이용하면, 협력형 멀티태스킹 방식으로, 쓰레드 프로그래밍 없이 동시성 프로그래밍이 가능해진다. 쓰레드는 필요한 비용에 비해 신경써야 할 것들이 너무 많은 단점이 있지만, 코루틴은 OS의 암묵적인 스케쥴링이나 컨텍스트 스위칭 오버헤드, 세마포어 설정 같은 고민으로 부터 자유롭다.

### **비동기**

코루틴은 비동기로 돌아가는 코드를 작성하는데도 도움을 줄 수 있다. 실제로 코루틴 자체가 비동기로 작동하는 것은 아니다. (코루틴은 항상 동기적으로 작동한다) 비동기 동작 자체는 코루틴과 별개지만, 비동기 애플리케이션 프로그래밍에 항상 등장하는 콜백 함수와 그로 인한 콜백 지옥을 해결책으로 코루틴이 유효하다. 즉, 보기에는 동기 방식으로 돌아갈 것 처럼 생겼지만(그래서 보기 좋지만) 실제로는 비동기로 돌아가는 코드를 만들어 낼 수 있다.

> 참조
>
> [https://velog.io/@rohkorea86/Generator-함수를-이해해보자-이론편-왜-제네레이터-함수를-써야-하는가](https://velog.io/@rohkorea86/Generator-%ED%95%A8%EC%88%98%EB%A5%BC-%EC%9D%B4%ED%95%B4%ED%95%B4%EB%B3%B4%EC%9E%90-%EC%9D%B4%EB%A1%A0%ED%8E%B8-%EC%99%9C-%EC%A0%9C%EB%84%A4%EB%A0%88%EC%9D%B4%ED%84%B0-%ED%95%A8%EC%88%98%EB%A5%BC-%EC%8D%A8%EC%95%BC-%ED%95%98%EB%8A%94%EA%B0%80)
>
> [https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)
>
> [https://gist.github.com/qodot/ecf8d90ce291196817f8cf6117036997](https://gist.github.com/qodot/ecf8d90ce291196817f8cf6117036997)
