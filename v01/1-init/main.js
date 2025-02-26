// v1 vanilla js - 在root div下创建一个div元素，id为app
// app下创建一个文本节点，内容为app
const dom = document.createElement('div');
dom.id = 'app';
document.querySelector('#root').append(dom);

const textNode = document.createTextNode('');
textNode.nodeValue = "app";
dom.appendChild(textNode);
