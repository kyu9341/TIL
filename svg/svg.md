## SVG란?
- 확장 가능한 벡터 그래픽(Scalable Vector Graphics)
    - 벡터 그래픽 : 점과 점 사이의 계산을 이용해 그린다. (어도비 일러스트레이터)
    - 이미지를 확대해도 깨지지 않음.
    - 용량이 일정
- XML 기반의 2차원 그래픽
    - XML 코드로 구성됨
- 아이콘, 이미지, 그래프, 사용자 인터페이스(UI) 등에 널리 씀임
- DOM의 일부로서 각 개체별로 HTML 엘리먼트가 추가됨.
- 벡터이기 때문에 이미지의 크기에 상관없이 선명하게 유지되고 모양이 많이 복잡하지 않은 경우 파일 사이즈도 작다.
- CSS와 자바스크립트를 이용해서 조작이 가능
- 크기(width/height)가 큰 이미지 표현에 유리
- 모양이 복잡하고 개체수가 많을수록 성능이 떨어짐

### 비교: 캔버스(Canvas)

- 비트맵 기반 그래픽
- 이미지나 비디오의 픽셀 조작, 게임, 퍼포먼스가 중요한 이미지 조작 등에 쓰임
- 단일 태그 `<canvas>` 로 표현
- 자바스크립트를 이용해서 조작 가능(css는 불가).
- 픽셀 단위의 조작이 가능해서 일반 HTML 엘리먼트로는 불가능한 다양한 표현들이 가능
- 저수준(low-level) API로 코딩량이 많고 까다로움
- 크기가 커질수록 성능이 떨어짐

### svg - viewBox 속성

viewBox를 설정하고, svg태그에 width, height 가 적용되어 있지 않으면 반응형으로 설정된다.

svg태그에 width, height 가 적용되어 있으면, 내부의 엘리먼트의 width, height에 대해 상대적인 크기를 나타내게 된다.

> viewBox = "`<min-x>`, `<min-y>`, `<width>`, `<height>`"

- [https://ryujek.tistory.com/entry/viewBox](https://ryujek.tistory.com/entry/viewBox)

## 기본 도형 그리기

### 사각형

```css
rect {
    fill: orange;
    stroke: dodgerblue;
    stroke-width: 10;
  }
```

```html
<rect x="10" y="20" width="200" height="100" fill="red"/>
<rect x="50" y="170" rx="10" ry="10" width="100" height="100"/>
```

`x, y` : 좌표 (svg 태그 내부에서 좌측 상단 0, 0 을 기준)

`rx, ry` : 사각형의 둥근 꼭짓점의 x, y 방향으로의 반지름이다. (모서리를 둥글게 하는 속성)

### 원

```html
<circle cx="350" cy="250" r="30"/>
```

`cx, cy` : 원의 중심의 좌표, `r` : 반지름의 길이

### 타원

```html
<ellipse cx="200" cy="200" rx="100" ry="50" fill="red" stroke="green" stroke-width="20"/>
```

`rx, ry` : 가로, 세로 방향의 반지름)

### 직선

```html
<line x1="10" x2="400" y1="30" y2="300" stroke="blue"/>
```

`x1, x2, y1, y2` : `x1, y1` 에서 `x2, y2` 좌표로 직선을 긋는다.

### 직선들의 그룹

```html
<polyline points="0 0, 200 100, 150 300" stroke="red" stroke-width="10"/>
```

**`points` :** 포인트들의 목록, 각 숫자는 공백, 쉼표, EOL 또는 줄 바꿈 문자로 구분된다. 각 포인트는 반드시 x 좌표와 y 좌표를 가지고 있어야 한다. 따라서 포인트 목록 (0,0), (1,1) 및 (2,2)는 "0 0, 1 1, 2 2"라고 쓸 수 있다.

### 다각형

```html
<polygon points="0 0, 200 100, 150 300" stroke="red" stroke-width="10"/>
```

위의 `polyline` 과 유사한데, `polygon` 은 각각의 `point` 를 모두 연결하여 하나의 다각형으로 만들어준다. 

### SVG - CSS 속성

`fill` : svg 색상 지정

`stroke` : svg에서의 border 색상

`stroke-width` : svg에서의 border 굵기