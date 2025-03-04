function createTextNode(text) {
  console.log("heiheihei!!!!!!!");
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

// 对于workLoop来讲，即将执行的任务（即将处理的vdom节点）
let nextWorkOfUnit = null;


function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}


function render(el, container) {
  // 将vdom的根节点作为children，创建到 root container 上
  // 这是第一个入队的任务
  nextWorkOfUnit = {
    dom: container,  // root container dom是dom树的根节点
    props: {
      children: [el],
    },
  };
}


function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

// 处理节点之间的关系
function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function performWorkOfUnit(fiber) {
  // 将vdom节点转换为dom节点
  // 如果vdom节点对应的dom节点未被创建，先创建dom节点，并append到父节点的dom上
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    fiber.parent.dom.append(dom);

    updateProps(dom, fiber.props);
  }

  // 将vdom的children转换为fiber节点，并链接sibling关系
  initChildren(fiber)

  console.log(fiber);

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
