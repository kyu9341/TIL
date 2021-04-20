`Strategy Pattern` 은 런타임에 직접 수행할 알고리즘(또는 기능)들을 선택할 수 있게 해주는 패턴이다.

객체들이 수행할 행위 각각에 대해 클래스를 생성하고, 유사한 행위들을 캡슐화하는 인터페이스를 정의하여 객체의 행위를 동적으로 변경하고 싶은 경우 직접 행위를 수정하는 대신 전략을 바꿔 행위를 유연하게 확장하는 방법이다.

예를 들어, 검색 버튼이 있고 전체 검색, 이미지 검색, 영상 검색 등의 검색 타입이 있는 상황이라고 가정해보자. 타입스크립트로 코드를 간단히 작성해보았다.

```tsx
interface SearchStrategy {
  search(): void;
}

class SearchStrategyAll implements SearchStrategy {
  search() {
    console.log('SEARCH ALL');
  }
}

class SearchStrategyImage implements SearchStrategy {
  search() {
    console.log('SEARCH ALL');
  }
}

class SearchStrategyVideo implements SearchStrategy {
  search() {
    console.log('SEARCH ALL');
  }
}
```

`search()` 라는 메소드를 가지는 `SearchStrategy` 라는 인터페이스를 만들고 해당 인터페이스를 구현한 클래스들을 만들었다. 즉, 검색 전략을 전체 검색, 이미지 검색, 영상 검색으로 나누어 선택된 전략에 따른 검색을 수행할 수 있도록 하는 것이다.

```tsx
class SearchButton {
  parent: HTMLElement;
  target: HTMLButtonElement;
  searchStrategy: SearchStrategy;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.target = document.createElement('button');
    this.searchStrategy = new SearchStrategyAll();
  }

  addEventListener() {
    this.target.addEventListener('click', this.handleClick.bind(this));
  }

  setSearchStrategy(_searchStrategy: SearchStrategy) {
    this.searchStrategy = _searchStrategy;
  }

  handleClick() {
    this.searchStrategy.search();
  }
}
```

이제 위와 같이 검색 버튼에 현재 선택된 전략을 set해주면 입력받은 `SearchStrategy` 의 `search` 메소드를 호출하여 해당 전략에 맞는 검색을 수행하게 된다.

이렇게 전략 패턴을 사용하여 구현하게 되면 검색 타입을 변경하는 경우 전략만 변경해주면 되고, 새로운 검색 타입이 추가되거나 수정이 필요한 경우에는 새로운 전략을 추가하거나 특정 전략만 수정하여 유연하게 대처할 수 있다.

---

> 참고
>
> [https://www.youtube.com/watch?v=lJES5TQTTWE](https://www.youtube.com/watch?v=lJES5TQTTWE)
>
> [https://www.yalco.kr/29_oodp_1/](https://www.yalco.kr/29_oodp_1/)
