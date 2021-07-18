import React from 'react';
import ReactDom from 'react-dom';
import decorator from './decorator';
import person from './person';

const App = () => {
  return (
    <div>
      <p>React here!</p>
    </div>
  );
};

export default App;

ReactDom.render(<App />, document.querySelector('#root'));
