# jest

## 설치
```jsx
npm i -D jest
```

### 스크립트 설정
```jsx
"scripts": {
    "test": "jest"
  },
```
위와 같이 추가하면 `npm test` 를 입력하면 jest 를 실행

### Describe
테스트들을 `describe` 를 사용하여 묶어줄 수 있다.
```jsx
describe('create issue', () => {
  test('successfully', async () => {
    // given
    const data = {
      title: '첫 번째 이슈',
      content: '내용입니다.',
      is_open: true,
      user_id: 1,
    };

    // when
    const issueId = await issueService.createIssue(data);

    // then
    expect(issueId).toBe(5);
  });
  test('with invalid data', async () => {
    //given
    const data = {
      title: '',
      content: '두번째 이슈입니다.',
      is_open: true,
      user_id: 1,
    };

    //when
    const issueId = await issueService.createIssue(data);

    // then
    expect(issueId).toBeFalsy(); // 잘못된 요청에서 넘겨줄 데이터 값 (undefined or 0 예상)
  });
});
```

### Matcher 함수들
- `not` 을 앞에 사용하면 해당 조건을 만족하지 않는지 체크한다.
```jsx
test("not", () => {
  expect(1).not.toBe(2)
})
```

**`.toBe()` :** 숫자나 문자와 같은 객체가 아닌 기본형 값을 비교할 때 사용

**`.toEqual()` :** 객체 단위를 비교할 때 사용

**`.toBeTruthy()`** **`.toBeFalsy()` :** true(1)인지 false(0)인지 비교

```jsx
expect(0).toBeFalsy();
```

`**.toBeNull()**` : `null` 인지 확인

`**.toBeUndefined()**` : `undefined` 인지 확인

`**.toBeDefined()` : `.toBeUndefined()`**  의 반대

**`.toHaveLength()` :** 배열의 길이를 확인할 때 사용

**`.toContain()` :** 배열이 특정원소를 담고 있는지 검사할 때 사용
```jsx
const numbers = ['a', 'b', 'c', 'd'];
expect(numbers).toHaveLength(4);
expect(numbers).toContain('b');
```

**`.toMatch()` :** 일반 문자열이 아닌 정규식 기반의 테스트를 할 때 사용
```jsx
expect(getEmail('gggg@naver.com'))
       .toMatch(/.*naver.com$/);
```

`**.toThrow()` :**예외 발생 여부를 테스트할 때 사용
- 문자열을 넘기면 예외 메세지를 비교, 정규식을 넘기면 정규식 체크를 한다.
- `.toThrow()` 를 사용할 때는 검증 대상을 함수로 한 번 감싸줘야 한다. 그렇지 않으면 예외 발생 여부를 체크하기 전에, 테스트 실행 도중 그 예외가 발생하여 테스트가 실패하게 된다.
```jsx
test("throw when id is non negative", () => {
  expect(() => getUser(-1).toThrow())
  expect(() => getUser(-1).toThrow("Invalid ID"))
})
```

> 참조
> [https://www.daleseo.com/jest-basic/](https://www.daleseo.com/jest-basic/)
> [https://velog.io/@ppohee/Jest-로-테스트-코드-작성하기](https://velog.io/@ppohee/Jest-%EB%A1%9C-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)