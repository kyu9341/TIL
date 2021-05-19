# [mocha](https://mochajs.org/)

`Mocha`는 `Node.js` 및 브라우저에서 실행되는 `JavaScript` 테스트 프레임워크로 비동기 테스트를 간단하게 해준다. `Mocha` test는 직렬적으로 실행되어 유연하고 정확한 보고를 가능하게 하며, 예상치 못한 예외를 올바른 테스트 케이스에 매핑해준다.

### ASSERTIONS

`Mocha`에서는 원하는 assertion 라이브러리를 사용 가능하다. 노드에 내장된 `assert` 모듈을 사용해도 되고, 아래의 assertion 라이브러리들을 사용해도 무방하다.

- `should.js`
- `chai`
- `expect.js`
- `better-assert`

## 비동기 코드

테스트의 `callback`에 `done` 이라는 인자를 추가하면, `Mocha` 는 테스트가 완료되기 위해 이 함수가 호출될 때까지 기다려야 된다는 것을 알게된다. 이 callback은 `Error` 인스턴스나 `falsy` 값들을 모두 허용한다. 그 외에 다른 것은 잘못된 사용이며 오류를 발생시킨다.

```jsx
describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      const user = new User('Luna');
      user.save(function (err) {
        if (err) done(err);
        else done();
      });
    });
  });
});
```

대신, `done()` 을 `callback`으로 직접 사용할 수도 있다.

```jsx
describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      const user = new User('Luna');
      user.save(done);
    });
  });
});
```

### `async/await` 사용

`async/await`을 사용하면 아래와 같이 사용가능하다.

```jsx
beforeEach(async function () {
  await db.clear();
  await db.save([tobi, loki, jane]);
});

describe('#find()', function () {
  it('responds with matching records', async function () {
    const users = await db.find({ type: 'User' });
    users.should.have.length(3);
  });
});
```

## `arrow function`

`arrow function`은 렉시컬 `this`를 바인딩하기 때문에 `Mocha`의 `context`에 접근할 수 없다.

```jsx
describe('my suite', () => {
  it('my test', () => {
    // should set the timeout of this test to 1000 ms; instead will fail
    this.timeout(1000);
    assert.ok(true);
  });
});
```

`Mocha`의 `context`가 필요없는 경우라면 상관없지만, 나중에 필요하게 되면 다시 리팩토링하는 것이 더 귀찮을 수 있으니 주의하자.

## HOOKS

테스트 케이스마다 반복해서 먼저 실행되야 하는 사전 조건이나 테스트 이후 초기화가 필요한 경우 사용할 수 있는 `before()`, `after()`, `beforeEach()`, `afterEach()` 등의 hooks가 제공된다.

```jsx
describe('hooks', function () {
  before(function () {
    // runs once before the first test in this block
  });

  after(function () {
    // runs once after the last test in this block
  });

  beforeEach(function () {
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
  });

  // test cases
});
```

hooks는 정의된 순서대로 실행되는데, 순서는 다음과 같다.

- 모든 `before()` (한 번) → 모든 `beforeEach()` → tests → 모든 `afterEach()` → `after()` (한 번)

### describing hooks

hooks에 description을 붙여서 테스트에서 에러를 쉽게 찾을 수 있다.

```jsx
beforeEach(function () {
  // beforeEach hook
});

beforeEach(function namedFun() {
  // beforeEach:namedFun
});

beforeEach('some description', function () {
  // beforeEach:some description
});
```

### 비동기 hooks

모든 hooks에서도 일반적인 test case와 마찬가지로 비동기 처리가 가능하다.

### root-level hooks

test file의 최상위 스코프에 정의된 hook은 root hook이다.

### delayed root suite

suite를 실행하기 전에 비동기 작업을 수행해야하는 경우 root suite를 delay할 수 있다. `mocha` 명령과 함께 `--delay` 플래그를 추가하면, `run()`이라는 callback 함수가 global context에 연결된다.

```jsx
setTimeout(function () {
  // do some setup

  describe('my suite', function () {
    // ...
  });

  run();
}, 5000);
```

> 참고
>
> <https://mochajs.org/>
>
> <https://sjh836.tistory.com/174>
