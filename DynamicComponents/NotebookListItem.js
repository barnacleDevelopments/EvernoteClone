

const createNotebookListItem = ({ id, name }) => {
  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item");
  listItem.textContent = name;
  const editBtn = document.createElement("i");
  editBtn.classList.add("fas", "fa-ellipsis-h");
  // add edit button event listner

  // add get notes event listner
  listItem.addEventListener("click", () => {
    noteListEl.innerHTML = "";
    ipcRenderer.send("get:notebook-notes", id);
  })
  listItem.append(editBtn);
  return listItem;
}

module.exports = createNotebookListItem;