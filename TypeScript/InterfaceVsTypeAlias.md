## `Interface`와 `Type Alias`

### `interface`

`interface`는 일반적으로 타입 체크를 위해 사용되며 변수, 함수, 클래스에 사용할 수 있다. `interface`는 새로운 객체 타입을 정의하는 것이다. `interface`에 선언된 프로퍼티 또는 메소드의 구현을 강제하여 일관성을 유지할 수 있도록 할 수 있다.

```tsx
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

```tsx
interface AddFunc {
  (num1: number, num2: number): number;
}

const add: AddFunc = function (num1: number, num2: number) {
  return num1 + num2;
};
```

`interface`는 함수의 타입으로 사용 가능하다. 함수의 `interface`에는 타입이 선언된 파라미터들과 리턴 타입을 정의한다.

- `interface` 상속

```tsx
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

`interface`는 `extends` 키워드를 통해 확장이 가능하다.

- 클래스 구현 (`implements`)

```tsx
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

클래스 선언문의 `implements` 뒤에 `interface`를 선언하면 해당 클래스는 지정된 `interface`를 반드시 구현해야 한다. `interface`는 직접 인스턴스를 생성할 수는 없다.

`interface`는 `extends` 키워드를 통해 `interface` 또는 `class`를 상속받을 수 있다.

- `**declaration merging**` (선언 병합)

```tsx
interface Person {
  name: string;
}

interface Person {
  age: number;
}

const person: Person = {
  name: 'kwon',
  age: '27',
};
```

`interface`는 동일한 이름을 여러 번 선언을 해도 컴파일 시점에 합쳐지므로 확장성이 좋다. 따라서 외부로 노출하는 public api는 `interface` 를 사용하는 것이 좋다.

예를 들어, 만약 `Window` 객체 타입을 전역으로 확장해야하는 경우에도 `interface`의 `declaration merging`을 사용할 수 있다.

```tsx
declare global {
  interface Window {
    __NEW_PROPERTY__: boolean;
  }
}
```

---

### `Type Alias`

`type foo = number | string`과 같은 구문을 `type alias`라고 한다. 이름에서 유추할 수 있듯이, `type alias`는 주어진 자료형에 대한 별명을 만든다. 즉, 실제로 새로운 자료형을 만드는 것은 아니다.

```tsx
type Person = {
  name: string;
  age: number;
  address?: string;
};
```

이름있는 객체 자료형을 만드는 인터페이스와는 달리, `type alias`는 `primitive`, `union`, `intersection`을 포함하여 어느 자료형이든 만들 수 있다.

```tsx
// 문자열 리터럴 타입
type LastName = 'Kwon';

// 유니온 타입
type UnionType = string | number;

// 객체 리터럴 유니온 타입
type ObjectUnionType = { a: 1 } | { b: 2 };

// 인터페이스 유니온 타입
type Person = Student | Employee;

// 함수 타입
type AddFunc = (num1: number, num2: number) => number;
```

- `type` 상속

```tsx
type Person = {
  name: string;
  age: number;
};

type Student = Person & { grade: number };

const user: Student = {
  age: 26,
  name: 'kwon',
  grade: 2,
};
```

`type alias`도 인터섹션 타입을 활용하면 `interface`와 마찬가지로 상속이 가능하다.

- 클래스 구현 (`implements`)

```tsx
type TPerson = {
  name: string;
  age: number;
  sayHi(): void;
};

class Person implements TPerson {
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

또한 `interface`와 마찬가지로 클래스에서 `type alias`를 `implements`하는 것도 가능하다.

- `mapped type` / `conditional type`

```tsx
// mapped type
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// conditional type
type Flatten<T> = T extends any[] ? Flatten<T[number]> : T;
```

`interface`와 달리 `type alias`에서는 `mapped type`이나 `conditional type`등을 사용할 수 있다. 주로 `utility type`을 생성하는 데에 사용한다. 또한 위의 `Flatten<T>` 예시와 같이 `type alias`는 재귀적으로 선언될 수도 있다.

---

### `type`과 `interface`의 차이

타입과 인터페이스는 거의 동일하지만 약간의 차이가 있다.

- `interface`는 상속(`extends`)되거나 구현(`implements`)될 수 있으며, 다른 타입을 상속하거나 구현할 수 있다. 그러나 `type alias`는 그렇지 않다. (`TS 2.7` 부터는 타입도 인터섹션을 통해 다른 타입을 상속할 수 있다.)
  ```tsx
  type Student = Person & { grade: number };
  ```
  위와 같이 인터섹션 타입을 이용해서 `type` 으로도 상속을 구현할 수 있다.
- `interface`는 객체 타입만 정의가 가능한 것과 달리 `type alias`는 원시 타입, 배열과 튜플, 유니온 타입 등에 `alias`을 붙일 수 있고, `mapped type`이나 `conditional type`을 사용할 수 있다.
- `type`은 새로운 이름을 만들지 않지만, `interface`는 새로운 이름을 만든다.
  - 즉, `type alias`는 에러 메시지같은 곳에서 별칭으로 출력되지 않고, 리터럴 그대로 출력된다.
  - 에디터에서 `interface`에 마우스를 올리면 `Interface`를 반환한다고 보여주지만 `alias`는 객체 리터럴 타입을 반환한다고 보여준다.
- 인터페이스는 `**declaration merging**`(선언 병합)이 가능하다.
  - 즉, 같은 이름의 인터페이스를 여러번 선언할 수 있다. 그러나 `type alias`는 그렇지 않다.

---

<details>
    <summary> 🔖 참고 </summary>

> [https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
>
> [https://typescript-kr.github.io/pages/advanced-types.html#인터페이스-vs-타입-별칭-interfaces-vs-type-aliases](https://typescript-kr.github.io/pages/advanced-types.html#%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4-vs-%ED%83%80%EC%9E%85-%EB%B3%84%EC%B9%AD-interfaces-vs-type-aliases)
>
> [https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript](https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript)
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

</details>
