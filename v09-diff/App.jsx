import React from "./core/React.js"

let showBar = false
function Counter() {
  const bar = <div>bar</div>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      counter
      {showBar && bar}
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

console.log(Counter());

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App
