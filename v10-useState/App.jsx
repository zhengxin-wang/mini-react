import React from "./core/React.js"
function Foo() {
  const [count, setCount] = React.useState(10)
  function handleClick() {
    setCount(pre => pre + 2)
  }
  return (
    <div>
      <h1>Foo : {count}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  return (
    <div>
      <h1>App</h1>
      <Foo></Foo>
    </div>
  )
}

export default App

