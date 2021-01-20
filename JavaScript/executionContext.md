# 실행 컨텍스트

- 실행 가능한 코드가 실행되기 위해 필요한 환경

실행에 필요한 정보를 형상화하고 구분하기 위해 자바스크립트 엔진은 실행 컨텍스트를 물리적 객체의 형태로 관리한다. 함수가 호출되면 실행 컨텍스트가 생성되고, 실행 컨텍스트 스택에 쌓인다. 스택 가장 위에 위치하는 실행 컨텍스트가 현재 실행되고 있는 컨텍스트다.

### Execution Context의 종류

실행 컨텍스트는 두 가지 종류가 있는데, 전역 컨텍스트와 함수 컨텍스트로 나누어진다.

- `Global Execution Context(전역 실행 컨텍스트)`

  - 함수 안에서 실행되는 코드가 아니라면 모든 스크립트는 전역 실행 컨텍스트에서 실행된다.
  - 처음 코드를 실행하는 순간 모든 것을 포함하는 전역 실행 컨텍스트가 생성된다.
  - 전역 실행 컨텍스트는 애플리케이션이 종료될 때`(웹 페이지에서 나가거나 브라우저를 닫을 때)`까지 유지된다.
  - **동작 과정**
    1. `global object`를 생성(초기 상태의 전역 객체에는 빌트인 객체(Math, String, Array 등)와 BOM, DOM이 설정되어 있다.)
    2. 스코프 체인의 생성과 초기화
    3. `Variable Instantiation`(변수 객체화) 실행 (`Variable Object`에 프로퍼티와 값을 추가하는 것을 의미) → 아래의 순서로 `Variable Object`에 프로퍼티와 값을 set한다
       1. 대상 코드 내의 **함수** 선언(함수 표현식 제외)을 대상으로 함수명이 `Variable Object`의 프로퍼티로, 생성된 함수 객체가 값으로 설정된다.(**함수 호이스팅**)
       2. 대상 코드 내의 **변수** 선언을 대상으로 변수명이 `Variable Object`의 프로퍼티로, `undefined`가 값으로 설정된다.(**변수 호이스팅**)
    4. `this` 결정 → 전역 컨텍스트의 경우 `Variable Object`, 스코프 체인, `this` 값은 언제나 전역 객체이다.

- `Function Execution Context(함수 실행 컨텍스트)`
  - 함수를 호출하면 해당 함수의 실행 컨텍스트가 생성되며 직전에 실행된 코드 블록의 실행 컨텍스트 위에 쌓인다.
  - 함수 실행이 끝나면 해당 함수의 실행 컨텍스트를 파기하고 직전의 실행 컨텍스트에 컨트롤을 반환한다.
  - **동작 과정**
    1. 스코프 체인의 생성과 초기화
    2. `Variable Instantiation`(변수 객체화) 실행 (`Variable Object`에 프로퍼티와 값을 추가하는 것을 의미) → 아래의 순서로 `Variable Object`에 프로퍼티와 값을 set한다
       1. 매개변수(`parameter`)가 `Variable Object`의 프로퍼티로, 인수(`argument`)가 값으로 설정된다.
       2. 대상 코드 내의 **함수** 선언(함수 표현식 제외)을 대상으로 함수명이 `Variable Object`의 프로퍼티로, 생성된 함수 객체가 값으로 설정된다.(**함수 호이스팅**)
       3. 대상 코드 내의 **변수** 선언을 대상으로 변수명이 `Variable Object`의 프로퍼티로, `undefined`가 값으로 설정된다.(**변수 호이스팅**)
    3. `this` 결정 → `this value`가 결정되기 이전에 this는 전역 객체를 가리키고 있다가 함수 호출 패턴에 의해 this에 할당되는 값이 결정된다.

### 실행 컨텍스트의 3가지 객체

- **`Variable Object` (`VO` / 변수 객체)**
  - `Variable Object`는 코드가 실행될 때 엔진에 의해 참조되며 코드에서는 접근할 수 없다.
  - `Variable Object` 아래의 정보를 담는 객체이다.
    - 변수
    - 매개변수(`parameter`)와 인수 정보(`arguments`)
    - 함수 선언(함수 표현식은 제외)
  - `전역 컨텍스트` → `Variable Object` 는 유일하며 최상위에 위치하고 모든 전역 변수, 전역 함수 등을 포함하는 **`전역 객체`**(`Global Object` / `GO`)를 가리킨다. 전역 객체는 전역에 선언된 전역 변수와 전역 함수를 프로퍼티로 소유한다.
  - `함수 컨텍스트` → `Variable Object` 는 **`활성 객체`**(`AO` / `Activation Object`)를 가리키며 매개변수와 인수들의 정보를 배열의 형태로 담고 있는 객체인 `arguments object`가 추가된다.
- **`Scope Chain`**
  - 스코프 체인은 일종의 리스트로 전역 객체와 중첩된 함수의 스코프의 레퍼런스를 차례로 저장한다.
  - 스코프 체인은 해당 전역 또는 함수가 참조할 수 있는 변수, 함수 선언 드의 정보를 담고 있는 `전역 객체` 또는 `활성 객체`의 리스트를 가리킨다.
  - 현재 실행 컨텍스트의 `활성 객체`를 시작으로 순차적으로 상위 컨텍스트의 `활성 객체`를 가리키며 마지막 리스트는 `전역 객체`를 가리킨다.
  - 스코프 체인은 식별자 중에서 객체(전역 객체 제외)의 프로퍼티가 아닌 식별자, 즉 변수를 검색하는 메커니즘이다.
- **`this`**
  - `this` 프로퍼티에는 `this` 값이 할당된다. `this`에 할당되는 값은 함수 호출 패턴에 의해 결정된다.

### 예시

```jsx
var name = 'zero';
function wow(word) {
  console.log(word + ' ' + name);
}
function say() {
  var name = 'nero';
  console.log(name);
  wow('hello');
}
say();
```

```jsx
'전역 컨텍스트': {
  변수객체: {
    arguments: null,
    variable: ['name', 'wow', 'say'],
  },
  scopeChain: ['전역 변수객체'],
  this: window,
}
```

```jsx
'say 컨텍스트': {
  변수객체: {
    arguments: null,
    variable: ['name'], // 초기화 후 [{ name: 'nero' }]가 됨
  },
  scopeChain: ['say 변수객체', '전역 변수객체'],
  this: window,
}
```

```jsx
'wow 컨텍스트': {
  변수객체: {
    arguments: [{ word : 'hello' }],
    variable: null,
  },
  scopeChain: ['wow 변수객체', '전역 변수객체'],
  this: window,
}
```

> 참조
>
> [https://poiemaweb.com/js-execution-context](https://poiemaweb.com/js-execution-context)
>
> [https://www.zerocho.com/category/JavaScript/post/5741d96d094da4986bc950a0](https://www.zerocho.com/category/JavaScript/post/5741d96d094da4986bc950a0)
>
> [https://mingcoder.me/2020/02/28/Programming/JavaScript/execute-context/](https://mingcoder.me/2020/02/28/Programming/JavaScript/execute-context/)
>
> [https://lazymankook.tistory.com/93](https://lazymankook.tistory.com/93)
>
> [https://velog.io/@stampid/Execution-Context실행-컨텍스트란](https://velog.io/@stampid/Execution-Context%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8%EB%9E%80)
>
> [https://jinminkim-50502.medium.com/execution-context-실행-컨텍스트-4d6d082c83ff](https://jinminkim-50502.medium.com/execution-context-%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8-4d6d082c83ff)
