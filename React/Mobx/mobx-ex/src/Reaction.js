import React from 'react';

import { observer, Provider } from 'mobx-react';
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

const todos = observable([
  {
    title: 'Make coffee',
    done: true,
  },
  {
    title: 'Find biscuit',
    done: false,
  },
]);
// wrong use of reaction: reacts to length changes, but not to title changes!
const reaction1 = reaction(
  () => todos.length,
  length => console.log('reaction 1:', todos.map(todo => todo.title).join(', '))
);

// correct use of reaction: reacts to length and title changes
const reaction2 = reaction(
  () => todos.map(todo => todo.title),
  titles => console.log('reaction 2:', titles.join(', '))
);

// autorun reacts to just everything that is used in its function
const autorun1 = autorun(() =>
  console.log('autorun 1:', todos.map(todo => todo.title).join(', '))
);

todos.push({ title: 'explain reactions', done: false });
// prints:
// reaction 1: Make coffee, find biscuit, explain reactions
// reaction 2: Make coffee, find biscuit, explain reactions
// autorun 1: Make coffee, find biscuit, explain reactions

todos[0].title = 'Make tea';
// prints:
// reaction 2: Make tea, find biscuit, explain reactions
// autorun 1: Make tea, find biscuit, explain reactions

/* *********************************** */
@observer
class Reaction extends React.Component {
  render() {
    return (
      <div>
        <p>reaction test</p>
      </div>
    );
  }
}

export default Reaction;
