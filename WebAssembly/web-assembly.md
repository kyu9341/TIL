# Web Assembly

video encoding을 위해 프로젝트에 적용한 `mp4-h264` 라이브러리는 `Web Assembly` 를 활용하여 각 프레임마다 pixel 데이터를 받아 h264 코덱으로 인코딩하고 mp4파일로 합치는 라이브러리이다. 대체 `Web Assembly` 가 무엇이길래 이런 작업을 가능하게 하는지 알아보자.

## Web Assembly

- 웹 어셈블리는 최신 웹 브라우저에서 실행할 수 있는 새로운 유형의 코드이며 C, C++, RUST 등 저급 언어를 효과적으로 컴파일한다.
- 이전에는 불가능했던 웹에서 실행되는 클라이언트 응용프로그램을 사용하여 웹에서 여러 언어로 작성된 코드를 네이티브에 가까운 속도로 실행하는 방법을 제공한다.
- 웹 어셈블리는 자바스크립트를 대체할 목적이 아닌 보완하기 위해 나온 기술이다.

그렇다면 어떻게 `Web Assembly` 가 브라우저상에서 동작할 수 있는 것일까? 

이것을 이해하기 위해서는 컴파일러의 작동 원리에 대한 이해가 필요하다. 개발자는 인간의 언어에 더 가까운 언어로 코딩하지만 컴퓨터 프로세서는 기계어만 알아들을 수 있다. 그런데 문제는, 기계어 자체도 컴퓨터 프로세서의 종류마다 천차만별이라는 것이다.

각각의 프로그래밍 언어로 작성된 코드를 기계어 종류별, 버전별로 컴파일하려면 매우 힘들 것이다. 그래서 일반적으로 개발자가 작성한 코드는 컴파일러 프론트엔드에서 중간 표현형(IR: Intermediate Representation)으로 변환된다. 컴파일러 백엔드는 이렇게 생성된 IR 코드를 최적화한 후, 원하는 기계어로 변환해준다.

