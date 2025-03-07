
import React from "./core/React.js";

function Counter(props) {
  function handleClick() {
    console.log("click");
  }
  
  return (
    <div>
      count: {props.num}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

// const App = <div id="app">hi-mini-react</div>;

function App(params) {
  return (
    <div>
      mini-react
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  )
}

console.log(App);

export default App;
