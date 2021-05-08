import React from 'react';
import ReactDom from 'react-dom';
import Counter from '@/components/Counter/Counter.js';

const App = () => {
  return (
    <div>
      <p>React here!</p>

      <Counter></Counter>
    </div>
  );
};

export default App;

ReactDom.render(<App />, document.querySelector('#root'));
