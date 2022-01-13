function fillWineTypeSelect(wineCategory, typeSelectEl) {
  const whiteWines = [
    "Riesling",
    "Sauvignon Blanc",
    "Verdelho",
    "Semillon",
    "Chardonnay",
    "Pinot Gris / Pinot Grigio",
    "Other White Varieties",
    "White Blends"
  ];

  const redWines = [
    "Cabernet",
    "Cabernet Sauvignon",
    "Chardonnay",
    "Malbec",
    "Merlot",
    "Sirah / Shiraz",
    "Pinot Noir",
    "Port",
    "Other Red Varieties",
    "Red Blends",
  ];

  const desertWines = [
    "Eiswein (Ice Wine)",
    "Sauternes",
    "Other Dessert Varieties",
    "Dessert Blends",
  ];

  wineTypeSelectEl.innerHTML = "";

  function createWineOptionsEls(wineOptions, selectEl) {
    wineOptions.forEach(wine => {
      const optionEl = document.createElement("option");
      const optionTxt = document.createTextNode(wine);
      optionEl.append(optionTxt);
      selectEl.append(optionEl);
    });
  }
  switch (wineCategory) {
    case "red":
      createWineOptionsEls(redWines, typeSelectEl);
      break;
    case "white":
      createWineOptionsEls(whiteWines, typeSelectEl);
      break;
    case "desert":
      createWineOptionsEls(desertWines, typeSelectEl);
      break;
    default:
      wineTypeSelectEl.diabled = true;
      break;
  }
}

module.exports = fillWineTypeSelect;