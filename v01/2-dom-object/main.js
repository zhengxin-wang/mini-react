// v2 react -> vdom -> js object
// 用object来表示dom结构: app div 节点和下面的文本节点
const textEl  = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "app",
    children: []
  }
}

const appEl = {
  type: "div",
  props: {
    id: "app",
    children: [
      textEl
    ]
  }
}

const dom = document.createElement(appEl.type);
dom.id = appEl.props.id;
document.querySelector('#root').append(dom);

const textNode = document.createTextNode('');
textNode.nodeValue = textEl.props.nodeValue;
dom.appendChild(textNode);
