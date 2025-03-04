const el = document.createElement("div");

el.innerText = "heihei";

document.body.append(el);

// 模拟js执行耗时的操作
let i = 0;
while (i < 1000) {
  i++;
}
