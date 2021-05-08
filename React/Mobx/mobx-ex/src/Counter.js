import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('counter')
@observer
class Counter extends React.Component {
  render() {
    const { counter } = this.props;

    return (
      <div>
        <h1>{counter.number}</h1>
        <button onClick={counter.increase.bind(this)}>+1</button>
        <button onClick={counter.decrease.bind(this)}>-1</button>
      </div>
    );
  }
}

export default Counter;
