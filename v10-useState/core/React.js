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
        const isTextNode = typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      }),
    },
  };
}

// 对于workLoop来讲，即将执行的任务（即将处理的vdom节点）
let nextWorkOfUnit = null;
let wipRoot = null;
let wipFiber = null;


function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    console.log("get nextWorkOfUnit", nextWorkOfUnit)
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    // 如果wipRoot(要更新的函数组件)的兄弟就是下一个work
    //那就代表当前函数组件已经渲染完成了
    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined;
    }

    shouldYield = deadline.timeRemaining() < 1;
  }
  // 统一提交根节点：只在fiber tree 链表结束（下个元素为空）的时候append app到root节点
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop);
}

let currentRoot = null;
let deletions = [] // 需要删除的节点集合
function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child);
  currentRoot = wipRoot; // 保存当前的fiber树， 给下次用来做diff
  wipRoot = null;
  deletions = [];
}

function commitDeletion(fiber) {
  // 网上找上实际存在dom的parent节点
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    // 跳过函数组件本身，往下找实际存在dom的节点
    commitDeletion(fiber.child)
  }
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
  if (fiber.effectTag === "update") {
    // 提供新的和旧的props用来做diff
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement" && fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}



function render(el, container) {
  // 将vdom的根节点作为children，创建到 root container 上
  // 这是第一个入队的任务
  wipRoot = {
    dom: container,  // root container dom是dom树的根节点
    props: {
      children: [el],
    },
  };
  nextWorkOfUnit = wipRoot;
}

// function update() {
//   // 函数组件在运行此HOC的时候顺便记录当前fiber节点wipFiber
//   let currentFiber = wipFiber;
//   return () => {
//     wipRoot = {
//       ...currentFiber,
//       alternate: currentFiber,
//     };
//     nextWorkOfUnit = wipRoot;
//   }
// }

let stateHooks;
let stateHookIndex;
function useState(initial) {
  let currentFiber = wipFiber;
  // 根据index找到对应的stateHook
  let oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];

  // 存储本次的state供setState使用
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  }
  // 调用action
  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state)
  })
  stateHook.queue = [];

  stateHooks.push(stateHook);
  stateHookIndex++;

  //刷新hooks数组
  currentFiber.stateHooks = stateHooks;

  const setState = (action) => {
    // 处理值一样的情况
    const eagerState = typeof action === "function" ? action(stateHook.state) : action
    if (eagerState === stateHook.state) return

    // stateHook.queue.push(typeof action === "function" ? action : () => action)
    stateHook.state = eagerState;

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }

    nextWorkOfUnit = wipRoot
    console.log("eagerState", eagerState, "set nextWorkOfUnit",  nextWorkOfUnit)
  }

  return [stateHook.state, setState];
}


function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  // 1. old 有，new 没有，删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 2. old 有，new 有，更新
  // 3. old 没有，new 有，新增
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (prevProps[key] !== nextProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

// 处理节点之间的关系
function reconcileChildren(fiber, children) {  // reconcile 包含了init和update
  let oldFiber = fiber.alternate?.child;

  let prevChild = null;

  children.forEach((child, index) => {

    let newFiber = null;
    const isSameType = child && oldFiber && child.type === oldFiber.type;;

    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",  // 标记一下，这个fiber节点是更新老节点得来的
        alternate: oldFiber,
      };
    } else {
      if (child) {
        //create
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement",  // 标记一下，这个fiber节点是新建的
        };
      }

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }

    // 本次的fiber树会移动到sibling节点，oldFiber 也移动到兄弟节点。保证diff的时候能找到对应的节点
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    if (newFiber) {
      prevChild = newFiber;
    }
  });

  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  wipFiber = fiber;
  // 如果是函数组件，不直接为其append dom
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  // 将vdom节点转换为dom节点
  // 如果vdom节点对应的dom节点未被创建，先创建dom节点，并append到父节点的dom上
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
    console.log("peformUnitOfWork", fiber.type.name)
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
  useState,
  render,
  createElement,
};

export default React;
