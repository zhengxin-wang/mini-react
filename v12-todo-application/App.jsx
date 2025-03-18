import React from "./core/React.js";

function loadItems() {
  const items = localStorage.getItem("items")
  if (items) {
    return(JSON.parse(items))
  }
  return []
}

function Todos() {
  const [inputValue, setInputValue] = React.useState("");
  const [items, setItems] = React.useState(loadItems());

  function handleInput(e) {
    setInputValue(e.target.value)
  }

  function handleAdd() {
    setItems([...items, {text: inputValue}])
    setInputValue("")
  }

  function handleRemove(index) {
    return function () {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  }

  function handleDone(index) {
    return function () {
      const newItems = [...items]
      newItems[index].done = true
      setItems(newItems)
    }
  }

  function handleSave() {
    localStorage.setItem("items", JSON.stringify(items))
  }

  React.useEffect(() => {
    console.log("update items", items)
  }, [items])

  return (
    <div>
      <input type="text" onChange={handleInput} value={inputValue}></input>
      <button onClick={handleAdd}>add</button>
      <div>
        <button onClick={handleSave}>save</button>
      </div>
      <ul>
        {/* {items.length} */}
        {/* {items.map((item, index) => item.text)} */}
        {items.map((item, index) => {
          return (
            <li key={index}>
              <span style={{textDecoration: item.done ? "line-through" : "none"}}>{item.text}</span>
              <button onClick={handleRemove(index)}>remove</button>
              <button onClick={handleDone(index)}>done</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function App() {
  return (
    <div>
      <h1>TODOs</h1>
      <Todos></Todos>
    </div>
  )
}

export default App

