## `Type`과 `Interface`

### `Type`

`type foo = number | string`과 같은 구문을 `type alias`라고 한다. 이름에서 유추할 수 있듯이, `type alias`는 주어진 자료형에 대한 별명을 만든다. 즉, 실제로 새로운 자료형을 만드는 것은 아니다.

이름있는 객체 자료형을 만드는 인터페이스와는 달리, `type alias`는 `primitive`, `union`, `intersection`을 포함하여 어느 자료형이든 만들 수 있다.

```ts
type Person = {
  name: string;
  age: number;
  address?: string;
};
```

`type alias` 에서도 `Optional Property` 를 사용할 수 있다.

```ts
// 문자열 리터럴 타입 지정
type LastName = 'Kwon';

// 유니온 타입 지정
type UnionType = string | number;

// 객체 리터럴 유니온 타입 지정
type ObjectUnionType = { a: 1 } | { b: 2 };

// 인터페이스 유니온 타입 지정
type Person = Student | Employee;
```

---

### `interface`

`interface`는 일반적으로 타입 체크를 위해 사용되며 변수, 함수, 클래스에 사용할 수 있다. `interface`는 여러가지 타입을 갖는 프로퍼티로 이루어진 새로운 타입을 정의하는 것과 유사하다. `interface`에 선언된 프로퍼티 또는 메소드의 구현을 강제하여 일관성을 유지할 수 있도록 하는 것이다.

```ts
interface Person {
  // 인터페이스 정의
  name: string;
  age: number;
}

const user: Person = {
  name: 'kwon',
  age: 26,
};
```

- 함수 인터페이스

```ts
interface AddFunc {
  (num1: number, num2: number): number;
}

const add: AddFunc = function (num1: number, num2: number) {
  return num1 + num2;
};
```

인터페이스는 함수의 타입으로 사용 가능하다. 함수의 인터페이스에는 타입이 선언된 파라미터들과 리턴 타입을 정의한다.

- 클래스 인터페이스 구현

```ts
interface IPerson {
  name: string;
  age: number;
  sayHi(): void;
}

class Person implements IPerson {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  sayHi() {
    console.log('Hi');
  }
}
```

클래스 선언문의 `implements` 뒤에 인터페이스를 선언하면 해당 클래스는 지정된 인터페이스를 반드시 구현해야 한다. 인터페이스는 직접 인스턴스를 생성할 수는 없다.

- 인터페이스 상속

```ts
interface Person {
  name: string;
  age: number;
}

interface Student extends Person {
  grade: number;
}

const user: Student = {
  age: 26,
  name: 'kwon',
  grade: 2,
};
```

인터페이스는 `extends` 키워드를 통해 `interface` 또는 `class`를 상속받을 수 있다.

---

### `type`과 `interface`의 차이

타입과 인터페이스는 유사하지만, 인터페이스가 타입에 비해 좀 더 가용성이 높다.

- `interface`는 상속(`extends`)되거나 구현(`implements`)될 수 있으며, 다른 타입을 상속하거나 구현할 수 있다. 그러나 `Type Alias`는 그렇지 않다. (`TS 2.7` 부터는 타입도 인터섹션을 통해 다른 타입을 상속할 수 있다.)

  ```ts
  type Student = Person & { grade: number };
  ```

  위와 같이 인터섹션 타입을 이용해서 `type` 으로도 상속을 구현할 수 있다.

- `interface`와 달리 `Type Alias`는 원시 타입, 배열과 튜플, 유니온 타입 등에 새로운 이름을 붙일 수 있다.
- 타입은 새로운 이름을 만들지 않지만, 인터페이스는 새로운 이름을 만든다.
  - 즉, 에러 메시지같은 곳에서 별칭으로 출력되지 않고, 리터럴 그대로 출력된다.
  - 에디터에서 `interface`에 마우스를 올리면 `Interface`를 반환한다고 보여주지만 `alias`는 객체 리터럴 타입을 반환한다고 보여준다.
- 인터페이스는 여러 병합된 선언(`merged declaration`)을 가질 수 있다.
  - 즉, 같은 이름의 인터페이스를 여러번 선언할 수 있다. 그러나 객체 타입 리터럴의 앨리어스는 그렇지 않다.

공식 문서에는 최대한 타입 대신 인터페이스를 사용하라고 되어있고, 인터페이스로 표현할 수 없는 형태이거나 유니온 혹은 튜플을 사용해야 하는 경우라면 타입을 사용해야 한다고 한다.

---

> 참고
>
> [https://typescript-kr.github.io/pages/advanced-types.html#인터페이스-vs-타입-별칭-interfaces-vs-type-aliases](https://typescript-kr.github.io/pages/advanced-types.html#%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4-vs-%ED%83%80%EC%9E%85-%EB%B3%84%EC%B9%AD-interfaces-vs-type-aliases)
>
> [https://joonsungum.github.io/post/2019-02-25-typescript-interface-and-type-alias/](https://joonsungum.github.io/post/2019-02-25-typescript-interface-and-type-alias/)
>
> [https://kjwsx23.tistory.com/466](https://kjwsx23.tistory.com/466)
>
> [https://yceffort.kr/2021/03/typescript-interface-vs-type](https://yceffort.kr/2021/03/typescript-interface-vs-type)
>
> [https://poiemaweb.com/typescript-alias](https://poiemaweb.com/typescript-alias)
>
> [https://poiemaweb.com/typescript-interface](https://poiemaweb.com/typescript-interface)
