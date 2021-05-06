import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

@observer
class Counter extends Component {
  @observable number = 0;

  @action
  increase() {
    this.number++;
  }

  @action
  decrease() {
    this.number--;
  }

  render() {
    return (
      <div>
        <h1>{this.number}</h1>
        <button onClick={this.increase.bind(this)}>+1</button>
        <button onClick={this.decrease.bind(this)}>-1</button>
      </div>
    );
  }
}

export default Counter;
