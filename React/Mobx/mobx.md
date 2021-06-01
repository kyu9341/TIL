# [MobX API](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/api.md)

## `observable(value)`

**사용법**

- `observable(value)`
- `@observable classProperty = value`

`observable` 은 일반 객체, 클래스 인스턴스, 배열, 맵 등 일 수 있다.

`observable(value)` 은 `observable` 로 사용 가능한 데이터 구조인 경우에만 성공하는 편리한 API이다. 이외의 값에 대해서는 변환되지 않는다.

아래의 변환 규칙이 적용되고, 데코레이터를 사용하여 약간의 조율이 가능하다.

1. 값이 ES6 `Map`의 인스턴스인 경우 : 새로운 `Observable Map`을 반환

    `Observable Map`은 특정 항목의 변경에만 반응하지 않고 항목의 추가 또는 제거에 대해서도 유용하다.

2. 값이 array인 경우 : 새로운 `Observable Array`를 반환
3. 값이 프로토타입이 없는 객체이거나 프로토타입이 `Object.prototype`인 경우 (일반 객체) : 객체는 복사되고 현재의 모든 프로퍼티를 `observable`로 만든다.
4. 값이 `프로토타입을 가지는 객체`이거나 `원시타입` 또는 `함수가 있는 객체`인 경우 값이 변경되지 않는다. `Boxed Observable`이 필요한 경우 다음 중 하나를 수행할 수 있다.
    - `observable.box(value)`를 명시적으로 호출
    - `@observable`를 클래스 정의에 사용
    - `decorate()`
    - `extendObservable()` 를 클래스 생성자에서 사용

`MobX`는 프로토 타입이있는 객체를 자동으로 `observable`로 만들지 않는다. 그것은 생성자 함수의 책임이다. 생성자에서 `extendObservable` 를 사용하거나 클래스에서 `@observable`를 사용한다.

> Some **notes :**

기본적으로 데이터 구조를 `observable`하게 하는 것은 감염적이다. 즉, `observable value`는 데이터 구조에 포함될 값에 자동으로 적용된다는 것을 의미한다. 이 동작은 `decorator`를 사용하여 변경할 수 있다.

 [MobX 4 and below] 동적으로 키가 있는 개체를 만들려면 `map`을 사용해야 한다. 

