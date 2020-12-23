# 자바스크립트(JavaScript) - this

오늘은 자바스크립트에서 자주 헷갈리는 `this` 에 대해 알아보겠다.

## this란?

**일반적으로 메소드를 호출한 객체가 저장되어 있는 속성이다.**

자바스크립트에서는 함수 선언 시에 `this` 에 바인딩할 객체가 정적으로 결정되는 것이 아니고, 함수 호출 시 어떻게 호출되었는지에 따라 `this` 에 바인딩할 객체가 동적으로 결정된다. 즉, 함수 호출 전까지는 `this` 에 값이 할당되어있지 않는다.

그럼 이제 각각의 상황에서 `this` 에 어떤 값이 할당되는지 알아보자!

### 전역공간에서 `this`

- 브라우저에서 `this` : `window`
- Node.js 에서 `this` : `global`

### 함수 내부에서 `this`

- 기본적으로 전역 객체를 가리킨다.
- defalut 값이 전역 객체, 바뀔 수 있음 (call, bind, apply)

**내부함수에서의 우회법**

```tsx
const obj = {
  a: 20,
  b: function() {
    console.log(this.a); // 20
    
    function c() {
      console.log(this.a); // undefined
    }
    c();
  },
};

obj.b();
```

아래와 같이 스코프체인을 이용하여 `obj`의 `this`에 접근이 가능하다.

```tsx
const obj = {
  a: 20,
  b: function() {
    const self = this;
    console.log(this.a); // 20
    
    function c() {
      console.log(self.a); // 20
    }
    c();
  },
};

obj.b();
```

### 화살표 함수에서 `this`

- 화살표 함수에는 `this` 가 없다.
- 화살표 함수 내부에서 `this` 에 접근하면 외부에서 값을 가져온다.

    → 일반 변수 서칭과 마찬가지로 `this` 값을 외부 렉시컬 스코프에서 찾는다.

```tsx
const obj = {
  a: 10,
  func() {
    const arrow = () => {
      console.log(this.a);
    }
    arrow();
  }
};

obj.func(); // 10
```

위의 예시를 보면, `arrow` 가 화살표 함수이기 때문에 `this.a` 는 화살표 함수 바깥의 메서드인 `func` 가 가리키는 대상과 같아진다. 즉, `arrow` 내부에서 `obj.a === this.a`

### 메소드 호출 시 `this`

- 메소드 호출 주체 (메소드명 앞)
  -  ex) `a.b()` → `this === a`
  -  ex) `a.b.c()` → `this === a.b`

### callback에서 `this`

- 기본적으로는 함수 내부에서와 동일
- 제어권을 가진 함수가 callback의 this를 명시한 경우 그에 따른다.
- `[call()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call)` , `[apply()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)`, `[bind()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)` 사용하여 this를 설정할 수 있음
    - `func.call(thisArg[, arg1[, arg2[, ...]]])`
    - `func.apply(thisArg, [argsArray])`
    - `func.bind(thisArg[, arg1[, arg2[, ...]]])`

`thisArg` : `func` 를 실행할 때 인식하게 할 `this` 를 설정한다.

`call()` 과 `apply()` 는 `thisArg` 자리에 `this` 로 인식할 객체를 넣고, 즉시 함수를 호출하는 점은 동일하다. 다른 점은 매개변수로 넘겨줄 인자들을 `,` 로 나열하느냐, 아니면 배열(`[]`) 에 담아서 한번에 넘겨주느냐의 차이이다.

 `bind()` 는 `call()` 과 같은 방식으로 사용하지만 즉시 `func` 를 호출하는 것이 아니라 `this` 를 바인딩하여 새로운 함수를 생성한다. 

```tsx
function func(x, y, z) {
  console.log(x, y, z);
}

const obj = {
  a: 10,
  b: 20,
};

func.call(obj, 1, 2, 3);
func.apply(obj, [1, 2, 3]);
func.bind(obj, 1, 2, 3)();
// 1 2 3 --> 모두 같은 결과
```

### 생성자 함수에서 `this`

- 인스턴스를 가리킨다.

```tsx
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const kwon = new Person('Kwon', 25);
console.log(kwon); // Person {name: "Kwon", age: 25}
```

### 요약

- `this` 는 **일반적으로 메소드를 호출한 객체가 저장되어 있는 속성이다.**
- 내부함수는 일반 함수, 메소드, 콜백함수 어디에서 선언되었든 관게없이 this는 전역객체를 바인딩한다.
- [`call()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call) , [`apply()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply), [`bind()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 를 사용하여 this를 설정할 수 있다.
- 화살표 함수는 자신만의 `this`를 가지지 않는다. 화살표 함수 안에서 `this`를 사용하면, 외부에서 `this` 값을 가져온다.

> 참조
>
> [https://ko.javascript.info/arrow-functions](https://ko.javascript.info/arrow-functions)
>
> [https://ko.javascript.info/object-methods](https://ko.javascript.info/object-methods)
>
> [https://poiemaweb.com/js-this](https://poiemaweb.com/js-this)