## undefined와 null의 차이

`undefined` 는 선언 후 값을 할당하지 않은 변수를 의미하고, `null` 은 명시적으로 값이 비어있음을 나타낸다.

`undefined` 와 `null` 모두 하나의 값이자 `primitive type`이다.

차이점은 `undefined`는 변수를 선언만 하더라도 할당되지만 `null`은 변수를 선언한 후에 `null`로 값을 바꿔줘야 한다는 점이다.

```jsx
console.log(typeof null); // object
console.log(typeof undefined); // undefined

const val = null;

console.log(typeof val === null); // false
console.log(val === null); // true
```

`typeof`를 통해 자료형을 확인해보면 `undefined`는 `undefined`가 정상적으로 출력되는 것과 달리, `null`은 `object`로, 이는 자바스크립트 설계상의 오류라고 한다. 따라서 `null` 타입을 확인할 때 `typeof` 연산자를 사용하면 안되고 일치 연산자(`===`)를 사용하여야 한다.

**주의사항**

`undefined`는 개발자가 의도적으로 할당한 값이 아니라 자바스크립트 엔진에 의해 초기화된 값이다. 변수를 참조했을 때 `undefined`가 반환된다면 참조한 변수가 선언 이후 값이 할당된 적인 없는 변수라는 것을 알 수 있다.

만약 변수 초기화에 의도적으로 `undefined` 를 할당한다면 `undefined` 의 본래 취지와 어긋나며 혼란을 줄 수 있다. 따라서, 변수의 값이 없다는 것을 명시하고 싶다면 `null` 을 할당하는 것이 옳다.

[https://webclub.tistory.com/1](https://webclub.tistory.com/1)

[https://2ssue.github.io/common_questions_for_Web_Developer/docs/Javascript/13_undefined&null.html#undefined](https://2ssue.github.io/common_questions_for_Web_Developer/docs/Javascript/13_undefined&null.html#undefined)
