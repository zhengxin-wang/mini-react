
import React from "./core/React.js";

let count = 10;
let props = {id :"1213131"};
function Counter() {
  // update props - 后续会用useState来触发props更新
  function handleClick() {
    console.log("click");
    count++;
    props = {};
    React.update();
  }
  
  return (
    <div {...props}>
      count: {count}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

function CounterContainer() {
  return (
    <div>
      <Counter num={12}></Counter>
    </div>
  )
}

// const App = <div id="app">hi-mini-react</div>;

function App(params) {
  return (
    <div>
      mini-react
      <CounterContainer></CounterContainer>
    </div>
  )
}

console.log(App);

export default App;
