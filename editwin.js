// ELEMENTS
const wineEditFormEl = document.getElementById("wine-edit-form");
const wineTypeSelectEl = document.getElementById("type");
const wineCategorySelectEl = document.getElementById("category");
const wineYearSelectEl = document.getElementById("year")
const winePurchasedSelectEl = document.getElementById("yearPurchased")
const { ipcRenderer } = require('electron')
const fillWineTypeSelect = require("./functions/wineTypeSelectFiller")
const { getFieldValues, fillFields } = require("./functions/forms");
const getCentenaryOfYears = require("./functions/dates");

function submitForm(e) {
    e.preventDefault()
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
        const wineId = document.getElementById("wineId").value
        formContents._id = wineId;
        console.log(formContents)
        ipcRenderer.send('item:edit', formContents);
    }
}

ipcRenderer.on('fill:edit-form', (event, wine) => {
    // append years to year pushased input
    getCentenaryOfYears().reverse().map(year => {
        const wineYearOptionEl = document.createElement("option");
        const wineYearTxtNode = document.createTextNode(year);
        wineYearOptionEl.append(wineYearTxtNode);
        if (wine.year === year) {
            wineYearOptionEl.selected = true;
        }
        wineYearSelectEl.append(wineYearOptionEl);

    });
    getCentenaryOfYears().map(year => {
        const purchaseYearOptionEl = document.createElement("option");
        const purchaseYearTxtNode = document.createTextNode(year);
        purchaseYearOptionEl.append(purchaseYearTxtNode);
        if (wine.yearPurchased === year) {
            purchaseYearOptionEl.selected = true;
        }
        winePurchasedSelectEl.append(purchaseYearOptionEl);
    });

    fillFields(wine)
});

wineEditFormEl.addEventListener("submit", submitForm);


// on page load, fill wine type of default select
window.addEventListener("load", () => {
    const wineCategory = wineCategorySelectEl.value.toLowerCase();
    fillWineTypeSelect(wineCategory, wineTypeSelectEl);
});

// if it changes, remove click listener
wineCategorySelectEl.addEventListener("change", (e) => {
    const wineCategory = e.target.value.toLowerCase();
    fillWineTypeSelect(wineCategory, wineTypeSelectEl);
});

