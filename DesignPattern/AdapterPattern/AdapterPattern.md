# `Adapter Pattern` (어댑터 패턴)

어댑터 패턴은 클래스의 인터페이스를 사용자가 기대하는 다른 인터페이스로 변환하는 패턴으로, 인터페이스가 다른 객체들이 같은 형식 아래 작동할 수 있도록 하는 역할을 한다.

[`StrategyPattern`](https://github.com/kyu9341/TIL/blob/main/DesignPattern/StrategyPattern/StrategyPattern.md)의 예제를 다시 보자.

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
    console.log('SEARCH IMAGE');
  }
}

class SearchStrategyVideo implements SearchStrategy {
  search() {
    console.log('SEARCH VIDEO');
  }
}
```

기존의 검색 전략들에서 인터페이스가 다른 새로운 전략이 추가된 상황이다.

```tsx
interface FindAlgorithm {
  find(global: boolean): void;
}

class FindNewsAlgorithm implements FindAlgorithm {
  find(global: boolean) {
    console.log(`find news ${global ? 'globally' : ''}`);
  }
}
```

위와 같이 `FindAlgorithm` 라는 인터페이스를 가지는 뉴스 검색 알고리즘을 하나의 새로운 전략으로 추가하고 싶다.

```tsx
class SearchFindAdapter implements SearchStrategy {
  findAlgorithm: FindAlgorithm;

  constructor(findAlgorithm: FindAlgorithm) {
    this.findAlgorithm = findAlgorithm;
  }

  search() {
    this.findAlgorithm.find(true);
  }
}
```

기존의 `SearchStrategy`인터페이스를 가지는 `SearchFindAdapter`라는 어댑터를 생성하고 생성자에서 `FindAlgorithm` 인터페이스의 구현체를 받는다. 이후 `search()` 메서드에서 해당 검색 알고리즘을 수행하도록 하여 기존의 인터페이스를 만족하도록 할 수 있다.

---

> 참고
>
> [https://ko.wikipedia.org/wiki/어댑터\_패턴](https://ko.wikipedia.org/wiki/%EC%96%B4%EB%8C%91%ED%84%B0_%ED%8C%A8%ED%84%B4)
>
> [https://www.yalco.kr/29_oodp_1/](https://www.yalco.kr/29_oodp_1/)
>
> [https://dev-momo.tistory.com/entry/Adapter-Pattern-어댑터-패턴](https://dev-momo.tistory.com/entry/Adapter-Pattern-%EC%96%B4%EB%8C%91%ED%84%B0-%ED%8C%A8%ED%84%B4)
