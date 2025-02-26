import ReactDOM from "./core/ReactDom.js";
import App from "./App.jsx"; 

// v5 将render function 的调用包装到ReactDom中
// 将 render function本身 以及创建虚拟dom的 createElement和createTextNode 包装到React.js中
ReactDOM.createRoot(document.querySelector("#root")).render(App);
