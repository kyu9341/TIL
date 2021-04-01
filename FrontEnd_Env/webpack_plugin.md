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

### `BannerPlugin`

번들 결과물에 빌드 정보나 커밋 버전 등을 추가할 수 있는 플러그인이다. 웹팩에서 기본으로 제공해준다.

```tsx
const webpack = require('webpack');
const childProcess = require('child_process');

module.exports = {
  plugins: [
    new webpack.BannerPlugin({
      banner: `
      Build Date: ${new Date().toLocaleString()}
      Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
      `,
    }),
  ],
};
```

- `banner` 속성에 문자열이나 함수를 전달할 수 있다. 함수로 전달하는 경우 반환 값이 들어가게 된다.
- `child_process.execSync(command[, options])`
  - 자식 프로세스를 생성하여 CLI 명령을 동기로 실행시킨다.
  - 현재 커밋 버전을 받아오기 위해 사용
- 결과 (`main.js`)

```tsx
/*!
 *
 *       Build Date: 2021-4-1 4:50:57 ├F10: PM┤
 *       Commit Version: 0d06062
 *
 *
 */
```

### `DefinePlugin`

`DefinePlugin` 도 `BannerPlugin` 과 마찬가지로 웹팩에서 제공해주는 플러그인이므로 따로 설치가 필요 없다.

`DefinePlugin` 은 빌드 타임에만 사용할 전역 변수를 생성해주는 플러그인이다. 주로 `development` 모드와 `production` 모드를 구분하여 다른 동작을 수행하게 할 때 사용된다.

```tsx
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      TWO: '1+1',
      SERVICE_URL: JSON.stringify('https://dev.example.com'),
    }),
  ],
};
```

직접 코드의 형태로 문자열을 넣기 때문에 (ex: `TWO: '1+1'` 을 넣으면 `2` 로 계산되어 할당됨) `string` 형의 데이터로 사용하고 싶다면 `'"1+1"'` 처럼 사용하거나, `JSON.stringify('1+1')` 와 같이 사용해야 한다.

```tsx
console.log(`SERVICE_URL: ${SERVICE_URL}`);
```

<img width="514" alt="Screen Shot 2021-04-01 at 18 06 58 PM" src="https://user-images.githubusercontent.com/49153756/113272109-3f919080-9316-11eb-8e14-6d029023a72a.png">

위와 같이 번들 파일을 보면 해당 문자열로 치환되어 있는 모습을 볼 수 있다.

### `MiniCssExtractPlugin`

`MiniCssExtractPlugin` 은 `CSS`를 별도의 번들링된 `CSS` 파일로 추출하게 해주는 플러그인이다.

```
npm install -D mini-css-extract-plugin
```

`development` 모드에서는 굳이 적용하지 않아도 되니(빌드 속도가 느려질 수 있음) `production` 모드인 경우에만 사용하도록 설정을 추가해보자.

```tsx
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === 'production'
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ],
};
```

- `filename` 에 설정한 값으로 `output` 경로에 `CSS` 파일이 생성된다.

`MiniCssExtractPlugin` 을 사용하려면 `style-loader` 대신 `MiniCssExtractPlugin` 에서 제공하는 로더를 사용해야 한다. 로더도 마찬가지로 `production` 환경에서만 사용하도록 설정을 추가하자.

```tsx
module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader // production mode
            : 'style-loader', // development mode
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
```

<img width="149" alt="Screen Shot 2021-04-02 at 01 15 36 AM" src="https://user-images.githubusercontent.com/49153756/113326860-31169980-9355-11eb-9d3e-6c74fb6aa52d.png">

위와 같이 설정 후 `production` 모드로 빌드하게 되면 `main.css` 파일로 분리되어 번들링되는 것을 확인할 수 있다. 만약 모드 설정이 적용되지 않는다면 아래와 같이 `CLI`에서 추가해보자.

- `package.json`

```json
"scripts": {
    "start": "webpack serve --open --config webpack.config.js",
    "build": "NODE_ENV=production webpack --config webpack.config.js",
    "dev": "NODE_ENV=development webpack --config webpack.config.js",
  },
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
>
> [https://www.daleseo.com/webpack-plugins-define-environment/](https://www.daleseo.com/webpack-plugins-define-environment/)
>
> [https://webpack.js.org/plugins/define-plugin/](https://webpack.js.org/plugins/define-plugin/)
>
> [https://velog.io/@cckn/windows%EC%97%90%EC%84%9C-NODEENV%EB%A5%BC-%EB%B0%94%EA%BF%80-%EB%95%8C%EC%97%90%EB%8A%94-cross-env%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%9E%90](https://velog.io/@cckn/windows%EC%97%90%EC%84%9C-NODEENV%EB%A5%BC-%EB%B0%94%EA%BF%80-%EB%95%8C%EC%97%90%EB%8A%94-cross-env%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%9E%90)