![ir](https://user-images.githubusercontent.com/49153756/102007767-2d8fe000-3d6f-11eb-81a4-6c6338df64d5.png)

`Web Assembly` 를 사용한다면, 그 과정에서 IR 코드를 `.wasm` 형식의 바이너리 바이트코드로 바꾸어주는 과정이 추가된다. `Wasm` 파일에 있는 바이트코드는 `Web Assembly` 를 지원하는 브라우저가 이해할 수 있는 가상 명령어의 집합일 뿐 아직 기계어는 아니다. 브라우저는 `Wasm` 파일을 로드하고 문제가 없는지 확인한 뒤 이 파일에 있는 바이트코드를 브라우저가 실행 중인 디바이스의 기계어로 컴파일한다.

![wasm](https://user-images.githubusercontent.com/49153756/102007734-f6b9ca00-3d6e-11eb-8c25-649a60f7e835.png)

`Web Assembly` 의 동작 원리에 대해 컴파일 과정을 통해 간단하게 알아봤으니 이제 C/C++로 작성된 코드를 어떻게 브라우저에서 실행시키는지 알아보자.

### Emscripten

`Emscripten` 은 C/C++ 코드를 웹 어셈블리 바이트코드로 컴파일하는 가장 검증된 툴킷이다. `Emscripten` 은 자신만의 백엔드를 갖고 있는데, 이 백엔드는 또다른 대상 (asm.js)으로 컴파일한 후에 그것을 웹어셈블리로 변환하는 방식으로 웹어셈블리를 생성할 수 있다. 하지만 내부적으로는 LLVM을 사용하고 있기 때문에, Emscripten를 이용하면 두개의 백엔드 사이를 전환할 수 있다.

Emscripten은 전체 C/C++ 코드베이스를 변환할 수 있게 해 주는 많은 추가적인 도구와 라이브러리를 포함하기 때문에, 컴파일러라고 하기 보다는 소프트웨어 개발자 킷 (SDK: Software Developer Kit)에 가깝다. 

### LLVM

컴파일러는 프론트엔드-미들엔드-백엔드의 단계로 구성되어 있다. 보통 이 세 단계는 하나의 프로그램으로 일괄 처리되는데, 이럴 경우 '언어의 종류 x 아키텍처의 종류'만큼 복수의 컴파일러가 필요하게 된다. 다양한 언어와 다양한 아키텍처에 대응할 수 있는 이식성이 중요한 요즘 이러한 컴파일러 구조는 재사용성을 떨어뜨린다는 문제가 있다. 바로 이것을 해결할 수 있는 컴파일러 구조가 `LLVM`이다.

`LLVM`은 아키텍처별로 분리된 모듈식 미들엔드-백엔드를 중점으로 하고 있다. 프론트엔드가 여러가지 프로그래밍 언어들을 중간 표현 코드로 번역하고, `LLVM`은 그 중간 표현 코드를 각각의 아키텍처에 맞게 최적화하여 실행이 가능한 형태로 바꾸는 방식이다. `LLVM`의 자체 프론트엔드인 Clang이 등장한 이후 컴파일의 전 과정을 `LLVM` 툴체인으로 진행할 수 있게 되었다.

원래 `LLVM`은 저레벨 가상머신(Low-Level Virtual Machine)의 약자였지만, 프로젝트가 확장되며 이 용어는 더 이상 사용하지 않고 `LLVM` 자체가 프로젝트의 정식 명칭이 된다.

### C/C++로부터 포팅

`Emscripten` 을 이용하면 C/C++ 코드를 가져와서 `.wasm` 모듈로 컴파일하고, 이 모듈을 불러와 브라우저에서 실행시키기 위해 필요한 자바스크립트 glue(접착제) 코드를 끼워넣고, HTML 문서에 코드의 실행결과를 출력할 수 있다.

![wasm](https://user-images.githubusercontent.com/49153756/102009556-85344880-3d7b-11eb-8939-a89c6ffef828.png)

절차는 아래와 같다.

1. `Emscripten` 은 우선 C/C++ 코드를 `LLVM` 에 던져준다.
2. `Emscripten` 이 `LLVM` 의 컴파일 결과를 받아다가 `.wasm` 파일로 변환시켜준다.
3. `WebAssembly` 는 그 자체로는 DOM에 바로 접근할 수 없다. 단지 자바스크립트를 호출하면서 정수나 부동소수점 기초 자료형을 넘겨줄 수 있을 뿐이다. 따라서 웹 API에 접근하려면 웹 API를 호출하는 자바스크립트를 호출할 필요가 있다. 그래서 `Emscripten` 은 이 작업을 해주는 HTML과 자바스크립트 glue 코드를 같이 생성해준다.

엠스크립튼 툴킷은 LLVM 컴파일러 툴체인을 이용해 C/C++ 코드를 LLVM IR로 변환하고 엠스크립튼은 이를 다시 웹어셈블리 바이트코드로 변환한다. 웹어셈블리를 지원하는 브라우저는 웹어셈블리 파일을 로드해서 올바른 파일인지 확인한 뒤, 바이트코드를 기계어로 컴파일한다.

## 실습

### 환경설정

- Emscripten : [https://myevan.net/emscripten_get_started/](https://myevan.net/emscripten_get_started/)

엠스크립튼은 자동으로 C/C++ 코드의 main함수를 스타트 함수로 지정하기 때문에 모듈 다운로드인스턴스화가 완료되면 웹어셈블리 프레임워크에 의해 main함수가 자동으로 호출된다.

`emcc` 명령은 입력할 항목과 플래그가 많다. 자세한 플래그에 대한 설명은 다음 링크를 참고한다. 

- [https://emscripten.org/docs/tools_reference/emcc.html](https://emscripten.org/docs/tools_reference/emcc.html)

 

> 참고
>
> [https://blog.outsider.ne.kr/927](https://blog.outsider.ne.kr/927)
>
> [https://developer.mozilla.org/ko/docs/WebAssembly/Concepts](https://developer.mozilla.org/ko/docs/WebAssembly/Concepts)
> 
> [https://dongwoo.blog/2017/06/06/번역-웹어셈블리-모듈의-생성과-동작/](https://dongwoo.blog/2017/06/06/%eb%b2%88%ec%97%ad-%ec%9b%b9%ec%96%b4%ec%85%88%eb%b8%94%eb%a6%ac-%eb%aa%a8%eb%93%88%ec%9d%98-%ec%83%9d%ec%84%b1%ea%b3%bc-%eb%8f%99%ec%9e%91/)
>
> [https://duriepark.tistory.com/entry/도서WebAssembly-in-Action-1](https://duriepark.tistory.com/entry/%EB%8F%84%EC%84%9CWebAssembly-in-Action-1)
>
> [https://namu.wiki/w/LLVM](https://namu.wiki/w/LLVM)

