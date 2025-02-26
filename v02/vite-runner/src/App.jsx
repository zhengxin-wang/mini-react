/**@jsx CReact.createElement */
import CReact from "./core/React.js";

function AppOne () {
  return <div id="app">hi-mini-react<div>haha</div></div>
}
console.log(AppOne);
// ƒ AppOne() {
//   return /* @__PURE__ */ CReact.createElement("div", { id: "app" }, 
//            "hi-mini-react", 
//            /* @__PURE__ */ CReact.createElement("div", null, "haha"));
// }




// const App = createElement('div', { id: 'app' }, "hi", "mini-react");
const App = <div id="app">hi-mini-react</div>
console.log(App);

export default App;