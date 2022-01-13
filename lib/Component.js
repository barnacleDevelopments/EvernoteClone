const Store = require("../store/Store.js");

class Component {
  constructor(props = {}) {
    let self = this;

    this.render = this.render || function () { };
    // TODO: add check for store instance [ES6 classes are not different than object contrcutors]
    props.store.events.subscribe('stateChange', () => self.render());
    if (props.store instanceof Store) {
    }

    if (props.hasOwnProperty('element')) {
      this.element = props.element;
    }
  }
}

module.exports = Component;