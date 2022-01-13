const { ipcRenderer } = require("electron");
const Component = require("../../lib/Component");
const store = require("../../store/index.js");

class BasicFormMenu extends Component {
  constructor(id, previousName) {
    super({
      store,
      element: (() => {
        const menuEl = document.createElement("div");
        menuEl.classList.add("menu");
        menuEl.style.zIndex = "101"
        return menuEl;
      })()
    });
    this.previousName = previousName;
    this.menuActive = false;
    this.id = id;
  }

  setStatus(status) {
    this.menuActive = status
  }

  remove() {
    this.element.remove();
  }

  render() {
    if (this.menuActive) {
      this.element.innerHTML = `
    <div>
      <h2 class="mb-3">${this.id ? "Update" : "Create"} Notebook</h2>
      <form>
        <input class="form-control mb-3" type="text" required placeholder="Notebook Name" value="${this.previousName || ""}" />
        <div class="form-btn-group">
          <button class="btn btn-outline-light cancel-btn me-2">Cancel</button>
          <button type="submit" class="btn btn-success">${this.id ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>`;

      this.element.firstElementChild.addEventListener("submit", (e) => {
        e.preventDefault();
        let notebook = {
          name: e.target.elements[0].value
        }

        if (this.id) {
          notebook.id = this.id
          ipcRenderer.send("update:notebook", notebook);
        } else {
          ipcRenderer.send("create:notebook", notebook);
        }
        this.setStatus(false);
        this.remove()
      });

      this.element.querySelector(".cancel-btn")
        .addEventListener("click", () => {
          this.setStatus(false);
          this.remove()
        })

      this.remove();

      document.body.append(this.element);
    }

  }
}

module.exports = BasicFormMenu;