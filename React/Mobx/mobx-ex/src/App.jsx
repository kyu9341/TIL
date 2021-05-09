import React from 'react';
import ReactDOM from 'react-dom';
import { observer, Provider } from 'mobx-react';
import Counter from './Counter';
import Reaction from './Reaction';
// import Observable from './Observable';
import CounterStore from './CounterStore';
import {
  observable,
  computed,
  action,
  configure,
  autorun,
  comparer,
  reaction,
  when,
} from 'mobx';

const counter = new CounterStore();
const observableMap = observable.map({ key1: 'aa' });

configure({
  computedRequiresReaction: true,
});

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
    // arr.push(5);
    // arr[4] = 6;
  }

  render() {
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
        <Reaction />
        {/* <Observable /> */}
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
