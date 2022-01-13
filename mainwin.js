const store = require('./store/index.js');
const BasicList = require("./DynamicComponents/BasicComponents/BasicNoteList");
const BasicEditor = require("./DynamicComponents/BasicComponents/BasicEditor");
const BasicFormMenu = require("./DynamicComponents/BasicComponents/BasicFormMenu");
const BasicNotebookList = require("./DynamicComponents/BasicComponents/BasicNotebookList");

// initialize component states
const basicListInstance = new BasicList();
const basicEditor = new BasicEditor();
const basicNotebookList = new BasicNotebookList();
basicListInstance.render();
basicEditor.render();
basicNotebookList.render()

// dependencies 
const electron = require('electron');
const { ipcRenderer } = electron;

// page elements 
const addNotebookBtnEl = document.querySelector(".add-notebook-btn");
const addNoteBtnEl = document.querySelector(".add-note-btn");

window.addEventListener("load", () => {
  if (store.state.notebooks.length <= 0) {
    ipcRenderer.send("get:notebooks");
    document.querySelector("#collapseNotebooks").classList.remove("show");
  }
});

// Element event listeners
addNotebookBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const basicFormMenu = new BasicFormMenu();
  basicFormMenu.setStatus(true);
  basicFormMenu.render();
});

addNoteBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  ipcRenderer.send("create:note", store.state.selectedNotebook.id);
});

// NOTEBOOK - render process listeners 
ipcRenderer.on("populate:notebooks", (e, data) => {
  if (data.rows.length > 0) {
    store.dispatch("populateNotebooks", data.rows);

    const selectedNotebook = store.state.notebooks.find((notebook) => notebook.id === data.selectedNotebookId)
    if (selectedNotebook) {
      store.dispatch("setSelectedNotebook", selectedNotebook);
      document.querySelector("#collapseNotebooks").classList.add("show");
      ipcRenderer.send("get:notebook-notes", data.selectedNotebookId);
    }
  }
});

ipcRenderer.on("notebook:updated", (e, data) => {
  store.dispatch("updateNotebook", data.row);
});

ipcRenderer.on("notebook:deleted", (e, data) => {
  store.dispatch("deleteNotebook", { id: data.row.id });
  store.dispatch("setCurrentNote", {})
  store.dispatch("setSelectedNotes", [])
  if (store.state.notebooks.length > 0) {
    store.dispatch("setSelectedNotebook", store.state.notebooks[0]);
    ipcRenderer.send("get:notebook-notes", store.state.notebooks[0].id);
  } else {
    document.querySelector(".add-note-btn").classList.add("disabled");
    document.querySelector("#collapseNotebooks").classList.remove("show");
  }
});

ipcRenderer.on("notebook:created", (e, data) => {
  ipcRenderer.send("update:setting", {
    key: "selectedNotebookId",
    value: data.row.id
  });
  store.dispatch("addNotebook", data.row);
  store.dispatch("setSelectedNotebook", data.row);
  document.querySelector(".add-note-btn").classList.remove("disabled");
  document.querySelector("#collapseNotebooks").classList.add("show");
});

// NOTE - render process listeners 
ipcRenderer.on("populate:notes-of-notebook", (e, data) => {
  store.dispatch("setSelectedNotes", data.rows);
  if (data.rows.length > 0) {
    store.dispatch("setCurrentNote", data.rows[0]);
  }
});

ipcRenderer.on("note:created", (e, data) => {
  store.dispatch("addNote", data.row);
});

ipcRenderer.on("note:deleted", (e, data) => {
  store.dispatch("deleteNote", { id: data.row.id });
});

ipcRenderer.on("note:updated", (e, note) => {
  console.log(note)
  // TODO: add a update success message to page 
});

// Main Process UI Events
ipcRenderer.on("open:notebook:menu", (e) => {
  const basicFormMenu = new BasicFormMenu();
  basicFormMenu.setStatus(true);
  basicFormMenu.render();
  if (store.state.notebooks.length <= 0) {
    ipcRenderer.send("get:notebooks");
  }
});

ipcRenderer.on("create:note", (e) => {
  if (store.state.selectedNotebook.id) {
    ipcRenderer.send("create:note", store.state.selectedNotebook.id);
  }
});

// error handling 
ipcRenderer.on("error", (e, data) => {
  console.log(data)
})