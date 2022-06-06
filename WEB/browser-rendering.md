# 브라우저 동작 원리

### 렌더링 과정(요약)
- HTML을 파싱하여 **DOM 객체**를 생성하고, CSS를 파싱하여 **CSSOM**을 만든다.
- 이 두개를 합쳐서 실제로 웹 브라우저에 보여져야할 요소를 표현한 **렌더 트리**를 만든다.
- 이 렌더 트리를 기준으로 **레이아웃을 배치**하고 **색을 칠하는 등의 작업**을 한다.

## Critical Rendering Path (브라우저가 하나의 화면을 나타내는 과정)
1. HTML데이터를 파싱한다.
2. 파싱한 결과로 DOM Tree를 만든다.
3. 파싱 중 CSS파일 링크를 만나면 CSS파일을 요청해서 받고, CSS 파일을 읽어 CSSOM(CSS Object Model)을 만든다.
4. DOM Tree와 CSSOM을 사용해 Render Tree를 만든다.
5. Render Tree의 노드들이 화면의 어디에 위치할지 계산한다.
6. 웹페이지를 그린다.

### 1. HTML 데이터를 파싱
브라우저는 응답으로 받아온 HTML문서를 DOM으로 만들기 위해 각각의 요소를 파싱한다. 이 과정에서 미디어파일(이미지나 비디오등)을 만나면 추가 요청을 보낸다. 또한 JavaScript를 만나면 실행할 때까지 파싱을 멈춘다.

