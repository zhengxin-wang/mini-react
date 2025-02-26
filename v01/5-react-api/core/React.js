function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

export function createElement(type, props, ...children) {
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

export function render(el, container) {
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

const React = {
  createElement,
  render
}

export default React;