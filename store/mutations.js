module.exports = {
  setSelectedNotes(state, payload) {
    state.selectedNotes = payload;
    return state;
  },

  setCurrentNote(state, payload) {
    state.selectedNote = payload;

    return state;
  },

  addNote(state, payload) {
    state.selectedNote = payload;
    state.selectedNotes = [...state.selectedNotes, payload];
    return state
  },

  deleteNote(state, payload) {
    state.selectedNotes = state.selectedNotes.filter((note) =>
      note.id !== payload.id
    );
    return state;
  },

  updateNote(state, payload) {
    state.selectedNotes = state.selectedNotes.map((note) => {
      if (note.id === payload.id) {
        return payload
      } else {
        return note;
      }
    });
    return state;
  },

  addNotebook(state, payload) {
    state.notebooks = [...state.notebooks, payload];
    return state;
  },

  populateNotebooks(state, payload) {
    state.notebooks = payload
    return state;
  },

  setSelectedNotebook(state, payload) {
    state.selectedNotebook = payload
    return state;
  },

  updateNotebook(state, payload) {
    state.notebooks = state.notebooks.map((notebook) => {
      if (notebook.id == payload.id) {
        return payload;
      } else {
        return notebook;
      }
    });
    return state;
  },

  deleteNotebook(state, payload) {
    console.log("delete: ", payload)
    state.notebooks = state.notebooks.filter((notebook) =>
      notebook.id !== payload.id
    );
    return state;
  }
};