import React from "./core/React.js"

let showBar = false
function Counter() {
  const foo = <div>foo</div>
  const bar = <p>bar</p>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      counter
      <div>{showBar ? bar : foo}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App
