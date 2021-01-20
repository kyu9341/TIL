## immutable과 mutable

`Mutable`한 객체는 생성된 이후에 상태가 변경될 수 있는 객체이고, `Immutable`한 객체는 생성된 이후에 상태가 변경되지 않는 객체를 말한다. 자바스크립트에서 `Object`를 제외한 `primitive type`은 `Immutable`하다.

Javascript의 원시 타입(`primitive data type`)은 변경 불가능한 값(`immutable value`)이다.

- 원시 타입 (primitive data type)

  - `boolean`
  - `null`
  - `undefined`
  - `number`
  - `string`
  - `symbol` (ES6에서 추가)

- 객체 타입 (object/reference type)
  - `object`

문자열을 예로 들어보면, C에서는 문자열은 변경가능한 값이지만 JavaScript에서는 변경 불가능한 값이다. 문자열을 더하는 연산을 자바스크립트에서 수행하면 어떤 과정을 거치는지 살펴보자.

```jsx
let name = 'kwon';
name += 'yeongeon';

console.log(name);
```

위의 코드에서 두 번째 줄을 실행하면 다음과 같은 작업을 하게된다.

1. `name` 변수에 저장된 값을 읽어온다.
2. 'yeongeon'을 `name` 에서 읽어온 값에 붙인다.
3. 결과 값이 새로운 메모리 공간에 할당된다.
4. `name` 이 새로운 메모리 공간을 가리킨다.
5. 기존에 `name` 이 가리키던 메모리 공간은 GC의 대상이 된다.

즉, JavaScript에서 문자열은 `immutable`하기 때문에 `name` 변수에 저장된 값을 변경하는 것이 아니라 새로운 문자열을 생성하여 `name` 변수가 새로 생성된 문자열을 가리키게 하는 것이다.

`mutable` 한 타입과 `immutable` 한 타입의 차이를 보기 위해 아주 간단한 예제를 보자. 문자열과 객체로 비교를 해봤다.

```jsx
const name1 = 'kwon';
let name2 = name1;

name2 = 'kim';

console.log(name1); // kwon
console.log(name2); // kim
console.log(name1 === name2); // false
```

문자열은 `immutable` 한 타입이기 때문에 `name2` 을 변경하더라도 원본인 `name1` 은 영항을 받지 않는다.

```jsx
const user1 = {
  name: 'kwon',
  age: 26,
};
let user2 = user1;
user2.age = 30;

console.log(user1); // { name: 'kwon', age: 30 }
console.log(user2); // { name: 'kwon', age: 30 }
console.log(user1 === user2); // true
```

반면에 객체는 `mutable` 한 타입이기 때문에 `user2` 를 변경하더라도 원본 객체인 `user1` 이 영향을 받는다.

### 객체를 `immutable` 하게 사용하는 이유

`mutable value`는 값에 대한 메모리 주소를 참조하기 때문에 값을 변경했을 경우 해당 값을 사용하고 있는 모든 곳에서 `side effect`(부수 효과)가 발생하여 예상치 못한 버그를 유발할 수 있다.

이 문제의 해결책으로 비용은 조금 들지만 **객체를 불변객체로 만들어 프로퍼티의 변경을 방지**하며 객체의 변경이 필요한 경우에는 **참조가 아닌 객체의 방어적 복사(defensive copy)를 통해 새로운 객체를 생성**한 후 변경한다.

**`immutable` 하게 객체를 다루는 방법 - 방어적 복사 (defensive copy)**

`Object.assign`을 사용하면 기존 객체를 변경하지 않고 객체를 복사하여 사용할 수 있다.

```jsx
const user1 = {
  name: 'kwon',
  age: 26,
};
const user2 = Object.assign({}, user1);

console.log(user1 === user2); // false
```

`spread operator` 를 사용하여 복사할 수도 있다.

```jsx
const user1 = {
  name: 'kwon',
  age: 26,
};
const user2 = { ...user1 };

console.log(user1 === user2); // false
```

하지만 `Object.assign` 과 `spread operator` 는 완전한 `deep copy`를 지원하지는 않는다. 객체 내부의 객체(`Nested Object`)는 `Shallow copy`된다.

`Nested Object` 까지 모두 깊은 복사를 하려먼 직접 `deep copy` 를 구현하거나, `immutable.js` 를 사용할 수 있다고 한다.

**`deep copy` 직접 구현**

```jsx
const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') return obj;

  const result = Array.isArray(obj) ? [] : {};

  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = deepClone(obj[key]);
    return acc;
  }, result);
};
```

**`immutable` 한 상태를 만드는 방법**

`Object.freeze()` 를 사용하여 불변 객체로 만들 수 있다.

```jsx
const user1 = {
  name: 'kwon',
  age: 26,
  friends: ['kim', 'jo', 'park'],
};

Object.freeze(user1);
user1.age = 30;

console.log(user1); // { name: 'kwon', age: 26, friends: [ 'kim', 'jo', 'park'] }

user1.friends.push('na');
console.log(user1); // { name: 'kwon', age: 26, friends: [ 'kim', 'jo', 'park', 'na' ] }
```

위와 같이 `Object.freeze()` 를 사용하면 `user1.age = 30` 으로 변경을 시도했지만 변화가 되지 않은 것을 볼 수 있다. 하지만 `Object.freeze()` 도 `Object.assign()` 과 마찬가지로 `Nested Object` 까지는 적용이 되지 않는다. 따라서 내부 객체까지 변경을 막으려면 `Deep freeze` 를 해줘야 한다.

**`Deep freeze` 직접 구현**

```jsx
const deepFreeze = obj => {
  if (obj === null || typeof obj !== 'object') return obj;

  Object.keys(obj).forEach(key => {
    deepFreeze(obj[key]);
  });

  return Object.freeze(obj);
};
```

**`const` vs `Object.freeze()`**

- immutable한 상태를 만드는 방법은 const와 Object.freeze가 있는데 둘의 차이를 살펴보면 아래와 같다.

`const` : 참조값을 못 바꾸게 함

`Object.freeze()` : 값 자체를 못 바꾸게 함

```jsx
const user1 = { name: 'kwon' };
Object.freeze(user1); // user1은 immutable한 상태가 된다.

user1.name = 'kim'; // immutable한 상태이므로 바뀌지 않는다.
console.log(user1); // { name: 'kwon' }

const user2 = { name: 'jo' };
user1 = user2; // error : user1은 const로 선언되어 참조값을 변경할 수 없다.
```

> 참조
>
> [https://medium.com/@yeon22/immutable을-사용하는-이유-24aa152237e0](https://medium.com/@yeon22/immutable%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0-24aa152237e0)
>
> [https://poiemaweb.com/js-data-type-variable](https://poiemaweb.com/js-data-type-variable)
>
> [https://poiemaweb.com/js-immutability](https://poiemaweb.com/js-immutability)
>
> [https://2ssue.github.io/common_questions_for_Web_Developer/docs/Programming/12_immutable&mutable.html](https://2ssue.github.io/common_questions_for_Web_Developer/docs/Programming/12_immutable&mutable.html)
>
> [https://myphiloprogramming.tistory.com/11](https://myphiloprogramming.tistory.com/11)
>
> [https://evan-moon.github.io/2020/01/05/what-is-immutable/](https://evan-moon.github.io/2020/01/05/what-is-immutable/)
>
> [https://perfectacle.github.io/2017/10/30/js-014-call-by-value-vs-call-by-reference/](https://perfectacle.github.io/2017/10/30/js-014-call-by-value-vs-call-by-reference/)
