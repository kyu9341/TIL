# 타입 추론 / 타입 단언

## 타입 추론 (Type Inference)

타입 추론이란 타입스크립트에서 타입이 지정되어 있지 않은 경우에 코드를 해석하여 타입을 유추해가는 동작을 말한다.

매번 변수를 선언할 때마다 타입을 선언해야하는 불편함을 타입 추론으로 해소될 수 있다.

- `ex1)`

```jsx
let num = 3;
num = 'kwon'; // Type 'string' is not assignable to type 'number'.
```

위와 같이 `num` 이라는 변수에 `3`을 할당하면, 자동으로 타입스크립트는 `num` 변수는 `number` 타입으로 추론하게 된다. 이에 따라 `num`에 `'kwon'` 이라는 문자열을 할당하면 에러를 뱉는다.

또한, 이외에도 변수, `property`, `default parameter`, 함수의 반환 값 등을 설정할 때 타입 추론이 발생한다.

- `ex2)`

```tsx
interface Person<T> {
  name: string;
  age: number;
  value: T;
}

interface Student<K> extends Person<K> {
  school: string;
  address: K;
}

const student1: Student<string> = {
  name: 'kwon',
  age: 26,
  value: 'string value',
  school: 'abc',
  address: 'Seoul',
};
```

제네릭과 인터페이스에서도 타입 추론이 발생하는데, `student1`에서 `string`으로 정의된 `<K>` 가 `Person`에도 적용되어 `value`가 `string`이 되는 모습이다.

### Best Common Type

말그대로 가장 일반적인 타입이다. 여러가지 자료형이 배열 내에서 사용되는 경우, 여러가지 자료형을 포괄할 수 있는 가장 일반적인 자료형을 추론하는 것이다. 대부분의 경우 유니온 타입으로 추론된다.

<img width="418" alt="Screen Shot 2021-03-16 at 16 09 49 PM" src="https://user-images.githubusercontent.com/49153756/111269751-54152e00-8672-11eb-9417-177e438a4895.png">

위와 같이 `arr`이라는 배열에 여러 타입을 넣는 경우 모두 포함할 수 있는 유니온 타입으로 추론되는 모습을 볼 수 있다.

## 타입 단언 (Type Assertion)

타입 단언은 타입스크립트 컴파일러가 타입을 실제 런타임에 존재할 변수의 타입과 다르게 추론하거나 너무 보수적으로 추론하는 경우에 프로그래머가 수동으로 특정 변수에 대한 타입을 강제로 부여하는 것을 말한다.

```tsx
let a; // any;

a = 10;
a = 'abc';

let b = a as string; // a의 타입을 string으로 정해버린다.
```

타입 단언은 주로 DOM API를 조작할 때 많이 사용한다.

```tsx
const root = document.querySelector('#root');
root.textContent = 'text';
```

<img width="405" alt="Screen Shot 2021-03-16 at 17 00 14 PM" src="https://user-images.githubusercontent.com/49153756/111277559-ef5ed100-867b-11eb-98f8-13e9c0f78a81.png">

만약 `DOM`에 `root`라는 `id`를 가지는 엘리먼트가 없다면 `null` 값이 반환될 수 있으므로 `Element | null` 이라는 타입으로 추론된다.

```tsx
const root = document.querySelector('#root') as HTMLDivElement;
root.textContent = 'text';
```

<img width="538" alt="Screen Shot 2021-03-16 at 17 13 56 PM" src="https://user-images.githubusercontent.com/49153756/111277523-e40ba580-867b-11eb-9e35-ea03a9fb63d6.png">

이런 경우 해당 코드의 실행 시점에 `DOM`에 `root` 라는 `id`를 가지는 엘리먼트가 있다고 확신한다면 `as` 라는 키워드를 통해 `root` 변수의 타입을 단언할 수 있다.

```tsx
const root = document.querySelector('#root') as HTMLDivElement;
const root = <HTMLDivElement>document.querySelector('#root');
```

타입 단언은 위와 같이 두 방법으로 사용할 수 있는데, `<Type>` 의 표현법은 `JSX` 문법과 겹치는 경우가 있어 주로 `as type` 의 표현을 사용한다.

### 타입 단언과 타입 캐스팅의 차이

타입 단언은 런타임에 영향을 미치지 않는다. 반면, 타입 캐스팅은 컴파일 타임과 런타임 모두 타입을 변경시킨다. 타입 단언은 컴파일 타임에서만 타입을 변경한다.

> 참고
>
> [https://hyunseob.github.io/2017/12/12/typescript-type-inteference-and-type-assertion/](https://hyunseob.github.io/2017/12/12/typescript-type-inteference-and-type-assertion/)
>
> [https://joshua1988.github.io/ts/guide/type-inference.html#타입-추론-type-inference](https://joshua1988.github.io/ts/guide/type-inference.html#%ED%83%80%EC%9E%85-%EC%B6%94%EB%A1%A0-type-inference)
>
> [https://velog.io/@jo_love/TIL65.타입-추론타입-단언타입-가드타입-호환](https://velog.io/@jo_love/TIL65.%ED%83%80%EC%9E%85-%EC%B6%94%EB%A1%A0%ED%83%80%EC%9E%85-%EB%8B%A8%EC%96%B8%ED%83%80%EC%9E%85-%EA%B0%80%EB%93%9C%ED%83%80%EC%9E%85-%ED%98%B8%ED%99%98)
>
> [https://yceffort.kr/2019/08/20/typescript-type-assertion](https://yceffort.kr/2019/08/20/typescript-type-assertion)
