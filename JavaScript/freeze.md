# 객체를 `immutable` 하게 사용하는 만드는 방법

객체를 변경 할 수 없게 만드는 방법에는 대표적으로 `Object.freeze()`가 있다. 하지만, 이 방법 외에도 몇 가지 방법들이 있다.

- `const` vs `Object.freeze()`

  - `immutable`한 상태를 만드는 방법은 `const`와 `Object.freeze()`가 있는데 둘의 차이를 살펴보면 아래와 같다.

- `const` : 참조값을 못 바꾸게 함 (객체 내부의 프로퍼티의 값은 변경이 가능)
- `Object.freeze()` : 값 자체를 못 바꾸게 함 (참조 값을 재할당 가능)
- 위의 두 방법을 같이 사용하면 되지만, `Nested Object`는 까지는 변경을 막지 못함 -> `deep freeze`로 해결 가능

조금 더 자세히, 다양한 방법에 대해 알아보자.

### [`Object.defineProperty()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

- `Object` 객체의 `static method`로 객체에 직접 새로운 속성을 정의하거나, 이미 존재하는 속성을 수정하고, 그 객체를 반환한다.

```javascript
Object.defineProperty(obj, prop, descriptor);
```

- `obj` : 속성을 정의할 객체
- `prop` : 새로 정의하거나 수정할 속성
- `descriptor` : 새로 정의하거나 수정할 속성을 기술하는 객체

#### **`descriptor`** 객체에 포함되는 속성

- **`configurable`** : 해당 속성의 값을 변경할 수 있고, 대상 객체에서 삭제할 수도 있다면 `true`
  - → `false`가 된다면 `configurable`과 `enumerable`의 플래그를 수정할 수 없고, `writable: false`의 경우 `true`로 바꿀 수 없다. (`true → false`는 가능) `value`는 변경이 가능.
  - 즉, 해당 속성의 설정 값을 변경할 수 있는지를 관리하는 속성이다.
  - 기본값 : `false`
- **`enumerable`** : 해당 속성이 대상 객체의 속성 열거 시 노출된다면 `true`
  - 기본값 : `false`
