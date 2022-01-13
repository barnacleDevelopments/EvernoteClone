module.exports = {
  getFieldValues: () => ({
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    type: document.getElementById("type").value,
    year: document.getElementById("year").value,
    winery: document.getElementById("winery").value,
    yearPurchased: document.getElementById("yearPurchased").value,
    rating: document.getElementById("rating").value,
  }),

  fillFields: (wine) => {
    document.getElementById("wineId").value = wine._id
    document.getElementById("name").value = wine.name;
    document.getElementById("category").value = wine.category;
    document.getElementById("type").value = wine.type;
    document.getElementById("winery").value = wine.winery
    document.getElementById("rating").value = wine.rating;
  }
}