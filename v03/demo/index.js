// 展示workLoop的基本结构
// 1. 任务队列 taskId++
// 2. 任务执行
// 3. 任务调度 shouldYield


let taskId = 1;
const startTime = +Date.now();

function workLoop(deadline) {
  taskId++;

  let shouldYield = false;
  const currentTime = +Date.now();
  while (!shouldYield && (currentTime - startTime < 10000)) {
    // run task
    console.log(`taskId:${taskId} run task`);
    // dom

    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
