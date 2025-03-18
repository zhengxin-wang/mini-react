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

  const [filter, setFilter] = React.useState("all");

  const filteredItems = items.filter(item => {
    if (filter === "done") {
      return item.done
    }
    if (filter === "active") {
      return !item.done
    }

    return true
  })

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

  function handleActive(index) {
    return function () {
      const newItems = [...items]
      newItems[index].done = false
      setItems(newItems)
    }
  }

  function handleSave() {
    localStorage.setItem("items", JSON.stringify(items))
  }

  function handleFilter(e) {
    console.log("checked", e.target.value)
    setFilter(e.target.value)
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
      <div>
        <input type="radio" id="all" name="filter" value="all" onChange={handleFilter} checked/>
        <label for="all">all</label>
        <input type="radio" id="done" name="filter" value="done" onChange={handleFilter}/>
        <label for="done">done</label>
        <input type="radio" id="active" name="filter" value="active" onChange={handleFilter}/>
        <label for="active">active</label>
      </div>
      <ul>
        {filteredItems.map((item, index) => {
          return (
            <li key={index}>
              <span style={{textDecoration: item.done ? "line-through" : "none"}}>{item.text}</span>
              <button onClick={handleRemove(index)}>remove</button>
              {
                item.done ? 
                  <button onClick={handleActive(index)}>active</button>:
                  <button onClick={handleDone(index)}>done</button>
              }
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

