# enum

`enum`은 가능한 값이 특정하게 몇가지 정해져 있는 경우 이런 관련된 상수들의 집합으로 유용하게 사용할 수 있다. `java`나 다른 언어의 경우 일반적으로 `enum`이 내장되어 있지만, 자바스크립트는 그렇지 않기 때문에 보통 상수의 집합을 선언할 때 객체로 사용하게 된다. 

타입스크립트에서는 `enum`을 제공하는데, 일반적으로 타입스크립트에서 제공하는 다른 타입들과는 차이가 있다. `type`이나 `interface` 등 다른 타입들은 트랜스파일링되며 사라지므로 런타임에 영향을 미치지 않지만, `enum`은 다른 `type`들과 다르게 트랜스파일링되었을 때 사라지지 않고, 자바스크립트 객체로 변환된다.

`enum`은 `numeric enum`과 `string enum`으로 나누어진다. (섞어서 사용도 가능)

## `numeric enum`

기본적으로 `enum`은 다음과 같은 형태로 사용할 수 있다.

```tsx
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

값을 초기화해주지 않는다면 기본적으로 `numeric enum`으로 각 프로퍼티에 `0`부터 순차적으로 할당된다. 중간에 값을 지정해준다면 값이 지정된 다음 프로퍼티부터 `1`씩 증가되어 할당된다.

```tsx
enum Direction {
  Up,
  Down = 2,
  Left,
  Right,
}
```

위와 같은 경우 `Up` 부터 순서대로 `0, 2, 3, 4` 와 같이 값이 지정된다. 

`numeric enum`의 경우 문제가 있는데, 아래와 같은 경우에는 `Direction` 타입인 `dir`에 `1`, `2`, `3`, `4`의 값만 할당이 가능해야 할 것 같지만, 전혀 상관 없는 숫자를 입력해도 에러가 발생하지 않는다.

```tsx
enum Direction {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4,
}

const dir: Direction = 500; // 에러가 발생하지 않음
```

이러한 이유로 `numeric enum` 은 꼭 필요한 경우(이를 테면 `reverse mapping` 이 필요하다거나)가 아니라면 `string enum`을 사용하는 것이 나아보인다.

### `reverse mapping`

`numeric enum`인 경우에는 `reverse mapping`이 되므로 아래와 같은 동작이 가능하다. 

```tsx
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

const dir = Direction.Up; // 0
const dirValue = Direction[dir]; // "Up"
```

위와 같이 `Direction.Up` 의 값에 해당하는 `0` 으로 `Direction`에 접근하면 `"Up"` 이라는 값을 다시 얻을 수 있다. 아래의 변환된 결과물을 보면 어떻게 이런 동작이 가능한지 알 수 있다. 

```tsx
"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

`IIFE`형태로 변환되어 읽기 어렵지만, 간단하게 보면 아래와 같은 객체가 만들어지는 것이다.

```tsx
const Direction = {
    0: "Up",
    1: "Down",
    2: "Left",
    3: "Right",
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
};
```

## `string enum`

`string enum`은 다음과 같이 초기값을 문자열로 지정해주어 사용한다.

```tsx
enum Direction {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right'
}
```

`string enum`은 값을 지정해주지 않은 경우 `numeric enum`처럼 자동으로 값을 설정해주지 않으므로 반드시 초기값을 지정해 주어야 한다. `string enum`은 프로퍼티의 `value` 값에 문자열을 사용할 수 있으므로 런타임에 의미있는 값을 지정하여 유용하게 사용할 수 있다.

`string enum`은 `numeric enum`과 중요한 차이가 있는데, 타입스크립트의 다른 타입과 달리 구조적 타이핑이 아닌 **명목적 타이핑**을 사용한다.

> 구조적 타이핑(`structural typing`)은 구조가 같은면 할당이 가능한 반면, 명목적 타이핑(`nominally typing`)은 타입의 이름이 같아야 할당이 허용된다.
> 

다음 코드를 보자. `numeric enum` 의 경우 `Direction`타입인 `direction`에 직접 `Direction.Down`에 해당하는 값인 `1` 을 할당한 경우 아무 문제 없이 동작한다.

```tsx
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

let direction = Direction.Up;
direction = 1; // 정상 동작
```

하지만 `string enum` 의 경우 반드시 선언한 `Direction` 을 사용하지 않으면 에러가 발생한다. 

```tsx
enum Direction {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right'
}

let direction = Direction.Up;
direction = 'down'; // Type '"down"' is not assignable to type 'Direction'.(2322)
```

위 코드의 에러를 없애려면 `direction = Direction.Down` 과 같이 사용해야 한다.

```tsx
declare function checkDirection(direction: Direction): boolean;

checkDirection('left'); // javascript 에서 정상 동작 / typescript 에서 error
checkDirection(Direction.Left); // typescript 에서는 Direction을 사용해야 함
```

`Direction`는 런타임에는 문자열이므로 자바스크립트에서는 `checkDirection('left')`와 같이 호출이 가능하지만 타입스크립트에서는 에러가 발생한다.

