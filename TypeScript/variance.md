# 변성 (Variance)

변성/가변성(variance)은 타입의 계층 관계에서 서로 다른 타입 간에 어떤 관계가 있는지를 나타내는 개념이다.

```tsx
interface Shape {
  name: string;
}

interface Circle extends Shape {
  radius: number;
}
```

위와 같이 `Shape`과 `Circle`이 있다면, `Array<Shape>`와 `Array<Circle>`과 같이 기저 타입이 같고 타입 파라미터가 다른 여러 타입이 서로 어떤 관계를 가지는지 나타낸다. 이러한 타입의 변성은 언어마다 다른 방식으로 동작한다. 

변성의 종류에는 다음과 같이 네 가지가 존재한다.

- 공변 (`Covariance`) → `A`가 `B`의 서브타입일 때, `T<A>`도 `T<B>`의 서브타입인 경우
    - (`A → B`, `T<A> → T<B>`)
- 반공변 (`Contravariance`) →  `A`가 `B`의 서브타입일 때, `T<B>`가 `T<A>`의 서브타입인 경우
    - (`A → B`, `T<A> ← T<B>`)
- 무공변 (`Invariance`) → 다른 타입을 허용하지 않음
- 이변/양변 (`Bivariance`) → 공변성과 반공변성을 동시에 지님

**그럼 타입스크립트는 어떻게 동작할까?**

1. 기본적으로 타입스크립트는 공변성을 가진다.
2. 함수의 파라미터에서는 `strictFunctionTypes`옵션에 따라 반공변성 혹은 이변성을 가진다.
    1. `true` → 반공변성
    2. `false` → 이변성

### 공변성 (`Covariance`)

```tsx
declare let shapes: Array<Shape>;
declare let circles: Array<Circle>;

shapes = circles // 성공
circles = shapes // 에러
```

위 예시에서 `Circle`은 `Shape`의 서브타입이고, 타입스크립트에서 `Array`는 공변하므로 `Array<Circle>`도 `Array<Shape>`의 서브타입이다. 

다음 예시는 함수의 반환타입에서 공변성을 보여준다.

```tsx
type Producer<T> = () => T;

declare let produceShape: Producer<Shape>;
declare let produceCircle: Producer<Circle>;

produceShape = produceCircle; // 성공
produceCircle = produceShape; // 에러
```

위와 같이 함수의 반환 타입이 더 넓은 타입인 경우 더 좁은 타입을 반환하는 함수에 할당할 수 없다.

즉, `Circle → Shape` 일 때, `Producer<Circle> → Producer<Shape>` 의 관계가 성립한다.

### 반공변성 (`Contravariance`)

```tsx
type Consumer<T> = (x: T) => void;

declare let consumeShape: Consumer<Shape>;
declare let consumeCircle: Consumer<Circle>;

consumeShape = consumeCircle; // 에러
consumeCircle = consumeShape; // 성공
```

이번에도 마찬가지로 `Circle`은 `Shape`의 서브타입이지만, `Consumer<Circle>`는 `Consumer<Shape>`의 서브타입이 아닌 슈퍼타입으로 동작한다.

즉, `Circle → Shape` 일 때, `Consumer<Circle> ← Consumer<Shape>` 의 관계가 성립한다.

**함수의 파라미터가 반공변성 가져야 하는 이유**

```tsx
type Logger<T> = (arg: T) => void;

let logShape: Logger<Shape> = shape => console.log(`name: ${shape.name}`);
let logCircle: Logger<Circle> = circles => console.log(`name: ${circles.name}, radius: ${circles.radius}`);

logCircle = logShape; // 성공
logShape = logCircle; // 에러
```

**`logCircle`에 `logShape`를 할당하는 경우**

- `logCircle`을 호출하며 `Circle` 타입을 파리미터로 전달
- 실제로 `logCircle`에는 `logShape`이 할당되어 있으므로 `name`을 출력
- `Circle`을 `Shape`의 서브타입이므로 `name` 을 가지고 있어 정상 동작

**`logShape`에 `logCircle`을 할당하는 경우**

- `logShape`을 호출하며 `Shape` 타입을 파리미터로 전달
- 실제로 `logShape`에는 `logCircle`이 할당되어 있으므로 `name` 과 `radius`를 출력
- `Shape`은 `name` 은 가지고 있지만 `radius`는 가지고 있지 않음 → `undefined` 출력 (의도치 않은 동작)

### 이변성 (`Bivariance`)

처음에 `strictFunctionTypes` 가 `false`이면 함수의 파라미터는 이변성을 가진다고 했다. 

**타입스크립트가 함수의 파라미터에서 이변성을 가지도록 허용한 이유**

`Circle[]`이 `Shape[]`에 할당할 수 있는지 확인할 때 다음과 같은 과정을 거친다.

- `Circle[]`의 각 원소가 `Shape[]`에 할당할 수 있는가?
    - `Circle[].push`가 `Shape[].push`에 할당할 수 있는가?
        - `(x: Circle) => number` 타입이 `(x: Shape) => number` 타입에 할당할 수 있는가?
            - `(x: Circle) => number` 의 첫 번째 파라미터 타입이 `(x: Shape ) => number` 의 첫 번째 파라미터 타입에 할당할 수 있는가?
                - `Circle`은 `Shape`에 할당할 수 있는가?
                    - Yes.

위의 과정을 보면 `(x: Circle) => number` 타입이 `(x: Shape) => number` 타입에 할당할 수 있는지를 확인한다. 만약 타입스크립트가 함수 파라미터에서 항상 반변하도록 강제하였다면 `Circle[]`은 `Shape[]`에 할당할 수 없다.

이러한 문제로 인해 타입스크립트에서 함수 파라미터에서 이변성을 가질 수 있게 되었다.