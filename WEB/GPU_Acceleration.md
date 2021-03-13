# 하드웨어 가속

특정 작업을 CPU가 아닌 다른 특별한 장치를 통해 수행 속도를 높이는 것을 '하드웨어 가속(hardware accelerated)'이라 한다. 그래픽이나 사운드와 관련된 작업에 하드웨어 가속을 많이 사용한다.

**브라우저에서 하드웨어 가속은 GPU를 이용하여 CPU의 처리량을 줄이고, 브라우저의 렌더링을 효율화하는 것을 말한다. CSS 작업에 하드웨어 가속을 활성화하면, 작업 처리가 빨라져서 웹페이지의 렌더링을 보다 빠르게 할 수 있다.**

### 프론트엔드 개발자가 GPU를 사용하는 방법

프론트엔드 개발자가 브라우저 렌더링 시에 GPU를 사용하도록 만드려면 어떻게 해야할까? 이런 내용을 받아들이기 위해서는 먼저 브라우저의 `Layer Model`에 대해 이해해야 할 것 같다.

## Layer Model (크롬 기준)

최근 브라우저들은 `Layout` 과정 이후 `Update Layer Tree` 라는 단계가 생겼다. `Render Object` 는 `Layout` 이후 정해진 기준에 따라 Layer를 나눈다. Layer는 웹 페이지를 렌더링하기 위해 필요한 이미지 단위 요소로 브라우저의 Layer는 다음의 두 가지로 나뉜다.

1. `Render Layer`
2. `Graphics Layer`

