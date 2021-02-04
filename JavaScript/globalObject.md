# Global Object(전역 객체)

전역 객체(Global Object)는 모든 객체의 유일한 최상위 객체를 의미하며 일반적으로 `브라우저`에서는 `window`, `Node.js`에서는 `global` 객체를 의미한다.

### Window

**BOM (Browser Object Model)**

![bom](https://user-images.githubusercontent.com/49153756/105978075-790b0d00-60d5-11eb-8281-69418f75e473.png)

**브라우저의 창이나 프레임을 프로그래밍적으로 제어할 수 있게 해주는 객체모델** 이다. 이를 통해서 브라우저의 새 창을 열거나 다른 문서로 이동하는 등의 기능을 실행시킬 수 있다. 전역객체로 `window` 가 있으며 하위 객체들로 `location` , `navigator` , `document` , `screen` , `history` 가 포함되어 있다.

- **`location`** : `location` 객체는 창에 표시되는 URL을 관리한다.

  ![url](https://user-images.githubusercontent.com/49153756/105978059-76101c80-60d5-11eb-97bc-005de957c638.png)

  - `assign(url)` : 브라우저 창에 지정된 URL 주소에 존재하는 문서를 불러온다. 웹 브라우저 이력에 남고, 뒤로가기가 가능하다.
  - `reload()` : 새로고침
  - `replace(url)` : `assign` 과 비슷하지만 새로운 문서를 브라우저의 히스토리에서 제거한다. 따라서 뒤로가기가 불가능하다.
  - `toString()` : `location.href` 값을 문자열로 반환

- **`history`** : `history` 객체는 웹 페이지 열람 이력을 관리한다.
  - `length` : 현재 세션의 이력 개수
  - `state` : `pushState` , `replaceState` 메서드로 설정한 state 값
  - `back()` : 뒤로가기
  - `forward()` : 앞으로 가기
  - `go(n)` : n만큼 앞으로 가기 (음수면 뒤로)
  - `pushState(state, title, url)` : 열람 이력 추가
  - `replaceState(state, title, url)` : 열람 이력 수정
  - `popstate` : Window 인터페이스의 popstate 이벤트는 사용자의 세션 기록 탐색으로 인해 현재 활성화된 기록 항목이 바뀔 때 발생한다.
  - 만약 활성화된 엔트리가 `history.pushState()` 메서드나 `history.replaceState()` 메서드에 의해 생성되면, `popstate` 이벤트의 `state` 속성은 히스토리 엔트리 `state` 객체의 복사본을 갖게 됩니다.`history.pushState()` 또는 `history.replaceState()`는 `popstate` 이벤트를 발생시키지 않는 것에 유의합니다. `popstate` 이벤트는 브라우저의 백 버튼이나 (`history.back()` 호출) 등을 통해서만 발생된다.
- **`navigator`** : 브라우저 등의 앱 정보를 관리한다.
  - `appCodeName` : 웹 브라우저 코드 네임
  - `appName` : 웹 브라우저 이름
  - `appVersion` : 브라우저 버전
  - `onLine` : 브라우저 네트워크 연결 여부
  - `language` : 브라우저 UI 언어
  - `userAgent` : `USER-AGENT` 헤더에 보내는 문자열
- **`screen`** : Screen은 화면 정보를 가져오는 객체이다.
  - `screen.width` : 화면의 가로 크기
  - `screen.height` : 화면의 세로 크기
  - `screen.availWidth` : 작업 표시줄이 차지하는 부분을 제외한 가로 크기
  - `screen.availHeight` : 작업 표시줄이 차지하는 부분을 제외한 세로 크기
  - `screen.colorDepth` : 하나의 색상을 표시하는 데 사용되는 비트(bits) 수를 반환

### Global

- `process` : 현재 동작중인 프로세스의 정보
  - `env` : 환경 변수 정보
  - `argv` : 프로세스를 실행할 때 전달되는 파라미터 정보
  - `exit()` : 프로세스를 끝내는 메소드
- `console` : 콘솔 출력
- `__dirname` , `__filename` : 현재 폴더와 파일 경로(절대 경로)
- `module` , `exports` : 로딩된 모듈 정보와 모듈 타입, 객체 노출시키기

> 참조
>
> [https://velog.io/@kdo0129/웹-브라우저-객체2](https://velog.io/@kdo0129/%EC%9B%B9-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EA%B0%9D%EC%B2%B42)
>
> [https://stophyun.tistory.com/143](https://stophyun.tistory.com/143)
>
> [https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event)
>
> [https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event)
>
> [https://poiemaweb.com/js-global-object](https://poiemaweb.com/js-global-object)
