## Canvas

### 직사각형

- `fillRect(x, y, width, height)` : 색칠된 직사각형을 그린다.
- `strokeRect(x, y, width, height)` : 직사각형 윤곽선을 그린다.
- `clearRect(x, y, width, height)` : 특정 부분을 지우는 직사각형이며, 지워진 부분은 완전히 투명해진다.

**parameter**

- `x, y` : 캔버스의 좌측 상단에서 사각형의 위치
- `width, height` : 사각형의 크기

ex)

```tsx
const draw = () => {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }
}
```

### 경로

`path` 를 이용하여 도형을 만들기 위해서는 아래의 세 단계를 거쳐야 한다.

1. 경로를 생성한다.
2. 그리기 명령어를 사용하여 경로상에 그린다.
3. 경로가 한 번 만들어졌다면, 경로를 렌더링하기 위해 윤곽선을 그리거나 도형 내부를 채울 수 있다.
- `beginPath()` : 새로운 경로를 만든다. 경로가 생성됐다면, 이 후 그리기 명령들은 경로를 구성하고 만드는데 사용한다.
    - 이 메소드가 호출될 때마다, 하위 경로의 모음은 초기화되고 새로운 도형을 그릴 수 있게 된다.
    - 현재 열린 path가 비어있는 경우 ( `beginPath()` 메소드를 사용한 직 후, 혹은캔버스를 새로 생성한 직후), 첫 경로 생성 명령은 실제 동작에 상관 없이 `moveTo()` 로 여겨지게 된다. 그렇기 때문에 경로를 초기화한 직후에는 항상 명확하게 시작 위치를 설정해 두는것이 좋다.
- `closePath()` : 현재 하위 경로의 시작 부분과 연결된 직선을 추가한다.
    - 현재 점 위치와 시작점 위치를 직선으로 이어서 도형을 닫는다.
- `stroke()` : 윤곽선을 이요하여 도형을 그린다.
- `fill()` : 경로의 내부를 채워서 내부가 채워진 도형을 그린다.
    - `fill()` 호출 시 열린 도형은 자동으로 닫히게 된다.

ex) 삼각형 그리기

```tsx
const draw = () => {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
  }
}
```

### 펜(pen)이동

- `moveTo(x, y)` : 펜을 (x, y) 좌표로 이동시킨다.
    - 실제로 어떤 것도 그리지 않고, 펜을 종이 위에서 들어 옆으로 옮기는 것이라고 생각하면 된다.
    - 캔버스가 초기화 되었거나 `beginPath()` 메소드가 호출되었을 때, 특정 시작점을 위해 `moveTo()` 함수를 사용하는 것이 좋다.

### 선

- `lineTo(x, y)` : 현재의 드로잉 위치에서 x와 y로 지정된 위치까지 선을 그린다.
    - 이 메소드는 선의 끝점의 좌표가 되는 x, y 인자를 받는다. 시작점은 이전에 그려진 경로에 의해 결정되고 이전 경로의 끝점이 다음 경로의 시작점이 된다. 시작점은 `moveTo()` 에 의해 변경될 수 있다.

### 호

- `arc(x, y, radius, startAngle, endAngle, anticlockwise)` : `(x, y)` 위치에 원점을 두고, 반지름 `radius` 를 가지고, `startAngle` 에서 시작해서 `endAngle` 로 끝나는 `anticlockwise` `(boolean)`방향으로 향하는(기본 값은 시계방향 회전) 호를 그리게 된다.
- `arcTo(x1, y1, x2, y2, radius)` : 주어진 제어점과 반지름으로 호를 그리고, 이전 점과 직선으로 연결한다.

### 베지어(Bezier) 곡선과 이차(Quadratic) 곡선

- `quadraticCurveTo(cp1x, cp2y, x, y)` : `cp1x` 및 `cp1y` 로 지정된 제어점을 사용하여 현재 펜의 위치에서 x와 y로 지정된 끝점까지 이차 베지어 곡선을 그린다.
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` : `(cp1x, cp1y)` 및 `(cp2x, cp2y)` 로 지정된 제어점을 사용하여 현제 펜의 위치에서 x 및 y로 지정된 끝점까지 삼차 베지어 곡선을 그린다.

![canvasCurve](https://user-images.githubusercontent.com/49153756/101260485-a9889780-3773-11eb-862d-54fdf335a901.png)

> 참조
>
> [https://developer.mozilla.org/ko/docs/Web/HTML/Canvas/Tutorial/Drawing_shapes](https://developer.mozilla.org/ko/docs/Web/HTML/Canvas/Tutorial/Drawing_shapes)
>
> [http://ui-lab.co.kr/html5-canvas-활용예제/](http://ui-lab.co.kr/html5-canvas-%ED%99%9C%EC%9A%A9%EC%98%88%EC%A0%9C/)
