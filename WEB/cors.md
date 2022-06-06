
# CORS

(`Cross-Origin Resource Sharing` - 교차 출처 리소스 공유)

요즘에는 웹 프론트 엔드(클라이언트)와 api 서버를 따로 구성하는 경우가 많은데, 이러한 경우에 프론트 엔드에서 다른 `Origin` 의 api 서버로 요청을 보내면 문제가 발생하게 된다. 이 문제를 `CORS` 문제라고 부른다.

여기서 말하는 `Origin` 이란, 아래의 세 가지 요소를 조합한 것을 말한다.

- URL 스키마 (`http`, `https`)
- hostname (`localhost`, [`naver.com`](http://naver.com) 등..)
- 포트 (`80` , `3000` , `8080` 등..)

## 배경

예전에는 브라우저에서 요청을 보내면, 서버는 해당하는 로직을 수행한 뒤 HTML 페이지를 렌더링 한 뒤 브라우저에 반환해주는 방식이 일반적이었다. 즉, 하나의 서버(동일한 `Origin`)에서 모든 작업이 수행되었다.

그렇기 때문에 웹 사이트에서 다른 서버로 요청을 보낸다는 것을 무언가 보안상 악의적인 행동을 하려는 것으로 생각했다. 그래서 브라우저에서는 같은 `Origin`이 아니라면 요청을 막아버리는 선택을 했던 것이고, 이것이 `SOP` 정책이다. 하지만 점점 웹 사이트에서 하는 일이 많아지면서 이러한 정책이 불편해지기 시작했고, 그에 따라 이러한 `SOP` 를 우회하기 위한 방법들이 나오기 시작했다.

그 방법들 중 하나가 `JSONP` 라는 방법인데, HTML의 script 태그의 경우에는 다른 `Origin` 의 파일을 불러오는 것이 가능했고 이 것을 리소스 요청을 주고받는데 우회적으로 사용한 것이었다. 스크립트를 불러오는 것처럼 사용을 하지만 실제로는 서버에서 데이터를 반환하는 용도로 사용을 했다.

이러한 방식의 우회로를 계속 두고 볼 수 없지만, 너무 수요가 많았기 때문에 공식적으로 특정한 제약조건 속에서 `cross-origin` 요청을 허용하도록 나온 정책이 `CORS` 이다.

이제 `SOP` 와 `CORS` 에 대해 하나씩 살펴보자.

## SOP (Same Origin Policy)

**SOP**는 동일 출처 정책으로 하나의 `Origin` 에서 로드된 문서나 스크립트가 다른 `Origin` 의 자원과 상호작용하지 못하도록 제한하는 것을 말한다. 이 정책에 의해 `XMLHttpRequest` 객체를 사용하는 등 `AJAX` 통신으로 어떠한 자원에 접근할 때 동일한 `Origin` 인 경우에만 접근이 가능하다.

![sop](https://user-images.githubusercontent.com/49153756/97000786-3552b580-1572-11eb-8bcd-f63b2b1a176a.png)


예를 들어, 나의 api 서버가 `http://localhost:3000` 에서 제공이 되고, 그 api를 `http://localhost:3000` 에서 호출할 수 없는 것이다. 호출을 한다면 다음과 같은 에러 메세지를 볼 수 있다.

```
XMLHttpRequest cannot load '[http://localhost:3000](http://localhost:3000/)'.
No 'Access-Control-Allow-Origin' header is present on the requested resource.
Origin '[http://localhost:8080](http://localhost:8080/)' is therefore not allowed access.
```

자, `SOP` 에 대해 알아봤으니 본론인 `CORS` 에 대해 알아보겠다.

## CORS (Cross-Origin Resource Sharing)

위에서 언급했던 `SOP` 에 대한 서버단의 해결책이 바로 `CORS` 이다. 이 정책의 특징은 서버에서 외부 요청을 허용할 경우 `AJAX` 요청이 가능해진다는 것이다. `MDN` 에서는 다음과 같이 정의한다.

```
**교차 출처 리소스 공유(Cross-Origin Resource Sharing, CORS)는 추가 HTTP 헤더를 사용하여,
한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권한을 부여하도록
브라우저에 알려주는 체제입니다. 웹 애플리케이션은 리소스가 자신의 출처(도메인, 프로토콜, 포트)와 다를 때
교차 출처 HTTP 요청을 실행합니다.**
```

한마디로 하자면, `Cross-Origin`에서  `Http Request`를 가능하게 해주는 표준 규약이다.

그렇다면 이제 `CORS` 상황에서 어떻게 동작할까?

## CORS 동작방식

`MDN` 에서는 `CORS` 동작 방식에 대해 세 가지 시나리오를 설명한다.

- `Simple Request` (단순 요청)
- `Preflight Request` (사전 요청)
- `Credentialed Request` (인증 정보를 포함한 요청)

각각의 시나리오를 알아보기 전에 이해를 돕기 위해 브라우저에서의 요청과 서버에서의 응답에 대한 헤더의 종류를 알아보고 가자.

### 클라이언트 요청 헤더 종류

- `Origin` : 요청을 보내는 페이지의 출처(도메인)
- `Access-Control-Request-Method` : 실제 요청하려는 메소드를 알려주기 위해 `preflight request` 시 사용된다.
- `Access-Control-Request-Headers` : 마찬가지로 실제 요청에 포함될 있는 헤더를 알려주기 위해 사용된다.

### 서버 응답 헤더 종류

- `Access-Control-Allow-Origin` : 허용할 출처 → 모든 `Origin` 에 대해 허용하려면 와일드카드 (`*`) 를 사용한다.
- `Access-Control-Expose-Headers` : 브라우저가 접근할 수 있는 헤더를 정의
- `Access-Control-Max-Age` : 브라우저에서 `preflight request` 요청 결과를 캐시할 수 있는 시간(초) 이렇게 퍼미션 정보를 캐싱해두면 브라우저는 일정 기간 동안 `preflight request` 없이 본 요청을 보낼 수 있다.
- `Access-Control-Allow-Credentials` : 클라이언트 요청이 쿠키를 통해서 자격 증명을 해야 하는 경우에 true. true를 응답 받은 클라이언트는 실제 요청 시 서버에서 정의된 규격의 인증 값이 담긴 쿠키를 같이 보내야 한다.
- `Access-Control-Allow-Methods` : 요청을 허용하는 메소드. 기본값은 `GET`,  `POST`이며 `preflight request` 에 대한 응답으로 사용되고, 클라이언트에서의 요청이 이 헤더에 포함되는 메서드인 경우 실제 요청을 보낸다.
- `Access-Control-Allow-Headers` : 실제 요청 시 사용할 수 있는 헤더

### Simple Request

`Simple Request` 는 아래의 세 가지 조건을 모두 만족할 때 가능한 요청이다.

1. 요청 메서드가 `GET` `POST` `HEAD` 중 하나인 경우
2. `POST` 메서드라면, `Content-Type` 이 아래 중 하나여야 한다.
    - `application/x-www-form-urlencoded`
    - `multipart/form-data`
    - `text/plain`
3. `CORS-safelisted request-header`로 정의된 헤더 외에 커스텀 헤더를 사용하면 안된다.

하지만 위의 조건을 모두 만족하는 경우는 사실 드물다. 일반적으로 `HTTP API` 는 `Content-Type` 으로 `application/json` 타입을 가지도록 설계를 하고, JWT와 같은 토큰 방식의 인증에서는 `Authorization` 헤더를 사용하여 사용자 인증이 진행되는데, 위에서 말한 조건의 헤더에 포함되지 않기 때문이다.

![simple](https://user-images.githubusercontent.com/49153756/97000918-734fd980-1572-11eb-9906-24fbd3f606bc.png)
`Simple Request` 는 바로 본 요청을 서버에 보낸 후, 서버의 응답 헤더에 `Access-Control-Allow-Origin` 과 같은 값을 보내주면 그 때 브라우저가 `CORS` 정책의 위반 여부를 검사하는 방식이다.

### Preflight Request

이제 일반적으로 `CORS` 상황에서 가장 많이 마주하게 되는 시나리오를 보자. 위에서 언급한 `Simple Request` 의 조건에 만족하지 않는 경우에는 `Preflight Request` 방식으로 진행이 되는데, 이 방식은 `Simple Request` 처럼 바로 본 요청을 보내지 않고 먼저 `Preflight Request` 라고 하는 예비 요청을 먼저 보내게 된다.

아래는 최근에 가계부 미션 때 만들었던 프로젝트의 `Preflight Request` 를 흐름도로 간단하게 그려보았다.

![preflight](https://user-images.githubusercontent.com/49153756/97000912-71861600-1572-11eb-950b-ab23f8cc5ad4.png)

자바스크립트에서 `fetch API` 를 사용하면 먼저 `Preflight Request` 을 보내는데,  `OPTIONS` 라는 HTTP 메서드를 사용한다. 이 때, 헤더에 본 요청에서 어떤 메서드를 사용하고, 어떤 헤더를 사용할 것인지에 대한 정보를 담아 예비 요청을 보내면 서버는 어떤 메서드를 허용하고, 어떤 헤더를 허용하는지 정보를 담아 응답한다.

브라우저는 사용할 메서드와 헤더가 허용되는지 응답 받은 정보와 비교하여 본 요청을 보낼지 판단하고, 문제가 없다면 본 요청을 보내게 된다. 이 후 본 요청이 수행되는 과정은 위의 `Simple Request` 와 동일하게 진행된다.

### Credentialed Request

마지막 시나리오는 `Cookie` 나 인증 관련한 정보가 포함된 요청을 사용하는 방법이다. 자바스크립트를 이용해 보내는 `cross-origin` 요청의 경우 기본적으로 쿠키나 인증 정보와 같은 **자격 증명**이 함께 전송되지 않는다.

이 때, `XMLHttpRequest` 를 사용하는 경우 `withCredentials` 속성을 `true` 로 설정해주면 되고, `fetch API` 를 사용하는 경우  `Request()` 의 `credentials` 옵션을 설정해주면 된다.

- `credentials` 에는 다음과 같은 옵션을 설정할 수 있다.
    - `omit` : 절대로 cookie 들을 전송하거나 받지 않는다.
    - `same-origin` : URL이 호출 script 와 동일 출처(same origin)에 있다면, user credentials (cookies, basic http auth 등..)을 전송한다. (기본값)
    - `include` : cross-origin 호출이라 할지라도 언제나 user credentials (cookies, basic http auth 등..)을 전송한다.

```jsx
const response = await fetch(url, {
    method,
    mode: "cors",
    credentials: "include",
    headers,
    body,
  });
```

위와 같이 `fetch API` 의 옵션에 `include` 를 설정해주면 해당 `url` 에 해당하는 쿠키를 함께 보낼 수 있게 된다.  이 경우에 정상적으로 응답을 받기 위해서는 서버 측에서 응답 헤더로 `Access-Control-Allow-Credentials` 에 `true` 값을 넣어주어야 한다. 그렇지 않으면 브라우저는 응답을 거부해 버린다.

![credentialed](https://user-images.githubusercontent.com/49153756/97022531-30e8c580-158f-11eb-8e36-5c72558845e6.png)

또한, `include` 옵션인 경우 어떤 `Origin` 에서 어떤 요청이 왔는지에 대한 정보를 서버가 신뢰하기 위해서   `Access-Control-Allow-Origin` 에 와일드 카드인 `*` 를 사용할 수 없고, 명시적으로 허용할 `Origin` 의 정보를 넣어주어야 한다.

`Express` 의 경우 서버 측에서 다음과 같이 설정할 수 있다. (`cors` 미들웨어를 사용)
  - [https://github.com/expressjs/cors](https://github.com/expressjs/cors)

```jsx
app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
```

### 요약

- `CORS` 는 같은 `Origin` 에서만 자원 공유가 가능하다는 `SOP` 의 불편함에서 나온 정책이다.
- `CORS` 의 동작 방식에는 `simple request` , `preflight request` , `credentialed request` 가 있다.
    - `simple request` 는 특정한 조건이 갖춰진 경우에만 가능한 요청이다.
    - `preflight request` 는 본 요청을 보내기 전에 사전 요청을 보내어 이 요청을 보내는 것이 안전한지 확인하는 과정이 추가된다.
    - `credentialed request` 는 쿠키나 인증 관련 정보가 포함된 요청으로 프론트와 서버에서 각각 추가적인 설정을 해주어야 한다.

> 참조
> [https://ko.javascript.info/fetch-crossorigin](https://ko.javascript.info/fetch-crossorigin)
> [https://developer.mozilla.org/ko/docs/Web/HTTP/CORS](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)
> [https://evan-moon.github.io/2020/05/21/about-cors/](https://evan-moon.github.io/2020/05/21/about-cors/)
> [https://sjh836.tistory.com/93](https://sjh836.tistory.com/93)
> [https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)
> [https://developer.mozilla.org/ko/docs/Web/API/Request/Request](https://developer.mozilla.org/ko/docs/Web/API/Request/Request)