- [`@observable property = value`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/observable-decorator.md)
    - `observable` 은 데코레이터로도 사용이 가능하다. [데코레이터를 사용하도록 설정](https://github.com/mobxjs/mobx/blob/4.15.7/docs/best/decorators.md)해야 하며 `extendObservable(this, {property:value})`을 위한 syntactic sugar이다.
- [`observable.box(value, options?)`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/boxed.md)
    - 원시 값은 immutable하기 때문에 객체의 property가 아니라 단독으로는 `observable`로 만들 수 없다. 이를 `observable box`를 통해 가능하게 한다.
    - 값에 대한 `observable reference`를 저장하는 `observable box`를 만든다. `get()`을 사용하여 box의 현재 값을 가져오고, `set()` 으로 업데이트 한다.
    - 일반 box는 자동으로 추가되는 새로운 값을 `observable` 값으로 전환하려고 한다. 이 동작을 비활성화하려면 `{deep: false}` option을 사용한다.
    - `observable.box()` 로 반환되는 객체는 아래와 같은 메서드를 가진다.
        - `.get()` : 현재 값을 반환
        - `.set(value)` : 현재 저장된 값을 대체, 모든 observer에게 알림
        - `intercept(interceptor)` : 변경 사항을 적용하기 전에 가로채는 데 사용할 수 있다.
        - `.observe(callback: (change) => void, fireImmediately = false): disposerFunction` :  저장된 값이 변경될 때마다 실행되는 observer function을 등록. observer를 취소하는 함수(disposer)를 반환
            - change parameter는 `newValue`, `oldValue`를 포함한다.
        - 참고 → [observe & intercept](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/observe.md)

        ```jsx
        import { observable } from "mobx"

        const cityName = observable.box("Vienna")

        console.log(cityName.get())
        // prints 'Vienna'

        cityName.observe(function (change) {
            console.log(change.oldValue, "->", change.newValue)
        })

        cityName.set("Amsterdam")
        // prints 'Vienna -> Amsterdam'
        ```

- `observable.object(value, decorators?, options?)`
    - 일반 객체를 `observable`로 만든다.
    - `observable`은 기본적으로 재귀적으로 적용되어 nested object인 경우라도 모두 `observable`로 적용된다.
    - 나중에 추가되는 속성은 따로 설정하지 않으면 observable로 만들 수 없다. (`set`, `extendObservable` 사용하면 가능)
- `observable.array(value, options?)`
    - 배열을 `observable` 로 만든다.
    - 재귀적으로 동작하여 새로 추가되는 값도 모두 `observable` 로 만들어준다.
    - 기본 내장 함수 외에도 아래의 메서드를 사용할 수 있다.
        - `intercept(interceptor)` : 배열에 적용하기 전에 변경 사항을 가로채는 데 사용
        - `observe(listener, fireImmediately? = false)` : 배열의 변경 사항에 대한 listener 추가 가능. callback 배열 splice 또는 배열 변경을 표현하는 argument를 받는다 . listener를 중지하는 disposer 함수를 반환
        - `clear()` : 배열에서 현재 항목을 모두 제거
        - `replace(newItems)` : 배열의 모든 기존 항목을 새 항목으로 변경
        - `find(predicate: (item, index, array) => boolean, thisArg?)` : 기본적으로 ES7의 `Array.find`와 동일
        - `findIndex(predicate: (item, index, array) => boolean, thisArg?)` : 기본적으로 ES7의 `Array.findIndex`와 동일
        - `remove(value)` : 배열에서 값 별로 단일 항목을 제거한다. 항목이 발견되고 제거 된 경우 `true` 반환
        - *[MobX 4 이하]* `peek()` : `slice()` 와 유사하게 다른 라이브러리로 안전하게 전달 가능한 모든 값이있는 배열을 반환
    - `observable.array(values, { deep: false })` : 이 설정을 추가하면 배열에 할당되는 모든 값을 `observable` 로 만드는 동작을 비활성화한다.
    - 반환되는 값은 유사 배열인데, 네이티브 메서드는 모두 지원된다. 하지만 `Array.isArray(observable([]))` 같은 경우 `false` 가 반환되기 때문에 외부 라이브러리에 전달해야하는 경우 `array.slice()`를 통해 얕은 복사를 해서 전달한다.
- [`observable.map(values, options?)`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/map.md)
    - `observable(new Map())` , `@observable map = new Map()` 와 동일한 동작을 수행
    - 기본적으로 ES6 Map 스펙에 존재하는 메서드가 제공되고, 추가적으로 MobX에서 사용 가능한 아래의 메서드들이 있다.
        - `toJS()` :  `observable Map`을 다시 일반 맵으로 변환
        - `toJSON()` : Map의 shallow plain object representation을 반환 (`mobx.toJS(map)`으로 deep copy)
        - `intercept(interceptor)` : 변경 사항이 맵에 적용되기 전에 실행될 interceptor 등록
        - `observe(listener, fireImmediately?)` : map이 변경될 때 수행될 listener를 등록
        - `merge(values)` : 제공된 객체의 모든 항목을 이 맵에 복사. (`value` : 일반 객체, 배열, ES6 Map 등)
        - `replace(values)` :  현재 Map의 전체 내용을 제공된 values로 변경
- `observable.set(value, options?)`
    - Set을 observable로 만든다.
    - Set의 값 추가/제거를 관찰한다. 브라우저가 ES6 Set을 지원하는 경우 사용 가능
    - Set의 기본 API를 제공
- [`extendObservable`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/extend-observable.md)
    - `extendObservable`은 `Object.assign` 처럼 `property`와 값을 `target` 객체에 합쳐 주는데, 특징은 `observable property`로 만들어 추가한다.

---

### Decorators

- **`observable.deep`** : 모든 observable에서 사용하는 default decorator
- **`observable.ref`** : 자동 observable 변환을 disable하고, observable reference를 대신 생성
- **`observable.shallow`**: 컬렉션과 조합해서만 사용할 수 있고, 할당 된 컬렉션을 shallowly observable 컬렉션으로 변환. 즉, 컬렉션 내부의 값은 자동으로 observable하지 않게 된다.

---

## [`Computed values`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/computed-decorator.md)

`computed value`는 기존 상태나 또 다른 `computed value`에서 파생될 수 있는 값이다. 이전 계산에서 사용된 데이터가 변경되지 않으면 computed property는 다시 실행되지 않고 이전 계산 값을 재사용한다. 또한 최적화가 잘 되어있으니 가능하면 잘 사용하는 것이 좋다.

만약 UI가 사라지는 등의 경우로 `computed value` 가 더 이상 사용되지 않으면 MobX는 자동으로 가비지 컬렉션을 수행한다. `computed value` 를 생성하고 어떤 reaction에서도 사용되지 않으면 이것은 캐시되지 않고 불필요한 연산이 수행될 수 있는데, `observe`나 `keepAlive`를 사용하여 `computed value` 를 유지할 수 있다.

**사용법**

- `computed(() => expression)`
- `computed(() => expression, (newValue) => void)`
- `computed(() => expression, options)`
- `@computed get classProperty() { return expression; }`
- `@computed({equals: compareFn}) get classProperty() { return expression; }`
- `@computed.struct get classProperty() { return expression; }`

계산된 속성을 생성한다. `expression`은 side effect 없이 값을 반환해야 한다. `expression`은 `observable`이 변경된 경우 자동으로 재평가되지만, 일부 reaction에서 사용 중인 경우에만 해당된다.

`computed` 의 동작을 제어하는데 사용가능한 여러 옵션들이 있다.

- **`equals: (value, value) => boolean`**
    - Comparison method를 통해 상태가 변경 될 때 기본 감지를 override 할 수 있다. 다음과 같은 내장 comparer들이 있다.
        - `comparer.identity` : `===` 연산자를 통해 두 값이 동일한지 확인
        - `comparer.default` : 기본 값. `comparer.identity` 와 동일하지만, `NaN`끼리 서로 같은 것으로 취급
        - `comparer.structural` : `deep equality` 비교를 수행하여 확인
        - `comparer.shallow` : `shallow equality` 비교를 수행하여 확인
- **`name: string` :** `MobX developer tools` 등에서 debug name으로 사용
- **`requiresReaction: boolean`**
    - 계산 비용이 큰 경우 `true`로 설정하는 것이 좋다. reactive context 외부에서 이 값을 읽으려고 하면 캐시되지 않을 수 있다. 큰 비용의 계산을 다시 수행하는 대신 계산된 값을 반환한다.
- **`get: () => value)` :** `computed property`에 대한 getter를 override한다.
- **`set: (value) => void` :** `computed property`에 대한 setter를 override한다.
- **`keepAlive: boolean` :** `observer`가 없을 때 일시 중단하지 않고 `computed values`을 자동으로 유지하려면 `true`로 설정한다.

### `@computed`

`@computed` 데코레이터를 통해 아래와 같이 사용할 수 있다.

```jsx
import { observable, computed } from "mobx"

class OrderLine {
    @observable price = 0
    @observable amount = 1

    constructor(price) {
        this.price = price
    }

    @computed get total() {
        return this.price * this.amount
    }
}
```

`observable.object`와 `extendObservable`는 모두 getter를 만나면 자동으로 `computed property`로 추론하기 때문에 아래처럼만 작성해도 된다.

```jsx
const orderLine = observable.object({
    price: 0,
    amount: 1,
    get total() {
        return this.price * this.amount
    },
})
```

> 주의

위의 `OrderLine` 클래스 예제에서 get 키워드를 사용했는데, 일반적으로 getter에 직접 접근하면 안된다. 아래의 예제를 보자.

```jsx
const Ol = new OrderLine(2.00)

// don't do this.
// avoid accessing Ol.total directly
// it will recompute everytime.
setInterval(() => {
  console.log(Ol.total);
}, 60);
```

`computed value` 가 reaction에서 사용되지 않으면 메모이제이션되지 않고 매번 연산이 수행된다. 이로 인해 `requestAnimationFrame` 등의 반복적인 루프에서 접근하게 되면 성능저하가 발생할 수 있다.  `MobX`는 `computedRequiresReaction` 옵션을 사용하여 외부에서 직접 액세스할 때 오류를 보고하도록 설정할 수 있다.

```jsx
configure({
    computedRequiresReaction: true,
})
```

<img width="453" alt="mobx" src="https://user-images.githubusercontent.com/49153756/120198228-d8805180-c25c-11eb-9bb6-eb56aabdf590.png">

설정을 추가하니 위와 같은 경고 메세지가 출력되는 것을 볼 수 있다.

이 문제는 다음의 두 방법을 통해 직접 접근이 가능하도록 변경할 수 있다.

### reaction에서 memoization

`computed value` 은 항상 reaction에서 읽어야 한다. 위의 예제에서 `computedTotal`을 추가해 `getter`로 만들고 `observable` 값이 변경되는 경우에만 `autorun`이 실행되어 `total`에 값을 저장하고 직접 읽을 수 있도록 변경한다.

```jsx
class OrderLine {
  @observable price = 0;
  @observable amount = 1;

  constructor(price) {
    this.price = price;
		// When computed total changes
    // cache value to this.total
    autorun(() => {
      this.total = this.computedTotal;
    });
  }

  @computed({ keepAlive: true }) get computedTotal() {
    console.log('run');
    return this.price * this.amount;
  }
}
```

### Computed KeepAlive

`keepAlive`는 `computed`가 reaction에 의해 관찰되는 것처럼 동작하게 한다. 위의 `autorun` 예제와 동일하지만 더 효율적이다. (예를 들면, `computed`를 유지하지만 실제로 값을 읽을 때까지 연산을 연기할 수 있다)

```jsx
class OrderLine {
  @observable price = 0;
  @observable amount = 1;

  constructor(price) {
    this.price = price;
  }

  @computed({ keepAlive: true }) get total() {
    console.log('run');
    return this.price * this.amount;
  }
}
```

`computed`에 getter로 직접 접근하면 접근할 때마다 `computed property`가 호출되어 매번 run이 찍히는 반면, 위의 두 방식으로 사용하면 `observable` 값이 변경되는 경우에만 `computed property`가 호출되어 run이 찍히게 된다. 

### `computed(expression)`

`computed` 를 함수로 직접 호출할 수도 있다. 이런 방식은 주로 사용되지는 않지만 boxed computed value를 사용하는 경우 유용할 수 있다.

```jsx
import { observable, computed } from "mobx"
const name = observable.box("John")

const upperCaseName = computed(() => name.get().toUpperCase())

const disposer = upperCaseName.observe((change) => console.log(change.newValue))

name.set("Dave")
// prints: 'DAVE'
```

---

## [`Actions`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/action.md)

MobX를 사용하면 action을 통해 코드에서 작업 위치를 명시하여 코드를 더 구조적으로 만들어준다. 상태를 변경하거나 side effect가 있는 모든 함수에 사용하는 것이 좋다.

> 참고: strict mode 활성화된 경우 `action`을 꼭 사용해야 한다.

**사용법**

- `action(fn)`
- `action(name, fn)`
- `@action classMethod`
- `@action(name) classMethod`
- `@action boundClassMethod = (args) => { body }`
- `@action.bound boundClassMethod(args) { body }`
    - `action.bound`를 사용하면 자동으로 대상 객체에 this를 바인딩해준다.

    ```jsx
    class Ticker {
        @observable tick = 0

        @action.bound
        increment() {
            this.tick++ // 'this' will always be correct
        }
    }

    const ticker = new Ticker()
    setInterval(ticker.increment, 1000)
    ```

    - `action.bound` 를 하지 않고 실행하게 되면 `setInterval`에서 this는 전역 객체인 window를 가리키게 되는데, `action.bound` 를 사용하면 해당 객체에 binding해주므로 this는 `ticker`를 가리키게 된다.

`action`은 내부적으로 `transaction`이 자동으로 적용되어 성능적인 이점을 제공한다. `action`은 변화를 일괄적으로 처리하고 `action`이 완료된 이후에 computed value와 reaction에 알린다.

### `runInAction(name?, thunk)`

`runInAction`은 코드 블록을 (익명) `action`으로 실행하는 간단한 유틸리티다. 예를 들어 비동기 프로세스 내부에서 즉시 `action`을 만들고 실행하는 데 유용하다. `runInAction`은 `action`의 sugar이다.

## Reactions & Derivations

## [`Observer`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/observer-component.md)

React 컴포넌트를 감싸는 HOC로 사용할 수 있다. 컴포넌트의 render함수에 사용된 observable 상태가 변경되면 컴포넌트가 자동으로 리렌더링된다. 

- `observer`는  "`mobx-react`"에 의해 제공

**사용법**

- `observer(React.createClass({ ... }))`
- `observer((props, context) => ReactElement)`
- `observer(class MyComponent extends React.Component { ... })`
- `@observer class MyComponent extends React.Component { ... }`

### 특징

- `Observer`는 마지막 렌더링에 사용된 데이터 구조만 구독한다.
- `@observer`는 자식 컴포넌트의 불필요한 리렌더링이 없도록 자동으로 `memo` / `shouldComponentUpdate`를 구현한다.
- `props` 객체와 `observer` 컴포넌트의 `state object`는 자동으로 `observable`이 되어 해당 컴포넌트 내부의 `props`에서 파생되는 `@computed` 속성을 더 쉽게 만들 수 있다.

### 팁

때때로 `observer`를 렌더링의 일부에 적용하기 어려운 경우가 있다. 예를 들어, callback 내부에서 렌더링하고 있으며 새로운 컴포넌트로 추출하고 싶지 않은 경우 `<Observer />`는 유용하다. 사용된 `observable`이 변경 될 때마다 자동으로 다시 렌더링되는 callback render function을 사용한다.

```jsx
const Timer = ({ timerData }) => (
    <div>
        Seconds passed:
        <Observer>{() => <span>{timerData.secondsPassed} </span>}</Observer>
    </div>
)
```

## [`autorun`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/autorun.md)

**사용법**

- `autorun(() => { sideEffect }, options)`

`autorun`은 제공된 `sideEffect`를 실행하고 그동안 `observable state`에 액세스하는지 추적한다. 사용된 `observable` 중 하나가 나중에 변경 될 때마다 동일한 `sideEffect`가 다시 실행된다. `sideEffect`을 취소하는 `disposer` 함수를 반환합니다.

또한, `reaction`은 `autorun`에 대한 유일한 `argument`로 전달되어 내부에서 `autorun`을 조작할 수 있다. 그러므로 `autorun`을 종료하는 방법은 아래의 두가지가 있다.

```jsx
const disposer = autorun((reaction) => {
    /* do some stuff */
})
disposer()

// or

autorun((reaction) => {
    /* do some stuff */
    reaction.dispose()
})
```

### Options

- **`name?: string` :** 쉽게 식별하고 디버깅 할 수있는 이름
- **`delay?: number`** : delay 값 만큼 sideEffect 실행이 지연 또는 조절된다.
    - `default : 0`
- **`onError?: (error) => void`** : `autorun`이 예외를 `throw`하면 트리거되는 error handler
- **`scheduler?: (callback) => void`** : custom scheduler를 설정하여 autorun의 재실행 일정을 결정

## [`when`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/when.md)

**사용법**

- `when(predicate: () => boolean, effect?: () => void, options?)`

`when`은 `predicate`가 `true`를 반환 할 때까지 `predicate`를 관찰하고 실행 한다. `true`가 되면 `effect`가 실행되고 autorunner가 삭제된다. autorunner를 조기에 취소 가능한 `disposer`를 반환한다.

`when`은 reactive하게 무언가를 처분하거나 취소하는 데 정말 유용하다.

```jsx
class MyResource {
    constructor() {
        when(
            // once...
            () => !this.isVisible,
            // ... then
            () => this.dispose()
        )
    }

    @computed get isVisible() {
        // indicate whether this item is visible
    }

    dispose() {
        // dispose
    }
}
```

### when-promise

`effect` 함수가 제공되지 않았다면, `promise`를 반환한다. (`cancel()` 메서드가 있어 `promise`를 취소 가능)

```jsx
async function() {
	await when(() => that.isVisible)
	// etc..
}
```

### options

- **`name?: string`** : 쉽게 식별하고 디버깅 할 수있는 이름
- **`onError?: (error) => void` :**  `predicate-function` 또는 `effect-function`이 ****예외를 발생시키는 경우 트리거되는 error handler
- **`timeout: number` :** 특정 시간 내에 조건이 충족되지 않았음을 알리기 위해 onError handler가 트리거 되는 timeout (밀리 초)

## [`reaction`](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/reaction.md)

**사용법**

- `reaction(() => data, data => { sideEffect }, options)`

`reaction`은 `observables`을 추적하며 `autorun`보다 더 세밀한 제어가 가능하다. 두 함수를 인자로 받는데, 첫 번째 함수(`data function`)는 추적되며 두 번째 함수(`effect function`)의 첫 번째 인자로 사용될 데이터를 반환한다. `autorun` 과 달리 side effect는 생성 즉시 실행되지는 않지만 데이터 표현식이 처음으로 새 값을 반환한 뒤에 실행된다. side effect를 실행하는 동안 접근되는 `observable`은 추적되지 않는다.

- `reaction`은 `disposer function`을 반환

`reaction`에 전달된 두 번째 함수(`effect function`)는 호출될 때 두 개의 인자를 받는다. 첫 번째 인자는 `data function`에 의해 반환된 값이고, 두 번째 인자는 현재 `reaction`인데 실행 중에 `reaction`을 처리한는 데에 사용할 수 있다.

`side effect`는 data expression에서 접근한 데이터에만 반응하고, 실제로 effect에 사용되는 데이터보다 적을 수 있다.  `side effect`는 expression이 변경됨에 따라 데이터가 반환되었을 때 실행된다. 즉, `reaction`은 `side effect`에서 필요한 것들을 생성해야 한다.

### Options

- `fireImmediately` : `effect function`이 `data function`의 첫 실행 후 즉시 트리거되어야 함을 나타내는 `boolean`
    - `default : false`
- `delay` : `effect function`을 조절하는 데 사용할 수있는 밀리 초 단위의 숫자.
    - `default : 0`  → 이 경우는 throttling이 발생하지 않음
- `equals` : comparer function는 data function에 의해 생성 된 이전 값과 다음 값을 비교하는 데 사용
    - 이 함수가 `false`를 반환하는 경우 `effect function` 호출. 지정된 경우에는 `compareStructural`를 오버라이딩한다.
    - `default : comparer.default`
- `name` : `[spy](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/spy.md)` event와 같은 곳에서 reaction의 이름으로 사용되는 문자열
- `onError` : `reaction`에서의 error handler
- `scheduler` : custom scheduler를 설정하여 autorun function의 재실행 일정을 결정

다음 예제에서 `reaction1`, `reaction2`, `autorun1`은 todos array에서 todo의 추가, 제거 또는 교체에 반응한다. 하지만 `reaction2`과 `autorun1`만 `title` 수정에 반응하고, `reaction1`은 반응하지 않는다. `reaction1` 의 data expression에는 `title`이 사용되지 않고 `length`만 사용되기 때문이다. 

```tsx
const todos = observable([
    {
        title: "Make coffee",
        done: true,
    },
    {
        title: "Find biscuit",
        done: false,
    },
])

// wrong use of reaction: reacts to length changes, but not to title changes!
const reaction1 = reaction(
    () => todos.length,
    (length) => console.log("reaction 1:", todos.map((todo) => todo.title).join(", "))
)

// correct use of reaction: reacts to length and title changes
const reaction2 = reaction(
    () => todos.map((todo) => todo.title),
    (titles) => console.log("reaction 2:", titles.join(", "))
)

// autorun reacts to just everything that is used in its function
const autorun1 = autorun(() =>
    console.log("autorun 1:", todos.map((todo) => todo.title).join(", "))
)

todos.push({ title: "explain reactions", done: false })
// prints:
// reaction 1: Make coffee, find biscuit, explain reactions
// reaction 2: Make coffee, find biscuit, explain reactions
// autorun 1: Make coffee, find biscuit, explain reactions

todos[0].title = "Make tea"
// prints:
// reaction 2: Make tea, find biscuit, explain reactions
// autorun 1: Make tea, find biscuit, explain reactions
```

# Utilities

## Provider ([mobx-react](https://github.com/mobxjs/mobx-react#provider-experimental))

Provider는 React의 컨텍스트 메커니즘을 사용하여 store를 하위 컴포넌트로 전달할 수 있는 컴포넌트이다.

## inject (mobx-react)

inject는 특정 store를 가져오는 데에 사용할 수 있다. 문자열 목록을 받아 wrapping된 컴포넌트에서 사용할 수 있게 해주는 HOC이다.

**사용법**

- `inject("store1", "store2")(observer(MyComponent))`
- `@inject("store1", "store2") @observer MyComponent`
- `@inject((stores, props, context) => props) @observer MyComponent`
- `@observer(["store1", "store2"]) MyComponent`
    - `@inject() @observer` 축약 표현

## toJS

**사용법**

- `toJS(observableDataStructure, options?)`


---

- 참고
    - [https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/api.md](https://github.com/mobxjs/mobx/blob/4.15.7/docs/refguide/api.md)
    - [https://woowabros.github.io/experience/2019/01/02/kimcj-react-mobx.html](https://woowabros.github.io/experience/2019/01/02/kimcj-react-mobx.html)