// v4 dom tree 部分保持不变，新建render function，将dom tree渲染到root div下

/* dom tree start */
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => 
        typeof child === "string" ? createTextNode(child) : child
      )
    }
  }
}

// const textEl = createTextNode("app")
// const App = createElement("div", { id: "app" }, textEl)
const App = createElement('div', {id: 'app'}, "hi", "mini-react");
console.log('App: ', App);
/* dom tree end */

/* render start */
function render(el, container) {
  const dom = el.type === "TEXT_ELEMENT" ? document.createTextNode('') : document.createElement(el.type);

  for (let key of Object.keys(el.props)) {
    if (key !== 'children') {
      dom[key] = el.props[key];
    }
  }

  for (let child of el.props.children) {
    render(child, dom);
  }

  container.append(dom);
}

render(App, document.querySelector('#root'));
/* render end */