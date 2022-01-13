const { ipcRenderer } = require('electron');
const Component = require('../../lib/Component.js');
const store = require('../../store/index.js');
const BasicFormMenu = require('./BasicFormMenu.js');

// Components 

class NotebookList extends Component {
  constructor() {
    super({
      store,
      element: document.querySelector('.notebook-list')
    });
  }

  render() {
    this.element.innerHTML = `
      ${store.state.notebooks.map((item, index) => {
      return `
      <li 
        class="list-group-item notebook-list-item notebook-item-${index} ${store.state.selectedNotebook.id === item.id ? "active" : ""}" 
        aria-expanded="false">
        <span class="d-inline-block text-truncate pe-2" style="max-width: 100px;">
        ${item.name}
        </span>
       
        <div class="btn-group dropend">
          <i class="fas fa-ellipsis-h dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"></i>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item delete-btn" type="button">Delete</button></li>
            <li><button class="dropdown-item update-btn" type="button">Update</button></li>
          </ul>
        </div>
      </li>
      `
    }).join("")
      }
    `;
    store.state.notebooks.forEach((item, index) => {
      const noteBookItem = this.element.querySelector(`.notebook-item-${index}`);
      noteBookItem.addEventListener("click", (e) => {
        e.stopPropagation();

        ipcRenderer.send("get:notebook-notes", item.id);
        ipcRenderer.send("update:setting", {
          key: "selectedNotebookId",
          value: item.id
        });
        store.dispatch("setSelectedNotebook", item);
        document.querySelector(".add-note-btn").classList.remove("disabled");
      });

      noteBookItem.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
        e.stopImmediatePropagation()
      });

      noteBookItem.querySelector(".delete-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation()
          console.log(e)
          ipcRenderer.send("delete:notebook", item);
        });

      noteBookItem.querySelector(".update-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation()
          const editForm = new BasicFormMenu(item.id, item.name);
          editForm.setStatus(true);
          editForm.render();
        });
    });
  }
}

module.exports = NotebookList