- **`value`** : 속성에 연관된 값. 아무 유효한 JavaScript 값(숫자, 객체, 함수 등)이나 가능
  - 기본값 : [`undefined`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- **`writable`** : [할당 연산자(`=`)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Assignment_Operators)로 속성의 값을 바꿀 수 있다면 `true`
  - 기본값 : `false`

#### [`Object.getOwnPropertyDescriptor`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

- 객체의 해당 속성의 `descriptor`를 확인 할 수 있다.

```js
const user1 = {
  name: 'kwon',
  age: 26,
};

console.log(Object.getOwnPropertyDescriptor(user1, 'age'));
// { value: 26, writable: true, enumerable: true, configurable: true }
```

### [`Object.preventExtensions()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)

- 자바스크립트의 모든 객체는 `[[Extensible]]` 이라는 숨겨진 속성을 가지고 있는데, 이 속성의 값이 `false`면 객체에 속성을 추가하는 것이 불가능하다. (기본값 : `true`)
- 이 속성을 `false`로 변경하는 메소드가 `Object.preventExtensions(obj)`이다.
  - 객체의 `[[Extensible]]` 속성은 `Object.isExtensible(obj)`라는 메소드로 확인할 수 있다.

1. 개체의 기존 속성을 변경할 수 있음
2. **새로운 속성 추가 방지**

- `[[Extensible]]` 속성을 `false` 로 변경한다.

```js
const user1 = {
  name: 'kwon',
  age: 26,
};

console.log('Extensible : ', Object.isExtensible(user1));
// 출력 : Extensible :  true
Object.preventExtensions(user1);

console.log('Extensible : ', Object.isExtensible(user1));
// 출력 : Extensible :  false

Object.defineProperty(user1, 'address', {
  value: 'Seoul',
});
// TypeError: Cannot define property address, object is not extensible
```

`Object.preventExtensions(user1)` 을 통해 내부의 `Extensible` 속성이 `false`로 변경된 모습을 볼 수 있고, 이후에 `Object.defineProperty()`로 새로운 속성을 추가하려고 하면 위와 같은 에러를 발생시키게 된다.

### [`Object.seal()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

1. 개체의 기존 속성을 변경할 수 있음
2. **새로운 속성 추가 방지**
3. **기존 속성 제거 허용 안함**

- `[[Extensible]]` 속성을 `false` 로 변경한다.
- 모든 프로퍼티의 `configurable` 속성을 `false` 로 변경한다.

```js
const user1 = {
  name: 'kwon',
  age: 26,
};

console.log(Object.getOwnPropertyDescriptor(user1, 'age'));
// 출력 : { value: 26, writable: true, enumerable: true, configurable: true }
console.log('Extensible : ', Object.isExtensible(user1));
// 출력 : Extensible :  true

delete user1.name; // name 속성이 삭제됨
console.log(user1); // { age: 26 }

Object.seal(user1);

console.log(Object.getOwnPropertyDescriptor(user1, 'age'));
// 출력 : { value: 26, writable: true, enumerable: true, configurable: false }
console.log('Extensible : ', Object.isExtensible(user1));
// 출력 : Extensible :  false

delete user1.age; // 삭제가 안됨

console.log(user1); // { age: 26 }

user1.age = 30;

console.log(user1); // { age: 30 }
```

`Object.seal()`이 적용된 이후 `Extensible`과 `configurable`이 모두 `false`로 변경된 것을 확인할 수 있다. 또한, `delete` 연산자를 통해 `user1`의 `name`과 `age`를 각각 `Object.seal()` 이전, 이후에 삭제를 시도한 모습인데, `Object.seal()` 이전에 수행된 `name` 속성은 삭제된 반면, 이후에 실행된 `age` 속성은 삭제되지 않은 것을 볼 수 있다.

하지만 `Object.seal()` 이후에도 `writable` 속성이 `true`인 경우에는 객체의 속성은 변경이 가능하다.

### [`Object.freeze()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

- 객체를 불변하게 만드는 가장 강력한 방법이다.

1. **새로운 속성 추가 방지**
2. **기존 속성 제거를 허용하지 않음**
3. **속성을 변경할 수 없음** (`depth` 1단계만)
4. 자식 개체의 속성을 수정할 수 있음

- `[[Extensible]]` 속성을 `false` 로 변경한다.
- 모든 프로퍼티의 `configurable` 속성을 `false` 로 변경한다.
- 모든 프로퍼티의 `writable` 속성을 `false` 로 변경한다.

```js
const user1 = {
  name: 'kwon',
  age: 26,
};

console.log(Object.getOwnPropertyDescriptor(user1, 'age'));
// 출력 : { value: 26, writable: true, enumerable: true, configurable: true }
console.log('Extensible : ', Object.isExtensible(user1));
// 출력 : Extensible :  true

delete user1.name; // name 속성이 삭제됨
console.log(user1); // { age: 26 }

Object.freeze(user1);

console.log(Object.getOwnPropertyDescriptor(user1, 'age'));
// 출력 : { value: 26, writable: false, enumerable: true, configurable: false }
console.log('Extensible : ', Object.isExtensible(user1));
// 출력 : Extensible :  false

delete user1.age; // 삭제가 안됨

console.log(user1); // { age: 26 }

user1.age = 30;

console.log(user1); // { age: 26 }
```

`Object.seal()`과는 다르게 `Object.freeze()`를 수행하고 나면, `writable`이 `false`로 변경되고 이후 객체의 속성을 수정해도 변경되지 않는 것을 볼 수 있다.

또한, `Object.freeze()` 는 `Object.defineProperty()` 와 `Object.preventExtensions()` 로 구현이 가능하다.

```js
const _freeze = function (obj) {
  Object.keys(obj).forEach(key => {
    Object.defineProperty(obj, key, {
      configurable: false,
      writable: false,
    });
  });

  Object.preventExtensions(obj);
};
```

위와 같이 [`Object.defineProperty()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 를 통해 `writable`속성과 `configurable`속성을 `false` 로 변경하고, `Object.preventExtensions()` 를 통해 `[[Extensible]]` 속성을 `false` 로 변경하면 된다.

하지만, `Object.freeze()`만으로는 객체 내부의 객체까지는 변경을 막을 수 없다. 이를 막으려면 `deepFreeze`를 구현해야 하는데, 아래와 같은 방법으로 구현할 수 있다.

### `deepFreeze`

- `Object.freeze()` 사용

```js
const deepFreeze = function (obj) {
  if (obj === null || typeof obj !== 'object') return;

  Object.keys(obj).forEach(key => {
    deepFreeze(obj[key]);
  });

  Object.freeze(obj);
};
```

- `Object.defineProperty() + Object.preventExtensions()` 사용

```js
const deepFreeze = function (obj) {
  if (obj === null || typeof obj !== 'object') return;

  Object.keys(obj).forEach(key => {
    Object.defineProperty(obj, key, {
      configurable: false,
      writable: false,
    });

    deepFreeze(obj[key]);
  });

  Object.preventExtensions(obj);
};
```

### 비교

- 각각의 `static method`를 적용한 뒤에 객체의 상태가 어떻게 되는지 비교한 표이다.

|                기능                | `default` | `preventExtensions` | `seal` | `freeze` |
| :--------------------------------: | :-------: | :-----------------: | :----: | :------: |
| 새로운 속성 추가(`[[Extensible]]`) |    ⭕️    |         ⭕️         |   ❌   |    ❌    |
|   기존 속성 삭제(`configurable`)   |    ⭕️    |         ⭕️         |   ❌   |    ❌    |
|     기존 속성 변경(`writable`)     |    ⭕️    |         ⭕️         |  ⭕️   |    ❌    |

> 참조
>
> [https://stackoverflow.com/questions/6281314/object-preventextensions-actually-allows-mutation-of-proto](https://stackoverflow.com/questions/6281314/object-preventextensions-actually-allows-mutation-of-proto)
>
> [https://velog.io/@kdo0129/객체-잠그기](https://velog.io/@kdo0129/%EA%B0%9D%EC%B2%B4-%EC%9E%A0%EA%B7%B8%EA%B8%B0)
>
> [https://medium.com/@nlfernando11/object-freeze-vs-object-seal-vs-object-preventextensions-251ee99d0c47](https://medium.com/@nlfernando11/object-freeze-vs-object-seal-vs-object-preventextensions-251ee99d0c47)
>
> [https://medium.com/javascript-in-plain-english/object-freeze-vs-object-seal-vs-object-preventextensions-e78ef3a24201](https://medium.com/javascript-in-plain-english/object-freeze-vs-object-seal-vs-object-preventextensions-e78ef3a24201)
>
> [https://til.cybertec-postgresql.com/post/2019-10-11-Object-preventExtension-vs-seal-vs-freeze/](https://til.cybertec-postgresql.com/post/2019-10-11-Object-preventExtension-vs-seal-vs-freeze/)
>
> [https://ko.javascript.info/property-descriptors](https://ko.javascript.info/property-descriptors)
>
> [https://helloworldjavascript.net/pages/240-object-in-depth.html](https://helloworldjavascript.net/pages/240-object-in-depth.html)
