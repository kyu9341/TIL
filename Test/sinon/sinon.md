# sinon

`spy`, `stub`, `mocks` 등을 지원해주는 자바스크립트 test double library

- **`spy`**
  - 함수 호출에 대한 정보를 얻는 데 사용. 함수가 몇 번 호출되었는지, 어떤 인자를 가지고 호출되었는지, 어떤 값을 반환하는지, 어떤 에러를 던지는지 확인할 수 있다.
  - 테스트의 목적이 어떤 일이 발생했는지(어떤함수가 호출되었는지)를 확인할 때 사용하기에 적합. `Sinon`의 `assertion`과 결합하여 여러 가지 결과를 확인할 수 있다.
- **`stub`**
  - 타겟 함수를 대체한다는 점을 제외하면 `spy`와 동일하다. 값을 반환하거나 예외를 발생시키는 등의 행위를 포함할 수 있다.
  - 입력한 매개변수에 따라 다른 `callback`을 호출하는 것도 가능
  - 코드를 사용하여 문제가 있는 코드 조각을 대체할 수 있음
  - 오류 처리와 같이 트리거하지 않는 코드 경로를 트리거하는 데 사용 가능
  - 비동기 코드를 쉽게 테스트 가능
- **`mock`**
  - `spy`와 `stub`이 할 수 있는 모든 것을 할 수 있다. 때문에 무작정 `mock`을 사용하기 쉬운데, `mock`은 테스트 코드를 지나치게 구체적으로 만들기 때문에 코드가 변경될 때 의도치 않게 깨지는 코드를 만들기 쉽다.
  - `mock`은 `stub`이 필요할 때 사용하지만 `stub`보다 더 구체적인 검증이 필요할 때 사용

## [Spies](https://sinonjs.org/releases/v10.0.1/spies/)

`test spy`는 `arguments`, 리턴 값, `this`, `throw`된 예외 등을 기록하는 함수이다. `spy`에는 두 타입이 있는데, 하나는 익명 함수이고 하나는 테스트 중인 시스템에 이미 존재하는 메서드를 wrapping한다.

- **`const spy = sinon.spy();` :** `arguments`, 리턴 값, `this`, `throw`된 예외 등을 기록하는 익명 함수를 생성
- **`const spy = sinon.spy(myFunc);`** : `myFunc`를 `spy`로 wrapping
  - 함수가 어떻게 사용되는지 확인해야 할 때 원래 함수가 전달되는 곳에 `spy`를 전달할 수 있다.
- **`const spy = sinon.spy(object, "method");` :**  `object.method`를 위한 `spy`를 만들고 원래의 함수를을 스파이로 대체한다.
  - 기존 함수의 `property`가 아닌 경우 예외가 발생하고, spy는 모든 경우에 원래 함수와 똑같이 동작한다.
  - `object.method.restore()`를 호출하여 원래 메서드를 복원할 수 있다.
  - 반환 된 `spy`는 원래 메서드를 대체 한 함수 객체이다.
    - `spy === object.method`
- **`const spy = sinon.spy(object, "property", types);` :** 속성 `object.property`에 대한 `spy`를 생성한다.

## [Stubs](https://sinonjs.org/releases/v10.0.1/stubs/)

`test stubs`은 사전에 프로그래밍 된 동작이있는 함수(spy)이다. stub의 동작을 변경하는 데에 사용할 수있는 메서드 외에도 전체 [test spy API](https://sinonjs.org/releases/v10.0.1/spies) 를 지원한다. spy로서 stub은 익명으로 사용되거나 기존 함수를 wrapping할 수 있습니다. stub으로 기존 함수를 wrapping할 때 원래 함수는 호출되지 않는다.

- 시간이 오래 걸리는 작업 또는 외부에서 데이터를 가져와야 하는 경우 등의 환경에서 미리 응답값을 정의해서 해당 메소드가 동작을 한 것처럼 조작이 가능하다.

## [Mocks](https://sinonjs.org/releases/v10.0.1/mocks/)

Mocks는 사전에 프로그래밍된 동작(stub)과 pre-programmed expectations를 가진 가짜 함수(like spy)이다? → `spy`와 `stub`의 기능이 섞여 있다는 듯

- **`const mock = sinon.mock(obj);` :** 제공된 객체에 대한 `mock object`를 생성
  - 객체를 변경하지 않지만 `mock object`를 반환하여 객체의 메서드에 대한 `expectations`을 설정한다.
- **`const expectation = mock.expects("method");` :** `obj.method` 를 mock `function`으로 `override`하여 반환한다.
- **`mock.restore()`** : `mock method`를 모두 복원
- **`mock.verify()` :** `mock`에 대한 모든 `expectations`을 확인하고 `expectations`이 만족되지 않으면 예외를 던진다. 또한 `mocked mothod`를 복원한다.
- **`mock.usingPromise(promiseLibrary);`**

### [Sandboxes](https://sinonjs.org/releases/v10.0.1/sandbox/)

- 추가 예정..

> 참고
>
> [https://tiffany.devpools.kr/2018/03/19/sinon/](https://tiffany.devpools.kr/2018/03/19/sinon/)
