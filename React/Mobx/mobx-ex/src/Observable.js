import React from 'react';
import { observer, Provider } from 'mobx-react';
import CounterStore from './CounterStore';
import { observable, computed, configure, autorun, comparer } from 'mobx';

const counter = new CounterStore();
const observableMap = observable.map({ key1: 'aa' });

configure({
  computedRequiresReaction: true,
});

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

@observer
class Observable extends React.Component {
  componentDidMount() {
    observableMap.set('key1', 'value1');
    observableMap.delete('key1');
    console.log('componentDidMount');
  }

  render() {
    return (
      <div>
        <p>reaction test</p>
      </div>
    );
  }
}

export default Observable;
