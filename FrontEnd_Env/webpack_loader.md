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

### `Custom Loader` 만들기

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
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
```

### `file-loader`

- 파일을 모듈 형태로 지원, `webpack output`에 파일을 옮겨줌

```jsx
module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          publicPath: './dist',
        },
      },
    ],
  },
```

- `publicPath` : `file-loader`가 처리하는 파일을 모듈로 사용했을 때 경로 앞에 추가되는 문자열
- `name` : `file-loader` 가 `file`을 `output`에 복사할 때 사용되는 파일명
  - `name` 속성에 사용되는 `format`은 [**여기**](https://github.com/webpack/loader-utils#interpolatename)에서 자세히 확인할 수 있다.
    - `[name]` : `resource`의 기본 이름
      - → ex) `abc.png` 라는 파일이면 `abc`
    - `[ext]` : `resource`의 확장자명
    - `[hash]` : 해쉬값 (브라우저 캐시 갱신을 위해 사용)
      - 여기서는 쿼리스트링으로 줘서 파일명은 기존 파일명과 동일하면서 리소스 요청 시 캐싱되지 않도록 사용
      - 브라우저 캐시 때문에 정적 리소스가 변경되어도 반영되지 않는 문제가 생길 수 있기 때문

### `url-loader`

- [`Data URI Scheme`](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)를 이용하여 이미지를 `Base64`로 인코딩하여 문자열 형태로 소스코드에 넣는 처리를 자동화하는 `loader`

많은 이미지 사용은 매번 이미지를 네트워크 요청을 통해 가져와야 하기때문에 네트워크 비용이 커진다. 만약 한 페이지 내에서 작은 이미지 여러 개를 사용한다면 `Data URI Scheme`를 사용하는 방법이 좋을 것이다. 이미지를 `Base64`로 인코딩하여 번들에 넣는 방식인데, 이렇게 하면 추가적인 `HTTP` 요청이 발생하지 않아 네트워크 비용을 절감할 수 있다.

(너무 큰 이미지라면 번들 사이즈를 키워 초기 로딩 성능에 영향을 줄 수 있을 것 같다.)

```jsx
module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?[hash]',
          publicPath: './dist',
          limit: 10000, // 10KB
        },
      },
    ],
  },
```

- `limit` : `byte` 단위로 제한을 두어 해당 `byte` 미만인 경우 `url-loader`가 동작한다.

> `webpack5` 부터는 `url-loader`, `file-loader`, `raw-loader`는 추가적으로 로더를 추가하지 않아도 각각 `asset/inline` , `asset/resource`, `asset/source` 로 `assetModule`로서 사용이 가능하다고 한다. [(참고)](https://webpack.js.org/guides/asset-modules/)

---

> 참고
>
> [https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html](https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html)
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
>
> [http://blog.naver.com/PostView.nhn?blogId=jonghong0316&logNo=221988247758&parentCategoryNo=&categoryNo=17&viewDate=&isShowPopularPosts=true&from=search](http://blog.naver.com/PostView.nhn?blogId=jonghong0316&logNo=221988247758&parentCategoryNo=&categoryNo=17&viewDate=&isShowPopularPosts=true&from=search)
>
> [https://d0gf00t.tistory.com/15](https://d0gf00t.tistory.com/15)
