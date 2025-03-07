
import React from "./core/React.js";

function Counter(props) {
  console.log("props: ", props); 
  return (
    <div>
      <div>count: {props.num}</div>
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
