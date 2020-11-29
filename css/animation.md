### CSS 트랜지션과 CSS 애니메이션의 차이

CSS transition 을 CSS 애니메이션 모듈과 혼동하면 안된다.

transition 은 요소가 한 상태에서 다른 상태로 변형될 때(hover 효과와 같은 종류) 이 변화가 일정 시간동안 애니메이션화거나 transitioned, 즉 변천 과정을 겪는 것을 말하고, CSS 애니메이션 모듈은 완전히 별개로 훨씬 더 규모가 크고 복잡하며 다양한 능력을 가지고 있다.

**CSS 트랜지션에 사용되는 프로퍼티 네 가지**

- `transition-property` : 화면 이동에 영향을 받는 속성으로 이 값을 지정하면 특정 사항에 대해서만 화면 이동 효과가 나타난다.(어떤 속성을 트랜지션 할 것인지)
- `transition-duration` : CSS 효과가 반영되는데 걸리는 시간, 즉 화면 이동이 종료되기 까지 걸리는 시간(트랜지션이 일어나는 지속시간)
- `transition-timing-function` : 타이밍 함수(어떤 움직임(시간에 따른 가속이나 감속)으로 반영할 것인지)
    - `linear` : 등속도, 전환 과정에 속도의 변화 없이, 처음부터 끝까지 흐름이 일정하게 유지
    - `ease` : 점진적인 가속, 기본값은 ease 로서 느리게 시작한 후 빠르게 가속되다가 다시 느리게 끝남
    - `ease-in` : 가속, 애니메이션이 느리게 시작된 후 빠름 흐름으로 끝남
    - `ease-out` : 감속, 애니메이션이 빠르게 시작된 후 느리게 끝남
    - `ease-in-out` : 점진적인 가속 후에 감속, 느리게 시작한 후 중간 지점에서 빨라지다가 다시 느려지면서 끝나므로 `ease` 와 비슷하지만,그 변화 정도가 `ease` 의 경우처럼 급격하지는 않음
    - `cubic-bezier` (3차 베지어 곡선) : 정교하게 제어하기 위한 방법
        - `transition-timing-function: cubic-bezier(x1, y1, x2, y2);`  와 같은 문법으로 사용 - [온라인 도구](https://matthewlein.com/tools/ceaser)
- `transition-delay` : 트랜지션 지연시간(애니메이션을 지연시킬 때)
    - 전환이 일어나는 시점을 설정한다.
    - 음수를 주면 전환 효과가 즉시 실행되지만, 설정한 시간만큼 애니메이션이 건너뛰어서 나타난다.
- `transition` : 트랜지션 속기형(위의 속성들을 한데 모아서 작성할 때)

**네 가지 속성을 한번에 정의하는 방법**

```css
.selector { /* 권장 속성 순서 */ 
/* transition: prop dur timfn delay; */ 
  div { 
    transition: opacity .5s linear 2s; 
    transition: linear .5s opacity 2s; 
    transition: linear opacity .5s 2s; 
    transition: .5s 2s opacity linear;
  }
}
```

주의해야 할 점은 time 값으로 `transition-duration` 과 `transition-delay`가 있는데 하나의 time 값만 선언하면 이는 `transition-duration` 값으로 간주되고, `transition-delay` 는 기본 설정 값 또는 상속받은 값을 그대로 사용하는 것으로 간주된다.

### 주의 ⚠️

`transition` 속성은 일반적으로 초기 상태 스타일에 적용해 두자. `:hover` 에 적용해 둔다면 `:hover` 상태가 될 때는 정상적으로 동작하지만 `:hover` 가 해제되는 경우에는 점진적으로 변화하지 않고, 본래의 스타일로 바로 되돌아간다.

```css
.btn { 
	background: blue;
  transition: background 2s 0.5s linear;

  &:hover {
    background: red;
  }
}
```

하지만 `hover` 하는 순간과 `hover` 가 해제되는 순간의 트랜지션을 다르게 주고 싶다면 기존 상태에 해제되는 순간 주고 싶은 트랜지션을 주고, `:hover` 에 `hover` 되는 순간 주고 싶은 애니메이션을 주면 된다.

```css
.btn {
	background: blue;
  transition: 1s;
  &:hover {
    transform: rotate(180deg);
    background: red;
    transition: background 5s;
  }
}
```

위와 같이 속성을 주면, `hover` 하는 경우 `rotate`에 의해 바로 180도 뒤집어지고, `background`는 5초에 걸쳐서 빨간색으로 변화하게 된다. 그리고 `hover` 를 해제할 때 `transition` 속성을 보면 `transition-property`가 생략되어 있으므로 all로 취급되어 `rotate`의 변화와 `background`의 색상 변화 모두 1초에 걸쳐 이루어지게 된다.

---

### CSS3 transform - 2D 변형(전환)

### `rotate(회전 효과)` : rotateX(), rotateY(), rotate(x, y)

```css
.btn {
	transition-duration: 2s;

	&:hover {
		transform: ratate(45deg);
	//transform: ratate(1.2turn); 
}
```

- `turn` 을 넣어주면 그 횟수만큼 회전시킨다.

### `scale(확대/축소 효과)` : scaleX(), scaleY(), scale(x, y)

```css
.btn {
	transition-duration: 2s;

	&:hover {
		transform: scale(0.5);
 //	transform: scaleX(2);
 //	transform: scale(2, 3);
}
```

### `translate(이동효과)` : translateX(), translateY(), translate(x, y)

- translate 효과는 원래의 위치를 기반으로 해서 이동하는 것을 의미하며, 중요한 것은 원래의 위치 정보는 남아있다.
- translate 단위는 px, %, em 등을 사용
- `position` 속성은 해당 요소를 컨테이너를 기준으로 움직인다. 그에 반해서 `translate()`는 언제나 해당 요소의 본래(자신) 위치를 기준으로 하여 새 위치를 잡게 된다.

```css
.btn {
	transition-duration: 2s;

	&:hover {
		transform: translate(50px, 50px);
 //	transform: translate(0, -50px);
 //	transform: translateX(100px) translate(50px);
}
```

### `skew(비틀기) 효과` : skewX(), skewY()

```css
.btn {
	transition-duration: 2s;

	&:hover {
		transform: skewyX(15deg);
//	transform: skewyY(45deg);
}
```

[`skewX(x deg)`](http://www.w3schools.com/cssref/playit.asp?filename=playcss_transform_skewx) : 각도가 양수인 경우 영역의 상단은 왼쪽 방향으로 영역 하단은 오른쪽 방향으로 비틀리고,

[`skewY(y deg)`](http://www.w3schools.com/cssref/playit.asp?filename=playcss_transform_skewy) : 각도가 양수인 경우 영역의 좌측은 위로, 우측은 아래로 비틀리게 된다.

### `transform-origin(기준점 설정)`

위의 각 기능은 모두 **해당 요소의 중심**을 기점으로 동작한다. 예를 들어 `scale` 이 적용된 요소는 그 중심을 기점으로 크기가 커지고 `rotate` 가 적용된 요소들은 요소의 중심점을 기준으로 회전을 하게 된다.

하지만 `transform-origin` 속성은 전환이 발생하는 기준점을 x와 y 매개변수로 명시하여 중심이 아닌 다른 지점을 지정할 수 있는 속성이다.

```css
transform: skewX(45deg);
transform-origin: bottomhttps://webclub.tistory.com/619?category=541913 center;
```

`**transform-origin` 속성 값**

- `x축` : `left`, `center`, `right`, `length`, `%`
- `y축` : `top`, `center`, `bottom`, `length`, `%`
- `z축` : `length`, `view` 가 z축에 배치되는 곳을 지정한다(3D 변환(transition)과 함께 사용될 경우)

### 매트릭스

- [https://developer.mozilla.org/ko/docs/Web/CSS/transform-function/matrix()](https://developer.mozilla.org/ko/docs/Web/CSS/transform-function/matrix())
- 다른 함수들의 기초가 되는 함수
- 그래서 matrix를 제대로 쓸 줄 알면 다른 transform 함수들을 조합해서 사용하는 것보다 간결하게 작성할 수 있다.