![render](https://user-images.githubusercontent.com/49153756/106854300-65c3f700-66fe-11eb-844b-aea642a3987a.png)

> [이미지 출처](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)

브라우저는 화면에 표현되는 요소를 `RenderObject 트리`로 구성한다. `RenderObject 트리`의 노드는 `z-index` 속성이나 중첩 등을 처리하기 고안된 `RenderLayer`에 대응된다.

`RenderLayer` 가운데 실제 화면에 출력돼야 하는 노드는 다시 `GraphicsLayer`를 생성한다. `최상위(root) 노드`나 `<canvas>`, `<video>` 등이 `GraphicsLayer`를 생성하는 `RenderLayer`다.

### Render Layer

각 `Render Object`의 속성에 따라 `RenderLayer`에 할당된다. `RenderLayer` 는 페이지의 요소가 겹치는 컨텐츠나 반투명한 요소 등을 올바로 합성되어 표시하기 위해 존재하고, 일반적으로 아래와 같은 상황에 `RenderLayer` 가 생성된다고 한다.

- 페이지의 루트 개체 (`root layer` : 최상위 레이어)
- `CSS position` 속성 (`relative`, `absolute` 또는 `transform`)
- 투명도를 가지는 경우
- CSS 필터를 가지는 경우
- 3D 컨텍스트(`WebGL`) 혹은 하드웨어 가속 2D 컨텍스트를 가지는 `<canvas>` 엘리먼트
- `<video>` 엘리먼트

동일한 좌표 공간을 공유하는 `RenderObject` 는 일반적으로 동일한 `RenderLayer` 에 속한다. 또한, `RenderObject`와 `RenderLayer` 는 반드시 1:1로 매핑되는 것은 아니다.

### Graphics Layer

특정 `RenderLayer` 가 `GraphicsLayer` 생성 조건을 만족하면 `GraphicsLayer` 단위로 렌더링한 뒤 최종적으로 GPU를 통해 합성된다. `GraphicsLayer` 는 GPU에 텍스쳐로 업로드된다.

`RenderLayer` 가 아래 조건 중 하나라도 만족하면 `GraphicsLayer` 를 가질 수 있다.

- 3D나 `perspective`를 표현하는 `CSS transform` 속성을 가진 경우
- 하드웨어 가속 디코딩을 사용하는 `<video>` 엘리먼트
- 3D 컨텍스트(`WebGL`) 혹은 하드웨어 가속 2D 컨텍스트를 가지는 `<canvas>` 엘리먼트
- 투명도(`opacity`) 속성 혹은 `webkit transform`의 애니메이션의 사용
- 가속 가능한 CSS 필터를 가진 경우
- 합성 레이어(`Compositing Layer`)를 하위 노드로 가진 경우
- `z-index` 값이 낮은 형제 레이어를 갖는 경우 (즉, 레이어의 상단에 렌더링되는 경우)

즉, 프론트엔드 개발자가 브라우저 렌더링 시에 GPU를 사용하려면 위의 `GraphicsLayer` 를 생성하도록 개발하면 될 것이다.

### 그럼 어떻게 사용하면 좋을까?

**Layout, Paint 비용 줄이기**

`Layout` , `Paint` 를 발생시키는 속성 대신 GPU가 처리할 수 있는 변형을 이용하여 같은 효과를 구현한다.

- `left` / `top` 에 의한 이동은 `transform: translate` 를 이용한다.
- `show` / `hide` 는 `alpha` 값을 이용하는 `opacity` 속성을 이용한다.

위와 같이 사용한다면 CPU에서 레이아웃을 다시 계산하지 않아도 GPU단에서 바로 처리가 가능하다. `Layout` , `Paint` 과정을 다시 거치지 않고, 바로 GPU에서 `Composite` 과정만으로 처리할 수 있어 훨씬 빠르게 렌더링을 할 수 있다.

### 그렇다면, 모든 작업을 GPU에게 몰아버리는 것이 좋을까?

![GPU](https://user-images.githubusercontent.com/49153756/106854303-678dba80-66fe-11eb-9d47-77ae1632a82a.png)

> [이미지 출처](https://medium.com/@cwdoh/프론트엔드-개발자를-위한-크롬-렌더링-성능-인자-이해하기-4c9e4d715638)

위의 그림과 같이 CPU는 데이터를 처리하기 위해서 이를 메인 메모리(RAM)으로 가져와야 한다. 이와 마찬가지로 GPU에서 데이터를 처리하기 위해서는 VRAM이라는 비디오 메모리로 데이터를 가져와 처리하게 된다.

따라서, GPU에서 데이터를 처리하기 위해서는 RAM에서 VRAM으로 데이터를 전달하는 과정이 필요하다. 이 과정에서 texture를 계속해서 옮겨야 하는 상황이라면 그에 따른 오버헤드가 발생할 수 있다.

또한, 일반적으로 GPU가 texture를 받아 처리하기 위해서는 CPU에서 RAM에 texture를 로드하고, 이를 GPU로 보내게 된다. 즉, CPU가 GPU에서 사용될 데이터를 처리하는 시간이 소요된다.

### 강제로 GPU 가속을 사용하도록 하는 방법

특정한 요소에 GPU 가속을 적용하고 싶은 경우에는 레이어 핵(layer hack)이라고 부르는 방법을 사용할 수 있다. 레이어 핵은 하드웨어 가속을 위해 `CSS 3D` 속성을 추가해 특정 요소를 `GraphicsLayer` 로 분리하도록 하는 기법이다. `transform` 속성에 `translate3d(0,0,0)`나 `translateZ(0)` 등을 지정함으로써 하드웨어 가속을 활성화할 수 있다.

```css
transform: translate3d(0, 0, 0);
```

그러나 레이어를 생성하는 것에는 그만한 비용이 필요하다. RAM이나 GPU의 메모리 사용량이 커지게 되고, 이러한 점은 데스크탑에 비해 메모리 용량이 크지 않은 모바일 기기에서 큰 영향을 끼칠 수 있다. 따라서 하드웨어 가속을 적용할 때는 이를 통해 렌더링이 빨라지는지, 다른 문제는 발생하지 않는지 확인을 하고 적용해야 한다.

이런 레이어 핵을 대체하기 위한 새로운 CSS 속성이 등장했는데, 바로 `will-change` 라는 속성이다.

### `will-change` 속성

> [지원 브라우저 확인](https://caniuse.com/?search=will-change)

`will-change` 은 엘리먼트에 어떠한 변경을 할 것이라는 것을 브라우저에게 미리 알려주는 속성이다. 미리 알려주게 되면 브라우저는 해당 변경을 위한 작업을 사전에 최적화하여 실제 변경이 발생될 때 더 빠르게 업데이트를 할 수 있게 된다.

```css
will-change: transform, opacity;
```

위와 같이 `will-change` 속성에 앞으로 일어날 변경이 적용될 속성을 넣어주면 된다. 이 속성 또한 불필요한 곳에 남용하면 오히려 성능 저하를 불러올 수 있는데, 이에 대한 자세한 활용은 추후에 직접 사용해보며 알아보도록 해야겠다.

> 참조
>
> [https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)
>
> [https://blog.jaysiyo.com/critical-rendering-path](https://blog.jaysiyo.com/critical-rendering-path)
>
> [https://velog.io/@kimu2370/Layer-model](https://velog.io/@kimu2370/Layer-model)
>
> [http://pjh0718.blogspot.com/2017/03/blink-layer.html](http://pjh0718.blogspot.com/2017/03/blink-layer.html)
>
> [https://web-atelier.tistory.com/39](https://web-atelier.tistory.com/39)
>
> [https://sculove.github.io/slides/improveBrowserRendering/#/7](https://sculove.github.io/slides/improveBrowserRendering/#/7)
>
> [https://medium.com/@cwdoh/프론트엔드-개발자를-위한-크롬-렌더링-성능-인자-이해하기-4c9e4d715638](https://medium.com/@cwdoh/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-%ED%81%AC%EB%A1%AC-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%84%B1%EB%8A%A5-%EC%9D%B8%EC%9E%90-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-4c9e4d715638)
>
> [https://d2.naver.com/helloworld/2061385](https://d2.naver.com/helloworld/2061385)
>
> [https://d2.naver.com/helloworld/2922312](https://d2.naver.com/helloworld/2922312)
>
> [https://medium.com/@gotppetto/웹-애니메이션-gpu가속-1b027b2b355d](https://medium.com/@gotppetto/%EC%9B%B9-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-gpu%EA%B0%80%EC%86%8D-1b027b2b355d)
>
> [https://nykim.work/81](https://nykim.work/81)
>
> [https://www.slideshare.net/deview/125-119068291](https://www.slideshare.net/deview/125-119068291)
>
> [https://www.html5rocks.com/ko/tutorials/speed/high-performance-animations/](https://www.html5rocks.com/ko/tutorials/speed/high-performance-animations/)
>
> [https://ui.toast.com/fe-guide/ko_PERFORMANCE](https://ui.toast.com/fe-guide/ko_PERFORMANCE)
>
> [https://wit.nts-corp.com/2017/08/31/4861](https://wit.nts-corp.com/2017/08/31/4861)
>
> [http://sculove.github.io/blog/2013/12/05/animation-for-performance/](http://sculove.github.io/blog/2013/12/05/animation-for-performance/)
