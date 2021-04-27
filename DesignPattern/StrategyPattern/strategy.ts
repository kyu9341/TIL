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
