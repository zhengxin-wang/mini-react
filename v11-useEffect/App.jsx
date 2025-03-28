import React from "./core/React.js"

// useEffect
// 调用时机是在 React 完成对 DOM 的渲染之后，并且在浏览器完成绘制之前
// cleanUp 函数会在组件卸载的时候执行 在调用useEffect之前进行调用 ，当deps 为空的时候不会调用返回的cleanup

function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState("bar")
  function handleClick() {
    setCount(c => c + 1)
    setBar(() => "bar")
  }
  React.useEffect(() => {
    console.log("init every time")
    return () => {
      console.log("cleanUp every time")
    }
  })

  React.useEffect(() => {
    console.log("init")
    return () => {
      console.log("cleanUp 0")
    }
  }, [])

  React.useEffect(() => {
    console.log("update", count)
    return () => {
      console.log("cleanUp 1")
    }
  }, [count])

  React.useEffect(() => {
    console.log("update", count)
    return () => {
      console.log("cleanUp 2")
    }
  }, [count])

  return (
    <div>
      <h1>Foo : {count}</h1>
      <div>{bar}</div>
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

