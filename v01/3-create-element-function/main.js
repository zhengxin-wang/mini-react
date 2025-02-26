// v3 使用function来创建元素object, 并递归创建children -> dom tree
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

const textEl = createTextNode('app');
const App = createElement('div', {id: 'app'}, textEl);

const dom = document.createElement(App.type);
dom.id = App.props.id;
document.querySelector('#root').append(dom);

const textNode = document.createTextNode('');
textNode.nodeValue = textEl.props.nodeValue;
dom.appendChild(textNode);