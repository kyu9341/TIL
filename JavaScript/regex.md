# 정규표현식

정규 표현식은 문자열에 나타는 특정 문자 조합과 대응시키기 위해 사용되는 패턴이다. 주로 이메일이나 패스워드 등 특정 패턴을 검증할 때 주로 사용한다.

- [테스트 사이트](https://regexr.com/) - 정규식을 입력하면 그에 해당하는 문자들을 표시해준다.

### 정규식 생성

- **정규식 리터럴**

```tsx
const regx = /a+/;
```

정규식 리터럴은 스크립트가 불러와질 때 컴파일되므로 정규식을 상수로 사용한다면 리터럴로 사용하는 것이 성능에 이점이 있을 수 있다.

- **생성자 함수**

```tsx
const regx = new RegExp('a+');
```

생성자 함수를 사용하면 정규식의 실행 시점에 컴파일된다. 상황에 따라 정규식 패턴이 변경될 수 있는 경우는 생성자 함수를 사용해야 한다.

### 정규표현식 관련 메소드

- [`regxObj.exec(str)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) : `str`에서 탐색한 하나의 결과를 배열(or `null`)로 반환
- [`regexObj.test(str)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) : `str` 에서 정규표현식이 일치하는 부분이 있다면 `true` 아니면 `false`
- [`str.match(regexp)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/match) : 일치하는 문자열의 배열을 반환
  - 정규식에 `g` 플래그가 설정되어있지 않다면, `RegExp.exe()` 와 같은 결과를 반환
  - `g` 플래그가 포함되어 있다면, 일치하는 하위 문자열을 포함하는 배열을 반환
- [`str.search(regexp)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/search) : 첫 번째로 일치하는 문자열의 인덱스를 반호나
- [`const newStr = str.replace(regexp|substr, newSubstr|function)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
  - 일치하는 문자열을 대체하고 새로운 문자열을 반환
- [`str.split([separator[, limit]])`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/split) : 일치하는 문자열을 분할하여 배열로 반환
  - `limit` : 끊어진 문자열의 최대 개수

### 플래그

- `g` (`global`) : 모든 문자와 여러 줄 일치
- `m` (`multi line`) : 여러 줄 일치
- `u` (`unicode`) : 유니코드 문자 처리
- `y` (`sticky`) : `lastIndex` 속성으로 지정된 인덱스에서만 1회 일치

## 정규식 패턴

### `Group and ranges`

- `a|b` : a 또는 b 와 일치 (인덱스가 작은 것을 우선 반환)
- `()` : 캡쳐할 그룹
- `[abc]` : a 또는 b 또는 c와 일치
  - `[a-z]` : `a ~ z`사이의 문자 구간에 일치(영어 소문자)
  - `[A-Z]` : `A ~ Z`의 문자 구간에 일치(영어 대문자)
  - `[0-9]` : `0 ~ 9`의 숫자 구간
  - `[a-zA-Z0-9]` : `a ~ z` , `A ~ Z` , `0 ~ 9` 에 일치
- `[^abc]` : a 또는 b 또는 c가 아닌 나머지 문자에 일치(부정)
  - `[^a-zA-Z0-9]` : `a ~ z` , `A ~ Z` , `0 ~ 9` 를 제외한 문자에 일치
- `(?:)` : 캡쳐하지 않는 그룹

### `Quantifiers`

- `?` : 없거나 1회 있거나
- `*` : 0회 이상 연속으로 반복되는 문자와 가능한 많이 일치, `{0,}`와 동일
- `+` : 1회 이상 연속으로 반복되는 문자에 가능한 많이 일치, `{1,}`와 동일
- `{n}` : `n(숫자)`개 연속 일치
- `{min,}` : 최소 `min(숫자)`개 이상 연속 일치
- `{min,max}` : `min(숫자)`개 이상 `max(숫자)`개 이하 연속 일

### `Boundary-type`

- `\b` : 단어의 경계에서 일치
  - 63개 문자(`영문 대소문자 52개` + `숫자 10개` + `_`(`underscore`))가 아닌 나머지 문자에 일치하는 경계(`boundary`)
- `\B` : 단어의 경계가 아님 (`\b` 와 반대)
  - 63개 문자에 일치하는 경계
- `^` : 문장(Line)의 시작 → `/^abc/`
- `$` : 문장(Line)의 끝 → `/xyz$/`
  - `^` , `$` 은 `m` 플래그와 함께 사용해야 각 문장에 대해 찾을 수 있음
  - `m` 과 사용하지 않으면 전체 문자열에 대해 맨 앞 또는 맨 뒤만 확인하게 됨

### `Character classes`

- `\` : 이스케이프 문자
  - 실제로 `.` , `?` 등의 문자를 찾고 싶은 경우 → `\.` , `\?` 와 같이 사용
- `.` : 임의의 한 문자와 일치
- `\d` : 숫자에 일치 (`digit`)
- `\D` : 숫자가 아닌 문자에 일치
- `\w` : 문자에 일치
  - 63개 문자(`Word`, `영문 대소문자 52개` + `숫자 10개` + `_`)
- `\W` : 63개 문자가 아닌 나머지 문자에 일치
- `\s` : 공백(`Space`, `Tab` 등)에 일치
- `\S` : 공백이 아닌 문자에 일치

### 추가

- `/target(?=pattern)/` : 앞쪽 일치(`Lookahead`) → `/ab(?=c)/`
- ex) → `/[a-z]+(?=:\/\/)/g` : 영문 소문자 1자리 이상 연속되는 문자열 중 `://` 앞에 있는 문자열을 모두 찾는다는 뜻이다. 아래 이미지를 보면 URL의 프로토콜 부분만을 찾아낸 것을 볼 수 있다.

  ![before](https://user-images.githubusercontent.com/49153756/113473106-7f857e80-94a2-11eb-940b-b71b5b69600f.png)

- `/target(?!pattern)/` : 부정 앞쪽 일치(`Negative Lookahead`) → `/ab(?!c)/`

  - 뒤의 패턴에 일치하지 않는 문자열을 찾는다.

- `/(?<=pattern)target/` (`ES2018`) : 뒤쪽 일치(`Lookbehind`) → `/(?<=ab)c/`

  - ex) → `/(?<=:\/\/)[^=;/#?:%\s\{\}\[\]^~]+/g` : `://` 로 시작하고, `[]` 에 포함된 특수 문자들을 제외한 1자리 이상 연속되는 문자열을 추출한다.

    ![after](https://user-images.githubusercontent.com/49153756/113473105-7dbbbb00-94a2-11eb-8e9c-8d03df713f3b.png)

- `/(?<!pattern)traget/` (`ES2018`) : 부정 뒤쪽 일치(`Negative Lookbehind`)
  - → `/(?<!ab)c/`
  - 앞의 패턴에 일치하지 않는 문자열을 찾는다.

---

> 참고
>
> [https://heropy.blog/2018/10/28/regexp/](https://heropy.blog/2018/10/28/regexp/)
>
> [https://www.youtube.com/watch?v=t3M6toIflyQ](https://www.youtube.com/watch?v=t3M6toIflyQ)
>
> [https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions)
