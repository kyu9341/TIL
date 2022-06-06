> OAuth는 인터넷 사용자들이 비밀번호를 제공하지 않고 다른 웹사이트 상의 자신들의 정보에 대해 웹사이트나 애플리케이션의 접근 권한을 부여할 수 있는 공통적인 수단으로서 사용되는, 접근 위임을 위한 개방형 표준이다.
> 이 매커니즘은 여러 기업들에 의해 사용되는데, 이를테면 아마존, 구글, 페이스북, 마이크로소프트, 트위터가 있으며 사용자들이 타사 애플리케이션이나 웹사이트의 계정에 관한 정보를 공유할 수 있게 허용한다.
> 출처 : [Wikipedia](https://ko.wikipedia.org/wiki/OAuth)

먼저, github에서 App 설정을 해줘야 한다.

- Github App의 우측 상단 내 Profile 사진을 클릭하고 Settings > Developers settings > OAuth Apps > Settings 메뉴를 클릭
- `New OAuth App` 버튼을 클릭하여 새로운 OAuth App을 만든다.
  - 최초 등록하는 경우, 버튼에는 `Register a new application`이라고 표시된다.

![Screen Shot 2020-10-27 at 23 00 21 PM](https://user-images.githubusercontent.com/49153756/97699025-d69ab800-1aec-11eb-9dda-11031203c2a0.png)

- OAuth App 생성 화면에서 Application name, Homepage URL, Application description, Authorization callback URL을 입력한 후 `Register application`을 눌러 OAuth App을 생성을 완료한다.
- Homepage URL 에는 구동시킬 페이지의 주소를 적으면 된다.
- callback URL 은 나의 깃허브 계정을 이 앱에서 사용하겠다는 인증 등록에 대한 허가의 증거로 반환 값을 줄 URL을 설정한다. - 나는 SPA로 구현할 것이기 때문에 프론트 서버 주소를 입력했다.

---

서버측에서 `.env` 에 `Client ID` 와 `Client Secret` 을 넣어두고 사용했다.

인증 흐름은 다음과 같다.

1. `get https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={http://...}` 형태로 `Client ID` 와 다른 추가적인 정보(선택)을 담아 요청을 보내면 github 로그인을 위한 페이지로 이동한다.
2. `get [http://127.0.0.1:8080/users/github/callback?code=ed565b1a5110ee889459](http://127.0.0.1:8080/users/github/callback?code=ed565b1a5110ee889459)` 과 같은 형태로 code 를 보내주게 됨
3. 받은 코드를 사용해서 `post https://github.com/login/oauth/access_token` 로 정보를 요청

- `header Accept : application/json` 헤더 설정
- `param code : {받은 코드}`
- `param client_secret : {어플리케이션 정보에서 가져옴}`
- `param client_id : {어플리케이션 정보에서 가져옴}`
- 정상 처리가 되면 status 200 으로 `{access_token: "xed9x8e949fed8a8c9549809e84968be98712207", token_type: "bearer"}` 과 같은 정보가 날라옴. 이 access_token 을 통해서 여러 API 에 접근 가능해짐

이전에 `passport-kakao` 를 사용했는데, CORS 문제로 인해 서버 측에서는 기능 구현을 했지만 클라이언트 측으로 원하는 데이터를 보낼 수 없었다. 그래서 이번에는 `passport-github` 을 사용하지 않고 직접 구현했다.

먼저 위의 1번의 동작을 수행하기 위해 서버의 `.env` 파일에 있는 `client_id` 가 필요하다.

`github login` 버튼을 누르면 서버에 get 요청을 보내고, 서버에서는 `client_id` 를 포함한 url을 응답해주었다. 응답 받은 url로 `location.href` 를 통해 이동하고, github 로그인을 수행하면 위에서 설정했던 `callback URL` 로 이동한다.

리액트에서 라우팅 설정을 하여 `callback URL` 로 접근한 경우 빈 컴포넌트에서 `query string` 에 들어있는 `code` 값을 담아 서버에 `post` 요청을 보낸다.

서버에서 클라이언트로부터 받은 `code` 와 `.env` 에 있는 `Client ID` , `Client Secret` 총 세 가지 정보를 담아 위의 3번 과정을 수행한다.

그럼 서버에서 github 으로 `post` 요청을 보내 `access_token` 을 응답으로 받게 된다. 다시 이 `access_token` 을 헤더의 `Authorization` 에 넣어 [`https://api.github.com/user`](https://api.github.com/user) 로 요청을 보내면 해당하는 user 정보를 받아 올 수 있다.

위 과정은 `passport` 없이 구현을 했다가 `passport-custom` 을 사용하여 로직을 옮기고 미들웨어로 사용했다.

그렇게 받아온 데이터에서 필요한 정보를 사용하면 된다. 아래는 사용할 수 있는 데이터이다.

```
{ login: 'kwon',
  id: 12344567,
  node_id: 'MDQ6VXNlcjMxMjEyMTgw',
  avatar_url: 'https://avatars2.githubusercontent.com/u/31212180?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/opzyra',
  html_url: 'https://github.com/opzyra',
  followers_url: 'https://api.github.com/users/kwon/followers',
  following_url: 'https://api.github.com/users/kwon/following{/other_user}',
  gists_url: 'https://api.github.com/users/kwon/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/kwon/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/kwon/subscriptions',
  organizations_url: 'https://api.github.com/users/kwon/orgs',
  repos_url: 'https://api.github.com/users/kwon/repos',
  events_url: 'https://api.github.com/users/kwon/events{/privacy}',
  received_events_url: 'https://api.github.com/users/kwon/received_events',
  type: 'User',
  site_admin: false,
  name: 'Yeongeon Kwon',
  company: null,
  location: 'Seoul, Korea',
  email: null,
  hireable: null,
  bio: 'Web Developer',
  public_repos: 12,
  public_gists: 0,
  followers: 4,
  following: 10,
  created_at: '2017-08-21T13:05:08Z',
  updated_at: '2019-10-27T11:08:28Z'
}
```

나는 여기서 `login` 에 담긴 username과 `avatar_url` 의 프로필 이미지만 사용했다.

username을 nickname으로 사용했고, 이미 존재하는 nickname인 경우 바로 해당 정보로 JWT토큰을 발급하고, 없는 사용자라면 회원가입 처리를 진행하고 토큰을 발급했다.

전체적인 흐름을 보면 아래와 같다.

![githuboauth](https://user-images.githubusercontent.com/49153756/97699031-d8fd1200-1aec-11eb-95bb-0844d5c0a00d.png)

### `GET /users/login/github`

response example

```
{
    "code": 200,
    "success": true,
    "url": "https://github.com/login/oauth/authorize?client_id=example"
}
```

### `POST /users/login/github`

request example

```
{
    "code": "abcdefg12345"
}
```

response example

```
{
    "code": 200,
    "success": true,
    "token": "eyJhbGciOiJIUzI4NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hb2UiOzJreXU5MzQxIiwiaWF0IjoxNjAzOTU1OTc0fQ.AFJ88Sn6vGv3bBOcK33HQbeoMhPBHsqm_o-53260Q6M",
    "id": 1,
    "nickname": "kyu9341"
}
```

> 참조
>
> [https://devhyun.com/blog/post/15](https://devhyun.com/blog/post/15)
>
> [https://gist.github.com/ninanung/2ad24c760e81401ed65f13f634a25e73](https://gist.github.com/ninanung/2ad24c760e81401ed65f13f634a25e73)
>
> [https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps](https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps)
>
> [https://developers-doc.nugu.co.kr/nugu-play/create-plays-with-play-builder/link-oauth20](https://developers-doc.nugu.co.kr/nugu-play/create-plays-with-play-builder/link-oauth20)
>
> [https://devhyun.com/blog/post/15](https://devhyun.com/blog/post/15)
