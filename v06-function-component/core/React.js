function createTextNode(text) {
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
        // const isTextNode = typeof child === "string"
        const isTextNode = typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      }),
    },
  };
}

// 对于workLoop来讲，即将执行的任务（即将处理的vdom节点）
let nextWorkOfUnit = null;
let root = null;


function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }
  // 统一提交根节点：只在fiber tree 链表结束（下个元素为空）的时候append app到root节点
  if (!nextWorkOfUnit && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) return

  // 原来的逻辑：导致报错 ->
  //           当前fiber=Counter，它的parent App是函数组件 fiber.parent.dom = null；
  //           Counter子组件本身也是函数组件 fiber.dom = null
  // fiber.parent.dom.append(fiber.dom)

  // 新逻辑：
  // 跳过函数组件造成的vdom >> dom结构断层
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  // vdom中的函数组件节点本身并没有对应的dom节点，append 会导致null被append到dom树上
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
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
  root = nextWorkOfUnit;
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
function initChildren(fiber, children) {
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

function updateFunctionComponent(fiber) {
  // 如果是函数组件，不直接为其append dom
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent(fiber) {
  // 将vdom节点转换为dom节点
  // 如果vdom节点对应的dom节点未被创建，先创建dom节点，并append到父节点的dom上
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  // 循环找parent和它的sibling
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      // 如果有sibling就返回
      return nextFiber.sibling;
    } else {
      // 否则就往上找
      nextFiber = nextFiber.parent;
    }
  }
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
