## Loader

로더는 모듈을 입력받아 원하는 형태로 변환 후 새로운 모듈을 출력한다. 빌드 과정에서 다양한 전처리를 할 수 있다.

웹팩의 `module` 속성의 `rules`에서 각각의 로더를 등록할 수 있다.

- `test` : 로딩할 파일 지정 → 정규표현식으로 설정
- `loader` : 적용할 로더 설정 (하나의 로더를 적용하는 경우)
- `use` : 적용할 로더 설정 → 배열 or 객체 형태
  - 로더는 하나의 파일에 대해서 여러 개가 실행이 되는데, 순서는 배열의 뒤에서부터 순차적으로 실행이 된다.
- `webpack.config.js` 예시

```jsx
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

---

### Custom Loader 만들기

로더의 동작을 이해하기 위해 간단한 커스텀 로더를 만들어보자.

- `loaders/my-loader.js`

```jsx
module.exports = function myLoader(content) {
  console.log('run my-loader');

  return content.replace('console.log(', 'alert(');
};
```

로더가 파일을 읽고, 읽은 파일의 내용이 `content` 라는 인자에 문자열의 형태로 들어온다. 여기서는 `run my-loader` 를 출력하고, `console.log`로 찍히는 문자열을 `alert`으로 변경해주는 로더를 만들었다.

```jsx
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: path.resolve('./loaders/my-loader.js'),
      },
    ],
  },
};
```

방금 만든 로더를 설정한다. `.js` 로 끝나는 파일에 대해 `my-loader` 를 적용한다는 뜻이다. 이제 실행해보면 아래와 같이 출력된다.

```
run my-loader
run my-loader
```

<img width="185" alt="Screen Shot 2021-03-22 at 21 38 21 PM" src="https://user-images.githubusercontent.com/49153756/111997197-24789100-8b5e-11eb-884b-96e20a1cc435.png">

```jsx
class App {
  constructor($root) {
    this.$root = $root;
    this.render();
  }

  render() {
    this.$root.innerHTML = `<h1> Hello World! </h1>`;
    console.log('loader'); // -> alert('loader');
  }
}

export default App;
```

폴더 구조는 위와 같이 `js` 파일이 2개이기 때문에 `run my-loader` 가 두 번 출력된 것을 볼 수 있다. 또한, 번들 파일을 확인해보면 `console`로 대신 `alert`으로 변경된 모습이다.

<img width="280" alt="Screen Shot 2021-03-22 at 21 55 11 PM" src="https://user-images.githubusercontent.com/49153756/111997180-1fb3dd00-8b5e-11eb-8528-f72bde744e2e.png">

---

이와 같은 원리로 다양한 로더들이 존재하는데, 주로 사용되는 로더 몇 가지를 알아보자.

### `css-loader`, `sass-loader`, `style-loader`

`css-loader`, `sass-loader`는 각각 `CSS`, `SCSS`파일을 자바스크립트로 변환해주는 로더이다. 하지만, `css-loader`, `sass-loader` 만으로는 부족하다. 자바스크립트로 변환된 `CSS`, `SCSS` 를 동적으로 `DOM`에 추가해줘야 하는데, 이 역할을 `style-loader`가 수행한다.

```jsx
module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
```

이 때, `use` 에 배열 형태로 로더를 넣어주면 뒤에서부터 순서대로 실행이 되므로 `css-loader`, `sass-loader` 를 먼저 실행한 뒤, `style-loader` 가 실행되도록 해준다.

### `babel-loader`

```
npm i -D babel-loader @babel/core @babel/preset-env
```

`babel-loader`는 `webpack`이 `js` 파일들에 대해 `babel`을 실행하도록 만들어준다.

- `@babel/core` : `babel`이 실제 동작하는 코드
- `@babel/preset-env` : 브라우저에 필요한 `ECMAScript` 버전을 자동으로 파악해서 알아서 `polyfill`을 넣어준다.

```jsx
module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
		},
```

---

> 참고
>
> [https://webpack.js.org/concepts/loaders/](https://webpack.js.org/concepts/loaders/)
>
> [https://jeonghwan-kim.github.io/js/2017/05/15/webpack.html](https://jeonghwan-kim.github.io/js/2017/05/15/webpack.html) > [https://ibrahimovic.tistory.com/52](https://ibrahimovic.tistory.com/52)
>
> [https://beomi.github.io/2017/10/18/Setup-Babel-with-webpack/](https://beomi.github.io/2017/10/18/Setup-Babel-with-webpack/)
>
> [https://www.zerocho.com/category/Webpack/post/58aa916d745ca90018e5301d](https://www.zerocho.com/category/Webpack/post/58aa916d745ca90018e5301d)
>
> [https://webpack.js.org/api/cli/](https://webpack.js.org/api/cli/)
>
> [https://www.inflearn.com/course/프론트엔드-개발환경/dashboard](https://www.inflearn.com/course/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD/dashboard)
