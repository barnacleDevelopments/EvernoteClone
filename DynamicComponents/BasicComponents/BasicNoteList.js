const { ipcRenderer } = require('electron');
const Component = require('../../lib/Component.js');
const store = require('../../store/index.js');
const moment = require("moment");

class NoteList extends Component {
  constructor() {
    super({
      store,
      element: document.querySelector('.note-list-column'),
    });
  }

  render() {
    this.element.innerHTML = `
    <table class="note-table" style="font-size:30px">
      <thead>
        <div class="ps-3 pt-2 note-column-header border-bottom border-secondary">
          <h1 style="font-size: 39.6px;">Notes</h1>
          <p>${store.state.selectedNotes.length} Notes</p>
        </div>
        <tr>
          <th class="ps-3" scope="col">Title</th>
          <th scope="col">Last Updated</th>
        </tr>
      </thead>
      <tbody class="note-list pe-2">
      ${store.state.selectedNotes.map((item, index) => ` 
          <tr class="note-list-item-${index} note-item">
            <td class="ps-3"> 
              <span class="d-inline-block text-truncate pe-2" style="max-width: 100px;">
              ${item.title || "untitled"}
              </span>
            </td>
            <td>${moment.utc(item.updatedAt).format("YYYY-MM-DD")}</td>
            <td><i class="fas fa-trash-alt"></i></td>
          </tr>`).join("")}
      </tbody>
    </table >`;

    store.state.selectedNotes.forEach((item, index) => {
      const itemEl = this.element.querySelector(`.note-list-item-${index}`)
      itemEl.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        store.dispatch("setCurrentNote", item)
      });

      itemEl.lastElementChild.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        ipcRenderer.send("delete:note", { id: item.id });
      });
    });
  }
}

module.exports = NoteList