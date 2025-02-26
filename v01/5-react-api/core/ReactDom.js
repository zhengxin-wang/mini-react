import { render } from './React.js';

const ReactDOM = {
  createRoot: function(container) {
    return {
      render: function(el) {
        render(el, container);
      }
    }
  }
}

export default ReactDOM;