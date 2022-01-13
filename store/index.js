const actions = require('./actions.js');
const mutations = require('./mutations.js');
const state = require('./state.js');
const Store = require('./store.js');

module.exports = new Store({
  actions,
  mutations,
  state
});