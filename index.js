//imports
const path = require('path');
const electron = require("electron")
let sqlite3 = require("sqlite3");
const Settings = require("./settings");

// create settings instance 
const settings = new Settings({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 800, height: 600 },
    userName: "Devin",
    selectedNotebookId: 0
  }
})

//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain, globalShortcut, ipcRenderer } = require('electron');

// setup accelerator 
app.whenReady().then(() => {
  // Register a 'CommandOrControl+Y' shortcut listener.
  globalShortcut.register('CommandOrControl+q', () => {
    mainWindow.close()
  });
})

//variables for windows
let mainWindow;

//CREATE WINDOWS
function createWindow() {
  const windowBounds = settings.get("windowBounds");
  const themeStyles = settings.get("theme");
  const username = settings.get("userName");
  mainWindow = new BrowserWindow({
    ...windowBounds,
    icon: `images/icon.png`,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.on("resize", () => {
    const { width, height } = mainWindow.getBounds();
    settings.set("windowBounds", { width, height });
    if (width < 1500) {
      mainWindow.webContents.insertCSS(".note-list-column {display: none}")
    } else {
      mainWindow.webContents.insertCSS(".note-list-column {display: block}")
    }
  });

  mainWindow.loadFile('mainwindow.html').then(() => {
    mainWindow.webContents.toggleDevTools()
    mainWindow.send("select:notebook", { id: settings.get("selectedNotebookId") })
    mainWindow.webContents.insertCSS(themeStyles);
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu)
}//end createWindow

// LISTENERS - SETTINGS 
ipcMain.on("update:setting", (e, { key, value }) => {
  settings.set(key, value);
});

//LISTENERS - NOTEBOOKS
ipcMain.on('get:notebooks', () => {
  knex.select("*")
    .from("notebooks")
    .then((rows) => {
      const response = {
        rows,
        selectedNotebookId: settings.get("selectedNotebookId")
      }
      mainWindow.webContents.send('populate:notebooks', response);
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to retrieve notebooks" }));
});

ipcMain.on('update:notebook', (e, notebook) => {
  knex('notebooks')
    .returning("*")
    .where({ "id": notebook.id })
    .update({ name: notebook.name })
    .then((rows) => {
      const response = {
        row: rows[0]
      }
      mainWindow.webContents.send("notebook:updated", response)
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to update notebook" }));
});

ipcMain.on('create:notebook', (e, notebook) => {
  const { name } = notebook;;
  knex.insert({ name })
    .returning("*")
    .into("notebooks")
    .then((rows) => {
      const response = {
        row: rows[0]
      }
      mainWindow.send("notebook:created", response)
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to create notebook" }));
});

ipcMain.on('delete:notebook', (e, notebook) => {
  knex.table('notebooks')
    .where({ id: notebook.id })
    .delete()
    .count()
    .then(rowCount => {
      const response = {
        row: notebook
      }
      if (rowCount > 0) {
        knex.table("notes")
          .where({ notebookId: notebook.id })
          .delete()
          .then(() => mainWindow.send("notebook:deleted", response))
          .catch(err => mainWindow.webContents.send("error", { message: "Failed to delete notebook notes" }));
      }
      else {
        mainWindow.webContents.send("error", { message: "Failed to delete notebook" })
      }
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to delete notebook" }));
});

// LISTENERS - NOTES
ipcMain.on("get:notebook-notes", (e, id) => {
  knex.table('notes')
    .where({ notebookId: id })
    .then(rows => {
      const response = {
        rows
      }
      mainWindow.webContents.send("populate:notes-of-notebook", response);
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to retrieve notebook notes." }));
});

ipcMain.on("create:note", async (e, notebookId) => {
  const currentDate = new Date();
  const note = await knex.table('notes')
    .returning("*")
    .insert({
      title: "",
      content: "",
      createdAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
      notebookId
    })
    .then(rows => {
      const response = {
        row: rows[0]
      }
      mainWindow.webContents.send("note:created", response);
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to create note." }));
});

ipcMain.on("delete:note", (e, note) => {
  knex.table('notes')
    .where({ id: note.id })
    .delete()
    .count()
    .then(rowCount => {
      if (rowCount > 0) {
        const response = {
          row: note
        }
        mainWindow.send("note:deleted", response);
      } else {
        mainWindow.webContents.send("error", { message: "Failed to delete note because note does not exist." });
      }
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to delete note." }));

});

ipcMain.on("update:note", async (e, note) => {
  const currentDate = new Date();
  knex.table("notes")
    .returning("*")
    .update({
      content: note.content,
      title: note.title,
      updatedAt: currentDate.toISOString()
    })
    .where({ id: note.id })
    .then((rows) => {
      const response = {
        row: rows[0]
      }
      mainWindow.webContents.send("note:updated", response);
    })
    .catch(err => mainWindow.webContents.send("error", { message: "Failed to update note." }));

});

//template for menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Create',
        submenu: [
          {
            label: 'New Notebook',
            click() {
              mainWindow.webContents.send("open:notebook:menu");
            }
          },
          {
            label: 'New Note',
            click() {
              mainWindow.webContents.send("create:note");
            }
          }
        ]
      },
      {
        label: 'Quit',
        click() { app.quit(); }
      }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        click() {
          mainWindow.webContents.toggleDevTools();
        }
      }
    ]
  }
];

app.on('ready', createWindow);
