const { ipcRenderer } = require("electron");
const Component = require("../../lib/Component");
const store = require('../../store/index.js');
const moment = require('moment');

function delay(fn, ms) {
  let timer = 0
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(fn.bind(this, ...args), ms || 0)
  }
}

class NoteEditor extends Component {
  constructor() {
    super({
      store,
      element: document.querySelector('.note-edit-column')
    });
    this.expanded = false
  }

  toggleExpand() {
    if (this.expanded) {
      this.expanded = false
      document.querySelector(".menu-column").style.display = "block";
      document.querySelector(".note-list-column").style.display = "block";
    } else {
      this.expanded = true
      document.querySelector(".menu-column").style.display = "none";
      document.querySelector(".note-list-column").style.display = "none";
    }
  }

  render() {
    let self = this;
    let currentNote = {
      id: store.state.selectedNote.id,
      title: store.state.selectedNote.title,
      content: store.state.selectedNote.content,
      notebookId: store.state.selectedNote.notebookId
    }
    let selectedNotebook = {}
    selectedNotebook = store.state.notebooks.find((nb) => nb.id == currentNote.notebookId) || {}

    self.element.innerHTML = `
    <div>
        <div class="note-editor-header pt-2 ps-3 border-bottom border-secondary">
          <p><i class="fas fa-expand me-2 border-end p-1 rounded expand-btn"></i>${selectedNotebook.hasOwnProperty("name") ? "NOTEBOOK: ".concat(selectedNotebook.name) : ""}</p>
          <p>last edited on ${moment.utc(selectedNotebook.updatedAt).format("MM-DD-YYYY")}</p>
        </div>
        <div class="px-3">     
          <input class="note-form-title mt-3 mb-3" type="text" name="note-title" value="${currentNote.title || ""}">
          <div class="note-form-content" contenteditable="true"><div></div></div>
        </div>
 
    </div>
    `
    self.element.querySelector(".note-form-content").innerHTML = currentNote.content || ""
    self.element.querySelector(".expand-btn").addEventListener("click", () => {
      this.toggleExpand();
    });

    // Update state of note on title change
    self.element.querySelector(".note-form-title")
      .addEventListener("change", (e) => {
        e.preventDefault();
        e.stopPropagation();
        store.dispatch("updateNote", {
          id: currentNote.id,
          title: e.target.value,
          content: currentNote.content,
          notebookId: currentNote.notebookId
        });

        store.dispatch("setCurrentNote", {
          id: currentNote.id,
          title: e.target.value,
          content: currentNote.content,
          notebookId: currentNote.notebookId
        });
      });

    // Save note to db on keyup for title with delay 
    self.element.querySelector(".note-form-title")
      .addEventListener("keyup", delay((e) => {
        e.preventDefault();
        e.stopPropagation();
        ipcRenderer.send("update:note", {
          id: store.state.selectedNote.id,
          title: e.target.value,
          content: store.state.selectedNote.content,
        });
      }, 500));

    // Update state of note on content change
    self.element.querySelector(".note-form-content")
      .addEventListener("focusout", (e) => {
        e.preventDefault();
        e.stopPropagation();
        store.dispatch("updateNote", {
          id: currentNote.id,
          title: currentNote.title,
          content: e.target.innerHTML,
          notebookId: currentNote.notebookId
        });

        store.dispatch("setCurrentNote", {
          id: currentNote.id,
          title: currentNote.title,
          content: e.target.innerHTML,
          notebookId: currentNote.notebookId
        });
      });

    // Save note to db on keyup for content with delay 
    self.element.querySelector(".note-form-content")
      .addEventListener("keyup", delay((e) => {
        e.preventDefault();
        e.stopPropagation();
        ipcRenderer.send("update:note", {
          id: store.state.selectedNote.id,
          title: store.state.selectedNote.title,
          content: e.target.innerHTML,

        });
      }, 500));

    self.element.querySelector(".note-form-title").focus()
  }
}

module.exports = NoteEditor;