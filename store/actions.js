module.exports = {
  setSelectedNotes(context, payload) {
    context.commit("setSelectedNotes", payload)
  },

  setCurrentNote(context, payload) {
    console.log(payload)
    context.commit("setCurrentNote", payload)
  },

  updateNote(context, payload) {
    context.commit("updateNote", payload)
  },

  addNote(context, payload) {
    context.commit("addNote", payload);
  },

  deleteNote(context, payload) {
    context.commit("deleteNote", payload);
  },

  populateNotebooks(context, payload) {
    context.commit("populateNotebooks", payload);
  },

  setSelectedNotebook(context, payload) {
    context.commit("setSelectedNotebook", payload);
  },

  addNotebook(context, payload) {
    context.commit("addNotebook", payload);
  },

  updateNotebook(context, payload) {
    context.commit("updateNotebook", payload)
  },

  deleteNotebook(context, payload) {
    context.commit("deleteNotebook", payload)
  },
};