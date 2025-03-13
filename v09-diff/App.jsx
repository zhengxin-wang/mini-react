import React from "./core/React.js"

let countFoo1 = 1
function Foo() {
  console.log("Foo return ")
  function handleClick() {
    countFoo1++
    React.update()
  }
  return (
    <div>
      <h1>Foo : {countFoo1}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countBar = 1
function Bar() {
  console.log("Bar return ")
  function handleClick() {
    countBar++
    React.update()
  }
  return (
    <div>
      <h1>Bar : {countBar}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countApp = 1
function App() {
  console.log("App return ")
  function handleClick() {
    countApp++
    React.update()
  }
  return (
    <div>
      <h1>App : {countApp}</h1>
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
      <Bar></Bar>
    </div>
  )
}

export default App

