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

interface FindAlgorithm {
  find(global: boolean): void;
}

class FindNewsAlgorithm implements FindAlgorithm {
  find(global: boolean) {
    console.log(`find news ${global ? 'globally' : ''}`);
  }
}

class SearchFindAdapter implements SearchStrategy {
  findAlgorithm: FindAlgorithm;

  constructor(findAlgorithm: FindAlgorithm) {
    this.findAlgorithm = findAlgorithm;
  }

  search() {
    this.findAlgorithm.find(true);
  }
}
