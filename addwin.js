// ELEMENTS
const wineTypeSelectEl = document.getElementById("type");
const wineCategorySelectEl = document.getElementById("category");
const wineYearSelectEl = document.getElementById("year")
const winePurchasedSelectEl = document.getElementById("yearPurchased")

// DEPENDENCIES
const electron = require('electron')
const { ipcRenderer } = electron
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);
const fillWineTypeSelect = require("./functions/wineTypeSelectFiller")

// FUNCTIONS 
const { getFieldValues } = require("./functions/forms");

const getCentenaryOfYears = require("./functions/dates");

function submitForm(e) {
  e.preventDefault();
  const nameValidationMessage = document.getElementById("name-validation-message");
  const wineryValidationMessage = document.getElementById("winery-validation-message")
  const formContents = getFieldValues();

  if (formContents.name.trim() === "") {
    nameValidationMessage.textContent = "Please provide a wine name.";
  } else {
    nameValidationMessage.textContent = ""
  }

  if (formContents.winery.trim() === "") {
    wineryValidationMessage.textContent = "Please provide a winery name.";
  } else {
    wineryValidationMessage.textContent = ""
  }

  if (formContents.name.trim() !== "" && formContents.winery.trim() !== "") {
    ipcRenderer.send('item:add', formContents);
  }

  //send to index.js
}

// LISTENERS 
// on page load, fill wine type of default select
window.addEventListener("load", () => {
  const wineCategory = wineCategorySelectEl.value.toLowerCase();
  fillWineTypeSelect(wineCategory, wineTypeSelectEl);

  // append years to year pushased input
  getCentenaryOfYears().reverse().map(year => {
    const wineYearOptionEl = document.createElement("option");
    const wineYearTxtNode = document.createTextNode(year);
    wineYearOptionEl.append(wineYearTxtNode);
    wineYearSelectEl.append(wineYearOptionEl)

  });
  getCentenaryOfYears().map(year => {
    const purchaseYearOptionEl = document.createElement("option");
    const purchaseYearTxtNode = document.createTextNode(year);
    purchaseYearOptionEl.append(purchaseYearTxtNode);
    winePurchasedSelectEl.append(purchaseYearOptionEl)
  })

});

// if it changes, remove click listener
wineCategorySelectEl.addEventListener("change", (e) => {
  const wineCategory = e.target.value.toLowerCase();
  fillWineTypeSelect(wineCategory, wineTypeSelectEl);
});