위와 같이 자바스크립트와 타입스크립트에서 동작이 다르기 때문에 `string enum`은 사용하지 않는 것이 좋지 않아 대신에 `object`에 `const assertion`을 적용하여 리터털 타입의 유니온으로 사용하는 것이 낫다는 의견도 있다. 이에 대해서는 아래에서 다시 알아보겠다.

## `const enum`

일반적인 (`numeric, string`) `enum`은 트랜스파일링되어 자바스크립트의 실제 객체로 변환된다. 하지만 `const enum`을 사용하면 실제 객체를 생성하지 않고, 완전히 제거되면서 `const enum`을 사용한 지점에 인라인된다. 

```tsx
const enum Direction {
    Up,
    Down,
    Left,
    Right,
}

const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
```

위와 같이 `const enum`을 사용하고 트랜스파일링하여 자바스크립트로 변환하면 아래와 같이 표현된다.

```tsx
"use strict";
const directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

객체로 변환되지 않고, 사용 지점에 `enum`의 `value` 값이 그대로 인라인된 것을 확인할 수 있다.


### `object const assertion`

위에서 언급한 `string enum`을 대체할 방법이다. 타입과 값으로 모두 사용할 수 있는 `enum`을 대체하려면 `object`에 `const assertion`을 사용하여 `value`를 리터럴 타입으로 추론하도록 한 후 그 `values`의 `union`으로 사용한다.

```tsx
const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
} as const;

type DirectionType = typeof DIRECTION[keyof typeof DIRECTION];
// "up" | "down" | "left" | "right"
```

위와 같이 **`object`에 `const assertion`을 사용**하고 `keyof` 키워드를 활용하여 해당 객체의 값들에 대한 `union` 타입을 생성하여 사용한다. 이를 유틸리티 타입으로 만들면 아래와 같이 사용할 수 있다.

- `Values` utility type 정의

```tsx
type Values<T extends object> = T[keyof T];

type DirectionType = Values<typeof DIRECTION>;
```

이런 방식으로 `enum`을 충분히 대체할 수 있다. 물론 이 방법은 일반적인 타입스크립트에서의 구조적 타이핑을 사용하기 때문에 `string enum`에서의 명목적 타이핑은 대체할 수 없다.

또한 선언한 상수의 타입이 필요한 경우 위와 같이 `Values`를 사용하여 새로 타입을 생성하여 관리해야 하므로 타입의 복잡도가 높아질 수 있다.

### `string enum` vs `object const assertion`

**`string enum`**

**장점**

- `string enum`의 경우 명목적 타이핑을 사용하므로 반드시 선언한 `enum`을 사용하도록 강제할 수 있음
- 선언한 `enum` 자체를 타입으로 사용가능하여 타입 정의를 단순하게 유지할 수 있음

**단점**

- `enum`을 사용하면 `IIFE`(즉시 실행 함수)로 변경이 되므로 `tree-shaking`이 되지 않음
- `string enum`은 타입스크립트의 다른 타입들과 달리 구조적 타이핑이 아닌 명목적 타이핑을 사용하여 자바스크립트와 타입스크립트에서의 동작이 다름
- `string enum`은 명목적 타이핑을 사용하므로 모든 곳에서 선언한 `enum`을 `import`하여 사용해야 하는 번거로움

**`object const assertion`**

위의 `string enum`의 장단점을 뒤집으면 `object const assertion`의 장단점이라고 볼 수 있다.

<details>
    <summary> 🔖 참고 </summary>

- [https://www.typescriptlang.org/docs/handbook/enums.html](https://www.typescriptlang.org/docs/handbook/enums.html)
- [https://medium.com/@seungha_kim_IT/typescript-enum을-사용하는-이유-3b3ccd8e5552](https://medium.com/@seungha_kim_IT/typescript-enum%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0-3b3ccd8e5552)
- [https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/](https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/)
- [https://hyunseob.github.io/2017/07/18/typescript-enums/](https://hyunseob.github.io/2017/07/18/typescript-enums/)
- [https://www.digitalocean.com/community/tutorials/how-to-use-enums-in-typescript](https://www.digitalocean.com/community/tutorials/how-to-use-enums-in-typescript)
- [https://ncjamieson.com/dont-export-const-enums/](https://ncjamieson.com/dont-export-const-enums/)
- [https://stackoverflow.com/questions/68720866/why-does-webpack-5-include-my-unused-typescript-enum-exports-even-when-tree-sha](https://stackoverflow.com/questions/68720866/why-does-webpack-5-include-my-unused-typescript-enum-exports-even-when-tree-sha)
- [https://velog.io/@sensecodevalue/Typescript-Enum-왜-쓰지-말아야하죠](https://velog.io/@sensecodevalue/Typescript-Enum-%EC%99%9C-%EC%93%B0%EC%A7%80-%EB%A7%90%EC%95%84%EC%95%BC%ED%95%98%EC%A3%A0)

</details>