### 2. DOM Tree 구성
![Screen Shot 2020-12-29 at 03 39 15 AM](https://user-images.githubusercontent.com/49153756/103270806-29fd8980-49fc-11eb-82e3-922feaed0cd4.png)

브라우저는 읽어들인 HTML 바이트 데이터를 해당 파일에 지정된 인코딩(ex: `UTF-8`)에 따라 문자열로 바꾸게 된다. 이렇게 바꾼 문자열을 다시 읽어서, HTML 토큰으로 변환한다. 태그의 경우 `StartTag`와 `EndTag`로 변환된다.

토큰들은 다시 노드로 바뀌는데(렉싱), `StartTag`와 `EndTag`사이에 있는 노드들은 자식노드로 들어간다. 즉 트리모양이 되는데, 이 과정이 끝나면 DOM Tree가 생성되는 것이다.

### 3. CSSOM 구성
HTML을 파싱하다 CSS링크를 만나면, CSS파일을 받아온다. CSS파일은 파싱과정을 거쳐 Tree형태의 CSSOM으로 만들어진다. CSS 파싱은 `cascading`규칙(부모의 특성을 자식이 이어받음)이 추가되는 점을 제외하고는 HTML파싱과 동일하다.

CSSOM이 구성이 되어야 다음 과정으로 넘어갈 수 있기 때문에, CSS는 렌더링의 blocking 요소라고도 한다.
![Screen Shot 2020-12-29 at 02 43 06 AM](https://user-images.githubusercontent.com/49153756/103270821-2e29a700-49fc-11eb-9fcd-8807a27df98e.png)

### 4. Render Tree 구성
DOM 및 CSSOM 트리는 결합되어 Render Tree를 형성한다. Render Tree는 DOM Tree에 있는 것들 중에 실제 페이지를 렌더링하는 데 필요한 노드들만 포함된다.

즉, `display:none`으로 설정되어 있는 것은 DOM Tree에 있어도 Render Tree에는 없다. 마찬가지로 DOM Tree 중 일부 노드(`<head>`, `<title>`, `<script>` 등)는 화면에 표현되는 노드가 아니기 때문에 Render Tree에 포함되지는 않는다.

### **5. Layout(Reflow)**

Render Tree가 만들어지면, 이제 각각의 노드들의 정확한 크기와 위치를 계산하는 과정을 거친다. 이 과정을 Layout과정이라고 한다. `position`, `width`, `height` 등 위치 및 크기에 관련된 부분들을 계산한다.

`width:100%`인 상태에서 브라우저를 리사이즈하면, Render Tree는 변경되지 않고 Layout 이후 과정만 다시 거치게 된다.

### **6. Paint**

Layout과정을 거쳐 계산을 마치면, 실제 그리는 작업(Paint)을 수행한다. 실제로 픽셀이 화면에 그려지며, 만약 Render Layer가 2개 이상이면 각각의 Layer를 그린 뒤 하나의 이미지로 Composite하는 과정을 거친 뒤 브라우저에 실제로 그려지게 된다.

색이 바뀐다거나 노드의 스타일이 바뀌는 걸로는 Layout 과정을 거치지 않고 Paint만 일어난다.

---

### Reflow

변경(일부 또는 전체)이 필요한 렌더 트리에 대한 유효성 확인 작업과 함께 노드의 크기와 위치를 다시 계산한다. 이 과정을 리플로(Reflow) 또는 레이아웃(Layout), 레이아웃팅(Layouting)이라고 부른다. 좀 더 정확하게는 노드의 크기 또는 위치가 바뀌어 현재 레이아웃에 영향을 미쳐 배치를 다시 해야 할 때 `Reflow`가 발생한다.

특정 요소에 `Reflow`가 발생하면 요소의 DOM 구조에 따라 자식 요소와 부모 요소 역시 다시 계산될 수 있으며, 경우에 따라서는 문서 전체에 `Reflow`가 발생할 수도 있다.

### Repaint

변경 영역의 결과를 표현하기 위해 화면이 업데이트되는 것을 의미한다.(`Reflow`만 수행되면 실제 화면에 반영되지 않는다.) `**Reflow`가 발생하거나 배경색 변경 등의 단순한 스타일 변경과 같은 작업이 발생하는 경우에 발생한다.** 간단하게는 화면을 변경해야 할 때 발생한다고 생각하면 된다. 이러한 작업을 `Repaint` 또는 `Redraw`라고 한다.

`Reflow`와 `Repaint` 모두 처리 비용이 발생하지만 `Repaint`보다 `Reflow`의 비용이 훨씬 높다. `Reflow`는 변경 범위에 따라 전체 페이지의 레이아웃을 변경해야 할 수도 있다. 어느 경우든 `Reflow`와 `Repaint` 때문에 UI의 화면 표현이 느려져 UX에 영향을 줄 수 있으므로 코드를 작성할 때 이를 최소화해야 한다.

**발생 요인**

현재 구성된 렌더 트리의 변경을 가져오는 작업이 실행되면 작업의 종류에 따라 `Reflow` 또는 `Repaint`가 발생한다. 주요 변경 요인은 다음과 같다.

- DOM 노드의 변경: 추가, 제거 업데이트
- DOM 노드의 노출 속성을 통한 변경: `display:none`은 `Reflow`와 리페인트를 발생시키지만 비슷한 속성인 `visibility:hidden`은 요소가 차지한 영역을 유지해 레이아웃에 영향을 주지 않으므로 `Repaint`만 발생시킵니다.
- 스크립트 애니메이션: 애니메이션은 DOM 노드의 이동과 스타일 변경이 짧은 시간 내에 수차례 반복해 발생되는 작업입니다.
- 스타일: 새로운 스타일시트의 추가 등을 통한 스타일 정보 변경 또는 기존 스타일 규칙의 변경
- 사용자의 액션: 브라우저 크기 변경, 글꼴 크기 변경 등

---

### 브라우저의 기본 구조

브라우저의 주요 구성 요소는 다음과 같다.

1. 사용자 인터페이스 - 주소 표시줄, 이전/다음 버튼, 북마크 메뉴 등. 요청한 페이지를 보여주는 창을 제외한 나머지 모든 부분이다.
2. 브라우저 엔진 - 사용자 인터페이스와 렌더링 엔진 사이의 동작을 제어.
3. 렌더링 엔진 - 요청한 콘텐츠를 표시. 예를 들어 HTML을 요청하면 HTML과 CSS를 파싱하여 화면에 표시함.
4. 통신 - HTTP 요청과 같은 네트워크 호출에 사용됨. 이것은 플랫폼 독립적인 인터페이스이고 각 플랫폼 하부에서 실행됨.
5. UI 백엔드 - 콤보 박스와 창 같은 기본적인 장치를 그림. 플랫폼에서 명시하지 않은 일반적인 인터페이스로서, OS 사용자 인터페이스 체계를 사용.
6. 자바스크립트 해석기 - 자바스크립트 코드를 해석하고 실행.
7. 자료 저장소 - 이 부분은 자료를 저장하는 계층이다. 쿠키를 저장하는 것과 같이 모든 종류의 자원을 하드 디스크에 저장할 필요가 있다. HTML5 명세에는 브라우저가 지원하는 '[웹 데이터 베이스](http://www.html5rocks.com/en/features/storage)'가 정의되어 있다.

![Screen Shot 2020-12-29 at 02 24 48 AM](https://user-images.githubusercontent.com/49153756/103270823-2f5ad400-49fc-11eb-92e1-e30d73571e9a.png)

브라우저에서 웹 페이지가 나타나는 과정 : [https://bearjin90.tistory.com/19](https://bearjin90.tistory.com/19)

렌더링 + 최적화 : [https://boxfoxs.tistory.com/408](https://boxfoxs.tistory.com/408)

렌더링 + 최적화 : [https://12bme.tistory.com/140](https://12bme.tistory.com/140)

브라우저 동작 원리 : [https://d2.naver.com/helloworld/59361](https://d2.naver.com/helloworld/59361)

[https://it-ist.tistory.com/110](https://it-ist.tistory.com/110)

[https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=ko](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=ko)

[https://isme2n.github.io/devlog/2017/07/06/browser-rendering/](https://isme2n.github.io/devlog/2017/07/06/browser-rendering/)