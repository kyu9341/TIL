# [NEXT js](https://nextjs.org/)

React의 SSR(`Server Side Rendering`)을 쉽게 구현할 수 있게 도와주는 프레임워크이다.

# [Page](https://nextjs.org/docs/basic-features/pages)

`Next.js`에서 `page`는 `pages` 디렉토리에서 `export`된 `js`, `jsx`, `ts`, `tsx` 파일이다. 각 페이지는 파일 이름에 따라 경로와 연결된다. 예를 들어, 아래와 같이 `pages/about.js` 를 생성하였다면 `/about` 으로 접근이 가능하다.

```jsx
function About() {
  return <div>About</div>;
}

export default About;
```

### Pages with Dynamic Routes

`Next.js`는 동적 경로를 지원한다. 예를 들면, `page/post/[id].js` 로 생성한다면 `posts/1` , `posts/2` 와 같이 접근할 수 있다.

→ [Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)

## `Pre-rendering`

기본적으로 `Next.js`는 모든 페이지를 `pre-rendering`한다. 클라이언트 측 `JavaScript`에서 작업을 실행하기 전에 각 페이지에 대해 미리 `HTML`을 생성한다. `pre-rendering` 은 더 나은 성능과 SEO를 가져올 수 있다.

생성된 각 `HTML`은 해당 페이지에 필요한 최소한의 `JavaScript` 코드와 연결되고, 브라우저에서 페이지를 로드하면 해당 `JavaScript`가 실행되며 그 페이지는 완전히 interactive해진다.

### `Pre-rendering`의 두가지 형태

`Next.js`에는 **`Static Generation`** 과 **`Server-side Rendering`** 의 두 가지 `pre-rendering` 형태가 있다. 차이는 페이지에 대한 HTML을 생성할 때이다.

- **`Static Generation`** (권장) : HTML은 빌드 시점에 생성되며 각 요청에 재사용된다.
- **`Server-side Rendering`** : 각 요청에 대해 HTML이 생성된다.

두 가지 방식 중에 선택할 수 있는데, 두 방식을 모두 사용하여 하이브리드로 사용할 수도 있다. 대부분의 페이지에는 `Static Generation`을 사용하고, 다른 페이지에는 `Server-side Rendering`을 적용하는 것도 가능하다.

공식 문서에서는 성능상의 이유로 `Static Generation` 을 권장하지만(추가 설정 없이 CDN 캐싱 가능), 경우에 따라 `Server-side Rendering` 이 필수적일 수도 있다. (예를 들면, 사용자마다 매번 다른 페이지를 보여줘야 하는 경우)

## `Static Generation`

`Static Generation` 을 사용하는 경우 HTML을 빌드 시점(`next build` 를 실행했을 때)에 생성된다.

### `Static Generation` without data

기본적으로 Next.js는 데이터를 가져오지 않고 `Static Generation` 을 통해 페이지를 `pre-rendering`한다.

```jsx
function About() {
  return <div>About</div>;
}

export default About;
```

위 페이지는 `pre-rendering` 할 외부 데이터를 가져올 필요가 없다. 이 경우 빌드 시간 동안 페이지 당 하나의 HTML 파일을 생성한다.

### `Static Generation` with data

`pre-rendering` 을 위해 외부 데이터를 가져와야 하는 경우 두 가지 시나리오가 있으며 상황에 따라 하나의 시나리오를 적용하거나 두 가지 모두 적용될 수 있다.

1. 페이지의 내용이 외부 데이터에 의존하는 경우 : `getStaticProps` 사용
2. 페이지 경로가 외부 데이터에 의존하는 경우 : `getStaticPaths` 사용 (일반적으로 `getStaticProps` 에 추가적으로 사용)

**1번 시나리오**

ex) 블로그 페이지에서 게시글 목록을 불러와야 하는 경우

```jsx
// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
function Blog({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li>{post.title}</li>
      ))}
    </ul>
  );
}

export default Blog;
```

`pre-rendering`에서 이 데이터를 가져오기 위해 동일한 파일에서 `getStaticProps` 라는 이름으로 `export`되는 `async` function을 호출할 수 있게 해준다. 이 함수는 빌드 시점에 호출되며 `pre-rendering` 할 때 가져온 데이터를 페이지의 `props` 로 전달할 수 있다.

```jsx
function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  };
}

export default Blog;
```

→ [자세한 동작](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)

**2번 시나리오**

Next.js는 동적 경로를 지원하는데, `pages/posts/[id].js` 라는 파일을 생성했다면 `id` 에 해당하는 게시글을 보여줄 수 있다. `posts/1` 로 접근하면 `id` 가 1인 게시글을 볼 수 있다.

ex) `id: 1`인 게시글만 DB에 존재하는 경우, 빌드 시점에 `posts/1` 을 `pre-rendering`하겠지만 이후에 `id: 2`인 게시글이 추가되었다면 `posts/2`도 `pre-rendering`되어야 한다.

이와 같이 페이지 경로가 외부 데이터에 의존한다면 `getStaticPaths` 라는 `async` function을 `export` 할 수 있다. 이 함수는 빌드 시점에 호출되며 `pre-rendering`할 경로를 지정할 수 있다.

```jsx
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map(post => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}
```

또한, `pages/posts/[id].js` 의 `getStaticProps` 에서 위에서 얻은 `id`를 사용하여 해당 게시글의 데이터를 가져올 수 있다.

```jsx
function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  // Pass post data to the page via props
  return { props: { post } };
}

export default Post;
```

→ [자세한 동작](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation)

### `Static Generation`을 사용해야 하는 경우

주로 다음과 같은 유형의 페이지에 `Static Generation`을 사용한다.

- Marketing pages
- Blog posts
- E-commerce product listings
- Help and documentation

하지만 사용자의 요청에 앞서 미리 페이지를 렌더링할 수 있는 경우가 아니라면 `Static Generation` 은 좋은 방법이 아니다. 이러한 경우에는 다음의 방법들을 사용할 수 있다.

- Use **`Static Generation`** with **`Client-side Rendering`** : 일부 `pre-rendering`을 건너 뛰고 CSR을 통해 자바스크립트로 렌더링한다. → [자세한 내용](https://nextjs.org/docs/basic-features/data-fetching#fetching-data-on-the-client-side)
- Use **`Server-Side Rendering`** : 각 요청에 대해 `pre-rendering`한다. CDN에서 캐싱할 수 없기 때문에 속도는 `Static Generation`보다 느리지만 `pre-rendering`된 페이지는 항상 최신 상태이다.

## `Server-Side Rendering`

페이지에서 `Server-Side Rendering` 을 사용한다면 각 요청마다 HTML을 생성한다.

`Server-Side Rendering` 을 사용하려면 `getServerSideProps` 라는 `async` function을 `export`해야 한다. 이 함수는 모든 요청에서 서버에 의해 호출된다.

ex) 페이지에서 자주 변경되는 데이터를 외부 API에서 가져와 렌더링해야 하는 경우 `getServerSideProps` 를 통해 데이터를 가져와 `Page`에 전달할 수 있다.

```jsx
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default Page;
```

`getServerSideProps`는 `getStaticProps` 와 비슷하지만 `getServerSideProps`는 빌드 시점이 아니라 모든 요청에서 실행된다는 점이 다르다.

→ [자세한 동작](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)

---

> 참조
>
> <https://nextjs.org/>
