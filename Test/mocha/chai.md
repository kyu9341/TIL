# [chai](https://www.chaijs.com/)

`Chai`는 `Node.js` 기반의 Assertion 라이브러리로 BDD와 TDD 스타일을 지원하고 있으며 `Should`, `Expect`, `Assert` 와 같은 인터페이스를 제공한다.

## expect style

다음 리스트는 가독성 향상을 위한 assertion의 chainable getter로 제공한다.

- `to`, `be`, `been`, `is`, `that`, `which`, `and`, `has`, `have`, `with`, `at`, `of`, `same`, `but`, `does`, `still`, `also`
- `.not` : chain에서 뒤따르는 assertion을 모두 부정한다.
- `.deep` : `strict equality`(`===`) 비교 대신에 `deep equality` 비교를 수행하도록 한다.

  ```jsx
  // Target object deeply (but not strictly) equals `{a: 1}`
  expect({ a: 1 }).to.deep.equal({ a: 1 });
  expect({ a: 1 }).to.not.equal({ a: 1 });

  // Target array deeply (but not strictly) includes `{a: 1}`
  expect([{ a: 1 }]).to.deep.include({ a: 1 });
  expect([{ a: 1 }]).to.not.include({ a: 1 });

  // Target object deeply (but not strictly) includes `x: {a: 1}`
  expect({ x: { a: 1 } }).to.deep.include({ x: { a: 1 } });
  expect({ x: { a: 1 } }).to.not.include({ x: { a: 1 } });

  // Target array deeply (but not strictly) has member `{a: 1}`
  expect([{ a: 1 }]).to.have.deep.members([{ a: 1 }]);
  expect([{ a: 1 }]).to.not.have.members([{ a: 1 }]);

  // Target set deeply (but not strictly) has key `{a: 1}`
  expect(new Set([{ a: 1 }])).to.have.deep.keys([{ a: 1 }]);
  expect(new Set([{ a: 1 }])).to.not.have.keys([{ a: 1 }]);

  // Target object deeply (but not strictly) has property `x: {a: 1}`
  expect({ x: { a: 1 } }).to.have.deep.property('x', { a: 1 });
  expect({ x: { a: 1 } }).to.not.have.property('x', { a: 1 });
  ```

- `.own` :`.property` 와`.include` assertion에서 상속된 속성을 무시하도록 설정
- `.ordered` : 뒤의 assertion이 동일한 순서를 따르는지 확인
- `.any` : `keys` assertion에서 하나 이상의 키만 필요하도록 설정
- `.all` : `keys` assertion에서 모든 키가 필요하도록 설정
- `.a(type[, msg])` : 대상의 타입이 인자로 들어온 string과 일치하는지 확인 (`.an`으로도 사용 가능)

  ```jsx
  expect('foo').to.be.a('string');
  expect({ a: 1 }).to.be.an('object');
  expect(null).to.be.a('null');
  expect(undefined).to.be.an('undefined');
  expect(new Error()).to.be.an('error');
  expect(Promise.resolve()).to.be.a('promise');
  expect(new Float32Array()).to.be.a('float32array');
  expect(Symbol()).to.be.a('symbol');
  ```

  - `.a` 는 가독성을 위한 chain으로도 사용이 가능

- `.include(val[, msg])` : 대상에 포함되는 값인지 확인

  - `val : string` → 대상의 하위 문자열인지 확인

    ```jsx
    expect('foobar').to.include('foo');
    ```

  - `val : Object` → 대상 객체의 속성의 subset인지 확인

    ```jsx
    expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1, b: 2 });
    ```

  - `val : Map` → Map의 values 중에 포함되는지 확인

    ```jsx
    expect(
      new Map([
        ['a', 1],
        ['b', 2],
      ])
    ).to.include(2);
    ```

  - 이렇게 타입에 따라 비교 대상 및 알고리즘이 변경되기 때문에 `.a` 를 통해 type을 먼저 확인하는 것이 좋다.

    ```jsx
    expect([1, 2, 3]).to.be.an('array').that.includes(2);
    ```

- `.equal(val[, msg])` : 대상과 strict equality (`===`) 비교를 수행
- `.eql(obj[, msg])` : 대상 객체와 deep equality 비교를 수행
- `.true`, `.false` : strict equality (`===`) 비교로 `true` or `false`인지 확인

---

> 참고
>
> <https://www.chaijs.com/>
>
> <https://sjh836.tistory.com/174>
