## Plugin

로더가 파일 단위로 처리하는 반면, 플러그인은 번들된 결과물을 처리한다. **번들된 결과물**을 난독화 한다거나 특정 텍스트를 추출하는 용도로 사용된다.

### `Custom Plugin` 만들기

웹팩 플러그인은 `apply` 메소드를 가지고 있는 자바스크립트 객체다. 이 `apply` 메소드는 웹팩 컴파일러에 의해 호출 되며, 전체 컴파일 라이프사이클에 접근한다.

- `plugins/my-plugin.js`

```tsx
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('My Plugin', stats => {
      console.log('My Plugin Done');
    });
  }
}

module.exports = MyPlugin;
```

사용된 `hooks`와 `tap` 메소드에 따라 플러그인은 다양한 방식으로 동작한다.

번들링된 결과물에 접근하기 위해서는 `compiler` 객체와 `compilation`객체가 필요하다.

- [`compiler`](https://webpack.js.org/api/compiler-hooks/) : 모든 옵션이 `CLI` 또은 `Node API`를 통해 전달되는 `compilation instance`를 생성하는 메인 엔진이다.
- [`compilation`](https://webpack.js.org/api/compilation-hooks/) : `compiler`에 의해 사용되며, 새로운 `compilations`를 만들거나 `build` 할 때 사용한다.
- 위에서 사용된 `done` 은 컴파일이 완료되면 실행되는 훅이다.
  - 이외에도 [다양한 훅](https://webpack.js.org/api/compiler-hooks/#hooks)이 있다.
- `tap` 은 동기적으로 동작하는 것에 사용하고, `tapAsync` 나 `tapPromise` 는 비동기를 처리할 때 사용한다.

```tsx
const MyPlugin = require('./plugins/my-plugin');

module.exports = {
  plugins: [new MyPlugin()],
};
```

위와 같이 방금 만든 플러그인을 추가하면 된다. 플러그인은 인자와 옵션을 사용할 수 있으므로, `plugins` 속성에 `new` 로 인스턴스를 생성해 전달한다.

<img width="211" alt="Screen Shot 2021-03-28 at 03 25 17 AM" src="https://user-images.githubusercontent.com/49153756/112731283-a3643400-8f79-11eb-9e84-df285e6f5f85.png">

---

이제 주로 사용되는 플러그인들을 알아보자.

### `HtmlWebpackPlugin`

`HtmlWebpackPlugin` 은 `HTML` 파일을 후처리 하는데 사용하며, 빌드타임의 값을 넣거나 코드를 압축한다.

```tsx
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
```

- `template` : 경로를 지정해주면 빌드한 결과물을 자동으로 로딩하는 코드를 주입해 준다.
- `templateParameters` : 템플릿에 주입할 파라미터 변수들을 객체 형태로 설정할 수 있다.
- 추가적인 다양한 옵션은 [여기](https://github.com/jantimon/html-webpack-plugin#options)서 확인할 수 있다.

### `CleanWebpackPlugin`

`CleanWebpackPlugin` 은 빌드 이전 결과물을 제거하는 플러그인이다.

```tsx
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

---

> 참고
>
> [https://webpack.js.org/contribute/writing-a-plugin/](https://webpack.js.org/contribute/writing-a-plugin/)
>
> [https://ibrahimovic.tistory.com/53](https://ibrahimovic.tistory.com/53)
>
> [https://howdy-mj.me/node/webpack-basic-2/](https://howdy-mj.me/node/webpack-basic-2/)
>
> [https://infoscis.github.io/2018/01/24/develop-webpack-plugin/](https://infoscis.github.io/2018/01/24/develop-webpack-plugin/)
