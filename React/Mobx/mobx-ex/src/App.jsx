import React from 'react';
import ReactDOM from 'react-dom';
import { observer, Provider } from 'mobx-react';
import Counter from './Counter';
import CounterStore from './CounterStore';
import {
  observable,
  computed,
  action,
  configure,
  autorun,
  comparer,
  when,
} from 'mobx';

const counter = new CounterStore();
const observableMap = observable.map({ key1: 'aa' });

configure({
  computedRequiresReaction: true,
});
/* 

const num = observable.box(1);
console.log(num.get());

class OrderLine {
  @observable price = 0;
  @observable amount = 1;

  constructor(price) {
    this.price = price;
    // When computed total changes
    // cache value to this.total
    autorun(() => {
      this.total = this.computedTotal;
    });
  }

  @computed({ keepAlive: true }) get computedTotal() {
    console.log('run');
    return this.price * this.amount;
  }
}

const Ol = new OrderLine(2.0);

setInterval(() => {
  console.log(Ol.total);
}, 1000);

setTimeout(() => {
  Ol.price = 10;
}, 5000);

 */
class Ticker {
  @observable tick = 0;

  @action
  increment() {
    console.log(this);
    this.tick++; // 'this' will always be correct
  }
}

const ticker = new Ticker();
// setInterval(ticker.increment, 1000);

const arr = observable.array([1, 2]);

when(
  () => arr.reduce((acc, cur) => acc + cur, 0) > 10,
  () => {
    console.log(arr.reduce((acc, cur) => acc + cur, 0));
    console.log('when');
  }
);

/* *********************************** */
@observer
class App extends React.Component {
  componentDidMount() {
    // observableMap.set('key1', 'value1');
    // observableMap.delete('key1');
    // console.log('componentDidMount');
    // console.log(arr.slice());
    // arr.push(5);
    // arr[4] = 6;
  }

  render() {
    console.log('render', arr.slice());
    return (
      <div>
        <p>React here!</p>
        <h3>map : {observableMap.get('key1') || 'abc'}</h3>
        <button
          onClick={() => {
            arr.push(10);
          }}
        >
          aaa
        </button>
        <button
          onClick={() => {
            arr.pop();
          }}
        >
          bbb
        </button>
        <Counter />
      </div>
    );
  }
}

ReactDOM.render(
  <Provider counter={counter}>
    <App />
  </Provider>,
  document.getElementById('root')
);
