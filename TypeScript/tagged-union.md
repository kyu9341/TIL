## `TypeScript` - `tagged union` (`discriminated union`)

타입스크립트에서 타입을 좁히는 방법은 일반적으로 `typeof`나 `instanceof`, `in` 연산자, `Array.isArray`, `type predicate`를 사용한 커스텀 타입 가드 등 다양하다.

또 다른 방법으로는 이번에 설명할 주제인데, `tagged union` 혹은 `discriminated union`이라고 한다.

간단히 말하면 `tagged union`은 명시적으로 타입에 태그를 붙이는 것이다.

먼저 다음 예시를 보자.

세 종류의 도형(원, 직사각형, 정사각형)이 있고, 이에 대한 `interface`(또는 `type alias`)를 정의한다고 생각해보자. 원의 반지름(`radius`), 직사각형의 너비(`width`)와 높이(`height`), 정사각형의 한 변의 길이(`size`)를 모두 가져야 한다.

또한 원이라면 `radius` 외에 `width`, `height` 등은 존재하지 않고, 정사각형이라면 한 번의 길이(`size`)외에 다른 정보는 없으므로 도형(`Shape`)에 대한 인터페이스는 아래와 같이 정의할 수 있다.

```tsx
interface Shape {
  radius?: number; // circle
  width?: number; // rectangle
  height?: number; // rectangle
  size?: number; // square
}
```

방금 정의한 인터페이스를 사용하여 반지름이 10인 원을 정의해보면 아래와 같다.

<img width="583" alt="Screen Shot 2022-04-17 at 21 06 07 PM" src="https://user-images.githubusercontent.com/49153756/163715858-7166e607-8424-46c8-aecf-687161504c54.png">

위의 `cycle`을 사용하려고 하면 원은 `radius`만 가져야 함에도 불구하고 아래와 같이 `Shape`에 정의된 모든 프로퍼티(`radius`/`width`/`height`/`size`)가 추론된다.

이런 상황을 방지하려면 각각의 도형에 대해 유효한 프로퍼티만 가지도록 타입을 설계해야 한다. 아래와 같이 작성한다면 위와 같은 문제가 발생하지 않고, 해당 도형이 가져야 하는 프로퍼티만 추론이 될 것이다.

```tsx
interface Circle {
  radius: number;
}

interface Rectangle {
  width: number;
  height: number;
}

interface Square {
  size: number;
}
```

<img width="584" alt="Screen Shot 2022-04-17 at 21 12 10 PM" src="https://user-images.githubusercontent.com/49153756/163715855-618b6a07-3c4c-4c51-bc87-e4f60c1ac16e.png">

또한 세 도형 모두를 포함하는 타입은 각 타입의 유니온으로 표현할 수 있다.

```tsx
type Shape = Circle | Rectangle | Square;
```

이를 바탕으로 이번엔 도형의 넓이를 구하는 함수를 만들어보자. 다음과 같이 `in` 연산자를 사용하여 `shape`의 프로퍼티 존재 여부로 타입을 좁힐 수 있다. 각 분기마다 정확하게 필요한 타입만 추론된다.

```tsx
const getArea = (shape: Shape) => {
  if ('radius' in shape) {
    return Math.PI * shape.radius ** 2;
  } else if ('width' in shape) {
    return shape.width * shape.height;
  } else if ('size' in shape) {
    return shape.size * shape.size;
  }
};
```

하지만 여기서 새로운 도형 타입(삼각형)이 추가된다고 해보자.

```tsx
interface Triangle {
  width: number;
  height: number;
}
type Shape = Circle | Rectangle | Square | Triangle;
```

이렇게 되면 삼각형과 직사각형은 동일한 프로퍼티(`width`, `height`)를 가지지만 넓이를 구하는 방법이 달라 문제가 생긴다.

이런 경우 아래와 같이 `tagged union` (`discriminated union`)을 사용하면 좋다.

```tsx
interface Circle {
  kind: 'circle';
  radius: number;
}
interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}
interface Square {
  kind: 'square';
  size: number;
}
interface Triangle {
  kind: 'triangle';
  width: number;
  height: number;
}

type Shape = Square | Rectangle | Circle | Triangle;

const getArea = (shape: Shape) => {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'rectangle':
      return shape.width * shape.height;
    case 'square':
      return shape.size * shape.size;
    case 'triangle':
      return (shape.width * shape.height) / 2;
  }
};
```

`kind` 라는 태그에 따라 각 `case` 절에서 해당 `kind` 값을 가지는 타입으로 타입을 좁혀 사용했다. 즉, 유일한 문자열 리터럴 타입을 태그로 지정함으로써 정확하게 타입을 구분하여 좁힐 수 있게 된 것이다.

### `redux` 에서 활용

`tagged union` (`discriminated union`)은 `redux`를 사용할 때 유용하게 사용된다.

사용자의 로그인 / 로그아웃 상태를 관리하는 user store가 있다고 해보자.

```tsx
interface User {
  id: number;
  username: string;
  image: string;
}
```

로그인 / 로그아웃 시 발생하는 두 가지 액션이 있다. 여기에서는 `type` 이 태그로 사용되었다.

```tsx
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

type LoginAction = {
  type: typeof LOGIN;
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: typeof LOGOUT;
};

type UserAction = LoginAction | LogoutAction;
```

위의 두 액션을 처리하는 `reducer`는 아래와 같이 `tagged union`을 활용하여 구현할 수 있다.

```tsx
interface UserState {
  user: User;
}
const initialState: UserState = {
  user: null,
};

const userReducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case LOGIN:
      return {
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        user: null,
      };
    default:
      return state;
  }
};
```

`Shape`의 예제에서는 `kind`가, `redux`의 `action`에서는 `type`이 각각 유일한 문자열 리터럴 타입의 태그로서 타입을 구분하여 특정한 동작을 수행할 수 있도록 했다.
